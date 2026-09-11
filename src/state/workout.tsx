import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import { useApp } from './app';
import { sessionTotals } from '../../shared/engine.js';
import type { Cardio, Entry, NewPR, PreviousPerformance, Session, Totals, WorkSet } from '../lib/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'offline';

/**
 * The in-progress workout is mirrored to localStorage on every keystroke.
 * Gyms lose signal; the network copy is the backup, not the original.
 */
const LOCAL_KEY = 'gt.activeWorkout';

interface LocalCopy {
  sessionId: string;
  entries: Entry[];
  updatedAt: number;
}

function readLocal(): LocalCopy | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as LocalCopy) : null;
  } catch {
    return null;
  }
}

function writeLocal(copy: LocalCopy | null) {
  try {
    if (copy) localStorage.setItem(LOCAL_KEY, JSON.stringify(copy));
    else localStorage.removeItem(LOCAL_KEY);
  } catch {
    /* private mode or quota — the server copy still applies */
  }
}

interface WorkoutState {
  session: Session | null;
  entries: Entry[];
  totals: Totals | null;
  previous: Record<string, PreviousPerformance>;
  saveState: SaveState;
  /** Unsynced changes are sitting in localStorage waiting for the network. */
  pendingSync: boolean;
  loading: boolean;

  start: (opts: { routineId?: string; name?: string }) => Promise<void>;
  finish: () => Promise<{ session: Session | null; newPRs: NewPR[]; discarded: boolean }>;
  cancel: () => Promise<void>;

  addExercise: (exerciseId: string) => void;
  removeExercise: (exerciseId: string) => void;
  swapExercise: (fromId: string, toId: string) => void;
  setEntryNotes: (exerciseId: string, notes: string) => void;
  undo: (() => void) | null;
  reorder: (from: number, to: number) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, index: number, patch: Partial<WorkSet>) => void;
  removeSet: (exerciseId: string, index: number) => void;
  updateCardio: (exerciseId: string, patch: Partial<Cardio>) => void;

  rest: { endsAt: number; total: number } | null;
  startRest: (seconds: number) => void;
  adjustRest: (delta: number) => void;
  stopRest: () => void;
}

const Ctx = createContext<WorkoutState | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { byId } = useApp();
  const [session, setSession] = useState<Session | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [previous, setPrevious] = useState<Record<string, PreviousPerformance>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [pendingSync, setPendingSync] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rest, setRest] = useState<{ endsAt: number; total: number } | null>(null);

  const timer = useRef<number | null>(null);
  const dirty = useRef(false);
  const editVersion = useRef(0);

  /* -------------------------------------------------------- load + save */

  useEffect(() => {
    (async () => {
      try {
        const { session: s } = await api.activeSession();
        if (!s) {
          writeLocal(null); // no active workout on the server, drop any stale copy
          return;
        }
        const local = readLocal();
        // The device copy wins when it belongs to this workout: it is the one
        // that may contain sets logged while the phone had no signal.
        if (local && local.sessionId === s.id) {
          setSession(s);
          setEntries(local.entries);
          dirty.current = true;
          setPendingSync(true);
        } else {
          setSession(s);
          setEntries(s.entries);
        }
      } catch {
        /* signed out or offline — the app shell reports it */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadPrevious = useCallback(async (ids: string[]) => {
    const missing = ids.filter(Boolean);
    if (!missing.length) return;
    const { previous: p } = await api.previous(missing);
    // Key every id that was asked for, including the ones with no history —
    // otherwise "not in the map" stays true and the effect refetches forever.
    setPrevious((cur) => {
      const next = { ...cur };
      for (const id of missing) next[id] = p[id];
      return next;
    });
  }, []);

  useEffect(() => {
    const ids = entries.map((e) => e.exerciseId).filter((id) => !(id in previous));
    if (ids.length) void loadPrevious(ids);
  }, [entries, previous, loadPrevious]);

  /**
   * Debounced autosave. Every change is written to localStorage immediately and
   * pushed to the server 800ms later. If the push fails the local copy stands
   * and we retry — losing a set to a dead signal is not acceptable.
   */
  useEffect(() => {
    if (!session || !dirty.current) return;

    writeLocal({ sessionId: session.id, entries, updatedAt: Date.now() });
    setSaveState('saving');
    const versionAtStart = editVersion.current;

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const { session: saved } = await api.saveSession(session.id, { entries });
        setSession(saved);
        setSaveState('saved');
        if (editVersion.current === versionAtStart) {
          setPendingSync(false);
          dirty.current = false;
          writeLocal(null); // the server now has it
        }
      } catch {
        setSaveState('offline');
        setPendingSync(true);
        // dirty stays true: the retry below and the next edit both re-attempt.
      }
    }, 800);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [entries, session]);

  /** Flush the moment the network comes back, and poll slowly meanwhile. */
  useEffect(() => {
    if (!pendingSync || !session) return;

    const flush = async () => {
      if (!dirty.current) return;
      const versionAtStart = editVersion.current;
      try {
        const { session: saved } = await api.saveSession(session.id, { entries });
        setSession(saved);
        setSaveState('saved');
        if (editVersion.current === versionAtStart) {
          setPendingSync(false);
          dirty.current = false;
          writeLocal(null);
        }
      } catch {
        /* still down — the interval will try again */
      }
    };

    window.addEventListener('online', flush);
    const id = window.setInterval(flush, 15000);
    return () => {
      window.removeEventListener('online', flush);
      window.clearInterval(id);
    };
  }, [pendingSync, session, entries]);

  // Last-ditch save when the tab closes mid-workout.
  useEffect(() => {
    const onHide = () => {
      if (!session || !dirty.current) return;
      const blob = new Blob([JSON.stringify({ entries })], { type: 'application/json' });
      navigator.sendBeacon?.(`/api/sessions/${session.id}/beacon`, blob);
    };
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, [session, entries]);

  const [undoStack, setUndoStack] = useState<Entry[][]>([]);

  const mutate = useCallback((fn: (list: Entry[]) => Entry[]) => {
    editVersion.current += 1;
    dirty.current = true;
    setEntries(fn);
  }, []);

  /**
   * Destructive edits snapshot first. Deleting the wrong set two hours into a
   * session and having no way back is the kind of thing that loses trust.
   */
  const mutateUndoable = useCallback(
    (fn: (list: Entry[]) => Entry[]) => {
      editVersion.current += 1;
      dirty.current = true;
      setEntries((list) => {
        setUndoStack((s) => [list, ...s].slice(0, 10));
        return fn(list);
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setUndoStack(([last, ...rest]) => {
      if (last) {
        dirty.current = true;
        setEntries(last);
      }
      return rest;
    });
  }, []);

  /* ------------------------------------------------------------ totals */

  const totals = useMemo(() => {
    if (!session) return null;
    return sessionTotals(
      { entries, bodyWeightKg: session.bodyWeightKg, startedAt: session.startedAt, endedAt: null, date: session.date },
      byId as never,
    ) as Totals;
  }, [entries, session, byId]);

  /* ------------------------------------------------------------ actions */

  const value: WorkoutState = useMemo(
    () => ({
      session,
      entries,
      totals,
      previous,
      saveState,
      pendingSync,
      loading,
      rest,

      start: async (opts) => {
        const { session: s } = await api.startSession(opts);
        writeLocal(null);
        setSession(s);
        setEntries(s.entries);
        dirty.current = false;
        setPendingSync(false);
        setSaveState('idle');
      },

      finish: async () => {
        if (!session) return { session: null, newPRs: [], discarded: true };
        // Flush anything still pending before the server decides what to keep.
        // If this throws, the workout stays open with the local copy intact.
        if (timer.current) window.clearTimeout(timer.current);
        if (dirty.current) await api.saveSession(session.id, { entries });
        const result = await api.finishSession(session.id);
        writeLocal(null);
        setSession(null);
        setEntries([]);
        setPrevious({});
        setRest(null);
        dirty.current = false;
        setPendingSync(false);
        return result;
      },

      cancel: async () => {
        if (!session) return;
        await api.deleteSession(session.id);
        writeLocal(null);
        setSession(null);
        setEntries([]);
        setRest(null);
        dirty.current = false;
        setPendingSync(false);
      },

      addExercise: (exerciseId) =>
        mutate((list) => {
          if (list.some((e) => e.exerciseId === exerciseId)) return list;
          const ex = byId.get(exerciseId);
          const isCardio = ex?.type === 'cardio';
          const last = previous[exerciseId];
          return [
            ...list,
            {
              exerciseId,
              // Seed from last time so the common case is confirm-not-type.
              sets: isCardio
                ? []
                : Array.from({ length: Math.max(1, last?.sets.filter((s) => !s.isWarmup).length ?? 3) }, (_, i) => ({
                    reps: last?.sets.filter((s) => !s.isWarmup)[i]?.reps ?? null,
                    weightKg: last?.sets.filter((s) => !s.isWarmup)[i]?.weightKg ?? null,
                    done: false,
                    isWarmup: false,
                  })),
              cardio: isCardio
                ? { durationMin: null, distanceKm: null, intensity: 'moderate' as const, done: false }
                : null,
            },
          ];
        }),

      removeExercise: (exerciseId) => mutateUndoable((list) => list.filter((e) => e.exerciseId !== exerciseId)),

      /** Machine taken: keep the position in the workout, change the exercise. */
      swapExercise: (fromId, toId) =>
        mutateUndoable((list) => {
          if (list.some((e) => e.exerciseId === toId)) return list;
          const target = byId.get(toId);
          return list.map((e) =>
            e.exerciseId === fromId
              ? {
                  exerciseId: toId,
                  notes: e.notes,
                  // Keep the set count, drop the numbers — they belonged to a
                  // different movement.
                  sets:
                    target?.type === 'cardio'
                      ? []
                      : e.sets.map((s) => ({ reps: null, weightKg: null, done: false, isWarmup: s.isWarmup })),
                  cardio:
                    target?.type === 'cardio'
                      ? { durationMin: null, distanceKm: null, intensity: 'moderate' as const, done: false }
                      : null,
                }
              : e,
          );
        }),

      setEntryNotes: (exerciseId, notes) =>
        mutate((list) => list.map((e) => (e.exerciseId === exerciseId ? { ...e, notes } : e))),

      undo: undoStack.length ? undo : null,

      reorder: (from, to) =>
        mutate((list) => {
          const next = [...list];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        }),

      addSet: (exerciseId) =>
        mutate((list) =>
          list.map((e) => {
            if (e.exerciseId !== exerciseId) return e;
            const last = e.sets[e.sets.length - 1];
            return {
              ...e,
              sets: [
                ...e.sets,
                { reps: last?.reps ?? null, weightKg: last?.weightKg ?? null, done: false, isWarmup: false },
              ],
            };
          }),
        ),

      updateSet: (exerciseId, index, patch) =>
        mutate((list) =>
          list.map((e) =>
            e.exerciseId === exerciseId
              ? { ...e, sets: e.sets.map((s, i) => (i === index ? { ...s, ...patch } : s)) }
              : e,
          ),
        ),

      removeSet: (exerciseId, index) =>
        mutateUndoable((list) =>
          list.map((e) => (e.exerciseId === exerciseId ? { ...e, sets: e.sets.filter((_, i) => i !== index) } : e)),
        ),

      updateCardio: (exerciseId, patch) =>
        mutate((list) =>
          list.map((e) =>
            e.exerciseId === exerciseId
              ? {
                  ...e,
                  cardio: {
                    durationMin: null,
                    distanceKm: null,
                    intensity: 'moderate',
                    done: false,
                    ...(e.cardio ?? {}),
                    ...patch,
                  },
                }
              : e,
          ),
        ),

      startRest: (seconds) => setRest({ endsAt: Date.now() + seconds * 1000, total: seconds }),
      adjustRest: (delta) =>
        setRest((r) =>
          r ? { endsAt: Math.max(Date.now(), r.endsAt + delta * 1000), total: Math.max(15, r.total + delta) } : r,
        ),
      stopRest: () => setRest(null),
    }),
    [session, entries, totals, previous, saveState, pendingSync, loading, rest, mutate, mutateUndoable, undo, undoStack.length, byId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkout(): WorkoutState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWorkout must be used inside WorkoutProvider');
  return ctx;
}

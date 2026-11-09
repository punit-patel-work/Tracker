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
import { api, ApiError } from '../lib/api';
import { useApp } from './app';
import { sessionTotals } from '../../shared/engine.js';
import type { Cardio, Entry, NewPR, PreviousPerformance, Session, Totals, WorkSet } from '../lib/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'offline' | 'conflict' | 'error';
interface LocalCopy { userId: string; session: Session; entries: Entry[]; dirty: boolean; updatedAt: number }
function readLocal(userId: string): LocalCopy | null {
  try {
    const data = JSON.parse(localStorage.getItem(`gt.activeWorkout.${userId}`) ?? 'null');
    return data?.userId === userId && data.session?.id && Array.isArray(data.entries) ? data : null;
  } catch { return null; }
}

interface WorkoutState {
  session: Session | null;
  entries: Entry[];
  totals: Totals | null;
  previous: Record<string, PreviousPerformance>;
  saveState: SaveState;
  /** Unsynced changes are sitting in localStorage waiting for the network. */
  pendingSync: boolean;
  syncError: string;
  resolveConflict: (choice: 'mine' | 'server') => Promise<void>;
  exportBackup: () => void;
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
  const { byId, user } = useApp();
  const [session, setSession] = useState<Session | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [previous, setPrevious] = useState<Record<string, PreviousPerformance>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [pendingSync, setPendingSync] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [loading, setLoading] = useState(true);
  const [rest, setRest] = useState<{ endsAt: number; total: number } | null>(null);
  const [undoStack, setUndoStack] = useState<Entry[][]>([]);
  const sessionRef = useRef<Session | null>(null);
  const entriesRef = useRef<Entry[]>([]);
  const dirty = useRef(false);
  const generation = useRef(0);
  const blocked = useRef(false);
  const closing = useRef(false);
  const editVersion = useRef(0);
  const tail = useRef<Promise<unknown>>(Promise.resolve());

  const persist = useCallback(() => {
    if (!user) return;
    try {
      const key = `gt.activeWorkout.${user.id}`;
      if (!sessionRef.current) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify({ userId: user.id, session: sessionRef.current,
        entries: entriesRef.current, dirty: dirty.current, updatedAt: Date.now() }));
    } catch { setSyncError('Device backup is unavailable. Keep this page open until your changes are saved.'); }
  }, [user?.id]);

  const adopt = useCallback((next: Session | null, rows = next?.entries ?? []) => {
    sessionRef.current = next; entriesRef.current = rows;
    setSession(next); setEntries(rows);
  }, []);

  const enqueue = useCallback(<T,>(operation: () => Promise<T>): Promise<T> => {
    const epoch = generation.current;
    const result = tail.current.catch(() => undefined).then(() => {
      if (epoch !== generation.current) throw new Error('Account changed');
      return operation();
    });
    tail.current = result.catch(() => undefined);
    return result;
  }, []);

  const handleFailure = useCallback((err: unknown) => {
    const conflict = err instanceof ApiError && err.status === 409;
    const retryable = err instanceof ApiError && (err.status === 0 || err.status === 503);
    blocked.current = !retryable;
    setSaveState(conflict ? 'conflict' : retryable ? 'offline' : 'error');
    setSyncError(err instanceof Error ? err.message : 'Could not save your workout');
    setPendingSync(true);
    persist();
  }, [persist]);

  const saveNow = useCallback(() => enqueue(async () => {
    const current = sessionRef.current;
    if (!current || !dirty.current || blocked.current) return;
    const epoch = generation.current;
    const version = editVersion.current;
    const rows = entriesRef.current;
    setSaveState('saving');
    try {
      const { session: saved } = await api.saveSession(current.id, { entries: rows, revision: current.revision ?? 0 });
      if (epoch !== generation.current || sessionRef.current?.id !== current.id) return;
      sessionRef.current = saved; setSession(saved);
      if (version === editVersion.current) dirty.current = false;
      setPendingSync(dirty.current); setSaveState(dirty.current ? 'saving' : 'saved'); setSyncError('');
      persist();
    } catch (err) {
      if (epoch === generation.current) handleFailure(err);
      throw err;
    }
  }), [enqueue, handleFailure, persist]);

  useEffect(() => {
    let cancelled = false;
    const restoreEpoch = generation.current;
    const local = user ? readLocal(user.id) : null;
    if (local) {
      dirty.current = local.dirty;
      adopt(local.session, local.entries);
      setPendingSync(local.dirty);
    }
    if (!user) { setLoading(false); return; }
    void api.activeSession().then(({ session: saved }) => {
      if (cancelled || restoreEpoch !== generation.current) return;
      const pending = dirty.current && sessionRef.current ? { session: sessionRef.current, entries: entriesRef.current, dirty: true } : local;
      if (pending?.dirty && (!saved || saved.id !== pending.session.id || (saved.revision ?? 0) !== (pending.session.revision ?? 0))) {
        blocked.current = true; setSaveState('conflict');
        setSyncError('Your device has unsaved changes and the saved workout has changed. Choose which copy to keep.');
        return;
      }
      dirty.current = !!pending?.dirty;
      adopt(saved, pending?.dirty ? pending.entries : saved?.entries ?? []);
      persist();
    }).catch((err) => {
      if (cancelled || restoreEpoch !== generation.current) return;
      if (local) { setSaveState('offline'); setPendingSync(local.dirty); }
      else setSyncError(err instanceof Error ? err.message : 'Could not load the workout');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; generation.current++; };
  }, [user?.id, adopt, persist]);

  useEffect(() => {
    if (loading || closing.current || !session || !dirty.current || blocked.current) return;
    persist();
    const timer = window.setTimeout(() => { void saveNow().catch(() => undefined); }, 800);
    return () => window.clearTimeout(timer);
  }, [entries, session, loading, persist, saveNow]);

  useEffect(() => {
    const flush = () => { if (!closing.current && dirty.current && !blocked.current) void saveNow().catch(() => undefined); };
    window.addEventListener('online', flush);
    const timer = window.setInterval(flush, 15000);
    const backup = () => persist();
    window.addEventListener('pagehide', backup);
    return () => { window.removeEventListener('online', flush); window.removeEventListener('pagehide', backup); window.clearInterval(timer); };
  }, [saveNow, persist]);

  useEffect(() => {
    let cancelled = false;
    const ids = entries.map((e) => e.exerciseId).filter((id) => !(id in previous));
    if (ids.length) void api.previous(ids).then(({ previous: result }) => {
      if (!cancelled) setPrevious((old) => ({ ...old, ...Object.fromEntries(ids.map((id) => [id, result[id]])) }));
    }).catch(() => { /* prior performance is optional while offline */ });
    return () => { cancelled = true; };
  }, [entries, previous]);

  const mutate = useCallback((fn: (list: Entry[]) => Entry[]) => {
    if (closing.current) return;
    editVersion.current++; dirty.current = true;
    const rows = fn(entriesRef.current);
    entriesRef.current = rows; setEntries(rows);
    if (blocked.current && saveState === 'error') blocked.current = false;
    persist();
  }, [persist, saveState]);
  const mutateUndoable = useCallback((fn: (list: Entry[]) => Entry[]) => {
    const snapshot = entriesRef.current;
    setUndoStack((stack) => [snapshot, ...stack].slice(0, 10));
    mutate(fn);
  }, [mutate]);
  const undo = useCallback(() => {
    const [last, ...rest] = undoStack;
    if (last) { mutate(() => last); setUndoStack(rest); }
  }, [undoStack, mutate]);

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
      syncError,
      resolveConflict: async (choice) => {
        const epoch = generation.current;
        try {
          const { session: saved } = await api.activeSession();
          if (epoch !== generation.current) return;
          if (choice === 'mine' && (!saved || saved.id !== sessionRef.current?.id)) throw new ApiError('That workout has ended. Export your device copy before switching to the saved version.', 409);
          const localRows = entriesRef.current;
          adopt(saved, choice === 'mine' ? localRows : saved?.entries ?? []);
          dirty.current = choice === 'mine'; blocked.current = false;
          setSyncError(''); setSaveState('idle'); setPendingSync(dirty.current); setUndoStack([]); persist();
          if (choice === 'mine') await saveNow();
        } catch (err) { if (epoch === generation.current) handleFailure(err); }
      },
      exportBackup: () => {
        const blob = new Blob([JSON.stringify({ session: sessionRef.current, entries: entriesRef.current }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
        anchor.href = url; anchor.download = 'workout-device-backup.json'; anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      loading,
      rest,

      start: async (opts) => {
        const epoch = ++generation.current;
        const { session: next } = await api.startSession(opts);
        if (epoch !== generation.current) return;
        dirty.current = false; blocked.current = false; closing.current = false;
        adopt(next); setUndoStack([]); setPrevious({}); setRest(null);
        setPendingSync(false); setSaveState('idle'); setSyncError(''); persist();
      },
      finish: async () => {
        if (closing.current) throw new Error('The workout is already being saved');
        closing.current = true;
        const epoch = generation.current;
        try {
          await saveNow();
          if (blocked.current) throw new ApiError(syncError || 'Resolve the save conflict before finishing', 409);
          return await enqueue(async () => {
            const current = sessionRef.current;
            if (!current) return { session: null, newPRs: [], discarded: true };
            const result = await api.finishSession(current.id, current.revision ?? 0);
            if (epoch === generation.current) {
              dirty.current = false; adopt(null); setPrevious({}); setUndoStack([]); setRest(null);
              setPendingSync(false); setSyncError(''); persist();
            }
            return result;
          });
        } catch (err) { if (epoch === generation.current) handleFailure(err); throw err; }
        finally { closing.current = false; }
      },
      cancel: async () => {
        closing.current = true;
        const epoch = generation.current;
        try {
          await enqueue(async () => {
            if (sessionRef.current) await api.deleteSession(sessionRef.current.id);
            if (epoch === generation.current) {
              dirty.current = false; adopt(null); setRest(null); setPrevious({}); setUndoStack([]);
              setPendingSync(false); setSyncError(''); persist();
            }
          });
        } finally { closing.current = false; }
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
    [session, entries, totals, previous, saveState, pendingSync, loading, rest, mutate, mutateUndoable, undo, undoStack.length, byId, syncError, enqueue, adopt, persist, saveNow, handleFailure],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkout(): WorkoutState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWorkout must be used inside WorkoutProvider');
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, isBackendDown } from '../lib/api';
import type { Exercise, Routine, User } from '../lib/types';

import { CATEGORIES } from '../../shared/catalog.js';
export { CATEGORIES };

interface AppState {
  ready: boolean;
  /** Set when the API or its database is unreachable — not a sign-in problem. */
  backendError: string | null;
  retryBoot: () => void;
  user: User | null;
  exercises: Exercise[];
  byId: Map<string, Exercise>;
  routines: Routine[];
  setUser: (u: User) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadExercises: () => Promise<void>;
  reloadRoutines: () => Promise<void>;
  toggleFavorite: (category: string, exerciseId: string) => Promise<void>;
  isFavorite: (category: string, exerciseId: string) => boolean;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [boot, setBoot] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);

  const loadAll = useCallback(async () => {
    const [{ exercises: ex }, { routines: r }] = await Promise.all([api.exercises(), api.routines()]);
    setExercises(ex ?? []);
    setRoutines(r ?? []);
  }, []);

  // Restore the session from the httpOnly cookie on first paint.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setReady(false);
      try {
        const { user: u } = await api.me();
        if (cancelled) return;
        setUser(u);
        setBackendError(null);
        await loadAll();
      } catch (err) {
        if (cancelled) return;
        setUser(null);
        // A 401 just means "not signed in"; anything else is infrastructure.
        setBackendError(isBackendDown(err) ? (err as Error).message : null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAll, boot]);

  const byId = useMemo(() => new Map((exercises ?? []).map((e) => [e.id, e])), [exercises]);

  const value: AppState = useMemo(
    () => ({
      ready,
      backendError,
      retryBoot: () => setBoot((n) => n + 1),
      user,
      exercises,
      byId,
      routines,
      setUser,

      signIn: async (email, password) => {
        const { user: u } = await api.login({ email, password });
        setUser(u);
        await loadAll();
      },

      signUp: async (name, email, password) => {
        const { user: u } = await api.signup({ name, email, password });
        setUser(u);
        await loadAll();
      },

      signOut: async () => {
        await api.logout();
        setUser(null);
        setExercises([]);
        setRoutines([]);
      },

      reloadExercises: async () => setExercises((await api.exercises()).exercises),
      reloadRoutines: async () => setRoutines((await api.routines()).routines),

      isFavorite: (category, exerciseId) => !!user?.favorites?.[category]?.includes(exerciseId),

      toggleFavorite: async (category, exerciseId) => {
        if (!user) return;
        const current = user.favorites?.[category] ?? [];
        const next = current.includes(exerciseId)
          ? current.filter((x) => x !== exerciseId)
          : [...current, exerciseId];
        const favorites = { ...(user.favorites ?? {}), [category]: next };
        setUser({ ...user, favorites }); // optimistic — a starred icon must not wait on the network
        const { user: saved } = await api.updateMe({ favorites });
        setUser(saved);
      },
    }),
    [ready, backendError, user, exercises, byId, routines, loadAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

/** Body metrics in the shape the calorie engine wants. */
export function useProfileMetrics() {
  const { user } = useApp();
  return {
    sex: user?.sex ?? 'male',
    weightKg: user?.currentWeightKg ?? 0,
    heightCm: user?.heightCm ?? 0,
    age: user?.birthYear ? new Date().getFullYear() - user.birthYear : 0,
  };
}

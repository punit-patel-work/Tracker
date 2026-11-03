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
import { cacheAccount, clearAccountCache, offlineAccount } from '../lib/offline';
import { api, isBackendDown } from '../lib/api';
import type { Exercise, Routine, User } from '../lib/types';

import { CATEGORIES } from '../../shared/catalog.js';
export { CATEGORIES };

interface AppState {
  ready: boolean;
  offline: boolean;
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
  const [offline, setOffline] = useState(false);
  const [ready, setReady] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [boot, setBoot] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loadedUser, setLoadedUser] = useState<string | null>(null);
  const accountEpoch = useRef(0);

  const loadAll = useCallback(async (epoch: number, userId: string) => {
    const [{ exercises: ex }, { routines: r }] = await Promise.all([api.exercises(), api.routines()]);
    if (epoch !== accountEpoch.current) return;
    setExercises(ex ?? []);
    setRoutines(r ?? []);
    setLoadedUser(userId);
  }, []);

  // Restore the session from the httpOnly cookie on first paint.
  useEffect(() => {
    let cancelled = false;
    const epoch = ++accountEpoch.current;
    (async () => {
      setReady(false);
      let authenticatedId: string | undefined;
      try {
        const { user: u } = await api.me();
        if (cancelled || epoch !== accountEpoch.current) return;
        authenticatedId = u.id;
        setUser(u);
        setBackendError(null);
        setOffline(false);
        await loadAll(epoch, u.id);
      } catch (err) {
        if (cancelled || epoch !== accountEpoch.current) return;
        const cached = isBackendDown(err) ? offlineAccount() : null;
        if (cached && (!authenticatedId || cached.user.id === authenticatedId)) {
          setUser(cached.user); setExercises(cached.exercises); setRoutines(cached.routines);
          setLoadedUser(cached.user.id);
          setOffline(true); setBackendError(null); return;
        }
        if (!isBackendDown(err)) clearAccountCache();
        setUser(null);
        setExercises([]);
        setRoutines([]);
        setLoadedUser(null);
        setOffline(false);
        // A 401 just means "not signed in"; anything else is infrastructure.
        setBackendError(isBackendDown(err) ? (err as Error).message : null);
      } finally {
        if (!cancelled && epoch === accountEpoch.current) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAll, boot]);

  useEffect(() => {
    if (user && !offline && ready && loadedUser === user.id) cacheAccount(user, exercises, routines);
  }, [user, exercises, routines, offline, ready, loadedUser]);

  useEffect(() => {
    if (!offline) return;
    const reconnect = () => setBoot((n) => n + 1);
    window.addEventListener('online', reconnect);
    return () => window.removeEventListener('online', reconnect);
  }, [offline]);

  const byId = useMemo(() => new Map((exercises ?? []).map((e) => [e.id, e])), [exercises]);

  const value: AppState = useMemo(
    () => ({
      ready,
      offline,
      backendError,
      retryBoot: () => setBoot((n) => n + 1),
      user,
      exercises,
      byId,
      routines,
      setUser: (next) => setUser((current) => current?.id === next.id ? next : current),

      signIn: async (email, password) => {
        const epoch = ++accountEpoch.current;
        const { user: u } = await api.login({ email, password });
        if (epoch !== accountEpoch.current) return;
        setOffline(false);
        setUser(u);
        await loadAll(epoch, u.id);
      },

      signUp: async (name, email, password) => {
        const epoch = ++accountEpoch.current;
        const { user: u } = await api.signup({ name, email, password });
        if (epoch !== accountEpoch.current) return;
        setOffline(false);
        setUser(u);
        await loadAll(epoch, u.id);
      },

      signOut: async () => {
        try {
          const backup = JSON.parse(localStorage.getItem(`gt.activeWorkout.${user?.id}`) ?? 'null');
          if (backup?.dirty && !window.confirm('This device has unsaved workout changes. Signing out will remove its local copy. Cancel to sync or export it first.')) return;
        } catch { /* no readable backup */ }
        ++accountEpoch.current;
        await api.logout();
        clearAccountCache(user?.id);
        setOffline(false);
        setUser(null);
        setExercises([]);
        setRoutines([]);
        setLoadedUser(null);
        setReady(true);
      },

      reloadExercises: async () => { const epoch = accountEpoch.current; const result = await api.exercises(); if (epoch === accountEpoch.current) setExercises(result.exercises); },
      reloadRoutines: async () => { const epoch = accountEpoch.current; const result = await api.routines(); if (epoch === accountEpoch.current) setRoutines(result.routines); },

      isFavorite: (category, exerciseId) => !!user?.favorites?.[category]?.includes(exerciseId),

      toggleFavorite: async (category, exerciseId) => {
        if (!user) return;
        const epoch = accountEpoch.current;
        const current = user.favorites?.[category] ?? [];
        const next = current.includes(exerciseId)
          ? current.filter((x) => x !== exerciseId)
          : [...current, exerciseId];
        const favorites = { ...(user.favorites ?? {}), [category]: next };
        setUser({ ...user, favorites }); // optimistic — a starred icon must not wait on the network
        const { user: saved } = await api.updateMe({ favorites });
        if (epoch === accountEpoch.current) setUser(saved);
      },
    }),
    [ready, offline, backendError, user, exercises, byId, routines, loadAll],
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

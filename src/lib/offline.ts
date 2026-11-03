import type { Exercise, Routine, User } from './types';

const KEY = 'gt.offlineAccount.v1';
interface OfflineAccount { user: User; exercises: Exercise[]; routines: Routine[]; savedAt: number }
export function offlineAccount(): OfflineAccount | null {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!data?.user?.id || !Array.isArray(data.exercises) || !Array.isArray(data.routines) || !Number.isFinite(data.savedAt) || data.savedAt > Date.now() || Date.now() - data.savedAt > 7 * 86400000) return null;
    return data;
  } catch { return null; }
}
export function cacheAccount(user: User, exercises: Exercise[], routines: Routine[]) {
  try { localStorage.setItem(KEY, JSON.stringify({ user, exercises, routines, savedAt: Date.now() })); } catch { /* optional cache */ }
}
export function clearAccountCache(userId?: string) {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem('gt.activeWorkout'); // remove the old unscoped backup
    if (userId) localStorage.removeItem(`gt.activeWorkout.${userId}`);
  } catch { /* storage disabled */ }
}

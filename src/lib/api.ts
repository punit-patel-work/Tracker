import type {
  Entry,
  Exercise,
  ExercisePoint,
  NewPR,
  Overview,
  PreviousPerformance,
  Routine,
  Session,
  User,
} from './types';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin', // the session cookie is httpOnly
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Status 0 means the request never reached a server: API down, or no network.
    throw new ApiError('Cannot reach the server. Is the API running?', 0);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((json as { error?: string }).error ?? 'Request failed', res.status);
  return json as T;
}

/** True when the failure is infrastructure, not something the user did wrong. */
export function isBackendDown(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 0 || err.status === 503);
}

export const api = {
  signup: (body: { name: string; email: string; password: string }) =>
    call<{ user: User }>('POST', '/auth/signup', body),
  login: (body: { email: string; password: string }) => call<{ user: User }>('POST', '/auth/login', body),
  logout: () => call<{ ok: true }>('POST', '/auth/logout'),
  me: () => call<{ user: User }>('GET', '/auth/me'),
  verifyEmail: (token: string) => call<{ ok: true; email: string }>('POST', '/auth/verify', { token }),
  resendVerification: () =>
    call<{ ok: true; sent?: boolean; alreadyVerified?: boolean; verifyLink: string | null }>(
      'POST',
      '/auth/resend-verification',
    ),
  forgot: (email: string) => call<{ ok: true; devLink: string | null }>('POST', '/auth/forgot', { email }),
  reset: (token: string, password: string) => call<{ user: User }>('POST', '/auth/reset', { token, password }),

  updateMe: (body: Partial<User> & { weightKg?: number }) => call<{ user: User }>('PATCH', '/me', body),
  addWeight: (kg: number, date?: string) => call<{ user: User }>('POST', '/me/weight', { kg, date }),
  removeWeight: (date: string) => call<{ user: User }>('DELETE', `/me/weight/${date}`),
  deleteAccount: (password: string) => call<{ ok: true }>('POST', '/me/delete-account', { password }),
  exportUrl: (format: 'json' | 'csv') => (format === 'csv' ? '/api/me/export.csv' : '/api/me/export'),

  exercises: () => call<{ exercises: Exercise[] }>('GET', '/exercises'),
  createExercise: (body: Partial<Exercise>) => call<{ exercise: Exercise }>('POST', '/exercises', body),

  routines: () => call<{ routines: Routine[] }>('GET', '/routines'),
  createRoutine: (body: { name: string; note?: string; exercises: unknown[] }) =>
    call<{ routine: Routine }>('POST', '/routines', body),
  updateRoutine: (id: string, body: { name?: string; note?: string; exercises?: unknown[] }) =>
    call<{ routine: Routine }>('PATCH', `/routines/${id}`, body),
  deleteRoutine: (id: string) => call<{ ok: true }>('DELETE', `/routines/${id}`),

  activeSession: () => call<{ session: Session | null }>('GET', '/sessions/active'),
  startSession: (body: { routineId?: string; name?: string }) => call<{ session: Session }>('POST', '/sessions', body),
  saveSession: (id: string, body: { entries?: Entry[]; name?: string; notes?: string }) =>
    call<{ session: Session }>('PATCH', `/sessions/${id}`, body),
  finishSession: (id: string) =>
    call<{ session: Session | null; newPRs: NewPR[]; discarded: boolean }>('POST', `/sessions/${id}/finish`),
  sessions: (limit = 30, skip = 0) =>
    call<{ sessions: Session[]; total: number }>('GET', `/sessions?limit=${limit}&skip=${skip}`),
  deleteSession: (id: string) => call<{ ok: true }>('DELETE', `/sessions/${id}`),
  logManual: (body: { date: string; name?: string; durationMin?: number; entries: Entry[] }) =>
    call<{ session: Session }>('POST', '/sessions/manual', body),
  saveAsRoutine: (id: string, name?: string) =>
    call<{ routineId: string; name: string }>('POST', `/sessions/${id}/save-as-routine`, { name }),
  previous: (ids: string[]) =>
    ids.length
      ? call<{ previous: Record<string, PreviousPerformance> }>('GET', `/sessions/previous?ids=${ids.join(',')}`)
      : Promise.resolve({ previous: {} as Record<string, PreviousPerformance> }),

  overview: (weeks = 12) => call<Overview>('GET', `/stats/overview?weeks=${weeks}`),
  exerciseTrend: (id: string) => call<{ points: ExercisePoint[] }>('GET', `/stats/exercise/${id}`),
};

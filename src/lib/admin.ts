import { ApiError } from './api';
export async function adminApi<T = any>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/admin${path}`, { method, credentials: 'same-origin', cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone },
      body: body === undefined ? undefined : JSON.stringify(body), signal: signal ?? AbortSignal.timeout(20000) });
  } catch (error) { if (signal?.aborted) throw error; throw new ApiError('Cannot reach administration. Check your connection and retry.', 0); }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new ApiError(data?.error ?? 'Administration request failed', response.status);
  return data;
}

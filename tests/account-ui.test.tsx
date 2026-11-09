import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AppProvider, useApp } from '../src/state/app';
import { api, ApiError } from '../src/lib/api';
import { cacheAccount, offlineAccount } from '../src/lib/offline';
import { useModal } from '../src/components/useModal';

const alice = { id: 'alice', name: 'Alice', units: 'metric' } as any;
const exercise = { id: 'alice-exercise', name: 'Private lift' } as any;
let app: ReturnType<typeof useApp>;
function Probe() { app = useApp(); return <div>{app.user?.name ?? 'Signed out'}</div>; }
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(api, 'me').mockResolvedValue({ user: alice });
  vi.spyOn(api, 'exercises').mockResolvedValue({ exercises: [exercise] });
  vi.spyOn(api, 'routines').mockResolvedValue({ routines: [] });
  vi.spyOn(api, 'logout').mockResolvedValue({ ok: true });
});
afterEach(cleanup);

it('cold reopens a previously loaded account when the API is unreachable', async () => {
  cacheAccount(alice, [exercise], []);
  vi.mocked(api.me).mockRejectedValue(new ApiError('Offline', 0));
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(app.ready).toBe(true));
  expect(app.offline).toBe(true);
  expect(app.exercises[0].id).toBe(exercise.id);
  vi.mocked(api.me).mockResolvedValue({ user: alice });
  fireEvent(window, new Event('online'));
  await waitFor(() => expect(app.offline).toBe(false));
  await waitFor(() => expect(app.ready).toBe(true));
});

it('does not restore cached identity after the server rejects authentication', async () => {
  cacheAccount(alice, [exercise], []);
  vi.mocked(api.me).mockRejectedValue(new ApiError('Not signed in', 401));
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(app.ready).toBe(true));
  expect(app.user).toBeNull();
  expect(offlineAccount()).toBeNull();
});

it('does not fall back to another account when authenticated catalog loading fails', async () => {
  cacheAccount(alice, [exercise], []);
  vi.mocked(api.me).mockResolvedValue({ user: { ...alice, id: 'bob', name: 'Bob' } });
  vi.mocked(api.exercises).mockRejectedValue(new ApiError('Unavailable', 503));
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(app.ready).toBe(true));
  expect(app.user).toBeNull();
  expect(app.exercises).toEqual([]);
  expect(app.backendError).toBe('Unavailable');
});

it('ignores a late catalog response after sign-out', async () => {
  let resolve: (value: any) => void;
  vi.mocked(api.exercises).mockImplementation(() => new Promise((r) => { resolve = r; }));
  render(<AppProvider><Probe /></AppProvider>);
  await screen.findByText('Alice');
  await act(() => app.signOut());
  await act(async () => resolve!({ exercises: [exercise] }));
  expect(app.user).toBeNull();
  expect(app.exercises).toEqual([]);
  expect(app.ready).toBe(true);
  expect(offlineAccount()).toBeNull();
  act(() => app.setUser(alice));
  expect(app.user).toBeNull();
});

it('lets the user cancel sign-out to keep unsynced local changes', async () => {
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(app.ready).toBe(true));
  localStorage.setItem('gt.activeWorkout.alice', JSON.stringify({ dirty: true }));
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  await act(() => app.signOut());
  expect(api.logout).not.toHaveBeenCalled();
  expect(app.user?.id).toBe('alice');
  expect(localStorage.getItem('gt.activeWorkout.alice')).toBeTruthy();
});

it('traps modal keyboard focus and restores the invoking control', () => {
  function Dialog() {
    const ref = useModal(vi.fn());
    return <div ref={ref} role="dialog"><button>First</button><button>Last</button></div>;
  }
  const launcher = document.createElement('button');
  document.body.append(launcher); launcher.focus();
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([{}] as any);
  const view = render(<Dialog />);
  const first = screen.getByText('First'); const last = screen.getByText('Last');
  expect(document.activeElement).toBe(first);
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(last);
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(document.activeElement).toBe(first);
  view.unmount();
  expect(document.activeElement).toBe(launcher);
  launcher.remove();
});

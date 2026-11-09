import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Admin from '../src/pages/Admin';
import { adminApi } from '../src/lib/admin';

vi.mock('../src/lib/admin', () => ({ adminApi: vi.fn() }));
vi.mock('../src/state/app', () => ({ useApp: () => ({ user: { id: 'owner', name: 'Owner', role: 'admin', isOwner: true }, signOut: vi.fn(), exercises: [] }) }));
const member = { id: 'member', name: 'Example member', email: 'member@example.com', role: 'user', revision: 3, suspended: false, createdAt: '2026-01-01' };
const detail = { user: member, sessions: [], stats: { workouts: 0, minutes: 0 }, routines: 0 };
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  history.replaceState(null, '', '/admin#users');
  vi.mocked(adminApi).mockImplementation(async (path, method) => {
    if (method === 'PATCH') return { ok: true };
    if (path === '/users/member') return detail;
    return { items: [member], total: 26, skip: 0, limit: 25 };
  });
  vi.spyOn(window, 'confirm').mockReturnValue(false);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('paginates and searches members on the server', async () => {
  render(<Admin themeToggle={null} />);
  await screen.findByText('Example member');
  fireEvent.click(screen.getByRole('button', { name: 'Next', exact: true }));
  await waitFor(() => expect(adminApi).toHaveBeenCalledWith(expect.stringContaining('skip=25'), 'GET', undefined, expect.any(AbortSignal)));
  fireEvent.change(screen.getByRole('textbox', { name: 'Search Members' }), { target: { value: 'member@example.com' } });
  await waitFor(() => expect(adminApi).toHaveBeenCalledWith(expect.stringMatching(/q=member%40example.com.*skip=0/), 'GET', undefined, expect.any(AbortSignal)));
});
it('keeps a failed request recoverable through retry', async () => {
  vi.mocked(adminApi).mockRejectedValueOnce(new Error('Temporary database issue'));
  render(<Admin themeToggle={null} />);
  await screen.findByText('Temporary database issue');
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await screen.findByText('Example member');
});
it('requires confirmation before discarding member edits and submits the original revision', async () => {
  render(<Admin themeToggle={null} />);
  await screen.findByText('Example member');
  fireEvent.click(screen.getByRole('button', { name: 'View member' }));
  await screen.findByRole('dialog');
  fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Corrected member' } });
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(window.confirm).toHaveBeenCalled(); expect(screen.getByRole('dialog')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  await waitFor(() => expect(adminApi).toHaveBeenCalledWith('/users/member', 'PATCH', { revision: 3, name: 'Corrected member', suspended: false, role: 'user' }));
  await screen.findByText('Changes saved.');
});
it('keeps protected owner controls read-only', async () => {
  const protectedUser = { ...member, id: 'owner', isOwner: true, role: 'admin' };
  vi.mocked(adminApi).mockImplementation(async (path) => path === '/users/owner' ? { ...detail, user: protectedUser } : { items: [protectedUser], total: 1 });
  render(<Admin themeToggle={null} />);
  await screen.findByText('Example member');
  fireEvent.click(screen.getByRole('button', { name: 'View member' }));
  await screen.findByRole('dialog');
  expect(screen.queryByRole('button', { name: 'Save changes' })).toBeNull();
  expect((screen.getByLabelText('Suspend account access') as HTMLInputElement).closest('fieldset')?.disabled).toBe(true);
});
it('creates a shared exercise with a valid category and MET through the editor', async () => {
  history.replaceState(null, '', '/admin#exercises');
  vi.mocked(adminApi).mockResolvedValue({ items: [], total: 0 });
  render(<Admin themeToggle={null} />);
  fireEvent.click(screen.getByRole('button', { name: '+ Add exercise' }));
  fireEvent.change(screen.getByLabelText('Exercise name'), { target: { value: 'New exercise' } });
  fireEvent.change(screen.getByLabelText('Effort rating (MET)'), { target: { value: '5' } });
  expect(screen.getByRole('option', { name: 'Chest', exact: true })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  await waitFor(() => expect(adminApi).toHaveBeenCalledWith('/exercises', 'POST', expect.objectContaining({ name: 'New exercise', met: 5, category: 'chest', type: 'strength' })));
});
it('edits completed workouts and retains their revision and set values', async () => {
  history.replaceState(null, '', '/admin#workouts');
  const session = { id: 'workout', revision: 5, name: 'Training', date: '2026-01-01', status: 'completed', bodyWeightKg: 80, totals: { durationMin: 30 }, user: member,
    entries: [{ exerciseId: 'lift', sets: [{ reps: 8, weightKg: 50, done: true }] }] };
  vi.mocked(adminApi).mockImplementation(async (path, method) => method === 'PATCH' ? { session } : path === '/workouts/workout' ? { session, exercises: [{ id: 'lift', name: 'Bench press' }] } : { items: [session], total: 1 });
  render(<Admin themeToggle={null} />);
  await screen.findByText('Training');
  fireEvent.click(screen.getByRole('button', { name: 'View workout' }));
  await screen.findByRole('dialog');
  fireEvent.change(screen.getByLabelText('Reps'), { target: { value: '12' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  await waitFor(() => expect(adminApi).toHaveBeenCalledWith('/workouts/workout', 'PATCH', expect.objectContaining({ revision: 5, entries: [{ exerciseId: 'lift', sets: [{ reps: 12, weightKg: 50, done: true }] }] })));
});
it('switches from dashboard metrics to a table without rendering the old response shape', async () => {
  history.replaceState(null, '', '/admin#overview');
  vi.mocked(adminApi).mockImplementation(async (path) => path.startsWith('/overview') ? {
    counts: { users: 4, admins: 1, suspended: 0, active: 0, workouts: 1, routines: 2, exercises: 530 }, totals: { sessions: 1, activeMembers: 1, minutes: 30 },
    range: { from: '2026-01-01', to: '2026-01-07', days: 7 }, series: [{ date: '2026-01-01', workouts: 1, signups: 1 }], popular: [], latest: [], activity: [],
  } : { items: [member], total: 1 });
  render(<Admin themeToggle={null} />);
  await screen.findByText('Training activity');
  fireEvent.click(screen.getByRole('button', { name: 'Members', exact: true }));
  await screen.findByText('Example member');
  expect(screen.getByRole('heading', { name: 'Members' })).toBeTruthy();
});
it('submits a new member using the admin endpoint without invoking email delivery', async () => {
  render(<Admin themeToggle={null} />);
  fireEvent.click(screen.getByRole('button', { name: '+ Add member' }));
  fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'New member' } });
  fireEvent.change(screen.getByLabelText('Email', { exact: true }), { target: { value: 'new@example.com' } });
  fireEvent.change(screen.getByLabelText('Initial password'), { target: { value: 'Initial-test-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  await waitFor(() => expect(adminApi).toHaveBeenCalledWith('/users', 'POST', expect.objectContaining({ name: 'New member', email: 'new@example.com', role: 'user' })));
});

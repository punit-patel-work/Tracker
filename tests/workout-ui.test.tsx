import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { WorkoutProvider, useWorkout } from '../src/state/workout';
import { api, ApiError } from '../src/lib/api';
import ManualLog from '../src/pages/ManualLog';
import Workout from '../src/pages/Workout';
import HistoryPage from '../src/pages/HistoryPage';

const state = vi.hoisted(() => ({ app: {} as any }));
vi.mock('../src/state/app', () => ({ useApp: () => state.app, CATEGORIES: [] }));
const exercise = { id: '111111111111111111111111', name: 'Bench press', type: 'strength', met: 5, defaultRestSec: 90,
  category: 'chest', equipment: 'Machine', muscles: [], primaryMuscles: [], secondaryMuscles: [] };
const fresh = () => ({ id: '222222222222222222222222', revision: 0, date: '2026-01-01', name: 'Test workout',
  startedAt: new Date().toISOString(), endedAt: null, status: 'active', bodyWeightKg: 80, notes: '', totals: {},
  entries: [{ exerciseId: exercise.id, sets: [{ reps: 8, weightKg: 50, done: false }] }] });
let exposed: ReturnType<typeof useWorkout>;
function Probe() { exposed = useWorkout(); return <div data-testid="workout-name">{exposed.session?.name ?? 'none'}</div>; }
function Host({ account }: { account: string }) { return <WorkoutProvider key={account}><Probe /></WorkoutProvider>; }
beforeEach(() => {
  localStorage.clear();
  state.app = { user: { id: 'alice', name: 'Alice', units: 'metric' }, byId: new Map([[exercise.id, exercise]]),
    exercises: [exercise], reloadRoutines: vi.fn(), isFavorite: () => false };
  vi.spyOn(api, 'activeSession').mockResolvedValue({ session: fresh() as any });
  vi.spyOn(api, 'previous').mockResolvedValue({ previous: {} });
  vi.spyOn(api, 'saveSession').mockImplementation(async (_id, body) => ({ session: { ...fresh(), revision: body.revision + 1, entries: body.entries } as any }));
  vi.spyOn(api, 'finishSession').mockResolvedValue({ session: { ...fresh(), status: 'completed' } as any, newPRs: [], discarded: false });
  vi.spyOn(window, 'confirm').mockReturnValue(false);
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('workout persistence', () => {
  it('starts at zero, increments on completion and restores deleted sets with undo', async () => {
    render(<Host account="alice" />);
    await waitFor(() => expect(exposed.loading).toBe(false));
    expect(exposed.totals?.totalKcal).toBe(0);
    act(() => exposed.updateSet(exercise.id, 0, { done: true }));
    expect(exposed.totals!.totalKcal).toBeGreaterThan(0);
    act(() => exposed.removeSet(exercise.id, 0));
    expect(exposed.entries[0].sets).toHaveLength(0);
    act(() => exposed.undo?.());
    expect(exposed.entries[0].sets).toHaveLength(1);
  });

  it('does not let a late response revive another account’s workout', async () => {
    let resolve: (value: any) => void;
    vi.mocked(api.activeSession).mockImplementationOnce(() => new Promise((r) => { resolve = r; }));
    const view = render(<Host account="alice" />);
    state.app = { ...state.app, user: { id: 'bob', units: 'metric' } };
    vi.mocked(api.activeSession).mockResolvedValue({ session: null });
    view.rerender(<Host account="bob" />);
    await waitFor(() => expect(exposed.loading).toBe(false));
    await act(async () => resolve!({ session: fresh() }));
    expect(exposed.session).toBeNull();
    expect(localStorage.getItem('gt.activeWorkout.bob')).toBeNull();
  });

  it('restores a full account-scoped workout when the network is unavailable', async () => {
    localStorage.setItem('gt.activeWorkout.alice', JSON.stringify({ userId: 'alice', session: fresh(), entries: fresh().entries, dirty: true, updatedAt: Date.now() }));
    vi.mocked(api.activeSession).mockRejectedValue(new ApiError('Offline', 0));
    render(<Host account="alice" />);
    await waitFor(() => expect(exposed.loading).toBe(false));
    expect(exposed.session?.name).toBe('Test workout');
    expect(exposed.entries).toHaveLength(1);
    expect(exposed.pendingSync).toBe(true);
  });

  it('serializes finishing after a pending autosave and uses its latest revision', async () => {
    render(<Host account="alice" />);
    await waitFor(() => expect(exposed.loading).toBe(false));
    vi.useFakeTimers();
    let resolve: (value: any) => void;
    vi.mocked(api.saveSession).mockImplementationOnce(() => new Promise((r) => { resolve = r; }));
    act(() => exposed.updateSet(exercise.id, 0, { done: true }));
    await act(async () => { await vi.advanceTimersByTimeAsync(801); });
    let finish: Promise<any>;
    act(() => { finish = exposed.finish(); });
    expect(api.finishSession).not.toHaveBeenCalled();
    await act(async () => { resolve!({ session: { ...fresh(), revision: 1 } }); await finish!; });
    expect(api.finishSession).toHaveBeenCalledWith(fresh().id, 1);
    expect(exposed.session).toBeNull();
    expect(localStorage.getItem('gt.activeWorkout.alice')).toBeNull();
  });

  it('keeps local changes on conflict until the user chooses a copy', async () => {
    render(<Host account="alice" />);
    await waitFor(() => expect(exposed.loading).toBe(false));
    vi.mocked(api.saveSession).mockRejectedValue(new ApiError('Changed elsewhere', 409));
    act(() => exposed.updateSet(exercise.id, 0, { reps: 12, done: true }));
    await act(async () => { await exposed.finish().catch(() => undefined); });
    expect(exposed.saveState).toBe('conflict');
    expect(exposed.entries[0].sets[0].reps).toBe(12);
    expect(api.finishSession).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem('gt.activeWorkout.alice')!).dirty).toBe(true);
  });
});

describe('workout interface', () => {
  it('accepts mixed machine units, preserves loads when switching, and remembers the choice for editing', async () => {
    const row = { ...exercise, id: '333333333333333333333333', name: 'Seated row' };
    state.app.byId.set(row.id, row);
    const session = fresh();
    session.entries.push({ exerciseId: row.id, sets: [{ reps: 10, weightKg: 30, done: false }] });
    vi.mocked(api.activeSession).mockResolvedValue({ session: session as any });
    const view = render(<WorkoutProvider><Workout go={vi.fn()} /><Probe /></WorkoutProvider>);
    const picker = await screen.findByLabelText('Weight unit for Bench press');
    fireEvent.change(picker, { target: { value: 'imperial' } });
    const lbs = screen.getByLabelText('Set 1 weight in lb', { exact: true }) as HTMLInputElement;
    expect(lbs.value).toBe('110.23');
    expect((screen.getByLabelText('Set 1 weight in kg', { exact: true }) as HTMLInputElement).value).toBe('30');
    fireEvent.focus(lbs);
    fireEvent.blur(lbs);
    expect(exposed.entries[0].sets[0].weightKg).toBe(50);
    act(() => lbs.focus());
    fireEvent.change(lbs, { target: { value: '100' } });
    fireEvent.change(picker, { target: { value: 'metric' } });
    expect(exposed.entries[0].sets[0].weightKg).toBeCloseTo(45.359237, 8);
    fireEvent.change(picker, { target: { value: 'imperial' } });
    expect(exposed.entries[0].sets[0].weightKg).toBeCloseTo(45.359237, 8);
    view.unmount();

    const editor = () => <ManualLog session={{ ...fresh(), totals: { durationMin: 45 } } as any}
      onClose={vi.fn()} onSaved={vi.fn()} />;
    const past = render(editor());
    expect((screen.getByLabelText('Set 1 weight') as HTMLInputElement).value).toBe('110.23');
    state.app.user = { ...state.app.user, id: 'bob' };
    past.rerender(editor());
    expect((screen.getByLabelText('Set 1 weight') as HTMLInputElement).value).toBe('50');
    state.app.user = { ...state.app.user, id: 'alice' };
    past.rerender(editor());
    fireEvent.change(screen.getByLabelText('Weight unit for Bench press'), { target: { value: '' } });
    expect((screen.getByLabelText('Set 1 weight') as HTMLInputElement).value).toBe('50');
  });

  it('requires a finish review and can return to training without saving', async () => {
    render(<WorkoutProvider><Workout go={vi.fn()} /></WorkoutProvider>);
    await screen.findByText('Test workout');
    fireEvent.click(screen.getByRole('button', { name: 'Finish', exact: true }));
    expect(screen.getByRole('dialog', { name: 'Review your workout' })).toBeTruthy();
    expect(screen.getByText(/1 unchecked sets/)).toBeTruthy();
    expect(api.finishSession).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Keep training' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('protects dirty editor changes on Escape and submits the original revision', async () => {
    const close = vi.fn(); const saved = vi.fn();
    vi.spyOn(api, 'editCompletedSession').mockResolvedValue({ session: fresh() as any });
    render(<ManualLog session={{ ...fresh(), revision: 4, status: 'completed', totals: { durationMin: 45 } } as any} onClose={close} onSaved={saved} />);
    fireEvent.change(screen.getByLabelText('Workout name'), { target: { value: 'Updated name' } });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(window.confirm).toHaveBeenCalled(); expect(close).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(saved).toHaveBeenCalled());
    expect(api.editCompletedSession).toHaveBeenCalledWith(fresh().id, expect.objectContaining({ revision: 4, name: 'Updated name' }));
  });

  it('shows a retry action for failed history requests', async () => {
    vi.spyOn(api, 'sessions').mockRejectedValue(new ApiError('History unavailable', 503));
    render(<HistoryPage />);
    await screen.findByText('History unavailable');
    vi.mocked(api.sessions).mockResolvedValue({ sessions: [], total: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await screen.findByText('Nothing logged yet');
  });
});

it('freezes the timer during the return window and resumes only when requested', async () => {
  const session = { ...fresh(), startedAt: new Date(Date.now() - 150 * 60_000).toISOString() };
  vi.mocked(api.activeSession).mockResolvedValue({ session: session as any });
  const resume = vi.spyOn(api, 'resumeSession').mockResolvedValue({ session: {
    ...session, lastResumedAt: new Date().toISOString(), pausedMs: 30 * 60_000, revision: 1,
  } as any });
  render(<WorkoutProvider><Workout go={vi.fn()} /></WorkoutProvider>);
  const button = await screen.findByRole('button', { name: 'Resume workout' });
  expect(screen.queryByRole('button', { name: /Add exercise/ })).toBeNull();
  expect(resume).not.toHaveBeenCalled();
  fireEvent.click(button);
  await screen.findByRole('button', { name: /Add exercise/ });
  expect(resume).toHaveBeenCalledWith(session.id, 0);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import router, { finalizeEntries } from '../server/routes/sessions.routes.js';
import { Session, Exercise, User } from '../server/models.js';
import { completedWorkoutChanges } from '../server/session-edit.js';
import { bestE1rm, cardioKcal, metKcal, sessionTotals, strengthKcal } from '../shared/engine.js';

const date = '2026-10-01';
const base = { date, startedAt: new Date(`${date}T10:00:00Z`) };
const entries = [{ exerciseId: '111111111111111111111111', notes: 'Keep this note',
  sets: [{ reps: 10, weightKg: 50, restSec: 60, rpe: 8, isWarmup: false, done: true }] }];
const body = () => ({ revision: 0, date, name: 'Updated workout', durationMin: 40, entries: structuredClone(entries) });
const lift = { _id: '111111111111111111111111', type: 'strength', met: 5, defaultRestSec: 90 };

test('edits preserve timestamps and set metadata, while date/duration corrections stay coherent', () => {
  const changed = completedWorkoutChanges(body(), base, date);
  assert.equal(changed.startedAt.getTime(), base.startedAt.getTime());
  assert.equal(changed.endedAt - changed.startedAt, 40 * 60000);
  assert.equal(changed.entries[0].notes, 'Keep this note');
  assert.equal(changed.entries[0].sets[0].restSec, 60);
  assert.equal(changed.entries[0].sets[0].rpe, 8);
  assert.equal(changed.entries[0].sets[0].done, true);
  const moved = completedWorkoutChanges({ ...body(), date: '2026-09-30' }, base, date);
  assert.equal(moved.startedAt.getDate(), 30);
  assert.equal(moved.endedAt - moved.startedAt, 40 * 60000);
});

test('bad dates, durations, empty workouts and invalid numbers cannot overwrite history', () => {
  for (const patch of [{ date: '2026-02-30' }, { date: '2026-10-02' }, { date: '' },
    { durationMin: 0 }, { durationMin: -1 }, { durationMin: Infinity }, { durationMin: 601 },
    { name: ' ' }, { entries: [] }, { entries: [...entries, ...entries] },
    { entries: [{ ...entries[0], sets: [{ reps: -1 }] }] }]) {
    assert.throws(() => completedWorkoutChanges({ ...body(), ...patch }, base, date));
  }
});

test('calorie explanation matches strength, rest, timed holds and cardio calculations', () => {
  assert.equal(strengthKcal(lift, entries[0].sets, 80), metKcal(5, 80, 0.5) + metKcal(1.5, 80, 1));
  assert.equal(strengthKcal(lift, [{ ...entries[0].sets[0], isWarmup: true }], 80), 0);
  assert.equal(strengthKcal(lift, [{ durationSec: 60, done: true }], 80), metKcal(5, 80, 1) + metKcal(1.5, 80, 1.5));
  const ex = { type: 'cardio', slug: 'treadmill', isDistanceBased: true, met: 5 };
  assert.equal(cardioKcal(ex, { durationMin: 30, intensity: 'light' }, 80), metKcal(3.5, 80, 30));
  assert.equal(cardioKcal(ex, { durationMin: 30, distanceKm: 5, intensity: 'light', incline: 5 }, 80), metKcal(11, 80, 30));
  const session = { ...base, entries, bodyWeightKg: 80, endedAt: new Date(`${date}T11:00:00Z`) };
  const first = sessionTotals(session, new Map([['111111111111111111111111', lift]]));
  assert.equal(sessionTotals({ ...session, endedAt: new Date(`${date}T12:00:00Z`) }, new Map([['111111111111111111111111', lift]])).totalKcal, first.totalKcal);
});

test('prefilled routines start at zero; checking and unchecking only counts completed work', () => {
  const exercises = new Map([['111111111111111111111111', lift], ['hold', { ...lift, isTimed: true }],
    ['bike', { type: 'cardio', met: 6 }]]);
  const session = { ...base, bodyWeightKg: 80, entries: [
    { exerciseId: '111111111111111111111111', sets: Array.from({ length: 4 }, () => ({ reps: 10, weightKg: 50, done: false })) },
    { exerciseId: 'hold', sets: [{ durationSec: 60, done: false }] },
    { exerciseId: 'bike', sets: [], cardio: { durationMin: 20, intensity: 'moderate', done: false } },
  ] };
  const total = () => sessionTotals(session, exercises);
  assert.equal(total().totalKcal, 0);
  assert.equal(total().workingSets, 0);
  assert.equal(total().volumeKg, 0);
  assert.equal(total().cardioMinutes, 0);
  assert.equal(bestE1rm(session.entries[0].sets, lift, 80), 0);
  session.entries[0].sets[0].done = true;
  assert.equal(total().workingSets, 1);
  assert.equal(total().volumeKg, 500);
  assert.equal(total().totalKcal, metKcal(5, 80, 0.5) + metKcal(1.5, 80, 1.5));
  session.entries[0].sets[0].done = false;
  assert.equal(total().totalKcal, 0);
  session.entries[1].sets[0].done = true;
  assert.equal(total().totalKcal, metKcal(5, 80, 1) + metKcal(1.5, 80, 1.5));
  session.entries[2].cardio.done = true;
  assert.equal(total().cardioKcal, metKcal(6, 80, 20));
  assert.equal(total().cardioMinutes, 20);
  session.entries[2].cardio.done = false;
  assert.equal(total().cardioKcal, 0);
  assert.equal(total().cardioMinutes, 0);
});

test('finish and expiry discard unchecked values while retaining completed warmups and cardio', () => {
  const planned = { exercise: '111111111111111111111111', sets: [{ reps: 10, weightKg: 50, done: false }] };
  assert.deepEqual(finalizeEntries([planned]), []);
  const warmup = { reps: 5, weightKg: 20, isWarmup: true, done: true };
  const cardio = { durationMin: 20, intensity: 'moderate', done: true };
  const input = [{ ...planned, sets: [...planned.sets, warmup] },
    { exercise: 'bike', sets: [], cardio },
    { exercise: 'run', sets: [], cardio: { ...cardio, done: false } }];
  const finalized = finalizeEntries(input.map((entry) => ({ toObject: () => entry })));
  assert.equal(finalized.length, 2);
  assert.deepEqual(finalized[0].sets, [warmup]);
  assert.deepEqual(finalized[1].cardio, cardio);
  assert.equal(input[0].sets.length, 2, 'finalizing must not mutate pending input');
});

test('previous-performance snapshots without completion flags still provide historical lift estimates', () => {
  assert.ok(bestE1rm([{ reps: 10, weightKg: 50 }], lift, 80) > 0);
});

test('session API protects history and finishing saves only checked work', async (t) => {
  process.env.JWT_SECRET = 'isolated-session-edit-test-secret';
  let saves = 0;
  const doc = { _id: '222222222222222222222222', user: 'owner', status: 'completed', bodyWeightKg: 80,
    routine: 'routine-1', notes: 'Original note', ...base, endedAt: new Date(`${date}T11:00:00Z`),
    entries: [], totals: {}, toObject() { return { ...this }; }, async save() { saves++; } };
  t.mock.method(User, 'findById', async (id) => ({ _id: id }));
  t.mock.method(Session, 'find', (query) => query.status === 'active' ? Promise.resolve([]) : { select: () => ({ lean: async () => [] }) });
  t.mock.method(Session, 'findOne', async (query) => query._id === doc._id && query.user === doc.user ? doc : null);
  t.mock.method(Exercise, 'find', () => ({ lean: async () => [lift] }));
  const app = express();
  app.use(express.json(), cookieParser());
  app.use('/sessions', router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/sessions/222222222222222222222222`;
  const request = (suffix, payload, user = 'owner', method = 'PATCH') => fetch(url + suffix, { method,
    headers: { 'Content-Type': 'application/json', Cookie: `gt_token=${jwt.sign({ sub: user }, process.env.JWT_SECRET)}` },
    body: JSON.stringify(payload) });
  assert.equal((await request('/completed', body(), 'someone-else')).status, 404);
  assert.equal((await request('', { entries })).status, 409, 'late autosave must remain blocked');
  assert.equal((await request('/completed', { ...body(), durationMin: -1 })).status, 400);
  assert.equal(saves, 0);
  const result = await request('/completed', body());
  assert.equal(result.status, 200);
  const saved = (await result.json()).session;
  assert.equal(saved.id, '222222222222222222222222');
  assert.equal(saved.status, 'completed');
  assert.equal(saved.bodyWeightKg, 80);
  assert.equal(saved.routineId, 'routine-1');
  assert.equal(saved.notes, 'Original note');
  assert.equal(saved.totals.durationMin, 40);
  assert.equal(saved.totals.volumeKg, 500);
  assert.equal(saved.totals.totalKcal, 5.6);
  assert.equal(saves, 1);
  doc.status = 'active';
  assert.equal((await request('/completed', body())).status, 409);
  doc.routine = null;
  doc.entries[0].sets.push({ reps: 20, weightKg: 100, done: false });
  const finished = await request('/finish', { revision: 0 }, 'owner', 'POST');
  assert.equal(finished.status, 200);
  const finalSession = (await finished.json()).session;
  assert.equal(finalSession.entries[0].sets.length, 1);
  assert.equal(finalSession.totals.totalKcal, 5.6);
  assert.equal(finalSession.totals.volumeKg, 500);
  doc.status = 'active';
  doc.entries = [{ exercise: '111111111111111111111111', sets: [{ reps: 10, weightKg: 50, done: false }] }];
  const deletion = t.mock.method(Session, 'deleteOne', async () => ({ deletedCount: 1 }));
  const empty = await request('/finish', { revision: 0 }, 'owner', 'POST');
  assert.equal((await empty.json()).discarded, true);
  assert.equal(deletion.mock.callCount(), 1);
});

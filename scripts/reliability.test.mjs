import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Exercise, User, Session } from '../server/models.js';
import sessionsRouter from '../server/routes/sessions.routes.js';
import authRouter from '../server/routes/auth.routes.js';
import statsRouter from '../server/routes/stats.routes.js';
import { initializeDatabase } from '../server/db.js';
import { CATALOG } from '../shared/catalog.js';
import { cardioKcal, sessionTotals } from '../shared/engine.js';
import { todayFor, entriesInput, dateISO } from '../server/validation.js';

let db, server, base, user, cookie, exercise;
before(async () => {
  process.env.JWT_SECRET = 'isolated-reliability-test-secret';
  db = await MongoMemoryServer.create();
  await mongoose.connect(db.getUri());
  await Promise.all([User.init(), Exercise.init(), Session.init()]);
  user = await User.create({ email: 'test@example.com', name: 'Tester', passwordHash: 'unused',
    weighIns: [{ date: '2026-01-01', kg: 80 }] });
  cookie = `gt_token=${jwt.sign({ sub: String(user._id), version: 0 }, process.env.JWT_SECRET)}`;
  exercise = await Exercise.create({ slug: 'test-lift', name: 'Test Lift', type: 'strength', category: 'chest', met: 5 });
  const app = express();
  app.use(express.json(), cookieParser());
  app.use('/api/sessions', sessionsRouter); app.use('/api/auth', authRouter); app.use('/api/stats', statsRouter);
  app.use((err, _req, res, _next) => res.status(err.status ?? (err.name === 'VersionError' ? 409 : 500)).json({ error: err.message }));
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (db) await db.stop();
});
async function request(path, method = 'GET', body, auth = cookie) {
  const res = await fetch(base + path, { method, headers: { Cookie: auth, 'Content-Type': 'application/json', 'X-Time-Zone': 'America/Toronto' }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, data: await res.json(), cookie: res.headers.get('set-cookie') };
}
const rows = (reps = 8) => [{ exerciseId: String(exercise._id), sets: [{ reps, weightKg: 50, done: true }] }];

test('catalog updates archive removed entries while preserving historical exercise IDs', async () => {
  const legacy = await Exercise.create({ slug: 'unmapped-legacy', name: 'Legacy lift', type: 'strength', category: 'chest' });
  const history = await Session.create({ user: user._id, date: '2026-01-01', status: 'completed', startedAt: new Date(), bodyWeightKg: 80,
    entries: [{ exercise: legacy._id, sets: [{ reps: 5, weightKg: 20, done: true }] }] });
  await initializeDatabase();
  assert.equal((await Exercise.findById(legacy._id)).archived, true);
  assert.equal(String((await Session.findById(history._id)).entries[0].exercise), String(legacy._id));
  const before = (await Exercise.findById(legacy._id)).updatedAt.getTime();
  await initializeDatabase();
  assert.equal((await Exercise.findById(legacy._id)).updatedAt.getTime(), before, 'catalog initialization must be version gated');
});

test('simultaneous starts and stale updates cannot duplicate or overwrite active workouts', async () => {
  const starts = await Promise.all(Array.from({ length: 4 }, () => request('/sessions', 'POST', {})));
  starts.forEach((r) => assert.ok([200, 201].includes(r.status), JSON.stringify(r)));
  assert.equal(new Set(starts.map((r) => r.data.session.id)).size, 1);
  assert.equal(await Session.countDocuments({ user: user._id, status: 'active' }), 1);
  const current = (await request('/sessions/active')).data.session;
  const updates = await Promise.all([8, 10].map((reps) => request(`/sessions/${current.id}`, 'PATCH', { revision: current.revision, entries: rows(reps) })));
  assert.deepEqual(updates.map((r) => r.status).sort(), [200, 409]);
  const latest = (await request('/sessions/active')).data.session;
  const finished = await request(`/sessions/${current.id}/finish`, 'POST', { revision: latest.revision });
  assert.equal(finished.status, 200);
  assert.equal((await request(`/sessions/${current.id}`, 'PATCH', { revision: latest.revision, entries: rows(100) })).status, 409);
});

test('exercise ownership and numeric validation apply to manual and active logs', async () => {
  const stranger = new mongoose.Types.ObjectId();
  const foreign = await Exercise.create({ owner: stranger, name: 'Private', slug: 'private', type: 'strength', category: 'chest' });
  const body = { date: '2026-01-01', durationMin: 30, entries: [{ exerciseId: String(foreign._id), sets: [{ reps: 8, weightKg: 50 }] }] };
  assert.equal((await request('/sessions/manual', 'POST', body)).status, 400);
  assert.equal((await request('/sessions/manual', 'POST', { ...body, entries: rows(-1) })).status, 400);
  assert.equal((await request('/sessions/manual', 'POST', { ...body, date: '2026-02-30', entries: rows() })).status, 400);
  assert.throws(() => entriesInput(Array(101).fill({})));
});

test('password reset atomically revokes previous tokens and consumes its reset token', async () => {
  const token = crypto.randomBytes(32).toString('hex');
  const account = await User.create({ email: 'reset@example.com', name: 'Reset', passwordHash: 'unused',
    resetTokenHash: crypto.createHash('sha256').update(token).digest('hex'), resetTokenExpires: new Date(Date.now() + 60000) });
  const oldCookie = `gt_token=${jwt.sign({ sub: String(account._id), version: 0 }, process.env.JWT_SECRET)}`;
  assert.equal((await request('/auth/me', 'GET', null, oldCookie)).status, 200);
  const reset = await request('/auth/reset', 'POST', { token, password: 'new-test-password' }, oldCookie);
  assert.equal(reset.status, 200);
  assert.equal((await request('/auth/me', 'GET', null, oldCookie)).status, 401);
  assert.equal((await request('/auth/me', 'GET', null, reset.cookie.split(';')[0])).status, 200);
  assert.equal((await request('/auth/reset', 'POST', { token, password: 'newer-test-password' }, oldCookie)).status, 400);
});

test('history pages beyond 200 and searches across the full history, including literal regex characters', async () => {
  await Session.insertMany(Array.from({ length: 210 }, (_, i) => ({ user: user._id, date: '2026-01-02',
    name: i === 209 ? 'Unique [older] workout' : 'Other workout', status: 'completed', startedAt: new Date(2026, 0, 2, 0, i),
    bodyWeightKg: 80, entries: [{ exercise: exercise._id, sets: [{ reps: 8, weightKg: 50, done: true }] }] })));
  const page = await request('/sessions?limit=30&skip=200');
  assert.equal(page.status, 200); assert.ok(page.data.sessions.length > 0);
  const result = await request('/sessions?q=' + encodeURIComponent('[older]'));
  assert.equal(result.status, 200); assert.equal(result.data.total, 1);
  const all = await request('/sessions?q=' + encodeURIComponent('Test Lift'));
  assert.ok(all.data.total >= 210);
});

test('completed edits preserve body weight, reject stale revisions and validate routine names', async () => {
  const created = await request('/sessions/manual', 'POST', { date: '2026-01-01', name: 'Before', durationMin: 30, entries: rows() });
  assert.equal(created.status, 201);
  const original = created.data.session;
  const payload = { revision: original.revision, date: '2026-01-02', name: 'After', durationMin: 50, entries: rows(12) };
  const edited = await request(`/sessions/${original.id}/completed`, 'PATCH', payload);
  assert.equal(edited.status, 200);
  assert.equal(edited.data.session.bodyWeightKg, original.bodyWeightKg);
  assert.equal(edited.data.session.totals.volumeKg, 600);
  assert.equal(edited.data.session.totals.durationMin, 50);
  assert.equal((await request(`/sessions/${original.id}/completed`, 'PATCH', payload)).status, 409);
  assert.equal((await request(`/sessions/${original.id}/completed`, 'PATCH', { ...payload, revision: edited.data.session.revision, name: 'x'.repeat(121) })).status, 400);
  assert.equal((await request(`/sessions/${original.id}/save-as-routine`, 'POST', { name: 'Edited routine' })).status, 201);
  assert.equal((await request(`/sessions/${original.id}/save-as-routine`, 'POST', { name: {} })).status, 400);
});

test('production password-reset responses and logs never expose recovery tokens', async () => {
  const previous = process.env.NODE_ENV; const originalLog = console.log; const logs = [];
  process.env.NODE_ENV = 'production'; console.log = (...args) => logs.push(args.join(' '));
  try {
    const result = await request('/auth/forgot', 'POST', { email: user.email });
    assert.equal(result.status, 200);
    assert.equal(result.data.devLink, null);
    assert.ok(!logs.some((line) => line.includes('?reset=')));
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous;
    console.log = originalLog;
  }
});

test('real catalog speed models and local calendar dates stay consistent', () => {
  const treadmill = CATALOG.find((e) => e.slug === 'treadmill-running-walking');
  const cardio = { durationMin: 30, intensity: 'moderate', done: true };
  assert.ok(cardioKcal(treadmill, { ...cardio, distanceKm: 5 }, 80) > cardioKcal(treadmill, { ...cardio, distanceKm: 2 }, 80));
  const now = new Date('2026-11-03T02:00:00Z');
  assert.equal(todayFor('America/Toronto', now), '2026-11-02');
  assert.equal(todayFor('UTC', now), '2026-11-03');
  assert.throws(() => dateISO('2026-11-03', todayFor('America/Toronto', now)));
});

test('progress cache avoids repeated full-history reads and invalidates after an edit', async () => {
  const baseSession = { bodyWeightKg: 80, date: '2026-01-03', entries: rows(), startedAt: '2026-01-03T10:00:00Z', endedAt: '2026-01-03T10:45:00Z' };
  const totals = sessionTotals(baseSession, new Map([[String(exercise._id), exercise.toObject()]]));
  await Session.insertMany(Array.from({ length: 3000 }, () => ({ ...baseSession, user: user._id, status: 'completed', totals,
    entries: [{ exercise: exercise._id, sets: baseSession.entries[0].sets }] })));
  let reads = 0;
  mongoose.set('debug', (collection, method) => { if (collection === 'sessions' && method === 'find') reads++; });
  const begin = performance.now(); const cold = await request('/stats/overview'); const coldMs = performance.now() - begin;
  assert.equal(cold.status, 200); assert.ok(reads > 0);
  reads = 0;
  const warmStart = performance.now(); const cached = await request('/stats/overview'); const warmMs = performance.now() - warmStart;
  assert.equal(cached.status, 200); assert.equal(reads, 0);
  const record = await Session.findOne({ user: user._id, status: 'completed' });
  record.name = 'Changed'; await record.save(); reads = 0;
  assert.equal((await request('/stats/overview')).status, 200); assert.ok(reads > 0);
  mongoose.set('debug', false);
  console.log(`Progress benchmark (3,000+ synthetic workouts): cold ${coldMs.toFixed(0)} ms; cached ${warmMs.toFixed(0)} ms`);
});

test('updated mail library composes messages without contacting an SMTP service', async () => {
  const mailer = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const result = await mailer.sendMail({ from: 'test@example.com', to: 'receiver@example.com', subject: 'Test', text: 'Local composition only' });
  assert.match(result.message.toString(), /Local composition only/);
});

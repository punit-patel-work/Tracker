import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import adminRouter from '../server/routes/admin.routes.js';
import authRouter from '../server/routes/auth.routes.js';
import meRouter from '../server/routes/me.routes.js';
import { User, Session, Exercise, Routine, AdminAudit } from '../server/models.js';
import { initializeDatabase } from '../server/db.js';
import { todayFor } from '../server/validation.js';

let db, server, base, owner, member, manager, lift, workout, routine;
const token = (u) => `gt_token=${jwt.sign({ sub: String(u._id), version: u.sessionVersion ?? 0 }, process.env.JWT_SECRET)}`;
const call = async (path, method = 'GET', body, who = owner) => {
  const res = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', Cookie: who ? token(who) : '', 'X-Time-Zone': 'America/Toronto' }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: res.status, data: await res.json(), cookie: res.headers.get('set-cookie'), cache: res.headers.get('cache-control') };
};
before(async () => {
  process.env.JWT_SECRET = 'test-admin-only-secret';
  db = await MongoMemoryServer.create(); await mongoose.connect(db.getUri());
  await Promise.all([User.init(), Session.init(), Exercise.init(), Routine.init(), AdminAudit.init()]);
  const passwordHash = await bcrypt.hash('Test-admin-password', 12);
  owner = await User.create({ name: 'Owner', email: 'owner@example.com', username: 'owner', role: 'admin', isOwner: true, passwordHash });
  manager = await User.create({ name: 'Manager', email: 'manager@example.com', role: 'admin', passwordHash });
  member = await User.create({ name: 'Member', email: 'member@example.com', passwordHash, weighIns: [{ date: '2026-01-01', kg: 80 }] });
  lift = await Exercise.create({ slug: 'test-lift', name: 'Test lift', type: 'strength', category: 'chest', met: 5 });
  workout = await Session.create({ user: member._id, name: 'Member session', status: 'completed', date: todayFor('America/Toronto'), startedAt: new Date(), endedAt: new Date(Date.now() + 30 * 60000), bodyWeightKg: 80,
    entries: [{ exercise: lift._id, sets: [{ reps: 8, weightKg: 50, done: true }] }], totals: { totalKcal: 20, durationMin: 30, workingSets: 1 } });
  routine = await Routine.create({ user: member._id, name: 'Member routine', exercises: [{ exercise: lift._id, targetSets: 3, targetReps: 8 }] });
  const app = express(); app.use(express.json(), cookieParser());
  app.use('/api/admin', adminRouter); app.use('/api/auth', authRouter); app.use('/api/me', meRouter);
  app.use((err, _req, res, _next) => res.status(err.status ?? (err.name === 'VersionError' ? 409 : 500)).json({ error: err.message }));
  server = app.listen(0, '127.0.0.1'); await new Promise((r) => server.once('listening', r)); base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => { if (server) await new Promise((r) => server.close(r)); await mongoose.disconnect(); if (db) await db.stop(); });

test('every admin section and write rejects unauthenticated and non-admin requests', async () => {
  for (const path of ['overview', 'users', 'workouts', 'routines', 'exercises', 'audit', 'system']) {
    assert.equal((await call(`/admin/${path}`, 'GET', undefined, null)).status, 401);
    assert.equal((await call(`/admin/${path}`, 'GET', undefined, member)).status, 403);
  }
  assert.equal((await call(`/admin/users/${member.id}`, 'PATCH', { role: 'admin' }, member)).status, 403);
  await call('/me', 'PATCH', { role: 'admin', isOwner: true }, member);
  assert.equal((await User.findById(member.id)).role, 'user');
});
test('username sign-in works and API responses do not expose hashes or reset tokens', async () => {
  const login = await call('/auth/login', 'POST', { email: 'owner', password: 'Test-admin-password' }, null);
  assert.equal(login.status, 200); assert.equal(login.data.user.role, 'admin'); assert.ok(login.cookie);
  owner = await User.findById(owner.id);
  const list = await call('/admin/users?limit=2');
  assert.equal(list.status, 200); assert.equal(list.data.items.length, 2); assert.equal(list.data.total, 3); assert.equal(list.cache, 'no-store');
  for (const path of ['/admin/users', `/admin/users/${member.id}`, '/admin/workouts', `/admin/workouts/${workout.id}`, '/admin/routines']) {
    const response = await call(path); assert.equal(response.status, 200);
    assert.doesNotMatch(JSON.stringify(response.data), /passwordHash|resetToken|verifyToken|sessionVersion/);
  }
});
test('owner protection, role delegation and stale admin edits are enforced', async () => {
  assert.equal((await call('/me/delete-account', 'POST', { password: 'Test-admin-password' })).status, 400);
  assert.equal((await call(`/admin/users/${owner.id}`, 'PATCH', { revision: owner.__v, suspended: true })).status, 400);
  assert.equal((await call(`/admin/users/${member.id}`, 'PATCH', { revision: member.__v, role: 'admin' }, manager)).status, 403);
  assert.equal((await call(`/admin/users/${owner.id}/revoke`, 'POST', {}, manager)).status, 400);
  member = await User.findById(member.id);
  const change = await call(`/admin/users/${member.id}`, 'PATCH', { revision: member.__v, name: 'Updated member' });
  assert.equal(change.status, 200);
  assert.equal((await call(`/admin/users/${member.id}`, 'PATCH', { revision: member.__v, name: 'Stale' })).status, 409);
  assert.equal((await call('/auth/me', 'GET', undefined, member)).status, 401);
  member = await User.findById(member.id);
});
test('suspension rejects existing sessions and future logins; resuming keeps history', async () => {
  assert.equal((await call(`/admin/users/${member.id}`, 'PATCH', { revision: member.__v, suspended: true })).status, 200);
  assert.equal((await call('/auth/me', 'GET', undefined, member)).status, 403);
  assert.equal((await call('/auth/login', 'POST', { email: member.email, password: 'Test-admin-password' }, null)).status, 403);
  member = await User.findById(member.id);
  assert.equal((await call(`/admin/users/${member.id}`, 'PATCH', { revision: member.__v, suspended: false })).status, 200);
  assert.equal(await Session.countDocuments({ user: member.id }), 1);
  member = await User.findById(member.id);
});
test('admin workout edits recalculate totals and reject conflicts and foreign exercises', async () => {
  const body = { revision: workout.__v, name: 'Corrected', date: workout.date, durationMin: 40, entries: [{ exerciseId: lift.id, sets: [{ reps: 12, weightKg: 50, done: true }] }] };
  const updated = await call(`/admin/workouts/${workout.id}`, 'PATCH', body);
  assert.equal(updated.status, 200); assert.equal(updated.data.session.totals.volumeKg, 600); assert.equal(updated.data.session.bodyWeightKg, 80);
  assert.equal((await call(`/admin/workouts/${workout.id}`, 'PATCH', body)).status, 409);
  const foreign = await Exercise.create({ owner: manager.id, slug: 'private', name: 'Private', category: 'chest', type: 'strength' });
  assert.equal((await call(`/admin/workouts/${workout.id}`, 'PATCH', { ...body, revision: updated.data.session.revision, entries: [{ exerciseId: foreign.id, sets: [{ reps: 8 }] }] })).status, 400);
  workout = await Session.findById(workout.id);
});
test('routine management supports targets, archiving and conflict checks', async () => {
  const body = { revision: routine.__v, name: 'Corrected routine', archived: true, exercises: [{ exerciseId: lift.id, targetSets: 5, targetReps: 10 }] };
  assert.equal((await call(`/admin/routines/${routine.id}`, 'PATCH', body)).status, 200);
  const saved = await Routine.findById(routine.id); assert.equal(saved.archived, true); assert.equal(saved.exercises[0].targetSets, 5);
  assert.equal((await call(`/admin/routines/${routine.id}`, 'PATCH', body)).status, 409);
});
test('shared catalog edits and new exercises survive a subsequent catalog refresh', async () => {
  const created = await call('/admin/exercises', 'POST', { name: 'Admin treadmill', category: 'cardio', type: 'cardio', met: 7, isDistanceBased: true, energyModel: 'walk-run' });
  assert.equal(created.status, 201);
  const e = created.data.exercise;
  assert.equal((await call(`/admin/exercises/${e.id}`, 'PATCH', { revision: e.revision, name: 'Edited treadmill', met: 8 })).status, 200);
  assert.equal((await call(`/admin/exercises/${e.id}`, 'PATCH', { revision: e.revision, met: 9 })).status, 409);
  await initializeDatabase();
  const saved = await Exercise.findById(e.id); assert.equal(saved.name, 'Edited treadmill'); assert.equal(saved.archived, false); assert.equal(saved.met, 8);
});
test('dashboard aggregates real records and fills missing chart days with zero', async () => {
  const { status, data } = await call('/admin/overview?days=7');
  assert.equal(status, 200); assert.equal(data.counts.users, 3); assert.equal(data.series.length, 7);
  assert.equal(data.totals.activeMembers, 1); assert.equal(data.totals.sessions, 1);
  assert.equal(data.series.reduce((sum, d) => sum + d.workouts, 0), 1);
  assert.ok(data.popular.length > 0);
});
test('deleting a completed workout requires its revision and leaves an audit event', async () => {
  assert.equal((await call(`/admin/workouts/${workout.id}`, 'DELETE', { revision: workout.__v - 1 })).status, 409);
  assert.equal((await call(`/admin/workouts/${workout.id}`, 'DELETE', { revision: workout.__v })).status, 200);
  assert.equal(await Session.findById(workout.id), null);
  const log = await call('/admin/audit?q=workout.delete'); assert.equal(log.status, 200); assert.equal(log.data.total, 1); assert.equal(log.data.items[0].actorName, owner.name);
});
test('administrators can create members, but only the owner can create administrators', async () => {
  const body = { name: 'New member', email: 'new@example.com', username: 'newmember', password: 'Initial-test-password', role: 'user' };
  const created = await call('/admin/users', 'POST', body, manager);
  assert.equal(created.status, 201); assert.equal(created.data.user.role, 'user');
  assert.doesNotMatch(JSON.stringify(created.data), /password|Hash/);
  assert.equal((await call('/admin/users', 'POST', { ...body, email: 'admin@example.com', role: 'admin' }, manager)).status, 403);
  assert.equal((await call('/admin/users', 'POST', body)).status, 409);
  assert.doesNotMatch(JSON.stringify((await call('/admin/audit')).data), /Initial-test-password/);
});
test('own-password changes revoke other cookies without logging passwords', async () => {
  const change = await call('/admin/password', 'POST', { currentPassword: 'Test-admin-password', password: 'Replacement-test-password' });
  assert.equal(change.status, 200); assert.ok(change.cookie);
  assert.equal((await call('/admin/system')).status, 401);
  owner = await User.findById(owner.id);
  const log = await call('/admin/audit'); assert.doesNotMatch(JSON.stringify(log.data), /Replacement-test-password|Test-admin-password/);
  assert.equal((await call('/admin/system')).status, 200);
});

test('AI tags are admin-managed and account deletion removes owned data while protecting the owner', async () => {
  const target = await User.create({name:'Delete fixture',email:'delete-fixture@test.invalid',passwordHash:'unused'});
  await call('/me','PATCH',{aiTier:'dev'},target);
  assert.equal((await User.findById(target.id)).aiTier,'regular');
  const path='/admin/users/'+target.id;
  const edit=await call(path,'PATCH',{revision:0,aiTier:'pro'});
  assert.equal(edit.data.user.aiTier,'pro');
  assert.equal((await call(path,'DELETE',{revision:0})).status,409);
  assert.equal((await call(path,'DELETE',{revision:1},target)).status,403);
  assert.equal((await call('/admin/users/'+owner.id,'DELETE',{revision:0})).status,400);
  const own=await Routine.create({user:target._id,name:'Private routine'});
  assert.equal((await call(path,'DELETE',{revision:1})).status,200);
  assert.equal(await User.findById(target.id),null);
  assert.equal(await Routine.findById(own.id),null);
  assert.ok(await AdminAudit.exists({action:'user.delete',target:target.id}));
});

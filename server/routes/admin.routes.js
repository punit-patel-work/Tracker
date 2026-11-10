import { Router } from 'express';
import mongoose from 'mongoose';
import { deleteAccount } from '../delete-account.js';
import bcrypt from 'bcryptjs';
import { User, Session, Exercise, Routine, AdminAudit } from '../models.js';
import { requireAuth, requireAdmin, issueToken } from '../auth.js';
import { text, number, id, invalid, entriesInput, accessibleExercises, dateISO, todayFor, array, routineInput } from '../validation.js';
import { completedWorkoutChanges } from '../session-edit.js';
import { sessionTotals, CALC_VERSION } from '../../shared/engine.js';
import { CATEGORIES, howToUrlFor } from '../../shared/catalog.js';
import { rateLimit } from '../rateLimit.js';

const router = Router();
router.use(requireAuth, requireAdmin);
router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
router.param('id', (_req, _res, next, value) => { try { id(value); next(); } catch (err) { next(err); } });
const pageArgs = (req) => ({ skip: number(Number(req.query.skip ?? 0), 'Offset', 0, 1000000, true), limit: number(Number(req.query.limit ?? 25), 'Page size', 1, 100, true) });
function search(req) {
  const q = text(String(req.query.q ?? ''), 'Search', 120, false);
  return q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
}
function revision(req, doc) {
  if (req.body?.revision !== (doc.__v ?? 0)) throw Object.assign(new Error('This record changed. Refresh before saving.'), { status: 409 });
}
const userView = (u) => ({ id: String(u._id), name: u.name, email: u.email, username: u.username ?? '', role: u.role ?? 'user',
  aiTier: u.aiTier ?? 'regular', isOwner: !!u.isOwner, suspended: !!u.suspended, emailVerified: !!u.emailVerified, createdAt: u.createdAt, lastLoginAt: u.lastLoginAt,
  units: u.units, goal: u.goal, timeZone: u.timeZone, revision: u.__v ?? 0 });
const userFields = 'name email username role aiTier isOwner suspended emailVerified createdAt lastLoginAt units goal timeZone __v';
const view = (doc) => { const { _id, __v, ...rest } = doc; return { ...rest, id: String(_id), revision: __v ?? 0 }; };
const sessionView = (s) => ({ ...view(s), user: s.user?.email ? userView(s.user) : s.user,
  entries: (s.entries ?? []).map(({ exercise, ...e }) => ({ ...e, exerciseId: String(exercise) })) });
const audit = (req, action, target, summary) => AdminAudit.create({ actor: req.user._id, actorName: req.user.name, action, target: String(target), summary });
function manageable(req, target) {
  if (target.isOwner || String(target._id) === String(req.user._id)) invalid('Use your account settings for your own account. The owner account is protected.');
  if (target.role === 'admin' && !req.user.isOwner) throw Object.assign(new Error('Only the owner can manage other administrators'), { status: 403 });
}
async function paged(model, filter, req, select, populate) {
  const { skip, limit } = pageArgs(req);
  let query = model.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit);
  if (select) query = query.select(select);
  if (populate) query = query.populate(populate, userFields);
  const [items, total] = await Promise.all([query.lean(), model.countDocuments(filter)]);
  return { items, total, skip, limit };
}

router.get('/overview', async (req, res) => {
  const days = number(Number(req.query.days ?? 30), 'Days', 7, 365, true);
  const today = todayFor(req.timeZone); const start = new Date(`${today}T12:00:00Z`); start.setUTCDate(start.getUTCDate() - days + 1);
  const from = start.toISOString().slice(0, 10);
  const dateQuery = { status: 'completed', date: { $gte: from, $lte: today } };
  const [users, admins, suspended, active, workouts, routines, exercises, totals, daily, registrations, popular, latest, activity] = await Promise.all([
    User.countDocuments(), User.countDocuments({ role: 'admin' }), User.countDocuments({ suspended: true }), Session.countDocuments({ status: 'active' }),
    Session.countDocuments({ status: 'completed' }), Routine.countDocuments({ archived: false }), Exercise.countDocuments({ archived: false }),
    Session.aggregate([{ $match: dateQuery }, { $group: { _id: null, sessions: { $sum: 1 }, kcal: { $sum: '$totals.totalKcal' }, minutes: { $sum: '$totals.durationMin' }, sets: { $sum: '$totals.workingSets' }, members: { $addToSet: '$user' } } }, { $project: { _id: 0, sessions: 1, kcal: 1, minutes: 1, sets: 1, activeMembers: { $size: '$members' } } }]),
    Session.aggregate([{ $match: dateQuery }, { $group: { _id: '$date', count: { $sum: 1 }, kcal: { $sum: '$totals.totalKcal' } } }, { $sort: { _id: 1 } }]),
    User.aggregate([{ $match: { createdAt: { $gte: new Date(`${from}T00:00:00Z`) } } }, { $group: { _id: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d', timezone: req.timeZone } }, count: { $sum: 1 } } }]),
    Session.aggregate([{ $match: dateQuery }, { $unwind: '$entries' }, { $group: { _id: '$entries.exercise', count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }, { $limit: 6 }, { $lookup: { from: 'exercises', localField: '_id', foreignField: '_id', as: 'exercise' } }, { $project: { count: 1, name: { $arrayElemAt: ['$exercise.name', 0] } } }]),
    Session.find().sort({ createdAt: -1 }).limit(6).select('name user date status totals createdAt').populate('user', userFields).lean(),
    AdminAudit.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  const series = Array.from({ length: days }, (_, i) => { const d = new Date(start); d.setUTCDate(d.getUTCDate() + i); const date = d.toISOString().slice(0, 10); return { date, workouts: daily.find((x) => x._id === date)?.count ?? 0, signups: registrations.find((x) => x._id === date)?.count ?? 0 }; });
  res.json({ range: { from, to: today, days }, counts: { users, admins, suspended, active, workouts, routines, exercises },
    totals: totals[0] ?? { sessions: 0, kcal: 0, minutes: 0, sets: 0, activeMembers: 0 }, series, popular, latest: latest.map(sessionView), activity: activity.map(view) });
});

router.get('/users', async (req, res) => {
  const pattern = search(req); const filter = pattern ? { $or: [{ name: pattern }, { email: pattern }, { username: pattern }] } : {};
  if (req.query.status === 'suspended') filter.suspended = true;
  if (req.query.status === 'admin') filter.role = 'admin';
  const result = await paged(User, filter, req, userFields);
  res.json({ ...result, items: result.items.map(userView) });
});
router.post('/users', async (req, res) => {
  const name = text(req.body.name, 'Name');
  const email = text(req.body.email, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid('Enter a valid email address');
  text(req.body.password, 'Password', 72);
  const password = req.body.password;
  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) invalid('Use a password with 12+ characters, at most 72 UTF-8 bytes');
  const username = req.body.username ? text(req.body.username, 'Username', 40).toLowerCase() : undefined;
  if (username && !/^[a-z0-9_]{3,40}$/.test(username)) invalid('Username must use 3–40 letters, numbers or underscores');
  const role = req.body.role ?? 'user';
  if (!['user', 'admin'].includes(role)) invalid('Invalid role');
  if (role === 'admin' && !req.user.isOwner) return res.status(403).json({ error: 'Only the owner can create administrators' });
  const aiTier = validateTier(req.body.aiTier ?? 'regular');
  let u;
  try { u = await User.create({ name, email, username, role, aiTier, passwordHash: await bcrypt.hash(password, 12), timeZone: req.timeZone }); }
  catch (err) { if (err.code === 11000) return res.status(409).json({ error: 'Email or username already exists' }); throw err; }
  await audit(req, 'user.create', u._id, `Created ${role} account for ${email}`);
  res.status(201).json({ user: userView(u) });
});
router.get('/users/:id', async (req, res) => {
  const u = await User.findById(req.params.id).select(userFields).lean();
  if (!u) return res.status(404).json({ error: 'User not found' });
  const [sessions, routines, customExercises, stats] = await Promise.all([
    Session.find({ user: u._id }).sort({ date: -1 }).limit(10).select('name date status totals').lean(),
    Routine.countDocuments({ user: u._id }), Exercise.countDocuments({ owner: u._id }),
    Session.aggregate([{ $match: { user: u._id, status: 'completed' } }, { $group: { _id: null, workouts: { $sum: 1 }, kcal: { $sum: '$totals.totalKcal' }, minutes: { $sum: '$totals.durationMin' } } }]),
  ]);
  res.json({ user: userView(u), sessions: sessions.map(view), routines, customExercises, stats: stats[0] ?? { workouts: 0, kcal: 0, minutes: 0 } });
});
router.patch('/users/:id', async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  const ownerTierOnly = req.user.isOwner && String(req.user._id) === String(u._id) &&
    req.body.aiTier !== undefined && Object.keys(req.body).every(key => ['aiTier', 'revision'].includes(key));
  if (!ownerTierOnly) manageable(req, u);
  revision(req, u);
  const changes = {};
  if (req.body.aiTier !== undefined) changes.aiTier = validateTier(req.body.aiTier);
  if (req.body.name !== undefined) changes.name = text(req.body.name, 'Name');
  if (req.body.role !== undefined) {
    if (!req.user.isOwner) return res.status(403).json({ error: 'Only the owner can change administrator access' });
    if (!['admin', 'user'].includes(req.body.role)) invalid('Invalid role');
    changes.role = req.body.role;
  }
  if (req.body.suspended !== undefined) { if (typeof req.body.suspended !== 'boolean') invalid('Invalid account status'); changes.suspended = req.body.suspended; }
  if (!Object.keys(changes).length) invalid('No supported changes');
  const result = await User.findOneAndUpdate({ _id: u._id, __v: u.__v }, { $set: changes, $inc: { __v: 1, sessionVersion: Object.keys(changes).some(k => k !== 'aiTier' && changes[k] !== u[k]) ? 1 : 0 } }, { returnDocument: 'after', runValidators: true });
  if (!result) return res.status(409).json({ error: 'User changed. Refresh and try again.' });
  await audit(req, 'user.update', u._id, `${u.email}: ${JSON.stringify(changes)}`);
  res.json({ user: userView(result) });
});
function validateTier(value) {
  if (!['regular', 'pro', 'dev'].includes(value)) invalid('Choose Regular, Pro or Dev.');
  return value;
}
router.delete('/users/:id', async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  manageable(req, u);
  revision(req, u);
  await deleteAccount(u);
  await audit(req, 'user.delete', u._id, 'Deleted member account');
  res.json({ ok: true });
});
router.post('/users/:id/revoke', async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  manageable(req, u);
  await User.updateOne({ _id: u._id }, { $inc: { sessionVersion: 1, __v: 1 } });
  await audit(req, 'user.revoke-sessions', u._id, `Signed out all devices for ${u.email}`);
  res.json({ ok: true });
});

router.get('/workouts', async (req, res) => {
  const pattern = search(req); const filter = {};
  if (pattern) { const owners = await User.find({ $or: [{ name: pattern }, { email: pattern }] }).select('_id').lean(); filter.$or = [{ name: pattern }, { date: pattern }, { user: { $in: owners.map((u) => u._id) } }]; }
  if (['active', 'completed'].includes(req.query.status)) filter.status = req.query.status;
  if (req.query.user) filter.user = id(req.query.user);
  const result = await paged(Session, filter, req, '-entries', 'user');
  res.json({ ...result, items: result.items.map(sessionView) });
});
router.get('/workouts/:id', async (req, res) => {
  const doc = await Session.findById(req.params.id).populate('user', userFields).lean();
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  const exercises = await Exercise.find({ _id: { $in: doc.entries.map((e) => e.exercise) } }).select('name type').lean();
  res.json({ session: sessionView(doc), exercises: exercises.map(view) });
});
router.patch('/workouts/:id', async (req, res) => {
  const doc = await Session.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  if (doc.status !== 'completed') return res.status(409).json({ error: 'Active workouts must be finished by their owner before editing' });
  revision(req, doc);
  let changes;
  try { changes = completedWorkoutChanges(req.body, doc, todayFor(req.timeZone)); } catch (err) { invalid(err.message); }
  changes.name = text(changes.name, 'Workout name'); changes.date = dateISO(changes.date, todayFor(req.timeZone));
  changes.entries = entriesInput(req.body.entries, true);
  const byId = await accessibleExercises(changes.entries.map((e) => e.exercise), doc.user);
  Object.assign(doc, changes); doc.totals = sessionTotals(doc, byId); doc.calcVersion = CALC_VERSION;
  await doc.save(); await audit(req, 'workout.update', doc._id, `Updated ${doc.name} (${doc.date})`);
  res.json({ session: sessionView(doc.toObject()) });
});
router.delete('/workouts/:id', async (req, res) => {
  const doc = await Session.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  if (doc.status !== 'completed') return res.status(409).json({ error: 'An active workout cannot be deleted from administration' });
  revision(req, doc);
  const result = await Session.deleteOne({ _id: doc._id, __v: doc.__v, status: 'completed' });
  if (!result.deletedCount) return res.status(409).json({ error: 'Workout changed. Refresh before deleting.' });
  await audit(req, 'workout.delete', doc._id, `Deleted ${doc.name} (${doc.date}); user ${doc.user}`);
  res.json({ ok: true });
});

router.get('/routines', async (req, res) => {
  const pattern = search(req); const filter = pattern ? { name: pattern } : {};
  if (req.query.status === 'archived') filter.archived = true;
  if (req.query.status === 'active') filter.archived = false;
  const result = await paged(Routine, filter, req, null, 'user');
  const ids = result.items.flatMap((r) => r.exercises.map((e) => e.exercise));
  const names = new Map((await Exercise.find({ _id: { $in: ids } }).select('name').lean()).map((e) => [String(e._id), e.name]));
  res.json({ ...result, items: result.items.map((r) => ({ ...view(r), user: r.user ? userView(r.user) : null,
    exercises: r.exercises.map((e) => ({ ...e, name: names.get(String(e.exercise)) ?? 'Archived exercise' })) })) });
});
router.patch('/routines/:id', async (req, res) => {
  const changes = {};
  if (req.body.name !== undefined) changes.name = text(req.body.name, 'Name');
  if (req.body.note !== undefined) changes.note = text(req.body.note, 'Notes', 2000, false);
  if (typeof req.body.archived === 'boolean') changes.archived = req.body.archived;
  const doc = await Routine.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Routine not found' });
  revision(req, doc);
  if (req.body.exercises !== undefined) {
    changes.exercises = routineInput(req.body.exercises);
    await accessibleExercises(changes.exercises.map((e) => e.exercise), doc.user);
  }
  const updated = await Routine.findOneAndUpdate({ _id: doc._id, __v: doc.__v }, { $set: changes, $inc: { __v: 1 } }, { returnDocument: 'after' });
  if (!updated) return res.status(409).json({ error: 'Routine changed. Refresh before saving.' });
  await audit(req, 'routine.update', doc._id, `Updated ${doc.name}: ${Object.keys(changes).join(', ')}`);
  res.json({ ok: true });
});

router.get('/exercises', async (req, res) => {
  const pattern = search(req); const filter = pattern ? { $or: [{ name: pattern }, { category: pattern }, { equipment: pattern }] } : {};
  if (req.query.status === 'archived') filter.archived = true;
  if (req.query.status === 'shared') filter.owner = null;
  if (req.query.status === 'custom') filter.owner = { $ne: null };
  const result = await paged(Exercise, filter, req, null, 'owner');
  res.json({ ...result, items: result.items.map((e) => ({ ...view(e), owner: e.owner ? userView(e.owner) : null })) });
});
function exerciseInput(body) {
  const out = {};
  for (const key of ['name', 'equipment']) if (body[key] !== undefined) out[key] = text(body[key], key);
  if (body.category !== undefined) { if (!CATEGORIES.some((c) => (c.id ?? c) === body.category)) invalid('Choose a valid category'); out.category = body.category; }
  for (const [key, options] of [['type', ['strength', 'cardio']], ['energyModel', ['fixed', 'walk-run', 'cycling', 'rowing']]]) {
    if (body[key] !== undefined) { if (!options.includes(body[key])) invalid(`Invalid ${key}`); out[key] = body[key]; }
  }
  for (const [key, min, max] of [['met', 0.1, 30], ['defaultRestSec', 0, 3600], ['bodyweightFactor', 0, 2], ['barWeightKg', 0, 100]]) if (body[key] !== undefined) out[key] = number(body[key], key, min, max);
  for (const key of ['archived', 'isBodyweight', 'isTimed', 'isBarbell', 'isDistanceBased']) if (body[key] !== undefined) { if (typeof body[key] !== 'boolean') invalid(`Invalid ${key}`); out[key] = body[key]; }
  for (const key of ['primaryMuscles', 'secondaryMuscles']) if (body[key] !== undefined) out[key] = array(body[key], key, 30).map((m) => text(m, 'Muscle', 80));
  return out;
}
router.post('/exercises', async (req, res) => {
  const values = exerciseInput(req.body);
  if (!values.name || !values.category || !values.type) invalid('Name, category and type are required');
  const doc = await Exercise.create({ ...values, owner: null, adminModified: true, slug: `admin-${new mongoose.Types.ObjectId()}`, howToUrl: howToUrlFor(values.name), muscles: [...(values.primaryMuscles ?? []), ...(values.secondaryMuscles ?? [])] });
  await audit(req, 'exercise.create', doc._id, `Created shared exercise ${doc.name}`);
  res.status(201).json({ exercise: view(doc.toObject()) });
});
router.patch('/exercises/:id', async (req, res) => {
  const doc = await Exercise.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Exercise not found' });
  revision(req, doc);
  const changes = exerciseInput(req.body);
  if (changes.primaryMuscles || changes.secondaryMuscles) changes.muscles = [...(changes.primaryMuscles ?? doc.primaryMuscles), ...(changes.secondaryMuscles ?? doc.secondaryMuscles)];
  if (changes.name) changes.howToUrl = howToUrlFor(changes.name);
  const result = await Exercise.findOneAndUpdate({ _id: doc._id, __v: doc.__v }, { $set: { ...changes, adminModified: true }, $inc: { __v: 1 } }, { returnDocument: 'after', runValidators: true });
  if (!result) return res.status(409).json({ error: 'Exercise changed. Refresh before saving.' });
  await audit(req, 'exercise.update', doc._id, `Updated ${doc.name}: ${Object.keys(changes).join(', ')}`);
  res.json({ exercise: view(result.toObject()) });
});
router.get('/audit', async (req, res) => {
  const pattern = search(req); const filter = pattern ? { $or: [{ action: pattern }, { actorName: pattern }, { summary: pattern }] } : {};
  const result = await paged(AdminAudit, filter, req); res.json({ ...result, items: result.items.map(view) });
});
router.get('/system', async (_req, res) => {
  const ping = Date.now(); await mongoose.connection.db.admin().ping();
  const indexes = await Session.collection.indexes();
  res.json({ database: 'Connected', databaseLatencyMs: Date.now() - ping, uptimeSeconds: Math.floor(process.uptime()), nodeVersion: process.version,
    calculationVersion: CALC_VERSION, uniqueActiveWorkoutIndex: indexes.some((i) => i.name === 'one_active_workout_per_user' && i.unique),
    mailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD), environment: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
    catalog: await mongoose.connection.collection('app_metadata').findOne({ _id: 'catalog' }, { projection: { revision: 1, updatedAt: 1 } }) });
});
router.post('/password', rateLimit({ windowMs: 15 * 60000, max: 5, keyFn: (req) => `admin-password|${req.user.id}` }), async (req, res) => {
  text(req.body.currentPassword, 'Current password', 72);
  text(req.body.password, 'New password', 72);
  const old = req.body.currentPassword;
  const password = req.body.password;
  if (Buffer.byteLength(password, 'utf8') > 72 || password.length < 12) invalid('Use 12–72 characters (at most 72 UTF-8 bytes)');
  if (!await bcrypt.compare(old, req.user.passwordHash)) return res.status(400).json({ error: 'Current password is incorrect' });
  const u = await User.findOneAndUpdate({ _id: req.user._id, passwordHash: req.user.passwordHash }, { $set: { passwordHash: await bcrypt.hash(password, 12) }, $inc: { sessionVersion: 1, __v: 1 } }, { returnDocument: 'after' });
  if (!u) return res.status(409).json({ error: 'Password already changed. Sign in again.' });
  await audit(req, 'admin.password-change', u._id, 'Changed own password and revoked previous sessions');
  issueToken(res, u); res.json({ ok: true });
});

export default router;

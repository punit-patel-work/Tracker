import { Router } from 'express';
import { Exercise, Routine, Session } from '../models.js';
import { requireAuth } from '../auth.js';
import { entriesInput, accessibleExercises, text, dateISO, todayFor, number, id } from '../validation.js';
import { completedWorkoutChanges } from '../session-edit.js';
import { bestE1rm, CALC_VERSION, effectiveLoadKg, isWorkingSet, sessionTotals } from '../../shared/engine.js';

const router = Router();
router.use(requireAuth);
router.param('id', (req, _res, next, value) => { try { id(value); next(); } catch (err) { next(err); } });

const MAX_ACTIVE_WORKOUT_MS = 6 * 60 * 60 * 1000;

/* --------------------------------------------------------------- helpers */

async function exerciseMap(ids) {
  const docs = await Exercise.find({ _id: { $in: [...new Set(ids.map(String))] } }).lean();
  return new Map(docs.map((d) => [String(d._id), d]));
}

function serialize(s) {
  return {
    id: String(s._id),
    revision: s.__v ?? 0,
    date: s.date,
    name: s.name,
    routineId: s.routine ? String(s.routine) : null,
    status: s.status,
    startedAt: s.startedAt,
    endedAt: s.endedAt,
    bodyWeightKg: s.bodyWeightKg,
    notes: s.notes,
    totals: s.totals ?? {},
    entries: (s.entries ?? []).map((e) => ({
      exerciseId: String(e.exercise),
      sets: (e.sets ?? []).map((x) => ({
        reps: x.reps,
        weightKg: x.weightKg,
        durationSec: x.durationSec,
        rpe: x.rpe,
        isWarmup: x.isWarmup,
        done: x.done,
        restSec: x.restSec,
      })),
      cardio: e.cardio ?? null,
      notes: e.notes ?? '',
    })),
  };
}

async function recompute(doc) {
  const byId = await exerciseMap((doc.entries ?? []).map((e) => e.exercise));
  const totals = sessionTotals(
    {
      entries: doc.entries.map((e) => ({ exerciseId: String(e.exercise), sets: e.sets, cardio: e.cardio })),
      bodyWeightKg: doc.bodyWeightKg,
      startedAt: doc.startedAt,
      endedAt: doc.endedAt,
      date: doc.date,
    },
    byId,
  );
  doc.totals = totals;
  doc.calcVersion = CALC_VERSION;
  return { totals, byId };
}

export function finalizeEntries(entries) {
  return (entries ?? [])
    .map((e) => {
      const obj = e.toObject ? e.toObject() : e;
      const validSets = (obj.sets ?? [])
        .filter((s) => s.done === true)
        .map((s) => ({ ...s, done: true }));
      const validCardio = obj.cardio?.done === true
        ? { ...obj.cardio, done: true }
        : null;
      return { ...obj, sets: validSets, cardio: validCardio };
    })
    .filter((e) => e.sets.length > 0 || !!e.cardio?.done);
}

/**
 * Finalize stale workouts consistently with the normal Finish action. This is
 * checked whenever the user accesses session APIs, so it also works after a
 * Cloud Run instance has slept. A periodic sweep below handles active servers.
 */
async function closeExpiredSessions(userId = null) {
  const cutoff = new Date(Date.now() - MAX_ACTIVE_WORKOUT_MS);
  const query = { status: 'active', startedAt: { $lte: cutoff } };
  if (userId) query.user = userId;

  const stale = await Session.find(query);
  for (const doc of stale) {
    doc.entries = finalizeEntries(doc.entries);

    if (!doc.entries.length) {
      await Session.deleteOne({ _id: doc._id, status: 'active', __v: doc.__v });
      continue;
    }

    doc.status = 'completed';
    doc.endedAt = new Date(doc.startedAt.getTime() + MAX_ACTIVE_WORKOUT_MS);
    await recompute(doc);
    try { await doc.save(); } catch (err) { if (err.name === 'VersionError') continue; throw err; }

    if (doc.routine) {
      await Routine.updateOne({ _id: doc.routine }, { lastPerformedAt: doc.endedAt });
    }
  }
}

// A request-time check is the reliable path on serverless hosts. This interval
// additionally closes stale workouts promptly while an instance stays awake.
const expirySweep = setInterval(() => {
  void closeExpiredSessions().catch((err) => console.error('[sessions] expiry sweep failed:', err.message));
}, 5 * 60 * 1000);
expirySweep.unref?.();

router.use(async (req, _res, next) => {
  try {
    await closeExpiredSessions(req.user._id);
    next();
  } catch (err) {
    next(err);
  }
});

function requireRevision(req, doc) {
  if (!Number.isInteger(req.body?.revision) || req.body.revision !== (doc.__v ?? 0)) {
    throw Object.assign(new Error('This workout changed on another device. Review the latest version before saving.'), { status: 409 });
  }
}

/* ---------------------------------------------------------------- routes */

/** The in-progress workout, if any — this is what makes a dead phone survivable. */
router.get('/active', async (req, res) => {
  const doc = await Session.findOne({ user: req.user._id, status: 'active' }).sort({ startedAt: -1 }).lean();
  res.json({ session: doc ? serialize(doc) : null });
});

router.post('/', async (req, res) => {
  const existing = await Session.findOne({ user: req.user._id, status: 'active' });
  // Starting a workout is intentionally idempotent. Mobile users can tap twice,
  // reconnect after going offline, or have stale client state while an active
  // session already exists. Resume that session instead of producing repeated
  // 409 errors (and never create two active workouts for one user).
  if (existing) {
    return res.status(200).json({ session: serialize(existing.toObject()), resumed: true });
  }

  const date = dateISO(req.body?.date ?? todayFor(req.timeZone), todayFor(req.timeZone));
  const bodyWeightKg = req.user.weightOn(date);
  if (!(bodyWeightKg > 0)) return res.status(400).json({ error: 'Add your body weight first — calorie estimates need it' });

  let entries = [];
  let name = text(req.body?.name ?? 'Quick Workout', 'Workout name');
  let routineId = null;

  if (req.body?.routineId) {
    id(req.body.routineId);
    const routine = await Routine.findOne({ _id: req.body.routineId, user: req.user._id }).lean();
    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    const byId = await accessibleExercises(routine.exercises.map((e) => String(e.exercise)), req.user._id);
    name = routine.name;
    routineId = routine._id;
    // Pre-build the planned sets so the screen opens ready to log, not empty.
    entries = routine.exercises.map((re) => {
      const ex = byId.get(String(re.exercise));
      return {
        exercise: re.exercise,
        sets:
          ex?.type === 'cardio'
            ? []
            : Array.from({ length: number(re.targetSets || 3, 'Target sets', 1, 100, true) }, () => ({
                reps: re.targetReps || null,
                weightKg: re.targetWeightKg ?? null,
                durationSec: re.targetDurationSec ?? null,
                restSec: re.restSec ?? null,
                done: false,
                isWarmup: false,
              })),
        cardio: ex?.type === 'cardio' ? { durationMin: re.targetCardioMin ?? null, distanceKm: null, intensity: 'moderate', done: false } : null,
      };
    });
  }

  const doc = new Session({
    user: req.user._id,
    date,
    name,
    routine: routineId,
    status: 'active',
    startedAt: new Date(),
    bodyWeightKg,
    entries,
  });
  await recompute(doc);
  try {
    await doc.save();
  } catch (err) {
    if (err.code !== 11000) throw err;
    const active = await Session.findOne({ user: req.user._id, status: 'active' });
    if (!active) throw err;
    return res.json({ session: serialize(active.toObject()), resumed: true });
  }
  res.status(201).json({ session: serialize(doc.toObject()) });
});

/** Explicit history edits stay separate from delayed active-workout autosaves. */
router.patch('/:id/completed', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ error: 'Workout not found' });

  if (doc.status !== 'completed') return res.status(409).json({ error: 'Finish this workout before editing it in History' });
  requireRevision(req, doc);
  let changes;
  try {
    changes = completedWorkoutChanges(req.body, doc, todayFor(req.timeZone));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  changes.name = text(changes.name, 'Workout name');
  changes.date = dateISO(changes.date, todayFor(req.timeZone));
  changes.entries = entriesInput(req.body.entries, true);
  const byId = await accessibleExercises(changes.entries.map((entry) => entry.exercise), req.user._id);
  if (changes.entries.some((entry) => !byId.has(entry.exercise))) {
    return res.status(400).json({ error: 'One of these exercises is no longer available' });
  }
  Object.assign(doc, changes);
  await recompute(doc);
  await doc.save();
  res.json({ session: serialize(doc.toObject()) });
});

/** Autosave replaces the entry list only when the client's revision is current. */
router.patch('/:id', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  if (doc.status !== 'active') {
    return res.status(409).json({ error: 'This workout has already ended', session: serialize(doc.toObject()) });
  }

  requireRevision(req, doc);
  if (req.body.name !== undefined) doc.name = text(req.body.name, 'Workout name');
  if (req.body.notes !== undefined) doc.notes = text(req.body.notes, 'Workout notes', 2000, false);
  if (req.body.date !== undefined) doc.date = dateISO(req.body.date, todayFor(req.timeZone));
  if (req.body.entries !== undefined) {
    const entries = entriesInput(req.body.entries);
    await accessibleExercises(entries.map((e) => e.exercise), req.user._id);
    doc.entries = entries;
  }

  await recompute(doc);
  await doc.save();
  res.json({ session: serialize(doc.toObject()) });
});

/**
 * Log a workout you already did. Writes a completed session straight to
 * history without touching the active-session slot, so you can backfill a
 * missed day without interrupting a workout in progress.
 */
router.post('/manual', async (req, res) => {
  const date = dateISO(req.body?.date, todayFor(req.timeZone));
  const name = text(req.body?.name || 'Logged afterwards', 'Workout name');
  const minutes = number(req.body?.durationMin ?? 45, 'Duration', 0.01, 600);
  const entries = entriesInput(req.body?.entries, true);
  if (!entries.length || entries.some((e) => !e.sets.length && !e.cardio)) return res.status(400).json({ error: 'Fill in at least one set or cardio entry per exercise' });
  await accessibleExercises(entries.map((e) => e.exercise), req.user._id);
  const bodyWeightKg = req.user.weightOn(date);
  if (!(bodyWeightKg > 0)) return res.status(400).json({ error: 'Add your body weight first' });
  const startedAt = new Date(`${date}T12:00:00Z`);
  const doc = await Session.create({ user: req.user._id, date, name, status: 'completed', startedAt,
    endedAt: new Date(startedAt.getTime() + minutes * 60000), bodyWeightKg, entries });

  await recompute(doc);
  await doc.save();
  res.status(201).json({ session: serialize(doc.toObject()) });
});

/** Turn a session you liked into a reusable routine. */
router.post('/:id/save-as-routine', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  const name = text(req.body?.name ?? `${doc.name} routine`, 'Routine name');

  const exercises = (doc.entries ?? []).map((e) => {
    const working = (e.sets ?? []).filter((s) => !s.isWarmup);
    // Median reps is a better target than the last set, which is often a drop-off.
    const reps = working.map((s) => s.reps ?? 0).sort((a, b) => a - b);
    return {
      exercise: e.exercise,
      targetSets: working.length || 3,
      targetReps: reps.length ? reps[Math.floor(reps.length / 2)] : 8,
      targetWeightKg: null,
      restSec: null,
    };
  });

  const routine = await Routine.create({
    user: req.user._id,
    name,
    note: `Built from the workout on ${doc.date}`,
    exercises,
  });
  res.status(201).json({ routineId: String(routine._id), name: routine.name });
});

/** navigator.sendBeacon target — a last flush when the tab closes mid-workout. */
router.post('/:id/beacon', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id, status: 'active' });
  if (!doc || !Array.isArray(req.body?.entries)) return res.status(204).end();
  requireRevision(req, doc);
  const entries = entriesInput(req.body.entries);
  await accessibleExercises(entries.map((e) => e.exercise), req.user._id);
  doc.entries = entries;

  await recompute(doc);
  await doc.save();
  res.status(204).end();
});

/**
 * Finish. Empty exercises are dropped so an opened-and-ignored card never lands
 * in history, and a workout with nothing logged is discarded rather than saved.
 */
router.post('/:id/finish', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  if (doc.status === 'completed') {
    return res.json({ session: serialize(doc.toObject()), newPRs: [], discarded: false, autoClosed: true });
  }

  requireRevision(req, doc);
  doc.entries = finalizeEntries(doc.entries);

  if (!doc.entries.length) {
    const removed = await Session.deleteOne({ _id: doc._id, status: 'active', __v: doc.__v });
    if (!removed.deletedCount) return res.status(409).json({ error: 'This workout changed while finishing. Review it before trying again.' });
    return res.json({ discarded: true, session: null, newPRs: [] });
  }

  doc.status = 'completed';
  doc.endedAt = new Date();
  const { byId } = await recompute(doc);
  await doc.save();

  // PRs are judged against everything logged BEFORE this workout. Each prior
  // session is scored at the body weight it was performed at, which matters for
  // bodyweight lifts.
  const priorSessions = await Session.find({
    user: req.user._id,
    status: 'completed',
    _id: { $ne: doc._id },
  })
    .select('entries date bodyWeightKg')
    .lean();

  const priorBest = new Map();
  for (const s of priorSessions) {
    for (const e of s.entries ?? []) {
      const key = String(e.exercise);
      const v = bestE1rm(e.sets ?? [], byId.get(key), s.bodyWeightKg);
      if (v > (priorBest.get(key) ?? 0)) priorBest.set(key, v);
    }
  }

  const newPRs = [];
  for (const e of doc.entries) {
    const key = String(e.exercise);
    const ex = byId.get(key);
    const best = bestE1rm(e.sets ?? [], ex, doc.bodyWeightKg);
    const prior = priorBest.get(key) ?? 0;
    if (best > 0 && best > prior && prior > 0) {
      const bestSet = (e.sets ?? [])
        .filter(isWorkingSet)
        .sort((a, b) => effectiveLoadKg(ex, b, doc.bodyWeightKg) - effectiveLoadKg(ex, a, doc.bodyWeightKg))[0];
      newPRs.push({
        exerciseId: key,
        name: ex?.name ?? 'Exercise',
        e1rm: Math.round(best * 10) / 10,
        previous: Math.round(prior * 10) / 10,
        reps: bestSet?.reps,
        weightKg: bestSet ? Math.round(effectiveLoadKg(ex, bestSet, doc.bodyWeightKg) * 10) / 10 : null,
      });
    }
  }

  if (doc.routine) await Routine.updateOne({ _id: doc.routine }, { lastPerformedAt: new Date() });

  res.json({ session: serialize(doc.toObject()), newPRs, discarded: false });
});

router.get('/', async (req, res) => {
  const limit = number(Number(req.query.limit ?? 30), 'Page size', 1, 100, true);
  const skip = number(Number(req.query.skip ?? 0), 'Page offset', 0, 1000000, true);
  const query = { user: req.user._id, status: 'completed' };
  const search = text(String(req.query.q ?? ''), 'Search', 120, false);
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, 'i');
    const exercises = await Exercise.find({ name: pattern, $or: [{ owner: null }, { owner: req.user._id }] }).select('_id').lean();
    query.$or = [{ name: pattern }, { date: pattern }, { 'entries.exercise': { $in: exercises.map((e) => e._id) } }];
  }
  const [list, total] = await Promise.all([
    Session.find(query).sort({ date: -1, startedAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    Session.countDocuments(query),
  ]);
  res.json({ sessions: list.map(serialize), total });
});

/**
 * "What did I do last time?" for a batch of exercises — the single most useful
 * thing to show while logging, so it gets its own endpoint instead of pulling
 * the whole history down to the phone.
 */
router.get('/previous', async (req, res) => {
  const ids = String(req.query.ids ?? '').split(',').filter(Boolean);
  if (ids.length > 100) return res.status(400).json({ error: 'Too many exercise IDs' });
  ids.forEach(id);
  if (!ids.length) return res.json({ previous: {} });

  const docs = await Session.find({
    user: req.user._id,
    status: 'completed',
    'entries.exercise': { $in: ids },
  })
    .sort({ date: -1, startedAt: -1 })
    .limit(60)
    .select('date entries bodyWeightKg')
    .lean();

  const byId = await accessibleExercises(ids, req.user._id);
  const previous = {};
  for (const s of docs) {
    for (const e of s.entries ?? []) {
      const key = String(e.exercise);
      if (!ids.includes(key) || previous[key]) continue;
      previous[key] = {
        date: s.date,
        bodyWeightKg: s.bodyWeightKg,
        sets: (e.sets ?? []).map((x) => ({
          reps: x.reps,
          weightKg: x.weightKg,
          durationSec: x.durationSec,
          isWarmup: x.isWarmup,
        })),
        cardio: e.cardio ?? null,
        bestE1rm: bestE1rm(e.sets ?? [], byId.get(key), s.bodyWeightKg),
      };
    }
  }
  res.json({ previous });
});

router.get('/:id', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  res.json({ session: serialize(doc) });
});

router.delete('/:id', async (req, res) => {
  const r = await Session.deleteOne({ _id: req.params.id, user: req.user._id });
  if (!r.deletedCount) return res.status(404).json({ error: 'Workout not found' });
  res.json({ ok: true });
});

export default router;

import { Router } from 'express';
import { Exercise, Routine, Session } from '../models.js';
import { requireAuth } from '../auth.js';
import { bestE1rm, CALC_VERSION, effectiveLoadKg, isWorkingSet, sessionTotals } from '../../shared/engine.js';

const router = Router();
router.use(requireAuth);

const MAX_ACTIVE_WORKOUT_MS = 6 * 60 * 60 * 1000;

/* --------------------------------------------------------------- helpers */

async function exerciseMap(ids) {
  const docs = await Exercise.find({ _id: { $in: [...new Set(ids.map(String))] } }).lean();
  return new Map(docs.map((d) => [String(d._id), d]));
}

function serialize(s) {
  return {
    id: String(s._id),
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

function isSetLogged(s) {
  return !!s.done || (s.reps != null && s.reps > 0) || s.weightKg != null || (s.durationSec != null && s.durationSec > 0);
}

function isCardioLogged(c) {
  return !!c && (!!c.done || (c.durationMin != null && c.durationMin > 0) || (c.distanceKm != null && c.distanceKm > 0));
}

function finalizeEntries(entries) {
  return (entries ?? [])
    .map((e) => {
      const obj = e.toObject ? e.toObject() : e;
      const validSets = (obj.sets ?? [])
        .filter(isSetLogged)
        .map((s) => ({ ...s, done: true }));
      const validCardio = isCardioLogged(obj.cardio)
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
      await Session.deleteOne({ _id: doc._id, status: 'active' });
      continue;
    }

    doc.status = 'completed';
    doc.endedAt = new Date(doc.startedAt.getTime() + MAX_ACTIVE_WORKOUT_MS);
    await recompute(doc);
    await doc.save();

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

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

  const date = req.body?.date ?? localToday();
  const bodyWeightKg = req.user.weightOn(date);
  if (!(bodyWeightKg > 0)) return res.status(400).json({ error: 'Add your body weight first — calorie estimates need it' });

  let entries = [];
  let name = req.body?.name?.trim() || 'Quick Workout';
  let routineId = null;

  if (req.body?.routineId) {
    const routine = await Routine.findOne({ _id: req.body.routineId, user: req.user._id }).lean();
    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    const byId = await exerciseMap(routine.exercises.map((e) => e.exercise));
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
            : Array.from({ length: re.targetSets || 3 }, () => ({
                reps: re.targetReps || null,
                weightKg: re.targetWeightKg ?? null,
                done: false,
                isWarmup: false,
              })),
        cardio: ex?.type === 'cardio' ? { durationMin: null, distanceKm: null, intensity: 'moderate', done: false } : null,
      };
    });
  }

  const doc = await Session.create({
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
  await doc.save();
  res.status(201).json({ session: serialize(doc.toObject()) });
});

/** Autosave target. The client sends the whole entry list; last write wins. */
router.patch('/:id', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ error: 'Workout not found' });
  if (doc.status !== 'active') {
    return res.status(409).json({ error: 'This workout has already ended', session: serialize(doc.toObject()) });
  }

  if (req.body.name !== undefined) doc.name = req.body.name;
  if (req.body.notes !== undefined) doc.notes = req.body.notes;
  if (req.body.date !== undefined) doc.date = req.body.date;
  if (req.body.entries !== undefined) {
    doc.entries = req.body.entries
      .filter((e) => e.exerciseId)
      .map((e) => ({
        exercise: e.exerciseId,
        sets: (e.sets ?? []).map((s) => ({
          reps: s.reps ?? null,
          weightKg: s.weightKg ?? null,
          durationSec: s.durationSec ?? null,
          rpe: s.rpe ?? null,
          isWarmup: !!s.isWarmup,
          done: !!s.done,
          restSec: s.restSec ?? null,
        })),
        cardio: e.cardio ?? null,
        notes: e.notes ?? '',
      }));
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
  const { date, name, durationMin, entries } = req.body ?? {};
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Pick a date' });
  if (date > localToday()) return res.status(400).json({ error: 'That date is in the future' });
  if (!Array.isArray(entries) || !entries.length) return res.status(400).json({ error: 'Add at least one exercise' });

  const bodyWeightKg = req.user.weightOn(date);
  if (!(bodyWeightKg > 0)) return res.status(400).json({ error: 'Add your body weight first' });

  const minutes = Math.max(1, Math.min(Number(durationMin) || 45, 600));
  const startedAt = new Date(`${date}T12:00:00`);

  const doc = await Session.create({
    user: req.user._id,
    date,
    name: name?.trim() || 'Logged afterwards',
    status: 'completed',
    startedAt,
    endedAt: new Date(startedAt.getTime() + minutes * 60000),
    bodyWeightKg,
    entries: entries
      .filter((e) => e.exerciseId)
      .map((e) => ({
        exercise: e.exerciseId,
        // Everything in a manual entry is by definition already done.
        sets: (e.sets ?? []).map((s) => ({
          reps: s.reps ?? null,
          weightKg: s.weightKg ?? null,
          durationSec: s.durationSec ?? null,
          rpe: s.rpe ?? null,
          isWarmup: !!s.isWarmup,
          done: true,
          restSec: s.restSec ?? null,
        })),
        cardio: e.cardio ? { ...e.cardio, done: true } : null,
        notes: e.notes ?? '',
      })),
  });

  await recompute(doc);
  await doc.save();
  res.status(201).json({ session: serialize(doc.toObject()) });
});

/** Turn a session you liked into a reusable routine. */
router.post('/:id/save-as-routine', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!doc) return res.status(404).json({ error: 'Workout not found' });

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
    name: req.body?.name?.trim() || `${doc.name} routine`,
    note: `Built from the workout on ${doc.date}`,
    exercises,
  });
  res.status(201).json({ routineId: String(routine._id), name: routine.name });
});

/** navigator.sendBeacon target — a last flush when the tab closes mid-workout. */
router.post('/:id/beacon', async (req, res) => {
  const doc = await Session.findOne({ _id: req.params.id, user: req.user._id, status: 'active' });
  if (!doc || !Array.isArray(req.body?.entries)) return res.status(204).end();
  doc.entries = req.body.entries
    .filter((e) => e.exerciseId)
    .map((e) => ({ exercise: e.exerciseId, sets: e.sets ?? [], cardio: e.cardio ?? null, notes: e.notes ?? '' }));
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

  doc.entries = finalizeEntries(doc.entries);

  if (!doc.entries.length) {
    await Session.deleteOne({ _id: doc._id });
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
  const limit = Math.min(Number(req.query.limit) || 30, 200);
  const skip = Number(req.query.skip) || 0;
  const [list, total] = await Promise.all([
    Session.find({ user: req.user._id, status: 'completed' }).sort({ date: -1, startedAt: -1 }).skip(skip).limit(limit).lean(),
    Session.countDocuments({ user: req.user._id, status: 'completed' }),
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

  const byId = await exerciseMap(ids);
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

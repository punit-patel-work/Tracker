import { Router } from 'express';
import { createHash } from 'node:crypto';
import { Exercise, Routine, Session, WeekPlan } from '../models.js';
import { AiDraft, AiPreferences } from '../ai/models.js';
import { generate } from '../ai/service.js';
import { reviewTargets } from '../ai/progression.js';
import { shiftDay } from '../ai/context.js';
import { weekKey } from '../../shared/engine.js';
import { id, invalid, text, array, number, dateISO, todayFor } from '../validation.js';

const missing = what => Object.assign(new Error(what + ' not found'), { status: 404 });
const conflict = () => Object.assign(new Error('Your plan or training records changed. Refresh the review before saving.'), { status: 409 });

async function ownedRoutine(req, routineId) {
  const routine = await Routine.findOne({ _id: id(routineId), user: req.user._id, archived: false });
  if (!routine) throw missing('Routine');
  return routine;
}
function trainingLog(session, ids, routineId) {
  return {
    id: String(session._id), date: session.date, name: session.name, feedback: session.feedback ?? null,
    notes: session.notes, durationMin: session.totals?.durationMin, matchesRoutine: !!routineId && String(session.routine) === routineId,
    entries: session.entries.filter(e => ids.has(String(e.exercise))).map(e => ({
      exerciseId: String(e.exercise), notes: e.notes, sets: e.sets.filter(s => s.done !== false),
      cardio: e.cardio?.done ? e.cardio : null,
    })),
  };
}
async function recentLogs(req, ids, routineId) {
  const today = todayFor(req.timeZone);
  const sessions = await Session.find({ user: req.user._id, status: 'completed',
    date: { $gte: shiftDay(today, -42), $lte: today }, 'entries.exercise': { $in: [...ids] } })
    .sort({ date: -1, startedAt: -1, _id: -1 }).limit(120).lean();
  return sessions.map(s => trainingLog(s, ids, routineId));
}
async function routineContext(req, routine) {
  const ids = new Set(routine.exercises.map(e => String(e.exercise)));
  const [catalog, history, profile] = await Promise.all([
    Exercise.find({ _id: { $in: [...ids] }, $or: [{ owner: null }, { owner: req.user._id }] }).lean(),
    recentLogs(req, ids, routine.id),
    AiPreferences.findOne({ user: req.user._id }).lean(),
  ]);
  const exercises = new Map(catalog.map(e => [String(e._id), e]));
  const preferences = profile?.preferences ?? { goal: req.user.goal };
  const rows = routine.exercises.flatMap(e => {
    const exercise = exercises.get(String(e.exercise));
    return exercise ? [reviewTargets(exercise, e, history, preferences)] : [];
  });
  const context = { routineId: routine.id, name: routine.name, note: routine.note, revision: routine.__v, preferences, rows, history,
    targets: routine.exercises.map(e => e.toObject()) };
  const stamp = createHash('sha256').update(JSON.stringify(context)).digest('hex');
  return { ...context, stamp };
}
function requireConsent(req) {
  if (req.body?.consent !== true) invalid('Confirm sharing the selected training data with OpenAI.');
}

export function coachingRoutes(request) {
  const router = Router();
  router.get('/routines/:id', async (req, res) => {
    const routine = await ownedRoutine(req, req.params.id);
    const ctx = await routineContext(req, routine);
    const saved = await AiDraft.findOne({ user: req.user._id, task: 'adjustment', hiddenAt:null, 'context.stamp': ctx.stamp }).select('result').lean();
    res.json({ rows: ctx.rows, stamp: ctx.stamp, revision: routine.__v, canUndo: routine.coachingUndo?.revision === routine.__v,
      reviewId:saved ? String(saved._id) : null, review: saved?.result ?? null });
  });
  router.post('/routines/:id/review', async (req, res) => {
    requireConsent(req);
    const routine = await ownedRoutine(req, req.params.id);
    const context = await routineContext(req, routine);
    if (req.body.stamp !== context.stamp) throw conflict();
    res.json(await generate({ user: req.user, task: 'adjustment', context, request }));
  });
  router.post('/routines/:id/apply', async (req, res) => {
    const routine = await ownedRoutine(req, req.params.id);
    const context = await routineContext(req, routine);
    if (req.body.stamp !== context.stamp) throw conflict();
    const selected = array(req.body.exerciseIds, 'Selected exercises', 100).map(id);
    if (!selected.length || new Set(selected).size !== selected.length) invalid('Select one or more distinct changes.');
    const before = routine.exercises.map(e => e.toObject());
    for (const selectedId of selected) {
      const option = context.rows.find(r => r.exerciseId === selectedId);
      if (!option?.proposed) invalid('This change is unavailable.');
      Object.assign(routine.exercises.find(e => String(e.exercise) === selectedId), option.proposed);
    }
    routine.coachingUndo = { revision: routine.__v + 1, exercises: before };
    await routine.save();
    res.json({ ok: true });
  });
  router.post('/routines/:id/undo', async (req, res) => {
    const routine = await ownedRoutine(req, req.params.id);
    if (req.body.revision !== routine.__v || routine.coachingUndo?.revision !== routine.__v) throw conflict();
    routine.exercises = routine.coachingUndo.exercises;
    routine.coachingUndo = null;
    await routine.save();
    res.json({ ok: true });
  });
  router.post('/question', async (req, res) => {
    requireConsent(req);
    const question = text(req.body.question, 'Question', 700);
    const subjectId = id(req.body.subjectId);
    const subjectType = req.body.subjectType;
    let context;
    if (subjectType === 'routine') {
      context = await routineContext(req, await ownedRoutine(req, subjectId));
    } else if (subjectType === 'exercise') {
      const exercise = await Exercise.findOne({ _id: subjectId, $or: [{ owner: req.user._id }, { owner: null }] })
        .select('name equipment type primaryMuscles isTimed').lean();
      if (!exercise) throw missing('Exercise');
      context = { exercise, history: await recentLogs(req, new Set([subjectId])) };
    } else if (subjectType === 'workout') {
      const session = await Session.findOne({ _id: subjectId, user: req.user._id, status: 'completed' }).lean();
      if (!session) throw missing('Completed workout');
      const ids = new Set(session.entries.map(e => String(e.exercise)));
      const exercises = await Exercise.find({ _id: { $in: [...ids] }, $or: [{ owner: null }, { owner: req.user._id }] }).select('name equipment type').lean();
      context = { exercises, totals: session.totals, history: [trainingLog(session, ids)] };
    } else invalid('Choose a workout, routine or exercise.');
    res.json(await generate({ user: req.user, task: 'question', context: { ...context, subjectType, subjectId, question }, request }));
  });
  router.get('/weeks/:week', async (req, res) => {
    const week = dateISO(req.params.week);
    if (weekKey(week) !== week) invalid('Choose the Monday of the week.');
    const [plan, logs, prefs] = await Promise.all([
      WeekPlan.findOne({ user: req.user._id, week }).lean(),
      Session.find({ user: req.user._id, status: 'completed', date: { $gte: week, $lte: shiftDay(week, 6) }, routine: { $ne: null } }).select('date routine').lean(),
      AiPreferences.findOne({ user: req.user._id }).select('preferences.preferredDays').lean(),
    ]);
    res.json({ week, revision: plan?.__v ?? -1, slots: plan?.slots ?? [], completed: logs.map(s => ({ date: s.date, routineId: s.routine })),
      preferredDays: prefs?.preferences?.preferredDays ?? [] });
  });
  router.put('/weeks/:week', async (req, res) => {
    const week = dateISO(req.params.week);
    if (weekKey(week) !== week) invalid('Choose the Monday of the week.');
    const revision = number(req.body.revision, 'Week revision', -1, Number.MAX_SAFE_INTEGER, true);
    const slots = array(req.body.slots, 'Planned sessions', 7).map(s => ({ date: dateISO(s?.date), routineId: id(s?.routineId) }));
    if (slots.some(s => weekKey(s.date) !== week) || new Set(slots.map(s => s.date)).size !== slots.length) invalid('Choose one routine per date within this week.');
    const ids = [...new Set(slots.map(s => s.routineId))];
    if (await Routine.countDocuments({ _id: { $in: ids }, user: req.user._id, archived: false }) !== ids.length) invalid('Choose routines from your active library.');
    const filter = { user: req.user._id, week };
    if (revision === -1) {
      try { await WeekPlan.create({ ...filter, slots }); }
      catch (error) { if (error.code === 11000) throw conflict(); throw error; }
    } else {
      const result = await WeekPlan.updateOne({ ...filter, __v: revision }, { $set: { slots }, $inc: { __v: 1 } });
      if (!result.matchedCount) throw conflict();
    }
    res.json({ revision: revision + 1 });
  });
  return router;
}

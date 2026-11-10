import { Router } from 'express';
import { deleteAccount } from '../delete-account.js';
import { AiDraft, AiPreferences } from '../ai/models.js';
import bcrypt from 'bcryptjs';
import { Exercise, Routine, Session, WeekPlan } from '../models.js';
import { text, number, dateISO, todayFor, timeZone, array, id } from '../validation.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

const EDITABLE = ['name', 'sex', 'birthYear', 'heightCm', 'units', 'goal', 'weeklyTarget', 'keepAwake', 'timeZone'];

router.patch('/', async (req, res) => {
  const user = req.user;
  if (req.body.name !== undefined) text(req.body.name, 'Name');
  if (req.body.heightCm != null) number(req.body.heightCm, 'Height', 30, 300);
  if (req.body.birthYear != null) number(req.body.birthYear, 'Birth year', 1900, Number(todayFor(req.timeZone).slice(0, 4)), true);
  if (req.body.weeklyTarget !== undefined) number(req.body.weeklyTarget, 'Weekly target', 1, 14, true);
  if (req.body.timeZone !== undefined) timeZone(req.body.timeZone);
  if (req.body.favorites) {
    if (typeof req.body.favorites !== 'object' || Array.isArray(req.body.favorites) || Object.keys(req.body.favorites).length > 50) return res.status(400).json({ error: 'Invalid favorites' });
    for (const [category, ids] of Object.entries(req.body.favorites)) { text(category, 'Category', 80); array(ids, 'Favorites').forEach(id); }
  }
  for (const key of EDITABLE) if (req.body[key] !== undefined) user[key] = req.body[key];

  // A weight sent with a profile edit is a weigh-in for today, not a field overwrite.
  if (req.body.weightKg !== undefined) upsertWeighIn(user, number(req.body.weightKg, 'Body weight', 1, 700), dateISO(req.body.date ?? todayFor(req.timeZone), todayFor(req.timeZone)));

  if (req.body.favorites) user.favorites = req.body.favorites;

  if (!user.onboardedAt && user.heightCm && user.birthYear && user.weighIns.length) {
    user.onboardedAt = new Date();
  }

  await user.save();
  res.json({ user: user.toPublic() });
});

router.post('/weight', async (req, res) => {
  const kg = number(req.body?.kg, 'Body weight', 1, 700);
  if (!(kg > 0)) return res.status(400).json({ error: 'Enter a weight above zero' });
  upsertWeighIn(req.user, kg, dateISO(req.body?.date ?? todayFor(req.timeZone), todayFor(req.timeZone)));
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});

router.delete('/weight/:date', async (req, res) => {
  req.user.weighIns = req.user.weighIns.filter((w) => w.date !== req.params.date);
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});

/** Everything the account holds, as one JSON file. */
router.get('/export', async (req, res) => {
  const [sessions, routines, custom] = await Promise.all([
    Session.find({ user: req.user._id, status: 'completed' }).sort({ date: 1 }).lean(),
    Routine.find({ user: req.user._id, archived: false }).lean(),
    Exercise.find({ owner: req.user._id }).lean(),
  ]);
  const exIds = [...new Set(sessions.flatMap((s) => (s.entries ?? []).map((e) => String(e.exercise))))];
  const names = new Map((await Exercise.find({ _id: { $in: exIds } }).select('name slug').lean()).map((e) => [String(e._id), e]));

  res.setHeader('Content-Disposition', `attachment; filename="gym-tracker-${todayFor(req.timeZone)}.json"`);
  res.json({
    weekPlans: await WeekPlan.find({ user: req.user._id }).select('week slots -_id').lean(),
    aiPreferences: (await AiPreferences.findOne({ user: req.user._id }).lean())?.preferences ?? null,
    aiSuggestions: await AiDraft.find({ user: req.user._id, hiddenAt: null }).select('task result createdAt').lean(),
    exportedAt: new Date().toISOString(),
    profile: req.user.toPublic(),
    customExercises: custom,
    routines,
    sessions: sessions.map((s) => ({
      date: s.date,
      name: s.name,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      feedback: s.feedback ?? null,
      pausedMs: s.pausedMs ?? 0,
      bodyWeightKg: s.bodyWeightKg,
      totals: s.totals,
      entries: (s.entries ?? []).map((e) => ({
        exercise: names.get(String(e.exercise))?.name ?? 'Unknown',
        slug: names.get(String(e.exercise))?.slug,
        sets: e.sets,
        cardio: e.cardio,
        notes: e.notes,
      })),
    })),
  });
});

/** One row per set — the shape a spreadsheet actually wants. */
router.get('/export.csv', async (req, res) => {
  const sessions = await Session.find({ user: req.user._id, status: 'completed' }).sort({ date: 1 }).lean();
  const exIds = [...new Set(sessions.flatMap((s) => (s.entries ?? []).map((e) => String(e.exercise))))];
  const names = new Map((await Exercise.find({ _id: { $in: exIds } }).select('name').lean()).map((e) => [String(e._id), e.name]));

  const rows = [
    ['date', 'workout', 'body_weight_kg', 'exercise', 'set', 'warmup', 'weight_kg', 'reps', 'duration_sec', 'rpe', 'cardio_min', 'cardio_km'],
  ];
  for (const s of sessions) {
    for (const e of s.entries ?? []) {
      const name = names.get(String(e.exercise)) ?? 'Unknown';
      if (e.cardio?.done) {
        rows.push([s.date, s.name, s.bodyWeightKg, name, '', '', '', '', '', '', e.cardio.durationMin ?? '', e.cardio.distanceKm ?? '']);
      }
      (e.sets ?? []).forEach((set, i) => {
        rows.push([
          s.date, s.name, s.bodyWeightKg, name, i + 1, set.isWarmup ? 'yes' : 'no',
          set.weightKg ?? '', set.reps ?? '', set.durationSec ?? '', set.rpe ?? '', '', '',
        ]);
      });
    }
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="gym-tracker-${todayFor(req.timeZone)}.csv"`);
  res.send(rows.map((r) => r.map(csvCell).join(',')).join('\r\n'));
});

function csvCell(v) {
  const raw = String(v ?? '');
  const s = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Destructive and irreversible — everything the account owns goes with it. */
router.post('/delete-account', async (req, res) => {
  if (req.user.isOwner) return res.status(400).json({ error: 'The owner administrator account cannot be deleted from Profile.' });
  const ok = await bcrypt.compare(req.body?.password ?? '', req.user.passwordHash);
  if (!ok) return res.status(403).json({ error: 'Password is incorrect' });

  await deleteAccount(req.user);
  res.clearCookie('gt_token', { path: '/' });
  res.json({ ok: true });
});

function upsertWeighIn(user, kg, date) {
  const iso = date;
  const existing = user.weighIns.find((w) => w.date === iso);
  if (existing) existing.kg = kg;
  else user.weighIns.push({ date: iso, kg });
  user.weighIns.sort((a, b) => a.date.localeCompare(b.date));
}

export default router;

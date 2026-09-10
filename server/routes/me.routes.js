import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Exercise, Routine, Session, User } from '../models.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

const EDITABLE = ['name', 'sex', 'birthYear', 'heightCm', 'units', 'goal', 'weeklyTarget'];

router.patch('/', async (req, res) => {
  const user = req.user;
  for (const key of EDITABLE) if (req.body[key] !== undefined) user[key] = req.body[key];

  // A weight sent with a profile edit is a weigh-in for today, not a field overwrite.
  if (req.body.weightKg > 0) upsertWeighIn(user, req.body.weightKg, req.body.date);

  if (req.body.favorites) user.favorites = req.body.favorites;

  if (!user.onboardedAt && user.heightCm && user.birthYear && user.weighIns.length) {
    user.onboardedAt = new Date();
  }

  await user.save();
  res.json({ user: user.toPublic() });
});

router.post('/weight', async (req, res) => {
  const kg = Number(req.body?.kg);
  if (!(kg > 0)) return res.status(400).json({ error: 'Enter a weight above zero' });
  upsertWeighIn(req.user, kg, req.body?.date);
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

  res.setHeader('Content-Disposition', `attachment; filename="gym-tracker-${localToday()}.json"`);
  res.json({
    exportedAt: new Date().toISOString(),
    profile: req.user.toPublic(),
    customExercises: custom,
    routines,
    sessions: sessions.map((s) => ({
      date: s.date,
      name: s.name,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
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
  res.setHeader('Content-Disposition', `attachment; filename="gym-tracker-${localToday()}.csv"`);
  res.send(rows.map((r) => r.map(csvCell).join(',')).join('\r\n'));
});

function csvCell(v) {
  const s = String(v ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Destructive and irreversible — everything the account owns goes with it. */
router.post('/delete-account', async (req, res) => {
  const ok = await bcrypt.compare(req.body?.password ?? '', req.user.passwordHash);
  if (!ok) return res.status(403).json({ error: 'Password is incorrect' });

  await Promise.all([
    Session.deleteMany({ user: req.user._id }),
    Routine.deleteMany({ user: req.user._id }),
    Exercise.deleteMany({ owner: req.user._id }),
  ]);
  await User.deleteOne({ _id: req.user._id });
  res.clearCookie('gt_token', { path: '/' });
  res.json({ ok: true });
});

function upsertWeighIn(user, kg, date) {
  const iso = date ?? localToday();
  const existing = user.weighIns.find((w) => w.date === iso);
  if (existing) existing.kg = kg;
  else user.weighIns.push({ date: iso, kg });
  user.weighIns.sort((a, b) => a.date.localeCompare(b.date));
}

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default router;

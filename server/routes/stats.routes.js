import { Router } from 'express';
import { Exercise, Session } from '../models.js';
import { requireAuth } from '../auth.js';
import {
  bestE1rm,
  effectiveLoadKg,
  hardSetCredit,
  isWorkingSet,
  personalRecords,
  sessionTotals,
  weekKey,
  weekStreak,
} from '../../shared/engine.js';

const router = Router();
router.use(requireAuth);

/**
 * Aggregation happens here, not on the phone — the client only ever gets series.
 *
 * Three narrow queries rather than one wide one: totals were already computed
 * and cached when each session was saved, so the common path never touches the
 * `entries` array at all.
 */
router.get('/overview', async (req, res) => {
  const cutoff28 = shiftDays(localToday(), -28);

  const [light, recent, forPrs] = await Promise.all([
    // Every session, but only its cached totals — this drives most of the page.
    Session.find({ user: req.user._id, status: 'completed' }).select('date totals').sort({ date: 1 }).lean(),
    // Muscle balance only looks back 28 days, so only those need their sets.
    Session.find({ user: req.user._id, status: 'completed', date: { $gte: cutoff28 } })
      .select('date bodyWeightKg entries')
      .lean(),
    // PRs are all-time by definition, but need no metadata beyond the sets.
    Session.find({ user: req.user._id, status: 'completed' })
      .select('date bodyWeightKg entries.exercise entries.sets')
      .sort({ date: 1 })
      .lean(),
  ]);

  const exIds = [...new Set(forPrs.flatMap((s) => (s.entries ?? []).map((e) => String(e.exercise))))];
  const exDocs = await Exercise.find({ _id: { $in: exIds } }).lean();
  const byId = new Map(exDocs.map((d) => [String(d._id), d]));

  const sessions = forPrs;
  const perSession = light.map((s) => ({ date: s.date, totals: normaliseTotals(s.totals) }));

  // Weekly buckets
  const weeks = new Map();
  for (const { date, totals } of perSession) {
    const k = weekKey(date);
    const row = weeks.get(k) ?? { week: k, volumeKg: 0, kcal: 0, sessions: 0, minutes: 0, cardioMinutes: 0, workingSets: 0 };
    row.volumeKg += totals.volumeKg;
    row.kcal += totals.totalKcal;
    row.minutes += totals.durationMin;
    row.cardioMinutes += totals.cardioMinutes;
    row.workingSets += totals.workingSets;
    row.sessions += 1;
    weeks.set(k, row);
  }
  const weekly = [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week)).slice(-12);

  const thisWeekKey = weekKey(localToday());
  const lastWeekKey = weekKey(shiftDays(localToday(), -7));
  const blank = { week: '', volumeKg: 0, kcal: 0, sessions: 0, minutes: 0, cardioMinutes: 0, workingSets: 0 };

  // Muscle balance over the last 28 days — where the neglect shows up
  const muscleVolume = {};
  for (const s of recent) {
    const t = sessionTotals(
      { entries: s.entries, bodyWeightKg: s.bodyWeightKg, startedAt: s.startedAt, endedAt: s.endedAt, date: s.date },
      byId,
    );
    for (const [m, v] of Object.entries(t.muscleVolume)) muscleVolume[m] = (muscleVolume[m] ?? 0) + v;
  }

  // Daily energy for the consistency grid
  const daily = {};
  for (const { date, totals } of perSession) daily[date] = (daily[date] ?? 0) + totals.totalKcal;

  const prs = personalRecords(sessions, byId).sort((a, b) => b.bestE1rm - a.bestE1rm);

  /* ------------------------------------------------------------------
   * The metrics that actually answer "am I progressing?"
   *
   * Total tonnage is deliberately not one of them: it rewards high-rep
   * accessory work over heavy compounds and moves with exercise selection
   * rather than with strength. What follows is per-lift strength change,
   * hard sets per muscle per week (the hypertrophy dose), and adherence.
   * ------------------------------------------------------------------ */

  const rangeWeeks = Math.min(Math.max(Number(req.query.weeks) || 12, 4), 260);
  const from = shiftDays(localToday(), -rangeWeeks * 7);

  // Per-lift strength trend inside the window.
  const perLift = new Map();
  for (const s of sessions) {
    for (const e of s.entries ?? []) {
      const id = String(e.exercise);
      const ex = byId.get(id);
      if (!ex || ex.type === 'cardio' || ex.isTimed) continue;
      const v = bestE1rm(e.sets ?? [], ex, s.bodyWeightKg);
      if (!(v > 0)) continue;
      if (!perLift.has(id)) perLift.set(id, { id, name: ex.name, category: ex.category, points: [] });
      perLift.get(id).points.push({ date: s.date, e1rm: Math.round(v * 10) / 10 });
    }
  }

  const fourWeeksAgo = shiftDays(localToday(), -28);
  const currentWeight = req.user.weighIns.length ? req.user.weighIns[req.user.weighIns.length - 1].kg : 0;

  const lifts = [...perLift.values()]
    .map((l) => {
      const inRange = l.points.filter((p) => p.date >= from);
      const pts = inRange.length >= 2 ? inRange : l.points.slice(-2);
      const first = pts[0]?.e1rm ?? 0;
      const last = pts[pts.length - 1]?.e1rm ?? 0;
      const best = Math.max(...l.points.map((p) => p.e1rm));
      const bestRecent = Math.max(0, ...l.points.filter((p) => p.date >= fourWeeksAgo).map((p) => p.e1rm));
      return {
        ...l,
        points: inRange,
        sessions: inRange.length,
        firstE1rm: first,
        lastE1rm: last,
        deltaKg: Math.round((last - first) * 10) / 10,
        deltaPct: first > 0 ? Math.round(((last - first) / first) * 1000) / 10 : 0,
        bestE1rm: best,
        // Trained recently but no longer setting bests: that is a plateau.
        stalled: l.points.length >= 3 && bestRecent > 0 && bestRecent < best,
        lastDate: l.points[l.points.length - 1].date,
        relative: currentWeight > 0 ? Math.round((best / currentWeight) * 100) / 100 : 0,
      };
    })
    .sort((a, b) => b.deltaPct - a.deltaPct);

  /**
   * Hard sets per muscle per week — the number hypertrophy research actually
   * talks about (roughly 10–20 per muscle per week). A set counts 1 toward the
   * exercise's primary muscle and 0.5 toward each secondary.
   */
  const setsByWeek = new Map();
  for (const s of sessions) {
    if (s.date < from) continue;
    const wk = weekKey(s.date);
    const row = setsByWeek.get(wk) ?? {};
    for (const e of s.entries ?? []) {
      const ex = byId.get(String(e.exercise));
      if (!ex || ex.type === 'cardio') continue;
      const hard = (e.sets ?? []).filter(isWorkingSet).length;
      if (!hard) continue;
      for (const [m, credit] of hardSetCredit(ex)) row[m] = (row[m] ?? 0) + hard * credit;
    }
    setsByWeek.set(wk, row);
  }

  const weekKeys = [...setsByWeek.keys()].sort();
  const muscleTotals = {};
  for (const row of setsByWeek.values()) {
    for (const [m, n] of Object.entries(row)) muscleTotals[m] = (muscleTotals[m] ?? 0) + n;
  }
  const weeksCounted = Math.max(1, weekKeys.length);
  const avgSetsPerMuscle = Object.fromEntries(
    Object.entries(muscleTotals)
      .map(([m, n]) => [m, Math.round((n / weeksCounted) * 10) / 10])
      .sort((a, b) => b[1] - a[1]),
  );

  // Adherence: how often you actually turned up, against your own target.
  const sessionsInRange = light.filter((s) => s.date >= from).length;
  const consistency = {
    weeks: rangeWeeks,
    sessionsInRange,
    avgPerWeek: Math.round((sessionsInRange / rangeWeeks) * 10) / 10,
    target: req.user.weeklyTarget,
    adherencePct: Math.round((sessionsInRange / (rangeWeeks * (req.user.weeklyTarget || 1))) * 100),
  };

  // Which exercises have enough history to chart
  const trackable = [];
  const seen = new Map();
  for (const s of sessions) {
    for (const e of s.entries ?? []) {
      const id = String(e.exercise);
      const ex = byId.get(id);
      if (!ex || ex.type === 'cardio' || ex.isTimed) continue;
      if (!(e.sets ?? []).some(isWorkingSet)) continue;
      seen.set(id, (seen.get(id) ?? 0) + 1);
    }
  }
  for (const [id, count] of seen) {
    if (count >= 2) trackable.push({ id, name: byId.get(id).name, sessions: count });
  }
  trackable.sort((a, b) => b.sessions - a.sessions);

  const totals = perSession.reduce(
    (acc, p) => ({
      volumeKg: acc.volumeKg + p.totals.volumeKg,
      kcal: acc.kcal + p.totals.totalKcal,
      strengthKcal: acc.strengthKcal + p.totals.strengthKcal,
      cardioKcal: acc.cardioKcal + p.totals.cardioKcal,
      workingSets: acc.workingSets + p.totals.workingSets,
      cardioMinutes: acc.cardioMinutes + p.totals.cardioMinutes,
      minutes: acc.minutes + p.totals.durationMin,
    }),
    { volumeKg: 0, kcal: 0, strengthKcal: 0, cardioKcal: 0, workingSets: 0, cardioMinutes: 0, minutes: 0 },
  );

  res.json({
    sessionCount: sessions.length,
    streak: weekStreak(sessions.map((s) => s.date)),
    goal: req.user.goal,
    range: { weeks: rangeWeeks, from },
    lifts,
    consistency,
    setsPerWeek: weekKeys.map((wk) => ({ week: wk, muscles: setsByWeek.get(wk) })),
    avgSetsPerMuscle,
    currentWeightKg: currentWeight,
    totals,
    weekly,
    thisWeek: weeks.get(thisWeekKey) ?? blank,
    lastWeek: weeks.get(lastWeekKey) ?? blank,
    muscleVolume,
    daily,
    prs: prs.slice(0, 12),
    trackable: trackable.slice(0, 40),
    bodyWeight: req.user.weighIns.map((w) => ({ date: w.date, kg: w.kg })),
    weeklyTarget: req.user.weeklyTarget,
  });
});

/** Per-exercise trend: best e1RM, heaviest set and volume, one point per session. */
router.get('/exercise/:id', async (req, res) => {
  const sessions = await Session.find({
    user: req.user._id,
    status: 'completed',
    'entries.exercise': req.params.id,
  })
    .sort({ date: 1 })
    .select('date entries bodyWeightKg')
    .lean();

  const ex = await Exercise.findById(req.params.id).lean();

  const points = [];
  for (const s of sessions) {
    const entry = (s.entries ?? []).find((e) => String(e.exercise) === req.params.id);
    const working = (entry?.sets ?? []).filter(isWorkingSet);
    if (!working.length) continue;
    // Load is resolved at the body weight of that session, not today's.
    const loads = working.map((x) => effectiveLoadKg(ex, x, s.bodyWeightKg));
    points.push({
      date: s.date,
      e1rm: bestE1rm(working, ex, s.bodyWeightKg),
      topWeightKg: Math.max(...loads),
      volumeKg: working.reduce((sum, x, i) => sum + (x.reps ?? 0) * loads[i], 0),
      sets: working.length,
    });
  }
  res.json({ points });
});

/** Sessions saved before a field existed should read as 0, not undefined. */
function normaliseTotals(t = {}) {
  return {
    volumeKg: t.volumeKg ?? 0,
    strengthKcal: t.strengthKcal ?? 0,
    cardioKcal: t.cardioKcal ?? 0,
    totalKcal: t.totalKcal ?? 0,
    workingSets: t.workingSets ?? 0,
    cardioMinutes: t.cardioMinutes ?? 0,
    durationMin: t.durationMin ?? 0,
    muscleVolume: t.muscleVolume ?? {},
  };
}

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shiftDays(iso, delta) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default router;

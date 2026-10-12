/** Isolated UI preview. Synthetic data stays in memory; no database or account is accessed. */
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { CATALOG } from '../shared/catalog.js';
import { sessionTotals, personalRecords, bestE1rm, weekKey, weekStreak, hardSetCredit } from '../shared/engine.js';
import { progressRangeStart } from '../shared/progress.js';

const today = new Date().toLocaleDateString('en-CA');
const shift = (date, days) => { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + days); return d.toLocaleDateString('en-CA'); };
const exercises = CATALOG.map((e) => ({ ...e, isCustom: false }));
const byId = new Map(exercises.map((e) => [e.id, e]));
const choose = (categories) => categories.flatMap((category) => exercises.filter((e) => e.category === category && e.type === 'strength' && !e.isTimed && !e.isBodyweight).slice(0, 2));
let routines = [
  { name: 'Push day', note: 'Chest, shoulders & triceps', categories: ['chest', 'shoulders', 'arms'] },
  { name: 'Pull day', note: 'Back & biceps', categories: ['back', 'arms'] },
  { name: 'Leg day', note: 'Quads, hamstrings & calves', categories: ['legs'] },
  { name: 'Full body', note: 'A little of everything', categories: ['chest', 'back', 'legs'] },
].map((r, i) => ({ id: `preview-routine-${i}`, name: r.name, note: r.note, lastPerformedAt: `${shift(today, -i - 2)}T12:00:00`,
  exercises: choose(r.categories).map((e) => ({ exerciseId: e.id, targetSets: 3, targetReps: 8, targetWeightKg: 45, restSec: 90 })) }));
let user = { id: 'preview-user', name: 'Alex Morgan', email: 'alex@example.com', emailVerified: true, sex: 'male', birthYear: 1996,
  heightCm: 178, units: 'metric', goal: 'strength', weeklyTarget: 4, keepAwake: 'never', favorites: {}, onboardedAt: today,
  currentWeightKg: 78.4, weighIns: Array.from({ length: 10 }, (_, i) => ({ date: shift(today, -70 + i * 7), kg: 80 - i * 0.18 })) };
let sessions = Array.from({ length: 42 }, (_, i) => {
  const r = routines[i % routines.length]; const date = shift(today, -Math.floor(i * 1.9));
  const startedAt = `${date}T10:00:00`; const endedAt = `${date}T10:48:00`;
  const entries = r.exercises.map((e) => ({ exerciseId: e.exerciseId,
    sets: Array.from({ length: 3 }, () => ({ reps: 8, weightKg: Math.max(20, 65 - Math.floor(i / 4) * 2.5), done: true, restSec: 90 })), notes: '' }));
  const s = { id: `preview-session-${i}`, name: r.name, routineId: r.id, status: 'completed', date, startedAt, endedAt,
    bodyWeightKg: 78.4, notes: '', entries };
  return { ...s, totals: sessionTotals(s, byId) };
});
let active = null;
let signedIn = true;
let empty = false;
let failSummary = false;
const blank = (week = '') => ({ week, volumeKg: 0, kcal: 0, sessions: 0, minutes: 0, cardioMinutes: 0, workingSets: 0 });
function overview(weeks = 12) {
  const history = empty ? [] : sessions; const from = progressRangeStart(today, weeks);
  const allWeeks = new Map(); const dailySessions = {}; const setsByWeek = new Map();
  for (const s of history) {
    const w = weekKey(s.date); const row = allWeeks.get(w) ?? blank(w);
    row.sessions++; row.volumeKg += s.totals.volumeKg; row.kcal += s.totals.totalKcal;
    row.workingSets += s.totals.workingSets; row.minutes += s.totals.durationMin; allWeeks.set(w, row);
    dailySessions[s.date] = (dailySessions[s.date] ?? 0) + 1;
  }
  const inRange = history.filter((s) => s.date >= from); const weekly = new Map(); const daily = {};
  const totals = { volumeKg: 0, kcal: 0, strengthKcal: 0, cardioKcal: 0, workingSets: 0, cardioMinutes: 0, minutes: 0 };
  const muscleVolume = {}; const muscleSets = {};
  for (const s of inRange) {
    const w = weekKey(s.date); const row = weekly.get(w) ?? blank(w);
    row.sessions++; row.volumeKg += s.totals.volumeKg; row.kcal += s.totals.totalKcal;
    row.workingSets += s.totals.workingSets; row.minutes += s.totals.durationMin; weekly.set(w, row);
    daily[s.date] = (daily[s.date] ?? 0) + s.totals.totalKcal;
    for (const k of ['volumeKg', 'strengthKcal', 'cardioKcal', 'workingSets', 'cardioMinutes']) totals[k] += s.totals[k];
    totals.kcal += s.totals.totalKcal; totals.minutes += s.totals.durationMin;
    for (const [m, v] of Object.entries(s.totals.muscleVolume)) muscleVolume[m] = (muscleVolume[m] ?? 0) + v;
    for (const entry of s.entries) {
      const credit = hardSetCredit(byId.get(entry.exerciseId));
      for (const [m, c] of credit) {
        const count = entry.sets.filter((set) => set.done && !set.isWarmup).length * c;
        muscleSets[m] = (muscleSets[m] ?? 0) + count;
        const row = setsByWeek.get(w) ?? {}; row[m] = (row[m] ?? 0) + count; setsByWeek.set(w, row);
      }
    }
  }
  const lifts = [...new Set(inRange.flatMap((s) => s.entries.map((e) => e.exerciseId)))].map((id) => {
    const e = byId.get(id); const points = inRange.filter((s) => s.entries.some((entry) => entry.exerciseId === id)).reverse()
      .map((s) => ({ date: s.date, e1rm: bestE1rm(s.entries.find((entry) => entry.exerciseId === id).sets, e, s.bodyWeightKg) }));
    const first = points[0].e1rm; const last = points.at(-1).e1rm;
    return { id, name: e.name, category: e.category, points, sessions: points.length, firstE1rm: first, lastE1rm: last,
      deltaKg: last - first, deltaPct: ((last - first) / first) * 100, bestE1rm: Math.max(...points.map((p) => p.e1rm)), stalled: false, lastDate: points.at(-1).date, relative: last / user.currentWeightKg };
  });
  return { sessionCount: history.length, goal: user.goal, range: { weeks, from }, lifts, streak: weekStreak(history.map((s) => s.date)),
    consistency: { weeks, sessionsInRange: inRange.length, avgPerWeek: inRange.length / weeks, target: user.weeklyTarget, adherencePct: inRange.length / weeks / user.weeklyTarget * 100 },
    totals, weekly: [...weekly.values()].sort((a, b) => a.week.localeCompare(b.week)), weeklyHistory: [...allWeeks.values()].sort((a, b) => a.week.localeCompare(b.week)), dailySessions, thisWeek: weekly.get(weekKey(today)) ?? blank(weekKey(today)),
    lastWeek: weekly.get(weekKey(shift(today, -7))) ?? blank(), muscleVolume, daily, prs: personalRecords(history, byId).sort((a, b) => b.bestE1rm - a.bestE1rm),
    trackable: lifts.map((l) => ({ id: l.id, name: l.name, sessions: l.sessions })), bodyWeight: user.weighIns,
    currentWeightKg: user.currentWeightKg, weeklyTarget: user.weeklyTarget, avgSetsPerMuscle: Object.fromEntries(Object.entries(muscleSets).map(([m, count]) => [m, count / weeks])), setsPerWeek: [...setsByWeek].map(([week, muscles]) => ({ week, muscles })) };
}
const previewPlugin = {
  name: 'isolated-ui-preview',
  transformIndexHtml(html) {
    return html.replace('<title>Gym Tracker</title>', '<title>Gym Tracker · Design preview</title>').replace('</head>', '<style>.preview-label{position:fixed;bottom:8px;left:12px;z-index:90;font:10px system-ui;color:#65716a;background:#ffffffeb;border:1px solid #e3e8e4;padding:4px 8px;border-radius:4px;pointer-events:none}@media(max-width:899px){.preview-label{bottom:78px}}</style></head>')
      .replace('<div id="root"></div>', '<div id="root"></div><div class="preview-label">Design preview · sample data</div>');
  },
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url, 'http://localhost');
      if (!url.pathname.startsWith('/api/')) {
        if (url.pathname === '/') {
          if (url.searchParams.has('auth')) signedIn = false;
          if (url.searchParams.has('empty')) { signedIn = true; empty = true; active = null; }
          if (url.searchParams.has('summary-error')) failSummary = true;
          if (url.searchParams.has('reset-preview')) { signedIn = true; empty = false; failSummary = false; active = null; }
        }
        return next();
      }
      const send = (data, status = 200) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
      let raw = ''; for await (const chunk of req) raw += chunk;
      let body = {}; try { body = raw ? JSON.parse(raw) : {}; } catch { return send({ error: 'Invalid preview request' }, 400); }
      const path = url.pathname.replace('/api', '');
      if (path === '/auth/me') return signedIn ? send({ user }) : send({ error: 'Not signed in' }, 401);
      if (path === '/auth/logout') { signedIn = false; return send({ ok: true }); }
      if (path === '/auth/login' || path === '/auth/signup') { signedIn = true; return send({ user }); }
      if (!signedIn) return send({ error: 'Not signed in' }, 401);
      if (path === '/exercises') return send({ exercises });
      if (path === '/routines' && req.method === 'GET') return send({ routines: empty ? [] : routines });
      if (path === '/routines' && req.method === 'POST') { const routine = { id: `preview-routine-${Date.now()}`, ...body }; routines.push(routine); empty = false; return send({ routine }); }
      if (path.startsWith('/routines/') && req.method === 'PATCH') { routines = routines.map((r) => r.id === path.split('/')[2] ? { ...r, ...body } : r); return send({ routine: routines.find((r) => r.id === path.split('/')[2]) }); }
      if (path === '/stats/overview') return failSummary ? send({ error: 'Preview summary unavailable' }, 503) : send(overview(Number(url.searchParams.get('weeks')) || 12));
      if (path.startsWith('/stats/exercise/')) {
        const id = path.split('/')[3]; const exercise = byId.get(id);
        return send({ points: (empty ? [] : sessions).filter((s) => s.entries.some((entry) => entry.exerciseId === id)).map((s) => {
          const entry = s.entries.find((entry) => entry.exerciseId === id);
          return { date: s.date, e1rm: bestE1rm(entry.sets, exercise, s.bodyWeightKg), topWeightKg: Math.max(...entry.sets.map((set) => set.weightKg ?? 0)),
            volumeKg: entry.sets.reduce((sum, set) => sum + (set.weightKg ?? 0) * (set.reps ?? 0), 0), sets: entry.sets.length };
        }).sort((a, b) => a.date.localeCompare(b.date)) });
      }
      if (path === '/sessions/active') return send({ session: active });
      if (path === '/sessions/previous') return send({ previous: Object.fromEntries((url.searchParams.get('ids') ?? '').split(',').flatMap((id) => {
        const s = sessions.find((s) => s.entries.some((e) => e.exerciseId === id)); const entry = s?.entries.find((e) => e.exerciseId === id);
        return entry ? [[id, { date: s.date, bodyWeightKg: s.bodyWeightKg, sets: entry.sets, cardio: null, bestE1rm: bestE1rm(entry.sets, byId.get(id), s.bodyWeightKg) }]] : [];
      })) });
      if (path === '/sessions' && req.method === 'GET') return send({ sessions: (empty ? [] : sessions).slice(Number(url.searchParams.get('skip')) || 0, Number(url.searchParams.get('limit')) || 30), total: empty ? 0 : sessions.length });
      if (path === '/sessions' && req.method === 'POST') {
        const routine = routines.find((r) => r.id === body.routineId);
        active = { id: `preview-active-${Date.now()}`, name: routine?.name ?? 'Freestyle workout', routineId: routine?.id ?? null, status: 'active',
          date: today, startedAt: new Date().toISOString(), endedAt: null, bodyWeightKg: user.currentWeightKg, notes: '', totals: {},
          entries: routine?.exercises.map((e) => ({ exerciseId: e.exerciseId, sets: Array.from({ length: e.targetSets }, () => ({ reps: e.targetReps, weightKg: e.targetWeightKg, done: false, restSec: e.restSec })), notes: '' })) ?? [] };
        return send({ session: active });
      }
      if (path.endsWith('/finish') && active) { active.endedAt = new Date().toISOString(); active.status = 'completed'; active.totals = sessionTotals(active, byId);
        const finished = active; if (finished.totals.workingSets) { sessions.unshift(finished); empty = false; } active = null;
        return send({ session: finished, newPRs: [], discarded: !finished.totals.workingSets }); }
      if (path.startsWith('/sessions/') && req.method === 'PATCH' && active) { active = { ...active, ...body }; active.totals = sessionTotals(active, byId); return send({ session: active }); }
      if (path === '/me' && req.method === 'PATCH') { user = { ...user, ...body }; return send({ user }); }
      if (path === '/me/weight' && req.method === 'POST') { user.currentWeightKg = body.kg; user.weighIns.push({ date: body.date ?? today, kg: body.kg }); return send({ user }); }
      return send({ error: 'This action is unavailable in the sample-data preview.' }, 400);
    });
  },
};
const server = await createServer({ configFile: false, plugins: [react(), previewPlugin], server: { host: '127.0.0.1', port: 5174, strictPort: true } });
await server.listen();
server.printUrls();
console.log('Design preview only. Sample data is kept in memory. Use ?auth, ?empty, ?summary-error or ?reset-preview to inspect states.');

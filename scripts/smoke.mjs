/**
 * End-to-end API smoke test against a running server.
 *   node server/index.js        # in one shell
 *   node scripts/smoke.mjs      # in another
 * Creates a throwaway account, runs a full workout through, deletes itself.
 */
const BASE = process.env.SMOKE_BASE ?? 'http://localhost:4000';
let cookie = '';

async function call(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  const json = await res.json().catch(() => ({}));
  if (res.status === 429 && path === '/api/auth/signup') {
    // Signups are capped at 5/hour per IP. The limiter is in-memory, so a
    // server restart clears it — that is the intended way to re-run this.
    console.error('\nSignup is rate limited (5/hour per IP). Restart the API and run again.\n');
    process.exit(1);
  }
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${JSON.stringify(json)}`);
  return json;
}

const ok = (label, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`);
  if (!cond) process.exitCode = 1;
};

// Plus-addressing when a real SMTP inbox is configured, so the one reset email
// this test sends actually lands somewhere instead of bouncing off example.com.
const INBOX = process.env.SMOKE_INBOX; // e.g. you@gmail.com
const email = INBOX
  ? INBOX.replace('@', `+smoke${Date.now()}@`)
  : `smoke-${Date.now()}@example.com`;
const PASSWORD = 'test-password-123';

const signup = await call('POST', '/api/auth/signup', { name: 'Smoke Test', email, password: PASSWORD });
ok('signup creates account', signup.user.email === email);
ok('new accounts start unverified', signup.user.emailVerified === false);
ok('signup issues a verification link', typeof signup.verifyLink === 'string' && signup.verifyLink.includes('verify='));

// Verifying must not sign anyone in — owning the inbox is not knowing the password.
const verifyToken = new URL(signup.verifyLink).searchParams.get('verify');
const verifyRes = await fetch(`${BASE}/api/auth/verify`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ token: verifyToken }),
});
ok('verify accepts a valid token', verifyRes.status === 200);
ok('verify does not set a session cookie', !verifyRes.headers.get('set-cookie'));
ok('account reads as verified afterwards', (await call('GET', '/api/auth/me')).user.emailVerified === true);

const reuseVerify = await fetch(`${BASE}/api/auth/verify`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ token: verifyToken }),
});
ok('a verification token cannot be reused', reuseVerify.status === 400);

const resend = await call('POST', '/api/auth/resend-verification');
ok('resend is a no-op once verified', resend.alreadyVerified === true);

await call('PATCH', '/api/me', { sex: 'male', birthYear: 1999, heightCm: 175, weightKg: 108, units: 'metric' });
const me = await call('GET', '/api/auth/me');
ok('onboarding completes', !!me.user.onboardedAt, `weight=${me.user.currentWeightKg}kg`);

const { exercises } = await call('GET', '/api/exercises');
ok('catalog seeded', exercises.length >= 60, `${exercises.length} exercises`);
const bench = exercises.find((e) => e.slug === 'bench-press');
const rower = exercises.find((e) => e.slug === 'rower');

const machines = exercises.filter((e) => e.equipment.includes('Machine'));
ok('machine library is present', machines.length >= 25, `${machines.length} machine exercises`);
ok('every exercise has a how-to link',
  exercises.every((e) => e.howToUrl?.startsWith('https://')),
  exercises[0]?.howToUrl.slice(0, 52) + '…');

const pushdown = exercises.find((e) => e.slug === 'rope-pushdown');
ok('muscles are split primary vs secondary',
  pushdown?.primaryMuscles.join() === 'Triceps Brachii' && pushdown?.secondaryMuscles.join() === 'Forearms');

const noDupes = new Set(exercises.map((e) => e.name)).size === exercises.length;
ok('no duplicate exercise names', noDupes);

const { routines } = await call('GET', '/api/routines');
ok('starter routines created', routines.length === 4, routines.map((r) => r.name).join(', '));

const push = routines.find((r) => r.name === 'Push Day');
const started = await call('POST', '/api/sessions', { routineId: push.id });
ok('routine prefills planned sets', started.session.entries[0].sets.length === 4);

const active = await call('GET', '/api/sessions/active');
ok('active workout is resumable', active.session?.id === started.session.id);

// Log a real workout: 3 working sets of bench + 20 min row
const entries = [
  {
    exerciseId: bench.id,
    sets: [
      { reps: 10, weightKg: 40, isWarmup: true, done: true, restSec: 60 },
      { reps: 8, weightKg: 80, done: true, restSec: 150 },
      { reps: 8, weightKg: 80, done: true, restSec: 150 },
      { reps: 6, weightKg: 85, done: true, restSec: 150 },
    ],
  },
  { exerciseId: rower.id, sets: [], cardio: { durationMin: 20, distanceKm: 4.5, intensity: 'vigorous', done: true } },
];
const saved = await call('PATCH', `/api/sessions/${started.session.id}`, { entries });
const t = saved.session.totals;
// Volume excludes the warmup: 8*80 + 8*80 + 6*85 = 1790
ok('volume excludes warmup sets', Math.round(t.volumeKg) === 1790, `${Math.round(t.volumeKg)} kg`);
ok('strength + cardio calories split', t.strengthKcal > 0 && t.cardioKcal > 0,
  `strength=${t.strengthKcal.toFixed(0)} cardio=${t.cardioKcal.toFixed(0)} kcal`);

const finished = await call('POST', `/api/sessions/${started.session.id}/finish`);
ok('finish drops untouched exercises', finished.session.entries.length === 2);
ok('finish clears the active slot', (await call('GET', '/api/sessions/active')).session === null);

const prev = await call('GET', `/api/sessions/previous?ids=${bench.id}`);
ok('previous performance lookup', prev.previous[bench.id]?.sets.length === 4,
  `best e1RM ${prev.previous[bench.id]?.bestE1rm.toFixed(1)} kg`);

const stats = await call('GET', '/api/stats/overview');
ok('stats overview aggregates', stats.sessionCount === 1 && stats.prs.length >= 1,
  `streak=${stats.streak}w prs=${stats.prs.length}`);

const { sessions } = await call('GET', '/api/sessions?limit=5');
ok('history lists completed sessions', sessions.length === 1);

// Second, heavier session should register a PR
const s2 = await call('POST', '/api/sessions', {});
await call('PATCH', `/api/sessions/${s2.session.id}`, {
  entries: [{ exerciseId: bench.id, sets: [{ reps: 5, weightKg: 100, done: true, restSec: 180 }] }],
});
const f2 = await call('POST', `/api/sessions/${s2.session.id}/finish`);
ok('beating a previous best raises a PR', f2.newPRs.length === 1,
  f2.newPRs[0] ? `${f2.newPRs[0].name} ${f2.newPRs[0].previous} -> ${f2.newPRs[0].e1rm} kg` : '');

// An empty workout is discarded rather than saved as a ghost row
const s3 = await call('POST', '/api/sessions', {});
const f3 = await call('POST', `/api/sessions/${s3.session.id}/finish`);
ok('empty workout is discarded', f3.discarded === true);

/* ------------------------------- bodyweight, timed sets, auth hardening */

const pullups = exercises.find((e) => e.slug === 'pull-ups');
const plank = exercises.find((e) => e.slug === 'plank');
ok('catalog flags bodyweight lifts', pullups?.isBodyweight === true && pullups?.bodyweightFactor === 1);
ok('catalog flags timed holds', plank?.isTimed === true);

const s4 = await call('POST', '/api/sessions', {});
const saved4 = await call('PATCH', `/api/sessions/${s4.session.id}`, {
  entries: [
    // Bodyweight at 108kg: 8 reps unweighted + 6 reps with +10kg
    { exerciseId: pullups.id, sets: [
      { reps: 8, weightKg: null, done: true, restSec: 120 },
      { reps: 6, weightKg: 10, done: true, restSec: 120 },
    ] },
    { exerciseId: plank.id, sets: [{ durationSec: 90, done: true, restSec: 45 }] },
  ],
});
// 8 × 108 + 6 × 118 = 864 + 708 = 1572; the plank adds no rep-volume
ok('bodyweight lifts count body weight as load', Math.round(saved4.session.totals.volumeKg) === 1572,
  `${Math.round(saved4.session.totals.volumeKg)} kg`);
ok('timed holds add no rep-volume but do burn', saved4.session.totals.strengthKcal > 0);

const f4 = await call('POST', `/api/sessions/${s4.session.id}/finish`);
ok('timed hold is kept in history', f4.session.entries.length === 2);

const prev4 = await call('GET', `/api/sessions/previous?ids=${pullups.id},${plank.id}`);
ok('previous returns the body weight of that day', prev4.previous[pullups.id]?.bodyWeightKg === 108);
ok('previous carries hold duration', prev4.previous[plank.id]?.sets[0].durationSec === 90);

const stats4 = await call('GET', '/api/stats/overview');
const pullPr = stats4.prs.find((p) => p.exerciseId === pullups.id);
ok('bodyweight PR uses total load', pullPr && pullPr.bestWeightKg >= 118,
  pullPr ? `${pullPr.bestWeightKg.toFixed(1)} kg` : 'missing');
ok('timed exercise stays out of 1RM tracking', !stats4.trackable.some((t) => t.id === plank.id));

// Password reset: forgot -> token -> new password -> signed in
const forgot = await fetch(`${BASE}/api/auth/forgot`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email }),
}).then((r) => r.json());
ok('forgot issues a reset link', typeof forgot.devLink === 'string' && forgot.devLink.includes('reset='),
  forgot.emailed ? `emailed to ${email}` : 'no SMTP — logged instead');

const unknown = await fetch(`${BASE}/api/auth/forgot`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'nobody-here@example.com' }),
}).then((r) => r.json());
ok('forgot does not leak which emails exist', unknown.ok === true && unknown.devLink === null);

const NEW_PASSWORD = 'a-brand-new-password';
const token = new URL(forgot.devLink).searchParams.get('reset');
await call('POST', '/api/auth/reset', { token, password: NEW_PASSWORD });
ok('reset signs you straight in', (await call('GET', '/api/auth/me')).user.email === email);

const reuse = await fetch(`${BASE}/api/auth/reset`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ token, password: 'another-password-1' }),
});
ok('a reset token cannot be reused', reuse.status === 400);

await call('POST', '/api/auth/login', { email, password: NEW_PASSWORD });
ok('the new password works', true);

// Rate limiting: 10 allowed per 15 min per IP+email, 11th is throttled
let throttled = false;
for (let i = 0; i < 12; i += 1) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'definitely-wrong' }),
  });
  if (r.status === 429) {
    throttled = true;
    break;
  }
}
ok('repeated bad logins get rate limited', throttled);

/* ------------------------- manual logging, routines from history, export */

await call('POST', '/api/auth/login', { email, password: NEW_PASSWORD }).catch(() => {});

const yesterday = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

const manual = await call('POST', '/api/sessions/manual', {
  date: yesterday,
  name: 'Backfilled session',
  durationMin: 50,
  entries: [{ exerciseId: bench.id, sets: [{ reps: 10, weightKg: 70 }, { reps: 10, weightKg: 70 }] }],
});
ok('manual log writes straight to history', manual.session.status === 'completed' && manual.session.date === yesterday,
  `${Math.round(manual.session.totals.volumeKg)} kg, ${Math.round(manual.session.totals.durationMin)} min`);
ok('manual log leaves the active slot alone', (await call('GET', '/api/sessions/active')).session === null);

const future = await fetch(`${BASE}/api/sessions/manual`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', cookie },
  body: JSON.stringify({ date: '2099-01-01', entries: [{ exerciseId: bench.id, sets: [{ reps: 5, weightKg: 50 }] }] }),
});
ok('manual log refuses future dates', future.status === 400);

const asRoutine = await call('POST', `/api/sessions/${manual.session.id}/save-as-routine`, { name: 'From history' });
const routinesNow = await call('GET', '/api/routines');
const built = routinesNow.routines.find((r) => r.id === asRoutine.routineId);
ok('save-as-routine copies the exercises', built?.exercises.length === 1 && built.exercises[0].targetSets === 2,
  `${built?.exercises[0].targetSets}×${built?.exercises[0].targetReps}`);

const csv = await fetch(`${BASE}/api/me/export.csv`, { headers: { cookie } });
const csvText = await csv.text();
ok('CSV export is one row per set',
  csv.headers.get('content-type')?.includes('text/csv') && csvText.split('\r\n').length > 3,
  `${csvText.split('\r\n').length - 1} rows`);

const json = await call('GET', '/api/me/export');
ok('JSON export names exercises', json.sessions.some((s) => s.entries.some((e) => e.exercise === 'Barbell Bench Press')));

/* -------------------------------------------- progress metrics (no tonnage) */

const prog = await call('GET', '/api/stats/overview?weeks=12');
const benchLift = prog.lifts.find((l) => l.name === 'Barbell Bench Press');
ok('per-lift strength change is reported', benchLift && benchLift.deltaKg !== undefined,
  benchLift ? `${benchLift.firstE1rm} -> ${benchLift.lastE1rm} kg (${benchLift.deltaPct}%)` : 'missing');
ok('lifts carry a sparkline series', (benchLift?.points.length ?? 0) >= 2);
ok('relative strength uses body weight', benchLift?.relative > 0, `${benchLift?.relative}x body weight`);

// Bench: Pectoralis Major primary (1.0), Anterior Deltoids + Triceps secondary (0.5)
const chestSets = prog.avgSetsPerMuscle['Pectoralis Major'];
ok('hard sets per muscle are weighted by role',
  chestSets > 0 && prog.avgSetsPerMuscle.Triceps === chestSets / 2,
  `pecs ${chestSets}/wk, triceps ${prog.avgSetsPerMuscle.Triceps}/wk`);

ok('adherence is measured against your own target',
  prog.consistency.target === 4 && prog.consistency.weeks === 12,
  `${prog.consistency.sessionsInRange} sessions, ${prog.consistency.avgPerWeek}/wk`);

const shortRange = await call('GET', '/api/stats/overview?weeks=6');
ok('range parameter scopes the window', shortRange.range.weeks === 6);

await call('POST', '/api/me/delete-account', { password: NEW_PASSWORD });
console.log('\ncleanup: throwaway account deleted');

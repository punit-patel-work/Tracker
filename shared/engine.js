/**
 * Training + energy maths. Imported by BOTH the API and the browser so a number
 * shown live during a workout is the same number the server persists.
 *
 * calcVersion is stamped on every stored session: a formula change can then be
 * re-run deliberately instead of silently rewriting a user's history.
 */

export const CALC_VERSION = 1;

const SECONDS_PER_REP = 3; // controlled tempo, concentric + eccentric
const MET_REST = 1.5; // standing between working sets

export const INTENSITY_FACTOR = { light: 0.7, moderate: 1, vigorous: 1.4, max: 1.7 };

/** kcal = MET x 3.5 x kg / 200 x minutes */
export function metKcal(met, weightKg, minutes) {
  if (!(minutes > 0) || !(weightKg > 0)) return 0;
  return ((met * 3.5 * weightKg) / 200) * minutes;
}

/** Mifflin-St Jeor. */
export function bmr({ sex, weightKg, heightCm, age }) {
  if (!weightKg || !heightCm || !age) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'female' ? base - 161 : base + 5);
}

export function ageFromBirthYear(birthYear) {
  if (!birthYear) return 0;
  return Math.max(0, new Date().getFullYear() - birthYear);
}

/** Epley. Returns 0 for anything that is not a real working set. */
export function estimated1RM(weightKg, reps) {
  if (!(weightKg > 0) || !(reps > 0)) return 0;
  return reps === 1 ? weightKg : weightKg * (1 + reps / 30);
}

/**
 * What the set actually moved.
 *
 * For a pull-up the bar is empty but you are lifting yourself, so `weightKg` on
 * a bodyweight exercise means *added* weight and the real load is
 * bodyweight × factor + added. Without this, pull-ups and push-ups record zero
 * volume and never produce a PR.
 */
export function effectiveLoadKg(exercise, set, bodyWeightKg) {
  const added = set?.weightKg ?? 0;
  if (exercise?.isBodyweight) return (bodyWeightKg ?? 0) * (exercise.bodyweightFactor ?? 1) + added;
  return added;
}

export function isWorkingSet(set) {
  if (!set.done || set.isWarmup) return false;
  return (set.reps ?? 0) > 0 || (set.durationSec ?? 0) > 0;
}

/**
 * Timed holds contribute no rep-volume — a 60s plank is not "1 rep × load".
 * They still count for energy expenditure and appear in history.
 */
export function setVolume(sets, exercise, bodyWeightKg) {
  return sets.reduce((sum, x) => {
    if (!isWorkingSet(x) || exercise?.isTimed) return sum;
    return sum + (x.reps ?? 0) * effectiveLoadKg(exercise, x, bodyWeightKg);
  }, 0);
}

/** Best estimated 1RM in a set list. Timed exercises have no meaningful 1RM. */
export function bestE1rm(sets, exercise, bodyWeightKg) {
  if (exercise?.isTimed) return 0;
  let best = 0;
  for (const set of sets ?? []) {
    if (!isWorkingSet(set)) continue;
    const v = estimated1RM(effectiveLoadKg(exercise, set, bodyWeightKg), set.reps ?? 0);
    if (v > best) best = v;
  }
  return best;
}

/**
 * Strength burn charges work time at the exercise MET and rest time at 1.5.
 * A single MET across wall-clock time overstates it by ~40-60% at normal rest.
 * Warmups count for energy (you did move) but never for volume or PRs.
 */
export function strengthKcal(exercise, sets, bodyWeightKg) {
  const done = sets.filter((x) => x.done && ((x.reps ?? 0) > 0 || (x.durationSec ?? 0) > 0));
  if (!done.length) return 0;
  // A timed hold measures its own work time; a rep set is estimated from tempo.
  const activeMin =
    done.reduce((s, x) => s + (x.durationSec ?? (x.reps ?? 0) * SECONDS_PER_REP), 0) / 60;
  const restMin = done.reduce((s, x) => s + (x.restSec ?? exercise.defaultRestSec ?? 90), 0) / 60;
  return metKcal(exercise.met ?? 5, bodyWeightKg, activeMin) + metKcal(MET_REST, bodyWeightKg, restMin);
}

/** Compendium-style speed bands — MET is strongly non-linear in speed. */
function speedMet(slug, kph) {
  if (slug === 'treadmill' || slug === 'outdoor-run') {
    if (kph < 5) return 3.5;
    if (kph < 6.5) return 5;
    if (kph < 8) return 8.3;
    if (kph < 9.7) return 9.8;
    if (kph < 11.3) return 11;
    if (kph < 12.9) return 11.8;
    return 14.5;
  }
  if (slug === 'bike') {
    if (kph < 16) return 4;
    if (kph < 19) return 6.8;
    if (kph < 22.5) return 8;
    if (kph < 25.7) return 10;
    return 12;
  }
  if (slug === 'rower') {
    if (kph < 8) return 4.8;
    if (kph < 11) return 7;
    if (kph < 13) return 8.5;
    return 12;
  }
  return null;
}

export function cardioKcal(exercise, cardio, bodyWeightKg) {
  if (!cardio?.done) return 0;
  const minutes = cardio.durationMin ?? 0;
  let met = (exercise.met ?? 5) * (INTENSITY_FACTOR[cardio.intensity] ?? 1);
  // A logged distance beats the subjective label: derive the real speed.
  if (exercise.isDistanceBased && cardio.distanceKm > 0 && minutes > 0) {
    met = speedMet(exercise.slug, cardio.distanceKm / (minutes / 60)) ?? met;
  }
  return metKcal(met, bodyWeightKg, minutes);
}

/**
 * @param session  {{ entries: [], bodyWeightKg, startedAt, endedAt }}
 * @param byId     Map of exerciseId -> exercise
 */
export function sessionTotals(session, byId) {
  let volumeKg = 0;
  let strength = 0;
  let cardio = 0;
  let workingSets = 0;
  let cardioMinutes = 0;
  const muscleVolume = {};

  for (const entry of session.entries ?? []) {
    const ex = byId.get(String(entry.exerciseId ?? entry.exercise));
    if (!ex) continue;
    if (ex.type === 'cardio') {
      cardio += cardioKcal(ex, entry.cardio, session.bodyWeightKg);
      if (entry.cardio?.done) cardioMinutes += entry.cardio.durationMin ?? 0;
    } else {
      const v = setVolume(entry.sets ?? [], ex, session.bodyWeightKg);
      volumeKg += v;
      strength += strengthKcal(ex, entry.sets ?? [], session.bodyWeightKg);
      workingSets += (entry.sets ?? []).filter(isWorkingSet).length;
      if (v > 0) {
        // Primary muscles take the full share, secondaries half — a triceps
        // pushdown should not credit forearms the same as triceps.
        for (const [m, weight] of muscleWeights(ex)) {
          muscleVolume[m] = (muscleVolume[m] ?? 0) + v * weight;
        }
      }
    }
  }

  const end = session.endedAt ? new Date(session.endedAt).getTime() : Date.now();
  const durationMin = session.startedAt ? Math.max(0, (end - new Date(session.startedAt).getTime()) / 60000) : 0;

  return {
    volumeKg,
    strengthKcal: strength,
    cardioKcal: cardio,
    totalKcal: strength + cardio,
    workingSets,
    cardioMinutes,
    durationMin,
    muscleVolume,
  };
}

/**
 * Muscle → share of the work, normalised to sum to 1. Primary counts double a
 * secondary. Falls back to the flat `muscles` list for older records.
 */
export function muscleWeights(exercise) {
  const primary = exercise?.primaryMuscles?.length ? exercise.primaryMuscles : (exercise?.muscles ?? []).slice(0, 1);
  const secondary = exercise?.primaryMuscles?.length
    ? (exercise.secondaryMuscles ?? [])
    : (exercise?.muscles ?? []).slice(1);

  const total = primary.length + secondary.length * 0.5;
  if (!total) return [];
  return [
    ...primary.map((m) => [m, 1 / total]),
    ...secondary.map((m) => [m, 0.5 / total]),
  ];
}

/** Hard sets credited to each muscle: 1 per primary, 0.5 per secondary. */
export function hardSetCredit(exercise) {
  const primary = exercise?.primaryMuscles?.length ? exercise.primaryMuscles : (exercise?.muscles ?? []).slice(0, 1);
  const secondary = exercise?.primaryMuscles?.length
    ? (exercise.secondaryMuscles ?? [])
    : (exercise?.muscles ?? []).slice(1);
  return [...primary.map((m) => [m, 1]), ...secondary.map((m) => [m, 0.5])];
}

/** Gross burn minus the BMR the body spends anyway over the same interval. */
export function netKcal(gross, profile, minutes) {
  return Math.max(0, gross - (bmr(profile) / 1440) * minutes);
}

/* ------------------------------------------------------- progression */

/** Smallest sensible jump for the kit involved. */
function loadIncrementKg(exercise) {
  if (exercise?.equipment === 'Dumbbells') return 2;
  if (exercise?.isBarbell && (exercise.category === 'legs' || exercise.slug === 'deadlift')) return 5;
  return 2.5;
}

/** Reps at which a weight is considered "owned" and worth adding to. */
const PROGRESSION_REPS = 8;

/**
 * Double progression: hold the weight until every working set clears the rep
 * threshold, then add the smallest plate. Returns null when last session gives
 * no clean signal — inconsistent loads mean you were working something out.
 */
export function suggestNextWeight(previous, exercise) {
  if (!previous || !exercise || exercise.type === 'cardio' || exercise.isTimed) return null;

  const working = (previous.sets ?? []).filter((s) => !s.isWarmup && (s.reps ?? 0) > 0);
  if (working.length < 2) return null;

  const loads = new Set(working.map((s) => s.weightKg ?? 0));
  if (loads.size !== 1) return null;

  const minReps = Math.min(...working.map((s) => s.reps ?? 0));
  if (minReps < PROGRESSION_REPS) return null;

  const fromKg = working[0].weightKg ?? 0;
  const stepKg = loadIncrementKg(exercise);
  return { fromKg, toKg: fromKg + stepKg, stepKg, sets: working.length, reps: minReps };
}

/* ------------------------------------------------------------------ plates */

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LB_PLATES = [45, 35, 25, 10, 5, 2.5];

/**
 * What to hang on each side. Returns null when the target is under the bar or
 * cannot be made from standard plates — better than silently rounding.
 */
export function platesPerSide(totalKg, barKg = 20, units = 'metric') {
  if (!(totalKg > barKg)) return null;
  const perSideKg = (totalKg - barKg) / 2;
  const toUnit = units === 'imperial' ? 2.20462 : 1;
  const plates = units === 'imperial' ? LB_PLATES : KG_PLATES;
  let remaining = perSideKg * toUnit;
  const out = [];
  for (const p of plates) {
    while (remaining >= p - 0.001) {
      out.push(p);
      remaining -= p;
    }
  }
  return { plates: out, leftover: Math.round(remaining * 100) / 100 };
}

/* --------------------------------------------------------------------- PRs */

/**
 * Best working set per exercise across a set of sessions.
 * Tracks both heaviest weight and best e1RM — they answer different questions.
 */
export function personalRecords(sessions, byId) {
  const prs = new Map();
  for (const s of sessions) {
    for (const entry of s.entries ?? []) {
      const ex = byId.get(String(entry.exerciseId ?? entry.exercise));
      if (!ex || ex.type === 'cardio' || ex.isTimed) continue;
      const key = String(entry.exerciseId ?? entry.exercise);
      for (const set of entry.sets ?? []) {
        if (!isWorkingSet(set)) continue;
        const load = effectiveLoadKg(ex, set, s.bodyWeightKg);
        const e1rm = estimated1RM(load, set.reps ?? 0);
        const cur = prs.get(key) ?? { exerciseId: key, name: ex.name, bestWeightKg: 0, bestE1rm: 0, date: s.date };
        if (load > cur.bestWeightKg) {
          cur.bestWeightKg = load;
          cur.bestWeightReps = set.reps ?? 0;
          cur.date = s.date;
        }
        if (e1rm > cur.bestE1rm) {
          cur.bestE1rm = e1rm;
          cur.date = s.date;
        }
        prs.set(key, cur);
      }
    }
  }
  return [...prs.values()];
}

/** Monday-anchored week key for bucketing. */
export function weekKey(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Consecutive-week streak: weeks with at least one session, counting back. */
export function weekStreak(dates) {
  if (!dates.length) return 0;
  const weeks = new Set(dates.map(weekKey));
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7));
  let streak = 0;
  for (;;) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    if (weeks.has(key)) streak += 1;
    else if (streak > 0 || weeks.size === 0) break;
    else if (streak === 0 && cursor < new Date(Date.now() - 7 * 86400000)) break;
    cursor.setDate(cursor.getDate() - 7);
    if (streak > 520) break;
  }
  return streak;
}

import { Exercise } from './models.js';

export function invalid(message) { throw Object.assign(new Error(message), { status: 400 }); }
export function text(value, label, max = 120, required = true) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) invalid(`${label} must be ${required ? 'non-empty and ' : ''}at most ${max} characters`);
  return value.trim();
}
export function number(value, label, min, max, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) invalid(`${label} must be ${integer ? 'a whole number ' : ''}between ${min} and ${max}`);
  return value;
}
export function id(value) {
  if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value)) invalid('Invalid record ID');
  return value;
}
export function array(value, label, max = 100) {
  if (!Array.isArray(value) || value.length > max) invalid(`${label} must be a list with at most ${max} items`);
  return value;
}
export function dateISO(value, today) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(`${value}T12:00:00Z`)) ||
      new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) !== value || value < '1900-01-01' || (today && value > today)) invalid('Choose a valid date on or before today');
  return value;
}
export function timeZone(value) {
  try { new Intl.DateTimeFormat('en', { timeZone: value }).format(); } catch { invalid('Invalid time zone'); }
  return text(value, 'Time zone', 80);
}
export function todayFor(zone = 'UTC', now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function entriesInput(entries, completed = false) {
  const ids = new Set();
  return array(entries, 'Exercises', 100).map((entry) => {
    if (!entry || typeof entry !== 'object') invalid('Invalid exercise entry');
    const exercise = id(entry.exerciseId);
    if (ids.has(exercise)) invalid('Each exercise must appear only once');
    ids.add(exercise);
    const sets = array(entry.sets ?? [], 'Sets', 100).map((s) => {
      if (!s || typeof s !== 'object') invalid('Invalid set');
      const out = {};
      for (const [key, max, integer] of [['reps', 10000, true], ['weightKg', 2000, false], ['durationSec', 36000, false], ['restSec', 3600, false], ['rpe', 10, false]]) {
        out[key] = s[key] == null ? null : number(s[key], key, 0, max, integer);
      }
      return { ...out, isWarmup: s.isWarmup === true, done: completed || s.done === true };
    });
    let cardio = null;
    if (entry.cardio != null) {
      const c = entry.cardio;
      if (!['light', 'moderate', 'vigorous', 'max'].includes(c.intensity)) invalid('Choose a valid cardio intensity');
      cardio = { intensity: c.intensity, done: completed || c.done === true };
      for (const [key, max] of [['durationMin', 600], ['distanceKm', 1000], ['incline', 100], ['level', 1000]]) {
        cardio[key] = c[key] == null ? null : number(c[key], key, 0, max);
      }
      if (cardio.done && !(cardio.durationMin > 0)) invalid('Completed cardio needs a duration above zero');
    }
    return { exercise, sets, cardio, notes: text(entry.notes ?? '', 'Exercise notes', 2000, false) };
  });
}
export async function accessibleExercises(ids, userId) {
  ids.forEach(id);
  const docs = await Exercise.find({ _id: { $in: [...new Set(ids)] }, $or: [{ owner: null }, { owner: userId }] }).lean();
  const map = new Map(docs.map((doc) => [String(doc._id), doc]));
  if (ids.some((key) => !map.has(key))) invalid('An exercise is unavailable or belongs to another account');
  return map;
}
export function routineInput(list) {
  const seen = new Set();
  return array(list ?? [], 'Routine exercises').map((e) => {
    const exercise = id(e?.exerciseId);
    if (seen.has(exercise)) invalid('Each exercise must appear only once');
    seen.add(exercise);
    return { exercise, targetSets: number(e.targetSets ?? 3, 'Target sets', 1, 100, true),
      targetReps: number(e.targetReps ?? 8, 'Target reps', 0, 10000, true),
      targetWeightKg: e.targetWeightKg == null ? null : number(e.targetWeightKg, 'Target weight', 0, 2000),
      restSec: e.restSec == null ? null : number(e.restSec, 'Rest seconds', 0, 3600) };
  });
}

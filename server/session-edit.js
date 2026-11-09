/** Validate a completed workout before changing the stored document. */
export function completedWorkoutChanges(body, session, today) {
  const { date, name, durationMin, entries } = body ?? {};
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(`${date}T12:00:00Z`)) ||
      new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date || date > today) {
    throw new Error('Choose a valid date on or before today');
  }
  if (typeof durationMin !== 'number' || !Number.isFinite(durationMin) || durationMin <= 0 || durationMin > 600) {
    throw new Error('Duration must be greater than 0 and at most 600 minutes');
  }
  if (typeof name !== 'string' || !name.trim()) throw new Error('Enter a workout name');
  if (!Array.isArray(entries) || !entries.length) throw new Error('Add at least one exercise');
  const ids = new Set();
  const numeric = (value) => value == null || (typeof value === 'number' && Number.isFinite(value) && value >= 0);
  const mapped = entries.map((entry) => {
    if (!entry || typeof entry.exerciseId !== 'string' || !entry.exerciseId || ids.has(entry.exerciseId)) {
      throw new Error('Each exercise must appear only once');
    }
    ids.add(entry.exerciseId);
    if (!Array.isArray(entry.sets)) throw new Error('Invalid sets');
    const sets = entry.sets.map((set) => {
      if (!set || !['reps', 'weightKg', 'durationSec', 'rpe', 'restSec'].every((key) => numeric(set[key]))) {
        throw new Error('Set values must be non-negative numbers');
      }
      return { reps: set.reps ?? null, weightKg: set.weightKg ?? null, durationSec: set.durationSec ?? null,
        rpe: set.rpe ?? null, restSec: set.restSec ?? null, isWarmup: !!set.isWarmup, done: true };
    });
    let cardio = null;
    if (entry.cardio) {
      const c = entry.cardio;
      if (!['durationMin', 'distanceKm', 'incline', 'level'].every((key) => numeric(c[key])) ||
          !['light', 'moderate', 'vigorous', 'max'].includes(c.intensity)) throw new Error('Invalid cardio values');
      cardio = { durationMin: c.durationMin ?? null, distanceKm: c.distanceKm ?? null,
        incline: c.incline ?? null, level: c.level ?? null, intensity: c.intensity, done: true };
    }
    if (!sets.length && !cardio) throw new Error('Fill in at least one set or cardio entry per exercise');
    return { exercise: entry.exerciseId, sets, cardio, notes: entry.notes ?? '' };
  });
  // Preserve the original timestamp when the date is unchanged, and keep the
  // body's recorded weight even if the user has since added new weigh-ins.
  const startedAt = date === session.date && session.startedAt ? new Date(session.startedAt) : new Date(`${date}T12:00:00Z`);
  return { date, name: name.trim(), entries: mapped, startedAt,
    endedAt: new Date(startedAt.getTime() + durationMin * 60000 + (session.pausedMs ?? 0)) };
}

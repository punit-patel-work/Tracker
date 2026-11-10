// Keep exercise identity, catalogue access and load selection on the server.
const words = value => value.toLowerCase().normalize('NFKD')
  .replace(/\bdb\b/g, 'dumbbell').replace(/\bbb\b/g, 'barbell')
  .replace(/\brdl\b/g, 'romanian deadlift').replace(/\bone arm\b/g, 'single arm')
  .replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
const nameKey = value => words(value).sort().join(' ');
const aliases = new Map([
  ['incline db press', 'Dumbbell Incline Bench Press'],
  ['flat db press', 'Dumbbell Flat Bench Press'],
  ['incline bb press', 'Barbell Incline Bench Press'],
].map(([alias, name]) => [nameKey(alias), nameKey(name)]));

export function routinePrompt(context) {
  const { excludedExerciseIds, ...preferences } = context.preferences;
  const recent = new Map();
  for (const session of context.history) {
    for (const entry of session.entries) {
      if (recent.has(entry.exerciseId) || excludedExerciseIds.includes(entry.exerciseId)) continue;
      const sets = entry.sets.filter(s => !s.isWarmup);
      recent.set(entry.exerciseId, { name: entry.name, date: session.date, sets: sets.length,
        reps: sets.at(-1)?.reps, rpe: sets.at(-1)?.rpe });
    }
  }
  return { preferences, excludedExercises: context.excludedNames, completedSessions: context.history.length,
    recentExercises: [...recent.values()].slice(0, 20),
    recentFeedback: context.history.filter(s => s.feedback).slice(0, 3).map(s => s.feedback) };
}

export function resolveSuggestions(plan, context) {
  for (const day of plan.days) {
    for (const [index, suggested] of day.exercises.entries()) {
      const { name, equipment, variant, kind, ...targets } = suggested;
      if (!name.trim()) throw new Error('The exercise name was empty.');
      const key = nameKey(name);
      const keys = new Set([key, aliases.get(key)]);
      const compatible = context.candidates.filter(e => (kind === 'cardio' ? e.type === 'cardio' :
        e.type === 'strength' && !!e.isTimed === (kind === 'timed')) && e.equipmentTags.includes(equipment));
      const exact = compatible.filter(e => keys.has(nameKey(e.name)) &&
        words(variant).every(token => words(e.name + ' ' + e.equipment).includes(token)));
      const matched = exact.length === 1 ? exact[0] : null;
      const tokens = words(name);
      const ranked = compatible.map(e => ({ id: e.exerciseId, score: words(e.name).filter(w => tokens.includes(w)).length }))
        .filter(e => e.score > 0).sort((a,b) => b.score - a.score).slice(0,4).map(e => e.id);
      const item = { ...targets, exerciseId: matched?.exerciseId ?? '', targetWeightKg: null,
        loadReason: 'Choose a comfortable starting load during warm-up.' };
      if (!matched) {
        item.match = { name, equipment, variant, kind, options: ranked };
      } else if (kind === 'strength' && context.preferences.breakWeeks <= 6) {
        const cutoff = new Date(Date.parse(context.today + 'T12:00:00Z') - 42 * 86400000).toISOString().slice(0,10);
        const entry = context.history.filter(s => s.date >= cutoff).flatMap(s => s.entries)
          .find(e => e.exerciseId === matched.exerciseId && e.sets.some(s => !s.isWarmup && s.weightKg != null && s.reps >= targets.targetReps));
        const set = entry?.sets.find(s => !s.isWarmup && s.weightKg != null && s.reps >= targets.targetReps);
        if (set) { item.targetWeightKg = set.weightKg; item.loadReason = 'Logged on this exact exercise for at least the planned reps.'; }
      }
      day.exercises[index] = item;
    }
  }
  return plan;
}

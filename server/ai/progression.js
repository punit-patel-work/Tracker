import { available } from './catalog.js';
import { invalid, text } from '../validation.js';

export function readFeedback(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('Invalid workout feedback');
  const { difficulty = '', stoppedFor = '', note = '' } = value;
  if (!['', 'easy', 'manageable', 'hard'].includes(difficulty)) invalid('Choose a workout difficulty');
  if (!['', 'time', 'fatigue', 'pain', 'other'].includes(stoppedFor)) invalid('Choose a reason for stopping');
  return { difficulty, stoppedFor, note: text(note, 'Training note', 500, false) };
}

export function blocksProgression(session, entry) {
  const notes = [session.feedback?.note, session.notes, entry?.notes].join(' ');
  return session.feedback?.stoppedFor === 'pain' || /\b(pain\w*|hurt\w*|injur\w*|discomfort)\b/i.test(notes);
}

export function reviewTargets(exercise, target, history, preferences) {
  const exerciseId = String(exercise._id);
  const recent = history.flatMap(session => {
    const entry = session.entries.find(row => row.exerciseId === exerciseId);
    return entry ? [{ session, entry }] : [];
  }).slice(0, 2);
  const evidence = recent.map(({ session }) => ({ id: session.id, date: session.date, name: session.name }));
  const current = { targetSets: target.targetSets, targetReps: target.targetReps, targetWeightKg: target.targetWeightKg ?? null };
  const row = { exerciseId, name: exercise.name, current, evidence, proposed: null, reason: '' };
  const hold = reason => ({ ...row, reason });
  if (!recent.length) return hold('No recent completed workout for this exercise. Keep the current target.');
  if (exercise.archived || preferences?.excludedExerciseIds?.includes(exerciseId)) return hold('This exercise is archived or excluded. Review it in the routine editor.');
  if (recent.some(({ session, entry }) => blocksProgression(session, entry)) || blocksProgression({ notes: preferences?.limitations })) {
    return hold('Pain or injury was mentioned. Review this movement before changing its targets.');
  }
  if (preferences?.breakWeeks > 6) return hold('Your preferences record a long training break. Review your starting targets.');
  if (preferences?.equipment?.length && !available(exercise, preferences.equipment)) return hold('This movement needs equipment outside your saved preferences. Review the exercise in your routine.');
  const { session } = recent[0];
  const shorter = session.feedback?.stoppedFor === 'time' || (preferences?.minutes && recent.length === 2 &&
    recent.every(r => r.session.matchesRoutine && r.session.durationMin > preferences.minutes + 10));
  if ((shorter || session.feedback?.difficulty === 'hard' || session.feedback?.stoppedFor === 'fatigue') && current.targetSets > 1) {
    return { ...row, proposed: { ...current, targetSets: current.targetSets - 1 }, reason: shorter
      ? 'Try one fewer set to shorten the session.' : 'Your last session felt difficult. Consider one fewer working set.' };
  }
  if (exercise.type === 'cardio' || exercise.isTimed) return hold('Repeat the recorded duration and review how it feels.');
  if (session.feedback?.stoppedFor || session.feedback?.difficulty === 'hard') return hold('Repeat this target and record how the next workout feels.');
  if (recent.length < 2) return hold('Log this exercise a second time before increasing the target.');
  const sets = recent.map(r => r.entry.sets.filter(s => !s.isWarmup));
  const load = current.targetWeightKg;
  const meets = reps => sets.every(group => group.length >= current.targetSets && group.every(s =>
    s.reps >= reps && (load == null ? exercise.isBodyweight && (s.weightKg ?? 0) === 0 : s.weightKg === load) && (s.rpe == null || s.rpe < 9)));
  if (!meets(current.targetReps)) return hold('Repeat the target. The last two logs do not both show all working sets at the planned reps and load.');
  const ceiling = target.repCeiling ?? current.targetReps;
  if (current.targetReps < ceiling && !meets(ceiling)) return { ...row, proposed: { ...current, targetReps: current.targetReps + 1 },
    reason: 'Both logs met your rep target. Try one more rep within your chosen range.' };
  if (!(target.incrementKg > 0 && load > 0)) return hold('Both logs met the target. Set a working weight and your available weight step in Edit routine to get a load suggestion.');
  if (target.incrementKg > load * 0.1 || load + target.incrementKg > 2000) return hold('Your available weight step is too large for an automatic increase. Choose the next load yourself.');
  return { ...row, proposed: { ...current, targetWeightKg: Number((load + target.incrementKg).toFixed(4)) },
    reason: 'Both logs met the rep target at this weight. Try one available weight increment.' };
}

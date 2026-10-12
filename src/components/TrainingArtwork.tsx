import type { Exercise, Routine } from '../lib/types';

export type TrainingFocus = 'pull' | 'push' | 'legs' | 'conditioning' | 'strength';

/** Use the actual exercises so custom routine names work too. */
export function trainingFocus(routine: Routine, exercises: Map<string, Exercise>): TrainingFocus {
  const counts: Record<TrainingFocus, number> = { pull: 0, push: 0, legs: 0, conditioning: 0, strength: 0 };
  for (const entry of routine.exercises) {
    const exercise = exercises.get(entry.exerciseId);
    if (!exercise) continue;
    if (exercise.type === 'cardio') counts.conditioning += 1;
    else if (exercise.category === 'legs') counts.legs += 1;
    else if (exercise.category === 'back') counts.pull += 1;
    else if (['chest', 'shoulders'].includes(exercise.category)) counts.push += 1;
    else counts.strength += 1;
  }
  const specific: TrainingFocus[] = ['pull', 'push', 'legs', 'conditioning'];
  specific.sort((a, b) => counts[b] - counts[a]);
  if (counts[specific[0]] === counts[specific[1]]) return 'strength';
  return counts[specific[0]] ? specific[0] : 'strength';
}

export const focusLabels: Record<TrainingFocus, string> = {
  pull: 'Pull', push: 'Push', legs: 'Lower body', conditioning: 'Conditioning', strength: 'Strength',
};

/** Small equipment illustrations share the app's native stroke icon language. */
export default function TrainingArtwork({ focus }: { focus: TrainingFocus }) {
  return <svg className="training-art" viewBox="0 0 180 120" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {focus === 'pull' ? <>
      <path d="M42 104V17h78v87M31 105h104M48 25h64M83 26v27M57 63l26-10 27 10M61 94h44M74 94v10" />
      <rect x="115" y="64" width="22" height="8" rx="2" /><rect x="115" y="76" width="22" height="8" rx="2" /><rect x="115" y="88" width="22" height="8" rx="2" />
      <path d="M120 18h11v42" />
    </> : focus === 'push' ? <>
      <path d="M34 76h99l12 10H39zM52 86l-7 21M120 87l9 20M55 76V37M127 76V37M26 37h121" />
      <rect x="32" y="20" width="11" height="34" rx="3" /><rect x="130" y="20" width="11" height="34" rx="3" />
      <path d="M46 28v18M126 28v18" />
    </> : focus === 'legs' ? <>
      <path d="M43 103V18h94v85M33 104h27M122 104h26M45 30h90M31 59h119M78 31v9M102 31v9" />
      <rect x="37" y="42" width="12" height="33" rx="3" /><rect x="131" y="42" width="12" height="33" rx="3" /><path d="M52 48v22M128 48v22" />
    </> : focus === 'conditioning' ? <>
      <path d="M42 95h77M54 40h36l19 40M82 57l-14 28M54 40l-9-14H33M97 32l9-12h23M97 32l-8 25" />
      <circle cx="115" cy="82" r="22" /><circle cx="115" cy="82" r="13" /><circle cx="66" cy="84" r="9" /><path d="M66 84l17 5M83 89h9M58 35h29" />
    </> : <g transform="rotate(-24 90 60)">
      <path d="M25 60h129" /><rect x="39" y="32" width="17" height="56" rx="5" /><rect x="28" y="42" width="11" height="36" rx="3" />
      <rect x="122" y="32" width="17" height="56" rx="5" /><rect x="139" y="42" width="11" height="36" rx="3" /><path d="M62 54h53M62 66h53" />
    </g>}
  </svg>;
}

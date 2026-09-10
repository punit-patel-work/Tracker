/**
 * Seed exercise catalog. Written into MongoDB on first boot and re-upserted by
 * slug on every boot, so editing an entry here updates it everywhere without
 * breaking the sessions that reference it.
 *
 * Muscles are split into primary and secondary because the hard-set count on
 * the Progress page weights them differently (1.0 vs 0.5).
 */

export const CATEGORIES = [
  { id: 'chest', name: 'Chest' },
  { id: 'back', name: 'Back' },
  { id: 'legs', name: 'Legs' },
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'arms', name: 'Arms' },
  { id: 'core', name: 'Core' },
  { id: 'cardio', name: 'Cardio' },
];

/**
 * A search rather than a fixed article: curated deep links rot, and a search
 * for "<exercise> proper form" reliably surfaces video demonstrations.
 */
export function howToUrlFor(name) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`how to ${name} proper form technique`)}`;
}

/**
 * @param opts.bw     fraction of body weight the movement lifts (pull-up 1.0)
 * @param opts.timed  held for time rather than counted in reps
 * @param opts.bar    barbell-loaded, enables the plate calculator
 */
const s = (slug, name, category, equipment, primary, secondary = [], opts = {}) => ({
  slug,
  name,
  type: 'strength',
  category,
  equipment,
  primaryMuscles: primary,
  secondaryMuscles: secondary,
  muscles: [...primary, ...secondary],
  met: opts.met ?? 5,
  defaultRestSec: opts.rest ?? 90,
  isBarbell: opts.bar ?? false,
  barWeightKg: opts.bar ? (opts.barKg ?? 20) : 0,
  isBodyweight: opts.bw != null,
  bodyweightFactor: opts.bw ?? 0,
  isTimed: opts.timed ?? false,
  isDistanceBased: false,
  howToUrl: howToUrlFor(name),
});

const c = (slug, name, equipment, primary, secondary, met, opts = {}) => ({
  slug,
  name,
  type: 'cardio',
  category: 'cardio',
  equipment,
  primaryMuscles: primary,
  secondaryMuscles: secondary,
  muscles: [...primary, ...secondary],
  met,
  defaultRestSec: 60,
  isBarbell: false,
  barWeightKg: 0,
  isBodyweight: false,
  bodyweightFactor: 0,
  isTimed: false,
  isDistanceBased: opts.distance ?? false,
  howToUrl: howToUrlFor(name),
});

export const CATALOG = [
  /* ------------------------------------------------------------- chest */
  s('bench-press', 'Barbell Bench Press', 'chest', 'Barbell', ['Pectoralis Major'], ['Anterior Deltoids', 'Triceps'], { met: 6, rest: 150, bar: true }),
  s('smith-bench-press', 'Smith Machine Bench Press', 'chest', 'Machine', ['Pectoralis Major'], ['Anterior Deltoids', 'Triceps'], { met: 5.5, rest: 120 }),
  s('chest-press-machine', 'Chest Press Machine', 'chest', 'Machine', ['Pectoralis Major'], ['Anterior Deltoids', 'Triceps'], { met: 5, rest: 90 }),
  s('incline-chest-press-machine', 'Incline Chest Press Machine', 'chest', 'Machine', ['Upper Pectoralis Major'], ['Anterior Deltoids', 'Triceps'], { met: 5, rest: 90 }),
  s('incline-db-press', 'Incline Dumbbell Press', 'chest', 'Dumbbells', ['Upper Pectoralis Major'], ['Anterior Deltoids', 'Triceps'], { met: 6, rest: 120 }),
  s('pec-deck', 'Pec Deck / Butterfly Machine', 'chest', 'Machine', ['Pectoralis Major'], ['Anterior Deltoids'], { met: 4.5, rest: 60 }),
  s('cable-fly', 'Cable Crossover / Fly', 'chest', 'Cable', ['Pectoralis Major'], ['Anterior Deltoids'], { met: 4.5, rest: 60 }),
  s('assisted-dip-machine', 'Assisted Dip Machine (Chest Focus)', 'chest', 'Machine', ['Lower Pectoralis Major'], ['Triceps', 'Anterior Deltoids'], { met: 5.5, rest: 90 }),
  s('dips', 'Chest Dips', 'chest', 'Bodyweight', ['Lower Pectoralis Major'], ['Triceps'], { met: 5, rest: 120, bw: 1 }),
  s('push-ups', 'Push-Ups', 'chest', 'Bodyweight', ['Pectoralis Major'], ['Triceps', 'Core'], { met: 4.5, rest: 60, bw: 0.64 }),

  /* -------------------------------------------------------------- back */
  s('deadlift', 'Conventional Deadlift', 'back', 'Barbell', ['Erector Spinae', 'Latissimus Dorsi'], ['Glutes', 'Hamstrings'], { met: 6, rest: 210, bar: true }),
  s('barbell-row', 'Bent-Over Barbell Row', 'back', 'Barbell', ['Rhomboids', 'Latissimus Dorsi'], ['Biceps', 'Posterior Deltoids'], { met: 6, rest: 120, bar: true }),
  s('lat-pulldown', 'Lat Pulldown Machine', 'back', 'Cable / Machine', ['Latissimus Dorsi'], ['Biceps', 'Rhomboids', 'Posterior Deltoids'], { met: 5, rest: 90 }),
  s('seated-row', 'Seated Cable Row', 'back', 'Cable', ['Rhomboids', 'Middle Trapezius'], ['Latissimus Dorsi', 'Biceps', 'Posterior Deltoids'], { met: 5, rest: 90 }),
  s('t-bar-row', 'Chest-Supported T-Bar Row Machine', 'back', 'Machine', ['Rhomboids', 'Latissimus Dorsi'], ['Biceps', 'Posterior Deltoids'], { met: 5.5, rest: 105 }),
  s('pull-ups', 'Pull-Ups', 'back', 'Pull-up Bar', ['Latissimus Dorsi'], ['Biceps', 'Upper Back'], { met: 6, rest: 150, bw: 1 }),
  s('assisted-pullup-machine', 'Assisted Pull-Up Machine', 'back', 'Machine', ['Latissimus Dorsi'], ['Biceps', 'Core', 'Upper Back'], { met: 5, rest: 120 }),
  s('reverse-pec-deck', 'Reverse Pec Deck (Rear Delt Fly)', 'back', 'Machine', ['Posterior Deltoids'], ['Rhomboids', 'Middle Trapezius'], { met: 4, rest: 60 }),
  s('back-extension', 'Back Extension / Hyperextension', 'back', 'Machine', ['Erector Spinae'], ['Glutes', 'Hamstrings'], { met: 4, rest: 60 }),
  s('face-pull', 'Cable Face Pull', 'back', 'Cable', ['Posterior Deltoids', 'External Rotators'], ['Upper Trapezius', 'Rhomboids'], { met: 4, rest: 60 }),

  /* ---------------------------------------------------------- shoulders */
  s('ohp', 'Overhead Barbell Press', 'shoulders', 'Barbell', ['Anterior Deltoids'], ['Triceps', 'Upper Trapezius'], { met: 6, rest: 150, bar: true }),
  s('smith-ohp', 'Smith Machine Overhead Press', 'shoulders', 'Machine', ['Anterior Deltoids'], ['Triceps', 'Upper Trapezius'], { met: 5.5, rest: 120 }),
  s('shoulder-press-machine', 'Seated Shoulder Press Machine', 'shoulders', 'Machine', ['Anterior Deltoids', 'Lateral Deltoids'], ['Triceps', 'Upper Pectoralis'], { met: 5, rest: 90 }),
  s('db-shoulder-press', 'Dumbbell Shoulder Press', 'shoulders', 'Dumbbells', ['Anterior Deltoids'], ['Triceps', 'Upper Trapezius'], { met: 5.5, rest: 120 }),
  s('lateral-raise', 'Dumbbell Lateral Raise', 'shoulders', 'Dumbbells', ['Lateral Deltoids'], ['Upper Trapezius'], { met: 4, rest: 60 }),
  s('lateral-raise-machine', 'Lateral Raise Machine', 'shoulders', 'Machine', ['Lateral Deltoids'], ['Upper Trapezius'], { met: 4, rest: 60 }),
  s('cable-lateral-raise', 'Cable Lateral Raise', 'shoulders', 'Cable', ['Lateral Deltoids'], ['Upper Trapezius'], { met: 4, rest: 60 }),
  s('cable-front-raise', 'Cable Front Raise', 'shoulders', 'Cable', ['Anterior Deltoids'], ['Upper Pectoralis'], { met: 4, rest: 60 }),

  /* -------------------------------------------------------------- legs */
  s('back-squat', 'Barbell Back Squat', 'legs', 'Barbell', ['Quadriceps', 'Glutes'], ['Hamstrings', 'Core'], { met: 6, rest: 210, bar: true }),
  s('front-squat', 'Barbell Front Squat', 'legs', 'Barbell', ['Quadriceps'], ['Core', 'Glutes'], { met: 6, rest: 180, bar: true }),
  s('smith-squat', 'Smith Machine Squat', 'legs', 'Machine', ['Quadriceps', 'Glutes'], ['Hamstrings', 'Erector Spinae'], { met: 6, rest: 150 }),
  s('hack-squat', 'Hack Squat Machine', 'legs', 'Machine', ['Quadriceps'], ['Glutes'], { met: 6, rest: 150 }),
  s('leg-press', 'Leg Press (45° / Seated)', 'legs', 'Machine', ['Quadriceps'], ['Glutes', 'Hamstrings'], { met: 6, rest: 120 }),
  s('rdl', 'Romanian Deadlift', 'legs', 'Barbell', ['Hamstrings'], ['Glutes', 'Erector Spinae'], { met: 6, rest: 150, bar: true }),
  s('leg-extension', 'Leg Extension Machine', 'legs', 'Machine', ['Quadriceps'], [], { met: 4, rest: 75 }),
  s('leg-curl', 'Lying Leg Curl Machine', 'legs', 'Machine', ['Hamstrings'], ['Calves'], { met: 4, rest: 75 }),
  s('seated-leg-curl', 'Seated Leg Curl Machine', 'legs', 'Machine', ['Hamstrings'], ['Calves'], { met: 4, rest: 75 }),
  s('walking-lunge', 'Dumbbell Walking Lunge', 'legs', 'Dumbbells', ['Quadriceps', 'Glutes'], ['Adductors'], { met: 5.5, rest: 90 }),
  s('glute-drive', 'Glute Drive / Machine Hip Thrust', 'legs', 'Machine', ['Gluteus Maximus'], ['Hamstrings', 'Core'], { met: 5.5, rest: 105 }),
  s('hip-abduction', 'Hip Abduction Machine', 'legs', 'Machine', ['Gluteus Medius', 'Gluteus Minimus'], ['Tensor Fasciae Latae'], { met: 3.5, rest: 60 }),
  s('hip-adduction', 'Hip Adduction Machine', 'legs', 'Machine', ['Adductors'], [], { met: 3.5, rest: 60 }),
  s('calf-raise', 'Standing Calf Raise Machine', 'legs', 'Machine', ['Calves'], ['Soleus'], { met: 4, rest: 60 }),
  s('seated-calf-raise', 'Seated Calf Raise Machine', 'legs', 'Machine', ['Soleus'], ['Calves'], { met: 3.5, rest: 60 }),

  /* -------------------------------------------------------------- arms */
  s('barbell-curl', 'Barbell Curl', 'arms', 'Barbell / EZ Bar', ['Biceps Brachii'], ['Forearms'], { met: 4, rest: 75, bar: true }),
  s('cable-curl', 'Cable Bicep Curl', 'arms', 'Cable', ['Biceps Brachii'], ['Brachialis', 'Forearms'], { met: 4, rest: 60 }),
  s('preacher-curl-machine', 'Preacher Curl Machine', 'arms', 'Machine', ['Biceps Brachii'], ['Forearms'], { met: 4, rest: 60 }),
  s('hammer-curl', 'Dumbbell Hammer Curl', 'arms', 'Dumbbells', ['Brachialis', 'Brachioradialis'], ['Biceps Brachii'], { met: 4, rest: 60 }),
  s('cable-hammer-curl', 'Cable Hammer Curl (Rope)', 'arms', 'Cable', ['Brachialis', 'Brachioradialis'], ['Biceps Brachii'], { met: 4, rest: 60 }),
  s('rope-pushdown', 'Cable Triceps Pushdown', 'arms', 'Cable', ['Triceps Brachii'], ['Forearms'], { met: 4, rest: 60 }),
  s('triceps-extension-machine', 'Triceps Extension Machine', 'arms', 'Machine', ['Triceps Brachii'], [], { met: 4, rest: 60 }),
  s('overhead-triceps-cable', 'Cable Overhead Triceps Extension', 'arms', 'Cable', ['Triceps Brachii'], ['Forearms'], { met: 4, rest: 60 }),
  s('skullcrusher', 'EZ-Bar Skullcrusher', 'arms', 'EZ Bar', ['Triceps Brachii'], [], { met: 4.5, rest: 75 }),

  /* -------------------------------------------------------------- core */
  s('ab-crunch-machine', 'Abdominal Crunch Machine', 'core', 'Machine', ['Rectus Abdominis'], ['Obliques'], { met: 4, rest: 60 }),
  s('woodchopper', 'Cable Woodchopper / Torso Rotation', 'core', 'Cable', ['Obliques'], ['Rectus Abdominis', 'Transverse Abdominis'], { met: 4.5, rest: 60 }),
  s('captains-chair', "Captain's Chair Leg Raise", 'core', 'Bodyweight / Machine', ['Lower Rectus Abdominis'], ['Hip Flexors', 'Obliques'], { met: 5, rest: 60, bw: 0.5 }),
  s('decline-crunch', 'Decline Ab Bench Crunch', 'core', 'Bodyweight / Bench', ['Rectus Abdominis'], ['Hip Flexors'], { met: 4.5, rest: 60, bw: 0.4 }),
  s('cable-crunch', 'Cable Crunch', 'core', 'Cable', ['Rectus Abdominis'], ['Obliques'], { met: 4, rest: 60 }),
  s('hanging-leg-raise', 'Hanging Leg Raise', 'core', 'Pull-up Bar', ['Lower Rectus Abdominis'], ['Hip Flexors'], { met: 4, rest: 60, bw: 0.5 }),
  s('plank', 'Front Plank', 'core', 'Bodyweight', ['Transverse Abdominis'], ['Rectus Abdominis'], { met: 3.5, rest: 45, timed: true, bw: 0.6 }),

  /* ------------------------------------------------------------ cardio */
  c('treadmill', 'Treadmill (Running / Walking)', 'Cardio Machine', ['Quadriceps', 'Calves', 'Glutes'], ['Core'], 8, { distance: true }),
  c('incline-walk', 'Incline Treadmill Walk', 'Cardio Machine', ['Glutes', 'Calves'], ['Hamstrings'], 5.3, { distance: true }),
  c('outdoor-run', 'Outdoor Run', 'None', ['Quadriceps', 'Calves'], ['Glutes', 'Core'], 9.8, { distance: true }),
  c('stair-climber', 'Stair Climber / StairMaster', 'Cardio Machine', ['Glutes', 'Quadriceps', 'Calves'], ['Hamstrings', 'Core'], 9),
  c('bike', 'Stationary Bike (Upright)', 'Cardio Machine', ['Quadriceps', 'Calves'], ['Hamstrings', 'Glutes'], 7, { distance: true }),
  c('recumbent-bike', 'Recumbent Bike', 'Cardio Machine', ['Quadriceps', 'Hamstrings'], ['Glutes', 'Calves'], 5.5, { distance: true }),
  c('rower', 'Rowing Machine (Ergometer)', 'Cardio Machine', ['Latissimus Dorsi', 'Quadriceps', 'Rhomboids'], ['Glutes', 'Biceps', 'Core'], 8.5, { distance: true }),
  c('elliptical', 'Elliptical Trainer', 'Cardio Machine', ['Quadriceps', 'Glutes', 'Hamstrings'], ['Chest', 'Back', 'Arms'], 7),
  c('air-bike', 'Assault / Air Bike', 'Cardio Machine', ['Quadriceps', 'Calves', 'Anterior Deltoids'], ['Triceps', 'Core'], 10.5),
  c('skierg', 'SkiErg Machine', 'Cardio Machine', ['Latissimus Dorsi', 'Triceps', 'Core'], ['Rectus Abdominis', 'Glutes'], 9),
  c('jacobs-ladder', 'Jacobs Ladder Machine', 'Cardio Machine', ['Quadriceps', 'Calves', 'Core'], ['Glutes', 'Anterior Deltoids'], 11),
  c('jump-rope', 'Jump Rope', 'Rope', ['Calves'], ['Anterior Deltoids', 'Core'], 12.3),
];

/** Starter routines created with every new account so day one isn't a blank page. */
export const STARTER_ROUTINES = [
  {
    name: 'Push Day',
    note: 'Chest, shoulders, triceps',
    exercises: [
      { slug: 'chest-press-machine', targetSets: 4, targetReps: 8 },
      { slug: 'shoulder-press-machine', targetSets: 3, targetReps: 10 },
      { slug: 'incline-chest-press-machine', targetSets: 3, targetReps: 10 },
      { slug: 'lateral-raise-machine', targetSets: 3, targetReps: 15 },
      { slug: 'rope-pushdown', targetSets: 3, targetReps: 12 },
    ],
  },
  {
    name: 'Pull Day',
    note: 'Back and biceps',
    exercises: [
      { slug: 'lat-pulldown', targetSets: 4, targetReps: 10 },
      { slug: 'seated-row', targetSets: 3, targetReps: 10 },
      { slug: 't-bar-row', targetSets: 3, targetReps: 10 },
      { slug: 'face-pull', targetSets: 3, targetReps: 15 },
      { slug: 'cable-curl', targetSets: 3, targetReps: 12 },
    ],
  },
  {
    name: 'Leg Day',
    note: 'Quads, hamstrings, glutes, calves',
    exercises: [
      { slug: 'leg-press', targetSets: 4, targetReps: 10 },
      { slug: 'hack-squat', targetSets: 3, targetReps: 10 },
      { slug: 'leg-curl', targetSets: 3, targetReps: 12 },
      { slug: 'leg-extension', targetSets: 3, targetReps: 12 },
      { slug: 'calf-raise', targetSets: 4, targetReps: 15 },
    ],
  },
  {
    name: 'Conditioning',
    note: 'Cardio and core',
    exercises: [
      { slug: 'rower', targetSets: 1, targetReps: 0 },
      { slug: 'stair-climber', targetSets: 1, targetReps: 0 },
      { slug: 'ab-crunch-machine', targetSets: 3, targetReps: 15 },
      { slug: 'plank', targetSets: 3, targetReps: 1 },
    ],
  },
];

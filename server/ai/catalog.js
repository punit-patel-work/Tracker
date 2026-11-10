import { createHash } from 'node:crypto';
// Explicit movement families; unknown movements have no automatic substitutions.
export const FAMILIES = {
  'flat chest press': ['chest-press-machine','smith-machine-bench-press','plate-loaded-chest-press','barbell-flat-bench-press','dumbbell-flat-bench-press','dumbbell-neutral-grip-bench-press','standing-cable-chest-press','resistance-band-chest-press'],
  'incline chest press': ['incline-chest-press-machine','barbell-incline-bench-press','dumbbell-incline-bench-press','smith-machine-incline-bench-press'],
  'chest fly': ['pec-deck-butterfly-machine','cable-crossover-flyes','dumbbell-flat-fly','flat-bench-cable-fly','resistance-band-chest-fly'],
  'vertical pull': ['lat-pulldown-machine','wide-grip-lat-pulldown','neutral-grip-lat-pulldown','underhand-lat-pulldown','single-arm-cable-lat-pulldown','half-kneeling-cable-lat-pulldown','assisted-pull-up-machine','pull-up-overhand-grip','neutral-grip-pull-up','resistance-band-assisted-pull-up'],
  'horizontal row': ['seated-cable-row','chest-supported-t-bar-row-machine','plate-loaded-low-row','iso-lateral-seated-row-machine','chest-supported-row-machine','single-arm-seated-cable-row','standing-cable-row','one-arm-dumbbell-row','chest-supported-dumbbell-row','dumbbell-bent-over-row','barbell-bent-over-row','barbell-seal-row','landmine-t-bar-row','smith-machine-bent-over-row','inverted-row','suspension-row-trx-row','resistance-band-seated-row'],
  'shoulder press': ['seated-shoulder-press-machine','smith-machine-overhead-press','seated-dumbbell-shoulder-press','standing-dumbbell-shoulder-press','neutral-grip-dumbbell-shoulder-press','standing-barbell-overhead-press-military-press','seated-barbell-shoulder-press','cable-shoulder-press','resistance-band-overhead-press'],
  'lateral raise': ['lateral-raise-machine','cable-lateral-raise','standing-dumbbell-lateral-raise','seated-dumbbell-lateral-raise','leaning-dumbbell-lateral-raise','behind-body-cable-lateral-raise'],
  'rear delt fly': ['reverse-pec-deck-rear-delt-fly','chest-supported-dumbbell-reverse-fly','bent-over-dumbbell-reverse-fly','cable-reverse-fly','single-arm-cable-rear-delt-fly'],
  'bilateral squat': ['smith-machine-squat','barbell-back-squat-high-bar','barbell-front-squat','safety-bar-squat','goblet-squat','dumbbell-squat','dumbbell-front-squat','landmine-squat','bodyweight-squat'],
  'supported squat press': ['leg-press-45-degree-seated','horizontal-seated-leg-press','hack-squat-machine','plate-loaded-squat-v-squat-power-squat-machine','pendulum-squat','belt-squat'],
  'split squat': ['barbell-split-squat','dumbbell-split-squat','dumbbell-bulgarian-split-squat','smith-machine-split-squat','smith-machine-bulgarian-split-squat','bodyweight-split-squat'],
  'reverse lunge': ['barbell-reverse-lunge','dumbbell-reverse-lunge','smith-machine-reverse-lunge','bodyweight-reverse-lunge'],
  'romanian deadlift': ['barbell-romanian-deadlift','dumbbell-romanian-deadlift','smith-machine-romanian-deadlift'],
  'hip thrust': ['glute-drive-machine-hip-thrust','barbell-hip-thrust','smith-machine-hip-thrust','dumbbell-hip-thrust'],
  'knee extension': ['leg-extension-machine','single-leg-extension'],
  'knee flexion': ['seated-leg-curl-machine','lying-leg-curl-machine','standing-leg-curl-machine','single-leg-seated-leg-curl','single-leg-lying-leg-curl','stability-ball-hamstring-curl','slider-hamstring-curl','resistance-band-leg-curl'],
  'standing calf raise': ['standing-calf-raise-machine','bodyweight-standing-calf-raise','dumbbell-standing-calf-raise','smith-machine-calf-raise','leg-press-calf-raise'],
  'seated calf raise': ['seated-calf-raise-machine','dumbbell-seated-calf-raise'],
  'supinated curl': ['cable-bicep-curl','preacher-curl-machine','standing-dumbbell-curl','alternating-dumbbell-curl','seated-dumbbell-curl','dumbbell-preacher-curl','dumbbell-concentration-curl','standing-barbell-curl','ez-bar-curl','resistance-band-biceps-curl'],
  'triceps pushdown': ['cable-triceps-pushdown','rope-triceps-pushdown','straight-bar-triceps-pushdown','v-bar-triceps-pushdown','single-arm-cable-triceps-pushdown','resistance-band-triceps-pushdown'],
  'overhead triceps extension': ['cable-overhead-triceps-extension','single-arm-overhead-cable-triceps-extension','two-hand-dumbbell-overhead-triceps-extension','single-arm-dumbbell-overhead-triceps-extension','ez-bar-overhead-triceps-extension','resistance-band-overhead-triceps-extension'],
  'crunch': ['abdominal-crunch-machine','kneeling-cable-crunch','standing-cable-crunch','floor-crunch','stability-ball-crunch','weighted-floor-crunch'],
  'front plank': ['forearm-plank','high-plank','kneeling-plank','long-lever-plank','rkc-plank'],
  'side plank': ['side-plank','kneeling-side-plank'],
  'pallof press': ['cable-pallof-press','half-kneeling-pallof-press','resistance-band-pallof-press'],
  'push up': ['standard-push-up','incline-push-up','kneeling-push-up','push-up-on-handles','weighted-push-up','resistance-band-push-up'],
};
const lookup = new Map(Object.entries(FAMILIES).flatMap(([group, slugs]) => slugs.map(slug => [slug, group])));
export function movement(e) { return lookup.get(e.slug) ?? null; }
export { available, equipmentTags } from '../../shared/equipment.js';
export function catalogFingerprint(list) {
  return createHash('sha256').update(JSON.stringify(list.map(e => [String(e._id), e.slug, e.name, e.equipment, e.type, e.isTimed, e.archived, e.primaryMuscles, e.updatedAt]).sort())).digest('hex');
}
export function alternativeCandidates(source, list) {
  const group = movement(source);
  if (!group) return [];
  return list.filter(e => String(e._id) !== String(source._id) && !e.archived && e.type === source.type &&
    !!e.isTimed === !!source.isTimed && movement(e) === group);
}
export const EQUIPMENT = ['full_gym','bodyweight','dumbbell','barbell','bench','cable','machine','smith','band','kettlebell','pullup_bar','suspension','ball','other'];

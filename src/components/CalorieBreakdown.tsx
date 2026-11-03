import { metKcal } from '../../shared/engine.js';
import { fromKg, num, weightLabel } from '../lib/format';
import type { Totals, Units } from '../lib/types';

export default function CalorieBreakdown({ totals, bodyWeightKg, units, live = false }: {
  totals: Partial<Totals>; bodyWeightKg: number; units: Units; live?: boolean;
}) {
  return (
    <details className="calorie-breakdown">
      <summary>How are calories estimated?</summary>
      <div className="calorie-content">
        <p>Based on your recorded body weight of <strong>{num(fromKg(bodyWeightKg, units), 1)} {weightLabel(units)}</strong> and the activity you log.
          This is an estimate, not a measurement from a heart-rate sensor.</p>
        <dl className="calorie-totals">
          <div><dt>Strength + estimated rest</dt><dd>{num(totals.strengthKcal ?? 0, 1)} kcal</dd></div>
          <div><dt>Cardio</dt><dd>{num(totals.cardioKcal ?? 0, 1)} kcal</dd></div>
          <div><dt>Total estimated burn</dt><dd>{num(totals.totalKcal ?? 0, 1)} kcal</dd></div>
        </dl>
        <p><strong>Strength:</strong> each rep is estimated at 3 seconds of activity; timed holds use their logged seconds.
          Each included set also adds its saved rest time, or the exercise’s default rest (90 seconds if none is set).
          Activity uses the exercise’s effort rating; rest uses a lower rating of 1.5. Warm-up sets are excluded.</p>
        <p><strong>Cardio:</strong> uses logged minutes and the exercise’s effort rating, adjusted by intensity.
          For the general treadmill, upright bike and rowing machine entries, distance plus time selects a speed-based rating instead. Specific pace or wattage entries retain their listed activity rating.
          Incline and resistance level are saved for reference but do not change this estimate.</p>
        <p><strong>The formula:</strong> calories = effort rating (MET) × 3.5 × body weight in kg ÷ 200 × minutes.
          MET describes an activity’s energy cost relative to rest. For example, 10 minutes at 5 MET using your
          recorded {num(bodyWeightKg, 1)} kg gives about {num(metKcal(5, bodyWeightKg, 10))} kcal.</p>
        <p className="hint">The workout timer and weight lifted do not directly change calorie burn. These are gross calories,
          including resting energy during the counted activity and rest periods, rather than extra calories above rest.
          {live && ' Only sets and cardio marked complete count. Prefilled values do not add calories.'}</p>
      </div>
    </details>
  );
}

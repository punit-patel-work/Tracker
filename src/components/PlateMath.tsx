import { platesPerSide } from '../../shared/engine.js';
import { num, weightLabel } from '../lib/format';
import type { Units } from '../lib/types';

/**
 * What to actually hang on the bar. Shown only for barbell lifts, because doing
 * this arithmetic between sets is where people load the wrong weight.
 */
export default function PlateMath({
  totalKg,
  barKg,
  units,
}: {
  totalKg: number;
  barKg: number;
  units: Units;
}) {
  const result = platesPerSide(totalKg, barKg || 20, units);
  if (!result) return null;

  const unit = weightLabel(units);
  const counts = new Map<number, number>();
  for (const p of result.plates) counts.set(p, (counts.get(p) ?? 0) + 1);

  return (
    <div className="plate-math">
      <span className="plate-caption">Per side</span>
      {result.plates.length === 0 ? (
        <span className="muted">bar only</span>
      ) : (
        [...counts.entries()].map(([plate, count]) => (
          <span key={plate} className="plate-chip">
            {count > 1 && <b>{count}×</b>}
            {num(plate, 2)}
          </span>
        ))
      )}
      {result.leftover > 0.01 && (
        <span className="plate-warn" title="Standard plates cannot make this exactly">
          +{num(result.leftover, 2)} {unit} short
        </span>
      )}
    </div>
  );
}

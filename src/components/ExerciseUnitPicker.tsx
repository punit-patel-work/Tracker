import { useExerciseUnits } from '../lib/exerciseUnits';
import { weightLabel } from '../lib/format';
import type { Units } from '../lib/types';

export default function ExerciseUnitPicker({ id, name }: { id: string; name: string }) {
  const { profileUnit, choice, setChoice } = useExerciseUnits();
  return (
    <label className="exercise-unit-picker">
      Weight unit
      <select aria-label={`Weight unit for ${name}`} value={choice(id)}
        onChange={event => {
          // Some native pickers leave the weight input focused until after the selection.
          if (document.activeElement instanceof HTMLInputElement) document.activeElement.blur();
          setChoice(id, event.target.value as Units | '');
        }}>
        <option value="">Profile ({weightLabel(profileUnit)})</option>
        <option value="metric">kg</option>
        <option value="imperial">lb</option>
      </select>
    </label>
  );
}

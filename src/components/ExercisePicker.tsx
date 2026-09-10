import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, useApp } from '../state/app';
import { api } from '../lib/api';
import * as I from './Icon';
import type { Exercise } from '../lib/types';

/**
 * Bottom sheet exercise picker. Favourites float to the top of each category —
 * that is what the old "customizer" page was really for, and it belongs here,
 * at the moment of choosing, not on a separate admin screen.
 */
export default function ExercisePicker({
  onPick,
  onClose,
  exclude = [],
  multi = false,
}: {
  onPick: (exercise: Exercise) => void;
  onClose: () => void;
  exclude?: string[];
  multi?: boolean;
}) {
  const { exercises, user, toggleFavorite, isFavorite, reloadExercises } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [creating, setCreating] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  // Escape closes the sheet, and the page behind it must not scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = exercises.filter((e) => {
      if (category !== 'all' && e.category !== category) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q) ||
        e.muscles.some((m) => m.toLowerCase().includes(q))
      );
    });
    // Favourites first, then alphabetical.
    return filtered.sort((a, b) => {
      const fa = isFavorite(a.category, a.id) ? 0 : 1;
      const fb = isFavorite(b.category, b.id) ? 0 : 1;
      return fa - fb || a.name.localeCompare(b.name);
    });
  }, [exercises, category, query, isFavorite, user]);

  const choose = (ex: Exercise) => {
    onPick(ex);
    if (multi) setPicked((p) => [...p, ex.id]);
    else onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Add exercise">
        <div className="sheet-grip" aria-hidden />
        <div className="sheet-head">
          <h3>Add exercise</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <I.X size={19} />
          </button>
        </div>

        {creating ? (
          <NewExerciseForm
            defaultCategory={category === 'all' ? 'chest' : category}
            onCancel={() => setCreating(false)}
            onCreated={async (ex) => {
              await reloadExercises();
              setCreating(false);
              choose(ex);
            }}
          />
        ) : (
          <>
            <div className="sheet-controls">
              <div className="search">
                <I.Search size={17} />
                <input
                  className="input"
                  placeholder="Search exercise, muscle or kit..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  aria-label="Search exercises"
                />
              </div>
              <div className="chip-row scroll-x">
                <button className={`chip ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    className={`chip ${category === c.id ? 'active' : ''}`}
                    onClick={() => setCategory(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sheet-list">
              {list.length === 0 && <p className="muted center">Nothing matches. Create it below.</p>}
              {list.map((ex) => {
                const used = exclude.includes(ex.id) || picked.includes(ex.id);
                const fav = isFavorite(ex.category, ex.id);
                return (
                  <div key={ex.id} className={`pick-row ${used ? 'used' : ''}`}>
                    <button
                      className="pick-main"
                      onClick={() => !used && choose(ex)}
                      disabled={used}
                      aria-label={`Add ${ex.name}`}
                    >
                      <div>
                        <div className="pick-name">
                          {ex.name}
                          {ex.isCustom && <span className="tag small">Custom</span>}
                        </div>
                        <div className="pick-meta">
                          {ex.equipment} · {(ex.primaryMuscles?.length ? ex.primaryMuscles : ex.muscles).join(', ')}
                        </div>
                      </div>
                      <span className="pick-action">{used ? <I.Check size={18} /> : <I.Plus size={18} />}</span>
                    </button>
                    <a
                      className="how-to"
                      href={ex.howToUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={`How to perform ${ex.name}`}
                      aria-label={`How to perform ${ex.name} (opens in a new tab)`}
                    >
                      <I.HelpCircle size={17} />
                    </a>
                    <button
                      className={`star ${fav ? 'on' : ''}`}
                      onClick={() => void toggleFavorite(ex.category, ex.id)}
                      aria-label={fav ? `Unpin ${ex.name}` : `Pin ${ex.name} to the top`}
                      aria-pressed={fav}
                    >
                      <I.Star size={17} filled={fav} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="sheet-foot">
              <button className="btn btn-ghost wide" onClick={() => setCreating(true)}>
                <I.Plus size={16} /> Create a new exercise
              </button>
              {multi && (
                <button className="btn btn-primary wide" onClick={onClose}>
                  Done{picked.length ? ` (${picked.length})` : ''}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NewExerciseForm({
  defaultCategory,
  onCancel,
  onCreated,
}: {
  defaultCategory: string;
  onCancel: () => void;
  onCreated: (ex: Exercise) => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [equipment, setEquipment] = useState('');
  const [muscles, setMuscles] = useState('');
  const [isBarbell, setIsBarbell] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      const { exercise } = await api.createExercise({
        name,
        category,
        type: category === 'cardio' ? 'cardio' : 'strength',
        equipment,
        muscles: muscles.split(',').map((m) => m.trim()).filter(Boolean),
        isBarbell,
        isDistanceBased: category === 'cardio',
      });
      onCreated(exercise);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create that exercise');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sheet-body">
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="ne-name">Name</label>
          <input id="ne-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="ne-cat">Category</label>
          <select id="ne-cat" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ne-eq">Equipment</label>
          <input id="ne-eq" className="input" value={equipment} onChange={(e) => setEquipment(e.target.value)} />
        </div>
        <div className="field full">
          <label htmlFor="ne-mus">Muscles (comma separated)</label>
          <input id="ne-mus" className="input" value={muscles} onChange={(e) => setMuscles(e.target.value)} />
        </div>
        {category !== 'cardio' && (
          <label className="check-line full">
            <input type="checkbox" checked={isBarbell} onChange={(e) => setIsBarbell(e.target.checked)} />
            Loaded on a barbell (enables the plate calculator)
          </label>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="sheet-foot">
        <button className="btn btn-ghost wide" onClick={onCancel}>
          Back
        </button>
        <button className="btn btn-primary wide" onClick={submit} disabled={!name.trim() || busy}>
          {busy ? 'Creating...' : 'Create & add'}
        </button>
      </div>
    </div>
  );
}

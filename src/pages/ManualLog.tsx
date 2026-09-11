import { useEffect, useState } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import { distanceLabel, fromKg, fromKm, shiftDays, toKg, toKm, todayISO, weightLabel } from '../lib/format';
import ExercisePicker from '../components/ExercisePicker';
import * as I from '../components/Icon';
import type { Entry, Exercise } from '../lib/types';

/**
 * Backfill a workout you forgot to log. Writes straight to history without
 * touching the active-session slot, so this works mid-workout too.
 */
export default function ManualLog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { user, byId } = useApp();
  const [date, setDate] = useState(shiftDays(todayISO(), -1));
  const [name, setName] = useState('');
  const [durationMin, setDurationMin] = useState('45');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const units = user?.units ?? 'metric';
  const unit = weightLabel(units);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const patchSet = (exerciseId: string, i: number, patch: Partial<Entry['sets'][number]>) =>
    setEntries((list) =>
      list.map((e) => (e.exerciseId === exerciseId ? { ...e, sets: e.sets.map((s, j) => (j === i ? { ...s, ...patch } : s)) } : e)),
    );

  const addExercise = (ex: Exercise) =>
    setEntries((list) => [
      ...list,
      {
        exerciseId: ex.id,
        sets:
          ex.type === 'cardio'
            ? []
            : Array.from({ length: 3 }, () => ({ reps: null, weightKg: null, done: true, isWarmup: false })),
        cardio: ex.type === 'cardio' ? { durationMin: null, distanceKm: null, intensity: 'moderate', done: true } : null,
      },
    ]);

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      // Drop rows left blank rather than writing empty sets into history.
      const cleaned = entries
        .map((e) => ({
          ...e,
          sets: e.sets.filter((s) => (s.reps ?? 0) > 0 || (s.durationSec ?? 0) > 0),
        }))
        .filter((e) => e.sets.length > 0 || e.cardio?.durationMin);

      if (!cleaned.length) throw new Error('Fill in at least one set');

      await api.logManual({ date, name: name.trim(), durationMin: Number(durationMin) || 45, entries: cleaned });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save that workout');
      setBusy(false);
    }
  };

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div className="sheet tall" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Log a past workout">
        <div className="sheet-grip" aria-hidden />
        <div className="sheet-head">
          <h3>Log a past workout</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <I.X size={19} />
          </button>
        </div>

        <div className="sheet-body">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="ml-date">Date</label>
              <input
                id="ml-date"
                className="input"
                type="date"
                max={todayISO()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="ml-dur">Duration (min)</label>
              <input
                id="ml-dur"
                className="input"
                inputMode="numeric"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />
            </div>
            <div className="field full">
              <label htmlFor="ml-name">Name (optional)</label>
              <input
                id="ml-name"
                className="input"
                placeholder="Push Day"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <p className="hint" style={{ marginBottom: 12 }}>
            Body weight is taken from your closest weigh-in on or before this date.
          </p>

          {entries.map((entry) => {
            const ex = byId.get(entry.exerciseId);
            if (!ex) return null;
            return (
              <div className="ex-block" key={entry.exerciseId}>
                <div className="ex-head" style={{ marginBottom: 10 }}>
                  <h4>{ex.name}</h4>
                  <div className="ex-head-actions">
                    <button
                      className="icon-btn sm danger"
                      onClick={() => setEntries((l) => l.filter((x) => x.exerciseId !== entry.exerciseId))}
                      aria-label={`Remove ${ex.name}`}
                    >
                      <I.Trash size={14} />
                    </button>
                  </div>
                </div>

                {ex.type === 'cardio' ? (
                  <div className="cardio-fields">
                    <div className="field">
                      <label>Minutes</label>
                      <input
                        className="input"
                        inputMode="numeric"
                        placeholder="30"
                        value={entry.cardio?.durationMin ?? ''}
                        onChange={(e) =>
                          setEntries((l) =>
                            l.map((x) => {
                              if (x.exerciseId !== entry.exerciseId) return x;
                              const cur = x.cardio ?? {
                                durationMin: null,
                                distanceKm: null,
                                incline: null,
                                level: null,
                                intensity: 'moderate',
                                done: true,
                              };
                              return {
                                ...x,
                                cardio: { ...cur, durationMin: e.target.value === '' ? null : Number(e.target.value) },
                              };
                            }),
                          )
                        }
                      />
                    </div>
                    {ex.isDistanceBased && (
                      <div className="field">
                        <label>Distance ({distanceLabel(units)})</label>
                        <input
                          className="input"
                          inputMode="decimal"
                          placeholder="1.25"
                          defaultValue={entry.cardio?.distanceKm == null ? '' : String(fromKm(entry.cardio.distanceKm, units))}
                          onBlur={(e) =>
                            setEntries((l) =>
                              l.map((x) => {
                                if (x.exerciseId !== entry.exerciseId) return x;
                                const cur = x.cardio ?? {
                                  durationMin: null,
                                  distanceKm: null,
                                  incline: null,
                                  level: null,
                                  intensity: 'moderate',
                                  done: true,
                                };
                                return {
                                  ...x,
                                  cardio: { ...cur, distanceKm: e.target.value === '' ? null : toKm(Number(e.target.value), units) },
                                };
                              }),
                            )
                          }
                        />
                      </div>
                    )}
                    <div className="field">
                      <label>Incline (%)</label>
                      <input
                        className="input"
                        inputMode="decimal"
                        placeholder="3.5"
                        value={entry.cardio?.incline ?? ''}
                        onChange={(e) =>
                          setEntries((l) =>
                            l.map((x) => {
                              if (x.exerciseId !== entry.exerciseId) return x;
                              const cur = x.cardio ?? {
                                durationMin: null,
                                distanceKm: null,
                                incline: null,
                                level: null,
                                intensity: 'moderate',
                                done: true,
                              };
                              return {
                                ...x,
                                cardio: { ...cur, incline: e.target.value === '' ? null : Number(e.target.value) },
                              };
                            }),
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Level / Resistance</label>
                      <input
                        className="input"
                        inputMode="numeric"
                        placeholder="5"
                        value={entry.cardio?.level ?? ''}
                        onChange={(e) =>
                          setEntries((l) =>
                            l.map((x) => {
                              if (x.exerciseId !== entry.exerciseId) return x;
                              const cur = x.cardio ?? {
                                durationMin: null,
                                distanceKm: null,
                                incline: null,
                                level: null,
                                intensity: 'moderate',
                                done: true,
                              };
                              return {
                                ...x,
                                cardio: { ...cur, level: e.target.value === '' ? null : Number(e.target.value) },
                              };
                            }),
                          )
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {entry.sets.map((set, i) => (
                      <div className="manual-set" key={i}>
                        <span className="set-no">{i + 1}</span>
                        {ex.isTimed ? (
                          <input
                            className="mini-input"
                            inputMode="numeric"
                            placeholder="secs"
                            value={set.durationSec ?? ''}
                            onChange={(e) =>
                              patchSet(entry.exerciseId, i, {
                                durationSec: e.target.value === '' ? null : Number(e.target.value),
                              })
                            }
                            aria-label={`Set ${i + 1} seconds`}
                          />
                        ) : (
                          <>
                            <input
                              className="mini-input"
                              inputMode="decimal"
                              placeholder={ex.isBodyweight ? `+${unit}` : unit}
                              value={set.weightKg == null ? '' : Math.round(fromKg(set.weightKg, units) * 100) / 100}
                              onChange={(e) =>
                                patchSet(entry.exerciseId, i, {
                                  weightKg: e.target.value === '' ? null : toKg(Number(e.target.value), units),
                                })
                              }
                              aria-label={`Set ${i + 1} weight`}
                            />
                            <span className="times">×</span>
                            <input
                              className="mini-input"
                              inputMode="numeric"
                              placeholder="reps"
                              value={set.reps ?? ''}
                              onChange={(e) =>
                                patchSet(entry.exerciseId, i, {
                                  reps: e.target.value === '' ? null : Number(e.target.value),
                                })
                              }
                              aria-label={`Set ${i + 1} reps`}
                            />
                          </>
                        )}
                        <button
                          className="set-remove"
                          onClick={() =>
                            setEntries((l) =>
                              l.map((x) =>
                                x.exerciseId === entry.exerciseId
                                  ? { ...x, sets: x.sets.filter((_, j) => j !== i) }
                                  : x,
                              ),
                            )
                          }
                          aria-label={`Delete set ${i + 1}`}
                        >
                          <I.X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="add-set"
                      onClick={() =>
                        setEntries((l) =>
                          l.map((x) =>
                            x.exerciseId === entry.exerciseId
                              ? {
                                  ...x,
                                  sets: [
                                    ...x.sets,
                                    {
                                      reps: x.sets[x.sets.length - 1]?.reps ?? null,
                                      weightKg: x.sets[x.sets.length - 1]?.weightKg ?? null,
                                      done: true,
                                      isWarmup: false,
                                    },
                                  ],
                                }
                              : x,
                          ),
                        )
                      }
                    >
                      <I.Plus size={15} /> Add set
                    </button>
                  </>
                )}
              </div>
            );
          })}

          <button className="btn btn-ghost wide big" style={{ marginTop: 12 }} onClick={() => setPicking(true)}>
            <I.Plus size={17} /> Add exercise
          </button>

          {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
        </div>

        <div className="sheet-foot">
          <button className="btn btn-ghost wide" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary wide" onClick={save} disabled={busy || !entries.length}>
            {busy ? 'Saving…' : 'Save workout'}
          </button>
        </div>
      </div>

      {picking && (
        <ExercisePicker
          multi
          exclude={entries.map((e) => e.exerciseId)}
          onPick={addExercise}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

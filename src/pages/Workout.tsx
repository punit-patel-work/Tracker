import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../state/app';
import { useWorkout } from '../state/workout';
import {
  clock,
  distanceLabel,
  fromKg,
  fromKm,
  num,
  relativeDay,
  toKg,
  toKm,
  weightLabel,
} from '../lib/format';
import { effectiveLoadKg, estimated1RM, suggestNextWeight } from '../../shared/engine.js';
import ExercisePicker from '../components/ExercisePicker';
import PlateMath from '../components/PlateMath';
import { useTick } from '../components/common';
import * as I from '../components/Icon';
import type { Entry, Exercise, Intensity, NewPR, PreviousPerformance, Session, Units, WorkSet } from '../lib/types';

const INTENSITIES: Intensity[] = ['light', 'moderate', 'vigorous', 'max'];

export default function Workout({ go }: { go: (page: string) => void }) {
  const { user, byId } = useApp();
  const w = useWorkout();
  const [picking, setPicking] = useState(false);
  const [summary, setSummary] = useState<{ session: Session | null; newPRs: NewPR[] } | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [finishError, setFinishError] = useState('');
  const now = useTick(1000, !!w.session);

  const units = user?.units ?? 'metric';

  if (!w.session) {
    return summary ? (
      <Summary data={summary} units={units} onClose={() => go('home')} />
    ) : (
      <div className="card empty">
        <I.Dumbbell size={40} />
        <h3>No workout running</h3>
        <p>Start one from the home screen and it will appear here.</p>
        <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => go('home')}>
          Go to home
        </button>
      </div>
    );
  }

  const elapsed = now - new Date(w.session.startedAt).getTime();

  const finish = async () => {
    setFinishError('');
    try {
      const result = await w.finish();
      setSummary({ session: result.session, newPRs: result.newPRs });
    } catch {
      // Finishing needs the server (it decides PRs). The workout stays open and
      // every set is still on the device, so nothing is lost by waiting.
      setFinishError('No connection. Your sets are saved on this device — reconnect and finish again.');
    }
  };

  return (
    <div className="workout">
      <div className="workout-top">
        <button className="icon-btn" onClick={() => go('home')} aria-label="Back to home">
          <I.ArrowLeft size={19} />
        </button>
        <div className="workout-title">
          <strong>{w.session.name}</strong>
          <span className={`save-dot ${w.saveState}`}>
            {w.saveState === 'saving' && 'Saving…'}
            {w.saveState === 'saved' && 'Saved'}
            {w.saveState === 'offline' && 'Saved on device — will sync'}
            {w.saveState === 'idle' && 'Autosaving'}
          </span>
        </div>
        {w.undo && (
          <button className="icon-btn sm" onClick={w.undo} title="Undo last delete" aria-label="Undo last delete">
            <I.Undo size={17} />
          </button>
        )}
        <button className="btn btn-primary" onClick={finish}>
          Finish
        </button>
      </div>

      <div className="workout-metrics">
        <div>
          <span>Time</span>
          <b>{clock(elapsed)}</b>
        </div>
        {/* Sets done, not tonnage — tonnage mid-workout tells you nothing. */}
        <div>
          <span>Sets</span>
          <b>{w.totals?.workingSets ?? 0}</b>
        </div>
        <div>
          <span>Exercises</span>
          <b>{w.entries.filter((e) => e.sets.some((s) => s.done) || e.cardio?.done).length}</b>
        </div>
        <div>
          <span>Burn</span>
          <b>
            {num(w.totals?.totalKcal ?? 0)} <small>kcal</small>
          </b>
        </div>
      </div>

      {(w.pendingSync || finishError) && (
        <div className="offline-note" role="status">
          <I.Database size={16} />
          <span>{finishError || 'Offline — sets are saved on this device and will sync automatically.'}</span>
        </div>
      )}

      <div className="stack">
        {w.entries.length === 0 && (
          <div className="card empty small">
            <I.Dumbbell size={34} />
            <h3>Empty workout</h3>
            <p>Add your first exercise to start logging.</p>
          </div>
        )}

        {w.entries.map((entry, index) => {
          const ex = byId.get(entry.exerciseId);
          if (!ex) return null;
          return (
            <ExerciseCard
              key={entry.exerciseId}
              entry={entry}
              exercise={ex}
              units={units}
              previous={w.previous[entry.exerciseId]}
              canMoveUp={index > 0}
              canMoveDown={index < w.entries.length - 1}
              onMove={(dir) => w.reorder(index, index + dir)}
            />
          );
        })}

        <button className="btn btn-ghost wide big" onClick={() => setPicking(true)}>
          <I.Plus size={18} /> Add exercise
        </button>

        <button className="btn btn-danger wide" onClick={() => setConfirmCancel(true)}>
          <I.Trash size={16} /> Discard this workout
        </button>
      </div>

      {picking && (
        <ExercisePicker
          multi
          exclude={w.entries.map((e) => e.exerciseId)}
          onPick={(ex) => w.addExercise(ex.id)}
          onClose={() => setPicking(false)}
        />
      )}

      {confirmCancel && (
        <div className="sheet-backdrop" onClick={() => setConfirmCancel(false)} role="presentation">
          <div className="dialog" onClick={(e) => e.stopPropagation()} role="dialog">
            <h3>Discard this workout?</h3>
            <p className="muted">Every set you logged in this session is deleted. This cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmCancel(false)}>
                Keep training
              </button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  await w.cancel();
                  go('home');
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ------------------------------------------------------------ exercise card */

function ExerciseCard({
  entry,
  exercise,
  units,
  previous,
  canMoveUp,
  canMoveDown,
  onMove,
}: {
  entry: Entry;
  exercise: Exercise;
  units: Units;
  previous?: PreviousPerformance;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (dir: number) => void;
}) {
  const w = useWorkout();
  const [menu, setMenu] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [showNotes, setShowNotes] = useState(!!entry.notes);
  const unit = weightLabel(units);

  const prevWorking = useMemo(() => (previous?.sets ?? []).filter((s) => !s.isWarmup), [previous]);

  if (exercise.type === 'cardio') {
    const cardio = entry.cardio ?? { durationMin: null, distanceKm: null, intensity: 'moderate' as Intensity, done: false };
    return (
      <section className="ex-card-live">
        <CardHeader
          exercise={exercise}
          previous={previous ? cardioSummary(previous, units) : null}
          menu={menu}
          setMenu={setMenu}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMove={onMove}
          onRemove={() => w.removeExercise(entry.exerciseId)}
          onSwap={() => setSwapping(true)}
          onNotes={() => setShowNotes(true)}
        />

        {swapping && (
          <ExercisePicker
            exclude={w.entries.map((e) => e.exerciseId)}
            onPick={(ex) => w.swapExercise(entry.exerciseId, ex.id)}
            onClose={() => setSwapping(false)}
          />
        )}

        {showNotes && (
          <input
            className="input note-input"
            placeholder="Note for this exercise"
            defaultValue={entry.notes ?? ''}
            onBlur={(e) => w.setEntryNotes(entry.exerciseId, e.target.value)}
            aria-label={`Note for ${exercise.name}`}
          />
        )}

        <div className="cardio-fields">
          <CardioNumberInput
            label="Duration (min)"
            value={cardio.durationMin == null ? '' : String(cardio.durationMin)}
            placeholder="30"
            step={5}
            onCommit={(v) =>
              w.updateCardio(entry.exerciseId, {
                durationMin: v === '' ? null : Number(v),
              })
            }
          />
          {exercise.isDistanceBased && (
            <CardioNumberInput
              label={`Distance (${distanceLabel(units)})`}
              value={cardio.distanceKm == null ? '' : String(round(fromKm(cardio.distanceKm, units), 2))}
              placeholder="1.25"
              step={0.1}
              onCommit={(v) =>
                w.updateCardio(entry.exerciseId, {
                  distanceKm: v === '' ? null : toKm(Number(v), units),
                })
              }
            />
          )}
          {(exercise.slug.includes('walk') || exercise.slug.includes('treadmill') || exercise.slug.includes('run') || exercise.category === 'cardio') && (
            <CardioNumberInput
              label="Incline (%)"
              value={cardio.incline == null ? '' : String(cardio.incline)}
              placeholder="3.5"
              step={0.5}
              onCommit={(v) =>
                w.updateCardio(entry.exerciseId, {
                  incline: v === '' ? null : Number(v),
                })
              }
            />
          )}
          {(exercise.equipment?.includes('Machine') || exercise.slug.includes('bike') || exercise.slug.includes('stair') || exercise.slug.includes('elliptical') || exercise.slug.includes('rower')) && (
            <CardioNumberInput
              label="Level / Resistance"
              value={cardio.level == null ? '' : String(cardio.level)}
              placeholder="5"
              step={1}
              onCommit={(v) =>
                w.updateCardio(entry.exerciseId, {
                  level: v === '' ? null : Number(v),
                })
              }
            />
          )}
        </div>

        <div className="field">
          <span className="field-label">Effort</span>
          <div className="segmented">
            {INTENSITIES.map((level) => (
              <button
                key={level}
                className={cardio.intensity === level ? 'on' : ''}
                onClick={() => w.updateCardio(entry.exerciseId, { intensity: level })}
                aria-pressed={cardio.intensity === level}
              >
                {level[0].toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {exercise.isDistanceBased && cardio.distanceKm && cardio.durationMin ? (
          <p className="hint">
            {num(fromKm(cardio.distanceKm, units) / (cardio.durationMin / 60), 1)} {distanceLabel(units)}/h ({num(cardio.durationMin / fromKm(cardio.distanceKm, units), 1)} min/{distanceLabel(units)})
          </p>
        ) : null}

        <button
          className={`btn wide ${cardio.done ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => w.updateCardio(entry.exerciseId, { done: !cardio.done })}
          aria-pressed={!!cardio.done}
        >
          <I.Check size={17} /> {cardio.done ? 'Logged' : 'Mark complete'}
        </button>
      </section>
    );
  }

  const bestPrevE1rm = previous?.bestE1rm ?? 0;
  const bodyWeightKg = w.session?.bodyWeightKg ?? 0;

  const headerNote = previous
    ? exercise.isTimed
      ? `${relativeDay(previous.date)} · ${prevWorking.length} holds`
      : `${relativeDay(previous.date)} · ${prevWorking.length} sets · best ${num(
          fromKg(bestPrevE1rm, units),
          1,
        )} ${unit} e1RM`
    : null;

  const suggestion = suggestNextWeight(previous, exercise);

  return (
    <section className="ex-card-live">
      <CardHeader
        exercise={exercise}
        previous={headerNote}
        menu={menu}
        setMenu={setMenu}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMove={onMove}
        onRemove={() => w.removeExercise(entry.exerciseId)}
        onSwap={() => setSwapping(true)}
        onNotes={() => setShowNotes(true)}
      />

      {swapping && (
        <ExercisePicker
          exclude={w.entries.map((e) => e.exerciseId)}
          onPick={(ex) => w.swapExercise(entry.exerciseId, ex.id)}
          onClose={() => setSwapping(false)}
        />
      )}

      {/*
        Double progression: you only earn the next plate once every working set
        cleared the rep target. Tapping applies it to all unlogged sets.
      */}
      {suggestion && !entry.sets.some((s) => s.done) && (
        <button
          className="suggest"
          onClick={() => {
            entry.sets.forEach((s, i) => {
              if (!s.done) w.updateSet(entry.exerciseId, i, { weightKg: suggestion.toKg });
            });
            navigator.vibrate?.(15);
          }}
        >
          <I.TrendingUp size={16} />
          <span>
            You hit {suggestion.sets}×{suggestion.reps} at {num(fromKg(suggestion.fromKg, units), 1)} {unit} — try{' '}
            <b>
              {num(fromKg(suggestion.toKg, units), 1)} {unit}
            </b>
          </span>
          <span className="suggest-apply">Apply</span>
        </button>
      )}

      {showNotes && (
        <input
          className="input note-input"
          placeholder="Note for this exercise (form cue, niggle, machine setting…)"
          defaultValue={entry.notes ?? ''}
          onBlur={(e) => w.setEntryNotes(entry.exerciseId, e.target.value)}
          aria-label={`Note for ${exercise.name}`}
        />
      )}

      {exercise.isBodyweight && (
        <p className="bw-note">
          Body weight counts: {num(fromKg(bodyWeightKg * (exercise.bodyweightFactor || 1), units), 1)} {unit} per rep.
          Enter only weight you <em>added</em>.
        </p>
      )}

      <div className="set-head">
        <span>Set</span>
        <span>Previous</span>
        <span>{exercise.isBodyweight ? `+${unit}` : unit}</span>
        <span>{exercise.isTimed ? 'Secs' : 'Reps'}</span>
        <span aria-hidden />
      </div>

      {entry.sets.map((set, i) => {
        const ghost = prevWorking[countWorkingBefore(entry.sets, i)];
        const load = effectiveLoadKg(exercise, set, bodyWeightKg);
        const isPR =
          !exercise.isTimed &&
          bestPrevE1rm > 0 &&
          !set.isWarmup &&
          estimated1RM(load, set.reps ?? 0) > bestPrevE1rm;
        return (
          <SetRow
            key={i}
            index={i}
            set={set}
            ghost={ghost}
            units={units}
            exercise={exercise}
            bodyWeightKg={bodyWeightKg}
            prevBodyWeightKg={previous?.bodyWeightKg ?? bodyWeightKg}
            isPR={isPR && !!set.done}
            barKg={exercise.isBarbell ? exercise.barWeightKg : 0}
            onToggleWarmup={() => w.updateSet(entry.exerciseId, i, { isWarmup: !set.isWarmup })}
            onChange={(patch) => w.updateSet(entry.exerciseId, i, patch)}
            onRemove={() => w.removeSet(entry.exerciseId, i)}
            onComplete={() => {
              const next = !set.done;
              // Confirming an empty set adopts last session's numbers — the whole
              // point of showing them.
              const patch: Partial<WorkSet> = exercise.isTimed
                ? {
                    done: next,
                    restSec: exercise.defaultRestSec,
                    durationSec: set.durationSec ?? ghost?.durationSec ?? null,
                  }
                : {
                    done: next,
                    restSec: exercise.defaultRestSec,
                    reps: set.reps ?? ghost?.reps ?? null,
                    weightKg: set.weightKg ?? ghost?.weightKg ?? null,
                  };
              w.updateSet(entry.exerciseId, i, patch);
              if (next) w.startRest(exercise.defaultRestSec);
              else w.stopRest();
            }}
          />
        );
      })}

      <button className="add-set" onClick={() => w.addSet(entry.exerciseId)}>
        <I.Plus size={16} /> Add set
      </button>
    </section>
  );
}

function CardHeader({
  exercise,
  previous,
  menu,
  setMenu,
  canMoveUp,
  canMoveDown,
  onMove,
  onRemove,
  onSwap,
  onNotes,
}: {
  exercise: Exercise;
  previous: string | null;
  menu: boolean;
  setMenu: (v: boolean) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (dir: number) => void;
  onRemove: () => void;
  onSwap: () => void;
  onNotes: () => void;
}) {
  return (
    <header className="ex-live-head">
      <div>
        <h3>
          {exercise.name}
          <a
            className="how-to inline"
            href={exercise.howToUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`How to perform ${exercise.name}`}
            aria-label={`How to perform ${exercise.name} (opens in a new tab)`}
          >
            <I.HelpCircle size={15} />
          </a>
        </h3>
        <p className="muted">{previous ?? 'First time logging this one'}</p>
      </div>
      <div className="ex-live-menu">
        <button className="icon-btn sm" onClick={() => setMenu(!menu)} aria-label={`Options for ${exercise.name}`}>
          <I.Grip size={18} />
        </button>
        {menu && (
          <div className="menu">
            <button onClick={() => { onSwap(); setMenu(false); }}>Swap exercise</button>
            <button onClick={() => { onNotes(); setMenu(false); }}>Add a note</button>
            <button disabled={!canMoveUp} onClick={() => { onMove(-1); setMenu(false); }}>
              Move up
            </button>
            <button disabled={!canMoveDown} onClick={() => { onMove(1); setMenu(false); }}>
              Move down
            </button>
            <button className="danger" onClick={() => { onRemove(); setMenu(false); }}>
              Remove exercise
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- set row */

function SetRow({
  index,
  set,
  ghost,
  units,
  exercise,
  bodyWeightKg,
  prevBodyWeightKg,
  isPR,
  barKg,
  onToggleWarmup,
  onChange,
  onRemove,
  onComplete,
}: {
  index: number;
  set: WorkSet;
  ghost?: { reps: number | null; weightKg: number | null; durationSec?: number | null };
  units: Units;
  exercise: Exercise;
  bodyWeightKg: number;
  prevBodyWeightKg: number;
  isPR: boolean;
  barKg: number;
  onToggleWarmup: () => void;
  onChange: (patch: Partial<WorkSet>) => void;
  onRemove: () => void;
  onComplete: () => void;
}) {
  const unit = weightLabel(units);
  const ghostText = describePrevious(ghost, exercise, units, prevBodyWeightKg);
  const load = effectiveLoadKg(exercise, set, bodyWeightKg);

  return (
    <>
      <div className={`set-line ${set.done ? 'done' : ''} ${set.isWarmup ? 'warmup' : ''}`}>
        <button
          className="set-index"
          onClick={onToggleWarmup}
          title="Tap to mark this as a warm-up set"
          aria-label={set.isWarmup ? `Set ${index + 1}, warm-up. Tap to make it a working set` : `Set ${index + 1}. Tap to mark as warm-up`}
        >
          {set.isWarmup ? 'W' : index + 1}
        </button>

        <span className="set-ghost">{ghostText}</span>

        <NumberField
          value={set.weightKg == null ? '' : String(round(fromKg(set.weightKg, units), 2))}
          placeholder={
            exercise.isBodyweight ? '+0' : ghost?.weightKg != null ? String(round(fromKg(ghost.weightKg, units), 1)) : '0'
          }
          onCommit={(v) => onChange({ weightKg: v === '' ? null : toKg(Number(v), units) })}
          label={`Set ${index + 1} ${exercise.isBodyweight ? 'added weight' : 'weight'} in ${unit}`}
          onStep={(dir) => {
            // A tap beats opening the keyboard for the common ±one-plate change.
            const step = units === 'imperial' ? 5 : 2.5;
            const current = fromKg(set.weightKg ?? ghost?.weightKg ?? 0, units);
            const next = Math.max(0, round(current + dir * step, 2));
            onChange({ weightKg: toKg(next, units) });
            navigator.vibrate?.(10);
          }}
        />

        {exercise.isTimed ? (
          <NumberField
            value={set.durationSec == null ? '' : String(set.durationSec)}
            placeholder={ghost?.durationSec != null ? String(ghost.durationSec) : '60'}
            onCommit={(v) => onChange({ durationSec: v === '' ? null : Number(v) })}
            label={`Set ${index + 1} hold in seconds`}
          />
        ) : (
          <NumberField
            value={set.reps == null ? '' : String(set.reps)}
            placeholder={ghost?.reps != null ? String(ghost.reps) : '0'}
            onCommit={(v) => onChange({ reps: v === '' ? null : Number(v) })}
            label={`Set ${index + 1} reps`}
            variant="reps"
            onStep={(dir) => {
              const current = set.reps ?? ghost?.reps ?? 0;
              onChange({ reps: Math.max(0, current + dir) });
              navigator.vibrate?.(10);
            }}
          />
        )}

        <button
          className={`set-check ${set.done ? 'on' : ''}`}
          onClick={() => {
            navigator.vibrate?.(set.done ? 10 : [18, 40, 18]);
            onComplete();
          }}
          aria-pressed={!!set.done}
          aria-label={`Complete set ${index + 1}`}
        >
          <I.Check size={20} />
        </button>

        <button className="set-remove" onClick={onRemove} aria-label={`Delete set ${index + 1}`}>
          <I.X size={15} />
        </button>
      </div>

      {isPR && (
        <div className="pr-flash">
          <I.Trophy size={14} /> Best estimated 1RM for this lift
        </div>
      )}

      {/* RPE is only worth asking for once the set is actually done. */}
      {set.done && !exercise.isTimed && (
        <div className="rpe-row">
          <span className="rpe-label">RPE</span>
          {[6, 7, 8, 9, 10].map((v) => (
            <button
              key={v}
              className={`rpe-chip ${set.rpe === v ? 'on' : ''}`}
              onClick={() => onChange({ rpe: set.rpe === v ? null : v })}
              aria-pressed={set.rpe === v}
              aria-label={`Rate set ${index + 1} as RPE ${v}`}
            >
              {v}
            </button>
          ))}
          {exercise.isBodyweight && (set.reps ?? 0) > 0 && (
            <span className="load-inline">
              {num(fromKg(load, units), 1)} {unit} total
            </span>
          )}
        </div>
      )}

      {barKg > 0 && set.weightKg != null && set.weightKg > barKg && (
        <PlateMath totalKg={set.weightKg} barKg={barKg} units={units} />
      )}
    </>
  );
}

/** Keeps its own string while focused so typing is never fought by conversion. */
function NumberField({
  value,
  placeholder,
  onCommit,
  label,
  onStep,
  variant = 'weight',
}: {
  value: string;
  placeholder: string;
  onCommit: (v: string) => void;
  label: string;
  onStep?: (dir: number) => void;
  /** Reps steppers are hidden on phones — there is no room for two of them. */
  variant?: 'weight' | 'reps';
}) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(value);
  }, [value]);

  return (
    <div className={`stepper ${variant}`}>
      {onStep && (
        <button className="step-btn" onClick={() => onStep(-1)} aria-label={`Decrease ${label}`} tabIndex={-1}>
          −
        </button>
      )}
      <input
        className="set-input"
        inputMode="decimal"
        enterKeyHint="done"
        autoComplete="off"
        aria-label={label}
        placeholder={placeholder}
        value={draft}
        onFocus={(e) => {
          focused.current = true;
          e.currentTarget.select();
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false;
          onCommit(draft.trim());
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
      />
      {onStep && (
        <button className="step-btn" onClick={() => onStep(1)} aria-label={`Increase ${label}`} tabIndex={-1}>
          +
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- summary */

function Summary({
  data,
  units,
  onClose,
}: {
  data: { session: Session | null; newPRs: NewPR[] };
  units: Units;
  onClose: () => void;
}) {
  const { session, newPRs } = data;
  const unit = weightLabel(units);

  if (!session) {
    return (
      <div className="sheet-backdrop" role="presentation">
        <div className="dialog" role="dialog">
          <h3>Nothing logged</h3>
          <p className="muted">
            No completed sets, so the workout was discarded rather than saved as an empty row in your history.
          </p>
          <div className="dialog-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const t = session.totals;
  return (
    <div className="sheet-backdrop" role="presentation">
      <div className="dialog wide-dialog" role="dialog">
        <div className="summary-head">
          <div className="brand-mark">
            <I.Trophy size={24} />
          </div>
          <div>
            <h3>{session.name} complete</h3>
            <p className="muted">{num(t.durationMin ?? 0)} minutes of work logged.</p>
          </div>
        </div>

        <div className="summary-grid">
          <div>
            <span>Working sets</span>
            <b>{t.workingSets ?? 0}</b>
          </div>
          <div>
            <span>Duration</span>
            <b>
              {num(t.durationMin ?? 0)} <small>min</small>
            </b>
          </div>
          <div>
            <span>Energy</span>
            <b>
              {num(t.totalKcal ?? 0)} <small>kcal</small>
            </b>
          </div>
          <div>
            <span>Exercises</span>
            <b>{session.entries.length}</b>
          </div>
        </div>

        {newPRs.length > 0 && (
          <div className="pr-banner">
            <h4>
              <I.Trophy size={17} /> {newPRs.length} new personal {newPRs.length === 1 ? 'record' : 'records'}
            </h4>
            {newPRs.map((pr) => (
              <div key={pr.exerciseId} className="pr-row">
                <span className="pr-name">{pr.name}</span>
                <b>
                  {num(fromKg(pr.e1rm, units), 1)} {unit}
                </b>
                <span className="muted">
                  was {num(fromKg(pr.previous, units), 1)} {unit}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="dialog-actions">
          <button className="btn btn-primary wide" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- helpers */

/** The ghost line: what this same set looked like last time. */
function describePrevious(
  ghost: { reps: number | null; weightKg: number | null; durationSec?: number | null } | undefined,
  exercise: Exercise,
  units: Units,
  prevBodyWeightKg: number,
): string {
  if (!ghost) return '—';
  if (exercise.isTimed) return ghost.durationSec ? `${ghost.durationSec}s` : '—';

  if (exercise.isBodyweight) {
    const added = ghost.weightKg ?? 0;
    const total = effectiveLoadKg(exercise, ghost as WorkSet, prevBodyWeightKg);
    const label = added > 0 ? `BW+${num(fromKg(added, units), 1)}` : 'BW';
    return `${label} (${num(fromKg(total, units), 0)}) × ${ghost.reps ?? 0}`;
  }

  return ghost.weightKg != null ? `${num(fromKg(ghost.weightKg, units), 1)} × ${ghost.reps ?? 0}` : '—';
}

function countWorkingBefore(sets: WorkSet[], index: number): number {
  let n = 0;
  for (let i = 0; i < index; i += 1) if (!sets[i].isWarmup) n += 1;
  return n;
}

function CardioNumberInput({
  label,
  value,
  placeholder = '',
  step,
  onCommit,
}: {
  label: string;
  value: string;
  placeholder?: string;
  step?: number;
  onCommit: (val: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(value);
  }, [value]);

  return (
    <div className="field">
      <label>{label}</label>
      <div className="stepper reps">
        {step && (
          <button
            className="step-btn"
            onClick={() => {
              const cur = Number(draft) || 0;
              const next = Math.max(0, Math.round((cur - step) * 100) / 100);
              const str = String(next);
              setDraft(str);
              onCommit(str);
            }}
            tabIndex={-1}
          >
            −
          </button>
        )}
        <input
          className="set-input"
          inputMode="decimal"
          enterKeyHint="done"
          autoComplete="off"
          placeholder={placeholder}
          value={draft}
          onFocus={(e) => {
            focused.current = true;
            e.currentTarget.select();
          }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            focused.current = false;
            onCommit(draft.trim());
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
        />
        {step && (
          <button
            className="step-btn"
            onClick={() => {
              const cur = Number(draft) || 0;
              const next = Math.max(0, Math.round((cur + step) * 100) / 100);
              const str = String(next);
              setDraft(str);
              onCommit(str);
            }}
            tabIndex={-1}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

function cardioSummary(prev: PreviousPerformance, units: Units): string {
  const c = prev.cardio;
  if (!c) return relativeDay(prev.date);
  const parts: string[] = [`${num(c.durationMin ?? 0)} min`];
  if (c.distanceKm) parts.push(`${num(fromKm(c.distanceKm, units), 2)} ${distanceLabel(units)}`);
  if (c.incline) parts.push(`${c.incline}% incl`);
  if (c.level) parts.push(`Lvl ${c.level}`);
  return `${relativeDay(prev.date)} · ${parts.join(' · ')}`;
}

function round(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

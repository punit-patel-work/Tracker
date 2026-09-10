import { useState } from 'react';
import { useApp } from '../state/app';
import { useWorkout } from '../state/workout';
import { api } from '../lib/api';
import { relativeDay, todayISO } from '../lib/format';
import ExercisePicker from '../components/ExercisePicker';
import * as I from '../components/Icon';
import type { Routine, RoutineExercise } from '../lib/types';

/**
 * Routines are the organising idea, not a per-category exercise switchboard.
 * A lifter thinks "it's push day", picks it, and starts — the old customizer
 * made you do admin before every session.
 */
export default function Routines({ go }: { go: (page: string) => void }) {
  const { routines, reloadRoutines, byId } = useApp();
  const { start, session } = useWorkout();
  const [editing, setEditing] = useState<Routine | 'new' | null>(null);
  const [busy, setBusy] = useState('');

  if (editing) {
    return (
      <RoutineEditor
        routine={editing === 'new' ? null : editing}
        onDone={async () => {
          await reloadRoutines();
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const begin = async (r: Routine) => {
    setBusy(r.id);
    try {
      await start({ routineId: r.id });
      go('workout');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h2 className="page-title">
            <I.Layers size={24} /> Routines
          </h2>
          <p className="page-sub">Your training days. Starting one queues every exercise with your last numbers.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            <I.Plus size={16} /> New routine
          </button>
        </div>
      </div>

      {routines.length === 0 && (
        <div className="card empty">
          <I.Layers size={40} />
          <h3>No routines yet</h3>
          <p>Build one for each training day, or just start an empty workout and add exercises as you go.</p>
        </div>
      )}

      <div className="grid-2">
        {routines.map((r) => (
          <section key={r.id} className="card card-pad routine-card">
            <div className="card-head">
              <div>
                <h3>{r.name}</h3>
                <p>
                  {r.exercises.length} exercises ·{' '}
                  {r.lastPerformedAt ? `last done ${relativeDay(todayISO(new Date(r.lastPerformedAt)))}` : 'never done'}
                </p>
              </div>
              <div className="card-head-actions">
                <button className="icon-btn sm" onClick={() => setEditing(r)} aria-label={`Edit ${r.name}`}>
                  <I.Pencil size={16} />
                </button>
              </div>
            </div>

            {r.note && <p className="muted">{r.note}</p>}

            <ol className="routine-list">
              {r.exercises.map((re) => {
                const ex = byId.get(re.exerciseId);
                return (
                  <li key={re.exerciseId}>
                    <span>{ex?.name ?? 'Removed exercise'}</span>
                    <span className="muted">
                      {ex?.type === 'cardio' ? 'timed' : `${re.targetSets} × ${re.targetReps}`}
                    </span>
                  </li>
                );
              })}
            </ol>

            <button
              className="btn btn-primary wide"
              disabled={!!busy || !!session}
              onClick={() => begin(r)}
              title={session ? 'Finish the workout in progress first' : undefined}
            >
              <I.Play size={15} /> {busy === r.id ? 'Starting…' : session ? 'Workout in progress' : 'Start this routine'}
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ editor */

function RoutineEditor({
  routine,
  onDone,
  onCancel,
}: {
  routine: Routine | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { byId } = useApp();
  const [name, setName] = useState(routine?.name ?? '');
  const [note, setNote] = useState(routine?.note ?? '');
  const [list, setList] = useState<RoutineExercise[]>(routine?.exercises ?? []);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const patch = (id: string, p: Partial<RoutineExercise>) =>
    setList((l) => l.map((x) => (x.exerciseId === id ? { ...x, ...p } : x)));

  const move = (from: number, dir: number) =>
    setList((l) => {
      const to = from + dir;
      if (to < 0 || to >= l.length) return l;
      const next = [...l];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });

  const save = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      const body = { name, note, exercises: list };
      if (routine) await api.updateRoutine(routine.id, body);
      else await api.createRoutine(body);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the routine');
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!routine) return;
    setBusy(true);
    await api.deleteRoutine(routine.id);
    onDone();
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <button className="link-btn" onClick={onCancel}>
            <I.ArrowLeft size={14} /> Back to routines
          </button>
          <h2 className="page-title" style={{ marginTop: 8 }}>
            {routine ? 'Edit routine' : 'New routine'}
          </h2>
        </div>
      </div>

      <section className="card card-pad">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="r-name">Name</label>
            <input
              id="r-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Push Day"
            />
          </div>
          <div className="field">
            <label htmlFor="r-note">Note (optional)</label>
            <input
              id="r-note"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Chest, shoulders, triceps"
            />
          </div>
        </div>
      </section>

      <section className="card card-pad">
        <div className="card-head">
          <div>
            <h3>Exercises</h3>
            <p>Targets prefill the set rows when you start this routine.</p>
          </div>
          <div className="card-head-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setPicking(true)}>
              <I.Plus size={15} /> Add
            </button>
          </div>
        </div>

        {list.length === 0 && <p className="muted">Nothing added yet.</p>}

        <div className="stack" style={{ gap: 10 }}>
          {list.map((re, i) => {
            const ex = byId.get(re.exerciseId);
            const cardio = ex?.type === 'cardio';
            return (
              <div key={re.exerciseId} className="routine-edit-row">
                <div className="routine-edit-name">
                  <strong>{ex?.name ?? 'Unknown'}</strong>
                  <span className="muted">{ex?.equipment}</span>
                </div>

                {!cardio && (
                  <div className="routine-edit-targets">
                    <label>
                      <span>Sets</span>
                      <input
                        className="mini-input"
                        inputMode="numeric"
                        value={re.targetSets}
                        onChange={(e) => patch(re.exerciseId, { targetSets: Number(e.target.value) || 0 })}
                      />
                    </label>
                    <label>
                      <span>Reps</span>
                      <input
                        className="mini-input"
                        inputMode="numeric"
                        value={re.targetReps}
                        onChange={(e) => patch(re.exerciseId, { targetReps: Number(e.target.value) || 0 })}
                      />
                    </label>
                  </div>
                )}

                <div className="routine-edit-actions">
                  <button className="icon-btn sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    ↑
                  </button>
                  <button
                    className="icon-btn sm"
                    onClick={() => move(i, 1)}
                    disabled={i === list.length - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    className="icon-btn sm danger"
                    onClick={() => setList((l) => l.filter((x) => x.exerciseId !== re.exerciseId))}
                    aria-label={`Remove ${ex?.name}`}
                  >
                    <I.Trash size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {error && <p className="form-error">{error}</p>}

      <div className="row-end">
        {routine && (
          <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={remove} disabled={busy}>
            <I.Trash size={16} /> Delete routine
          </button>
        )}
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={save} disabled={busy || !name.trim()}>
          <I.Save size={16} /> Save routine
        </button>
      </div>

      {picking && (
        <ExercisePicker
          multi
          exclude={list.map((x) => x.exerciseId)}
          onPick={(ex) =>
            setList((l) => [
              ...l,
              {
                exerciseId: ex.id,
                targetSets: ex.type === 'cardio' ? 1 : 3,
                targetReps: ex.type === 'cardio' ? 0 : 8,
                targetWeightKg: null,
                restSec: null,
              },
            ])
          }
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

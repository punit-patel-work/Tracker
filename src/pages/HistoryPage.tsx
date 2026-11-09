import { useEffect, useRef, useState } from 'react';

import { useApp } from '../state/app';

import { api } from '../lib/api';

import { fromKg, fromKm, num, parseISO, relativeDay, weightLabel, distanceLabel } from '../lib/format';

import { effectiveLoadKg, estimated1RM } from '../../shared/engine.js';

import { EmptyState, Toast, useToast } from '../components/common';

import ManualLog from './ManualLog';

import CalorieBreakdown from '../components/CalorieBreakdown';

import * as I from '../components/Icon';

import type { Session } from '../lib/types';



export default function HistoryPage() {

  const { user, byId, reloadRoutines } = useApp();

  const [logging, setLogging] = useState(false);

  const [editing, setEditing] = useState<Session | null>(null);

  const toast = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);

  const [total, setTotal] = useState(0);

  const [query, setQuery] = useState('');

  const [open, setOpen] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [retry, setRetry] = useState(0);

  const request = useRef(0);



  const units = user?.units ?? 'metric';

  const unit = weightLabel(units);



  const load = async (skip = 0) => {

    const version = ++request.current;

    setLoading(true); setError('');

    try {

      const res = await api.sessions(30, skip, query);

      if (version !== request.current) return;

      setSessions((old) => skip ? [...old, ...res.sessions.filter((item) => !old.some((s) => s.id === item.id))] : res.sessions);

      setTotal(res.total);

    } catch (err) {

      if (version === request.current) setError(err instanceof Error ? err.message : 'Could not load history');

    } finally { if (version === request.current) setLoading(false); }

  };

  useEffect(() => {

    request.current++;

    setSessions([]); setLoading(true);

    const timer = window.setTimeout(() => { void load(); }, 250);

    return () => { request.current++; window.clearTimeout(timer); };

  }, [query, retry]);

  const rows = sessions;



  return (

    <div className="stack history-page">

      <div className="page-head">

        <div>

          <h2 className="page-title">

            <I.History size={24} /> History

          </h2>

          <p className="page-sub">

            {total} {query ? 'matching' : 'completed'} {total === 1 ? 'workout' : 'workouts'}.

          </p>

        </div>

        <div className="page-head-actions">

          <div className="search">

            <I.Search size={17} />

            <input

              className="input"

              placeholder="Search by exercise, routine or date"

              value={query}

              onChange={(e) => setQuery(e.target.value)}

              aria-label="Search history"

            />

            {query && (

              <button

                className="affix-btn"

                onClick={() => setQuery('')}

                aria-label="Clear search"

                title="Clear search"

              >

                <I.X size={14} />

              </button>

            )}

          </div>

          <button className="btn btn-ghost" onClick={() => setLogging(true)}>

            <I.Plus size={16} /> Log a past workout

          </button>

        </div>

      </div>



      {logging && (

        <ManualLog

          onClose={() => setLogging(false)}

          onSaved={() => {

            setLogging(false);

            void load();

            toast.show('Workout added to your history');

          }}

        />

      )}



      {editing && (

        <ManualLog key={editing.id} session={editing} onClose={() => setEditing(null)} onSaved={(saved) => {

          setSessions((list) => list.map((item) => item.id === saved.id ? saved : item)

            .sort((a, b) => b.date.localeCompare(a.date) || b.startedAt.localeCompare(a.startedAt)));

          setEditing(null);

          void load();

          toast.show('Workout updated. Calories and progress recalculated.');

        }} />

      )}



      {error && <div className="dashboard-error" role="alert">{error}<button className="btn btn-ghost" onClick={() => setRetry((n) => n + 1)}>Retry</button></div>}

      {loading && !sessions.length ? <p className="muted" role="status">Loading history…</p> : error && !sessions.length ? null : sessions.length === 0 && !query ? (

        <EmptyState

          icon={<I.Calendar size={42} />}

          title="Nothing logged yet"

          body="Finish your first workout and it will show up here with volume, energy and every set you did."

        />

      ) : rows.length === 0 ? (

        <EmptyState

          icon={<I.Search size={42} />}

          title="No match"

          body="No workout in your history contains that exercise, routine or date."

        />

      ) : (

        <div className="stack" style={{ gap: 12 }}>

          {rows.map((s) => {

            const isOpen = open === s.id;

            const d = parseISO(s.date);

            return (

              <section key={s.id} className="card hist-card">

                <button className="hist-main" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>

                  <div className="hist-day">

                    <b>{d.getDate()}</b>

                    <span>{d.toLocaleDateString(undefined, { month: 'short' })}</span>

                  </div>

                  <div className="hist-info">

                    <strong>{s.name}</strong>

                    <span className="muted">

                      {relativeDay(s.date)} · {s.entries.length} exercises · {s.totals.workingSets ?? 0} sets

                      {(s.totals.cardioMinutes ?? 0) > 0 && ` · ${num(s.totals.cardioMinutes ?? 0)} min cardio`}

                    </span>

                  </div>

                  <div className="hist-nums">

                    <div>

                      <span>Hard sets</span>

                      <b>{s.totals.workingSets ?? 0}</b>

                    </div>

                    <div>

                      <span>Est. calories</span>

                      <b>{num(s.totals.totalKcal ?? 0)} kcal</b>

                    </div>

                    <div>

                      <span>Time</span>

                      <b>{num(s.totals.durationMin ?? 0)} min</b>

                    </div>

                  </div>

                  <I.ChevronDown size={18} className={isOpen ? 'flip' : ''} />

                </button>



                {isOpen && (

                  <div className="hist-body">

                    {s.feedback && <section><h4>Workout feedback</h4>
                      {s.feedback.difficulty && <p>Difficulty · {{ easy: 'Too easy', manageable: 'About right', hard: 'Too hard' }[s.feedback.difficulty]}</p>}
                      {s.feedback.stoppedFor && <p>Stopped early · {s.feedback.stoppedFor}</p>}
                      {s.feedback.note && <p>{s.feedback.note}</p>}
                    </section>}
                    <CalorieBreakdown totals={s.totals} bodyWeightKg={s.bodyWeightKg} units={units} />

                    {s.entries.map((entry) => {

                      const ex = byId.get(entry.exerciseId);

                      if (!ex) return null;

                      return (

                        <div key={entry.exerciseId} className="hist-entry">

                          <h4>{ex.name}</h4>

                          {ex.type === 'cardio' && entry.cardio ? (

                            <p className="muted">

                              {num(entry.cardio.durationMin ?? 0)} min · {entry.cardio.intensity}

                              {entry.cardio.distanceKm

                                ? ` · ${num(fromKm(entry.cardio.distanceKm, units), 2)} ${distanceLabel(units)}`

                                : ''}

                              {entry.cardio.incline ? ` · ${entry.cardio.incline}% incl` : ''}

                              {entry.cardio.level ? ` · Lvl ${entry.cardio.level}` : ''}

                            </p>

                          ) : (

                            <table className="data-table">

                              <thead>

                                <tr>

                                  <th>Set</th>

                                  {/* Bodyweight lifts show total load, not the added plates alone. */}

                                  <th>{ex.isTimed ? 'Hold' : `Load (${unit})`}</th>

                                  <th>{ex.isTimed ? '' : 'Reps'}</th>

                                  <th>{ex.isTimed ? '' : 'e1RM'}</th>

                                </tr>

                              </thead>

                              <tbody>

                                {entry.sets.map((set, i) => {

                                  const load = effectiveLoadKg(ex, set, s.bodyWeightKg);

                                  return (

                                    <tr key={i} className={set.isWarmup ? 'warm' : ''}>

                                      <td>{set.isWarmup ? 'W' : i + 1}</td>

                                      <td>

                                        {ex.isTimed

                                          ? `${set.durationSec ?? 0}s`

                                          : `${num(fromKg(load, units), 1)}${

                                              ex.isBodyweight && (set.weightKg ?? 0) > 0

                                                ? ` (BW+${num(fromKg(set.weightKg ?? 0, units), 1)})`

                                                : ex.isBodyweight

                                                  ? ' (BW)'

                                                  : ''

                                            }`}

                                      </td>

                                      <td>{ex.isTimed ? '' : (set.reps ?? 0)}</td>

                                      <td>

                                        {ex.isTimed || set.isWarmup

                                          ? '—'

                                          : num(fromKg(estimated1RM(load, set.reps ?? 0), units), 1)}

                                      </td>

                                    </tr>

                                  );

                                })}

                              </tbody>

                            </table>

                          )}

                        </div>

                      );

                    })}



                    <div className="hist-foot">

                      <button className="btn btn-primary btn-sm" onClick={() => setEditing(s)}>Edit workout</button>

                      <span className="muted">

                        Logged at {num(fromKg(s.bodyWeightKg, units), 1)} {unit} body weight

                      </span>

                      <button

                        className="btn btn-ghost btn-sm"

                        onClick={async () => {

                          try { const { name } = await api.saveAsRoutine(s.id); await reloadRoutines(); toast.show(`Saved as routine "${name}"`); } catch (err) { toast.show(err instanceof Error ? err.message : 'Could not save routine'); }

                        }}

                      >

                        <I.Layers size={14} /> Save as routine

                      </button>

                      <button

                        className="btn btn-danger btn-sm"

                        onClick={async () => {

                          if (!confirm('Delete this workout permanently?')) return;

                          try { await api.deleteSession(s.id); void load(); } catch (err) { toast.show(err instanceof Error ? err.message : 'Could not delete workout'); }

                        }}

                      >

                        <I.Trash size={14} /> Delete

                      </button>

                    </div>

                  </div>

                )}

              </section>

            );

          })}



          {sessions.length < total && (

            <button className="btn btn-ghost wide" disabled={loading} onClick={() => void load(sessions.length)}>

              {loading ? 'Loading…' : 'Load older workouts'}

            </button>

          )}

        </div>

      )}



      <Toast message={toast.message} />

    </div>

  );

}

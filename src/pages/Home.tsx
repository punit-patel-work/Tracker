import { useEffect, useState } from 'react';
import { useApp } from '../state/app';
import { useWorkout } from '../state/workout';
import { api } from '../lib/api';
import { clock, formatDate, fromKg, num, relativeDay, shiftDays, todayISO, weightLabel } from '../lib/format';
import { useTick } from '../components/common';
import * as I from '../components/Icon';
import type { Overview, Session } from '../lib/types';

export default function Home({ go }: { go: (page: string) => void }) {
  const { user, routines } = useApp();
  const { session, totals, start } = useWorkout();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recent, setRecent] = useState<Session[]>([]);
  const [busy, setBusy] = useState('');
  const now = useTick(1000, !!session);

  useEffect(() => {
    void (async () => {
      const [o, s] = await Promise.all([api.overview(), api.sessions(3)]);
      setOverview(o);
      setRecent(s.sessions);
    })();
  }, [session]);

  const units = user?.units ?? 'metric';
  const unit = weightLabel(units);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const begin = async (routineId?: string) => {
    setBusy(routineId ?? 'empty');
    try {
      await start(routineId ? { routineId } : {});
      go('workout');
    } finally {
      setBusy('');
    }
  };

  const target = overview?.weeklyTarget ?? 4;
  const doneThisWeek = overview?.thisWeek.sessions ?? 0;
  // Hard sets, not tonnage: comparable week to week regardless of what you trained.
  const setsDelta =
    overview && overview.lastWeek.workingSets > 0
      ? ((overview.thisWeek.workingSets - overview.lastWeek.workingSets) / overview.lastWeek.workingSets) * 100
      : null;

  const lastWeighIn = user?.weighIns?.[user.weighIns.length - 1];
  const weighInStale = !lastWeighIn || lastWeighIn.date < shiftDays(todayISO(), -7);

  return (
    <div className="stack">
      <header className="greet">
        <div>
          <h1>
            {greeting()}, {firstName}
          </h1>
          <p className="muted">{formatDate(todayISO())}</p>
        </div>
        {(overview?.streak ?? 0) > 0 && (
          <div className="streak" title="Consecutive weeks with at least one session">
            <I.Flame size={18} />
            <b>{overview?.streak}</b>
            <span>week streak</span>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------ start / resume */}
      {session ? (
        <button className="hero-action live" onClick={() => go('workout')}>
          <div className="hero-action-icon">
            <I.Timer size={26} />
          </div>
          <div className="hero-action-body">
            <span className="eyebrow">Workout in progress</span>
            <h2>{session.name}</h2>
            <p>
              {clock(now - new Date(session.startedAt).getTime())} · {totals?.workingSets ?? 0} sets ·{' '}
              {num(fromKg(totals?.volumeKg ?? 0, units))} {unit}
            </p>
          </div>
          <span className="hero-action-cta">
            Resume <I.ChevronRight size={18} />
          </span>
        </button>
      ) : (
        <section className="card card-pad start-card">
          <div className="card-head">
            <div>
              <h3>
                <I.Play size={16} /> Start a workout
              </h3>
              <p>Pick a routine and every exercise is queued with your last numbers.</p>
            </div>
          </div>

          <div className="routine-row">
            {routines.map((r) => (
              <button key={r.id} className="routine-chip" disabled={!!busy} onClick={() => begin(r.id)}>
                <strong>{r.name}</strong>
                <span className="muted">
                  {r.exercises.length} exercises
                  {r.lastPerformedAt ? ` · ${relativeDay(todayISO(new Date(r.lastPerformedAt)))}` : ' · never done'}
                </span>
                {busy === r.id && <span className="chip-busy">Starting…</span>}
              </button>
            ))}
            <button className="routine-chip ghost" disabled={!!busy} onClick={() => begin()}>
              <strong>
                <I.Plus size={15} /> Empty workout
              </strong>
              <span className="muted">Build it as you go</span>
            </button>
          </div>

          <button className="link-btn" onClick={() => go('routines')} style={{ marginTop: 14 }}>
            Manage routines
          </button>
        </section>
      )}

      {/* -------------------------------------------------------------- week */}
      <section className="card card-pad">
        <div className="card-head">
          <div>
            <h3>
              <I.Target size={18} /> This week
            </h3>
            <p>Monday to today, against your target of {target} sessions.</p>
          </div>
        </div>

        <div className="week-dots" role="img" aria-label={`${doneThisWeek} of ${target} sessions done`}>
          {Array.from({ length: target }, (_, i) => (
            <span key={i} className={i < doneThisWeek ? 'on' : ''} />
          ))}
          {doneThisWeek > target &&
            Array.from({ length: doneThisWeek - target }, (_, i) => <span key={`x${i}`} className="on bonus" />)}
        </div>

        <div className="mini-stats">
          <div>
            <span>Sessions</span>
            <b>
              {doneThisWeek}
              <small>/{target}</small>
            </b>
          </div>
          <div>
            <span>Hard sets</span>
            <b>{num(overview?.thisWeek.workingSets ?? 0)}</b>
          </div>
          <div>
            <span>Energy</span>
            <b>
              {num(overview?.thisWeek.kcal ?? 0)} <small>kcal</small>
            </b>
          </div>
          <div>
            <span>Time</span>
            <b>
              {num(overview?.thisWeek.minutes ?? 0)} <small>min</small>
            </b>
          </div>
        </div>

        {setsDelta !== null && (
          <p className={`delta ${setsDelta >= 0 ? 'up' : 'down'}`}>
            {setsDelta >= 0 ? '▲' : '▼'} {num(Math.abs(setsDelta))}% hard sets vs last week
          </p>
        )}
      </section>

      {/* --------------------------------------------------------------- PRs */}
      {(overview?.prs.length ?? 0) > 0 && (
        <section className="card card-pad">
          <div className="card-head">
            <div>
              <h3>
                <I.Trophy size={18} /> Personal records
              </h3>
              <p>Heaviest estimated 1RM per lift.</p>
            </div>
            <div className="card-head-actions">
              <button className="link-btn" onClick={() => go('progress')}>
                See all
              </button>
            </div>
          </div>
          <div className="pr-list">
            {overview?.prs.slice(0, 5).map((pr) => (
              <div key={pr.exerciseId} className="pr-row">
                <span className="pr-name">{pr.name}</span>
                <span className="muted">{relativeDay(pr.date)}</span>
                <b>
                  {num(fromKg(pr.bestE1rm, units), 1)} {unit}
                </b>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ recent */}
      {recent.length > 0 && (
        <section className="card card-pad">
          <div className="card-head">
            <div>
              <h3>
                <I.History size={18} /> Recent workouts
              </h3>
            </div>
            <div className="card-head-actions">
              <button className="link-btn" onClick={() => go('history')}>
                Full history
              </button>
            </div>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {recent.map((s) => (
              <button key={s.id} className="recent-row" onClick={() => go('history')}>
                <div>
                  <strong>{s.name}</strong>
                  <span className="muted">
                    {formatDate(s.date)} · {s.entries.length} exercises
                  </span>
                </div>
                <div className="recent-metrics">
                  <span>{s.totals?.workingSets ?? 0} sets</span>
                  <span>{num(s.totals?.durationMin ?? 0)} min</span>
                  <I.ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {weighInStale && (
        <button className="nudge" onClick={() => go('profile')}>
          <I.Scale size={19} />
          <div>
            <strong>Log today's weight</strong>
            <span className="muted">
              {lastWeighIn
                ? `Last recorded ${relativeDay(lastWeighIn.date)} at ${num(fromKg(lastWeighIn.kg, units), 1)} ${unit}.`
                : 'Calorie estimates need a current body weight.'}
            </span>
          </div>
          <I.ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

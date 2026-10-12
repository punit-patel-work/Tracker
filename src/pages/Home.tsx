import { useEffect, useState } from 'react';
import { useApp } from '../state/app';
import { useWorkout } from '../state/workout';
import { api } from '../lib/api';
import { clock, formatDate, fromKg, num, relativeDay, shiftDays, todayISO, weightLabel } from '../lib/format';
import { useTick } from '../components/common';
import * as I from '../components/Icon';
import TrainingArtwork, { trainingFocus, focusLabels } from '../components/TrainingArtwork';
import type { Overview, Session } from '../lib/types';

export default function Home({ go }: { go: (page: string) => void }) {
  const { user, routines, byId } = useApp();
  const { session, entries, start, loading: workoutLoading } = useWorkout();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recent, setRecent] = useState<Session[]>([]);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const now = useTick(1000, !!session);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void Promise.all([api.overview(), api.sessions(3)]).then(([o, s]) => {
      if (cancelled) return;
      setOverview(o); setRecent(s.sessions); setError('');
    }).catch(() => {
      if (!cancelled) setError('Your training summary could not be loaded. Try again in a moment.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [session?.id, retry]);

  const units = user?.units ?? 'metric';
  const unit = weightLabel(units);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const target = overview?.weeklyTarget ?? user?.weeklyTarget ?? 4;
  const done = overview?.thisWeek.sessions ?? 0;
  const setsDelta = overview && overview.lastWeek.workingSets > 0
    ? ((overview.thisWeek.workingSets - overview.lastWeek.workingSets) / overview.lastWeek.workingSets) * 100 : null;
  const lastWeighIn = user?.weighIns?.[user.weighIns.length - 1];
  const weighInStale = !lastWeighIn || lastWeighIn.date < shiftDays(todayISO(), -7);
  const monday = shiftDays(todayISO(), -((new Date().getDay() + 6) % 7));
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const featured = routines[0];
  const goalProgress = Math.min(1, done / Math.max(target, 1));
  const loggedSets = entries.reduce((count, entry) => count + entry.sets.filter((set) => set.done && !set.isWarmup).length, 0);

  const begin = async (routineId?: string) => {
    setBusy(routineId ?? 'empty'); setError('');
    try { await start(routineId ? { routineId } : {}); go('workout'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not start your workout. Please try again.'); }
    finally { setBusy(''); }
  };

  const metrics = [
    { label: 'Workouts', value: num(done), suffix: `/ ${target}`, icon: I.Dumbbell, detail: 'Weekly target', tone: 'teal' },
    { label: 'Working sets', value: num(overview?.thisWeek.workingSets ?? 0), suffix: '', icon: I.Layers,
      detail: setsDelta === null ? 'Warm-ups excluded' : `${setsDelta >= 0 ? '+' : '−'}${num(Math.abs(setsDelta))}% from last week`, tone: 'blue' },
    { label: 'Active time', value: num(overview?.thisWeek.minutes ?? 0), suffix: 'min', icon: I.Clock, detail: 'Training this week', tone: 'purple' },
    { label: 'Energy burned', value: num(overview?.thisWeek.kcal ?? 0), suffix: 'kcal', icon: I.Flame, detail: 'Estimated from activity', tone: 'orange' },
  ];

  return <div className="dashboard stack">
    <header className="greet">
      <div><span className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span><h1>{greeting()}, {firstName}.</h1>
        <p className="page-sub">Let’s make room for a little stronger.</p></div>
      <button className="btn btn-ghost" onClick={() => go('history')}><I.History size={16} /> Activity history</button>
    </header>
    {error && <div className="dashboard-error" role="alert"><I.Info size={18} /><span>{error}</span>
      <button className="link-btn" onClick={() => setRetry((n) => n + 1)}>Retry</button></div>}
    <div className="today-feature-grid">
      <section className="training-feature">
        <img className="training-feature-photo" src="/images/training-barbell.jpg" alt="" fetchPriority="high" />
        <div className="training-feature-content">
          <span className="training-label"><span />{session ? 'Session in progress' : featured ? 'From your routines' : 'Your next chapter'}</span>
          <h2>{session ? session.name : featured ? featured.name : 'Make your\nnext move.'}</h2>
          <p>{session
            ? `${clock(now - new Date(session.startedAt).getTime())} elapsed · ${loggedSets} working sets completed`
            : featured ? featured.note || 'Your plan. Your pace. Every rep counts.' : 'Start a session and build it your way.'}</p>
          {featured && !session && <div className="training-feature-meta"><span><I.Dumbbell size={15} /> {featured.exercises.length} exercises</span><span><I.Layers size={15} /> {focusLabels[trainingFocus(featured, byId)]}</span></div>}
          <div className="training-feature-actions">
            <button className="btn btn-training" disabled={!!busy || workoutLoading} onClick={() => session ? go('workout') : void begin(featured?.id)}>
              <I.Play size={16} /> {busy ? 'Starting…' : session ? 'Continue session' : 'Start training'}
            </button>
            {!session && <button className="training-secondary" onClick={() => go('routines')}>Choose a routine <I.ChevronRight size={15} /></button>}
          </div>
        </div>
        <span className="training-feature-caption" aria-hidden="true">SHOW UP. GET STRONGER.</span>
      </section>
      <section className="card weekly-goal" aria-busy={loading}>
        <div className="section-heading"><div><h3>Your weekly goal</h3><p>{formatDate(monday)} – {formatDate(shiftDays(monday, 6))}</p></div><I.Target size={18} /></div>
        <div className="goal-ring-row">
          <div className="goal-ring" role="progressbar" aria-label="Weekly workouts" aria-valuemin={0} aria-valuemax={Math.max(target, 1)} aria-valuenow={Math.min(done, target)} aria-valuetext={loading ? 'Loading' : overview ? `${done} of ${target} workouts completed` : 'Summary unavailable'}>
            <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="goal-ring-track" cx="60" cy="60" r="51" />{!loading && overview && done > 0 && <circle className="goal-ring-value" cx="60" cy="60" r="51" pathLength="100" strokeDasharray={`${goalProgress * 100} 100`} />}</svg>
            <div><strong>{loading || !overview ? '—' : done}<small>/{target}</small></strong><span>workouts</span></div>
          </div>
          <div className="goal-ring-copy"><strong>{loading ? 'Your week' : !overview ? 'Let’s reconnect' : done >= target ? 'Goal complete!' : done ? 'Keep it going.' : 'A fresh start.'}</strong>
            <p>{loading ? 'Loading your activity…' : !overview ? 'Retry your training summary above.' : done >= target ? 'You showed up for yourself this week.' : `${target - done} more ${target - done === 1 ? 'session' : 'sessions'} to your weekly goal.`}</p></div>
        </div>
        <div className="training-days" aria-label="Training days this week">
          {days.map((day, index) => { const date = shiftDays(monday, index); const trained = (overview?.daily[date] ?? 0) > 0;
            return <div key={day} className={`training-day ${trained ? 'trained' : ''} ${date === todayISO() ? 'today' : ''}`}>
              <span>{day.charAt(0)}</span><span className="day-marker" title={`${date}: ${trained ? 'Workout logged' : 'No workout logged'}`}>
                {trained ? <I.Check size={15} /> : <span aria-hidden="true">{new Date(`${date}T12:00:00`).getDate()}</span>}</span>
              <span className="sr-only">{day}: {trained ? 'Workout logged' : 'No workout logged'}{date === todayISO() && ', today'}</span>
            </div>;
          })}
        </div>
        <div className="goal-footer"><I.Flame size={17} /><span>{overview?.streak ? `${overview.streak}-week streak` : 'One session at a time'}</span>
          <button className="link-btn" onClick={() => go('progress')} aria-label="View weekly progress"><I.ChevronRight size={17} /></button></div>
      </section>
    </div>
    <section className="activity-overview"><div className="dashboard-section-title"><h2>This week in motion</h2><span>Mon – Sun</span></div>
    <div className="overview-metrics" aria-busy={loading}>
      {metrics.map((metric) => { const Icon = metric.icon;
        return <section key={metric.label} className={`overview-metric tone-${metric.tone}`}>
          <div className="metric-heading"><span>{metric.label}</span><Icon size={17} /></div>
          {loading ? <span className="skeleton metric-skeleton" aria-label="Loading" /> :
            <div className="metric-number">{overview ? metric.value : '—'}<small>{overview && metric.suffix}</small></div>}
          <span className={`metric-detail ${metric.label === 'Working sets' && setsDelta !== null && setsDelta > 0 ? 'positive' : ''}`}>{metric.detail}</span>
        </section>;
      })}
    </div>
    </section>
      <section className="dashboard-routines">
        <div className="dashboard-section-title"><div><h2>Your training lineup</h2><p>A plan for every training day.</p></div>
          <button className="link-btn" onClick={() => go('routines')}>Manage routines <I.ChevronRight size={14} /></button></div>
        <div className="routine-options">
          {routines.map((routine) => { const focus = trainingFocus(routine, byId); return <button key={routine.id} className={`routine-option focus-${focus}`} disabled={!!busy || !!session || workoutLoading} aria-label={`Start ${routine.name}, ${routine.exercises.length} exercises`}
            onClick={() => void begin(routine.id)} title={session ? 'Finish your current workout first' : undefined}>
            <span className="routine-cover"><span className="routine-focus-label">{focusLabels[focus]}</span><TrainingArtwork focus={focus} /></span>
            <span className="routine-option-copy"><strong>{routine.name}</strong><span>{routine.exercises.length} exercises · {routine.lastPerformedAt ? relativeDay(todayISO(new Date(routine.lastPerformedAt))) : 'Ready to start'}</span></span>
            <span className="routine-play">{busy === routine.id ? '…' : <I.Play size={16} />}</span>
          </button>; })}
          {routines.length === 0 && <div className="inline-empty"><I.Layers size={26} /><h4>Your next session starts here</h4>
            <p>Create a routine to keep your favourite exercises together.</p><button className="btn btn-ghost" onClick={() => go('routines')}>Create a routine</button></div>}
        </div>
        <button className="freestyle-action" disabled={!!busy || !!session || workoutLoading} onClick={() => void begin()}>
          <I.Plus size={16} /><span>Train without a routine</span><span className="muted">Build as you go</span></button>
      </section>
    <div className="dashboard-grid">
      <section className="card dashboard-recent">
        <div className="section-heading"><div><h3>Recent workouts</h3><p>Your latest time under the bar.</p></div>
          <button className="link-btn" onClick={() => go('history')}>View all <I.ChevronRight size={14} /></button></div>
        {loading ? <div className="loading-rows" role="status" aria-label="Loading recent workouts"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" /></div> :
          recent.length ? <div className="recent-list">{recent.map((s) => <button key={s.id} className="recent-row" onClick={() => go('history')}>
            <span className="recent-icon"><I.Dumbbell size={18} /></span><div><strong>{s.name}</strong><span className="muted">{formatDate(s.date)} · {s.entries.length} exercises</span></div>
            <div className="recent-metrics"><span>{s.totals?.workingSets ?? 0}<small>sets</small></span><span>{num(s.totals?.durationMin ?? 0)}<small>min</small></span><I.ChevronRight size={16} /></div>
          </button>)}</div> : <div className="inline-empty"><I.History size={26} /><h4>A fresh page in your journal</h4><p>Your completed workouts will appear here.</p></div>}
      </section>
      <section className="card dashboard-records">
        <div className="section-heading"><div><h3>Personal records</h3><p>Your best estimated one-rep max.</p></div><I.Trophy size={18} /></div>
        {loading ? <div className="loading-rows" role="status" aria-label="Loading personal records"><span className="skeleton" /><span className="skeleton" /></div> :
          overview?.prs.length ? <div className="record-list">{overview.prs.slice(0, 3).map((pr, index) => <div className="record-row" key={pr.exerciseId}>
            <span className="record-rank">{String(index + 1).padStart(2, '0')}</span><div><strong>{pr.name}</strong><span>{relativeDay(pr.date)}</span></div>
            <b>{num(fromKg(pr.bestE1rm, units), 1)}<small>{unit}</small></b></div>)}</div> :
            <div className="inline-empty"><I.Trophy size={26} /><h4>Room for a new best</h4><p>Log your lifts and your records will follow.</p></div>}
        <button className="records-link link-btn" onClick={() => go('progress')}>Explore your progress <I.ChevronRight size={14} /></button>
      </section>
    </div>
    {weighInStale && <button className="nudge" onClick={() => go('profile')}><I.Scale size={18} />
      <div><strong>A quick check-in</strong><span className="muted">{lastWeighIn ? `Last weigh-in ${relativeDay(lastWeighIn.date)}. Keep your estimates up to date.` : 'Add your body weight for more accurate energy estimates.'}</span></div>
      <span className="nudge-cta">Log weight <I.ChevronRight size={15} /></span></button>}
  </div>;
}
function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
}

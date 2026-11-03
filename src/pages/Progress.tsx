import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import { formatDate, fromKg, num, shiftDays, todayISO, weightLabel } from '../lib/format';
import { fillWeeks, mondayOf, percentChange, progressRangeStart, summarizeLift } from '../../shared/progress.js';
import InteractiveTrend from '../components/InteractiveTrend';
import * as I from '../components/Icon';
import type { ExercisePoint, LiftProgress, Overview, Units, WeekRow } from '../lib/types';
import '../styles/progress.css';

const RANGES = [{ weeks: 6, label: '6 weeks' }, { weeks: 12, label: '12 weeks' }, { weeks: 26, label: '6 months' }, { weeks: 52, label: '1 year' }];
type ActivityMetric = 'sessions' | 'workingSets' | 'minutes' | 'volumeKg' | 'kcal';
const METRICS: { key: ActivityMetric; label: string; unit: string }[] = [
  { key: 'sessions', label: 'Sessions', unit: 'sessions' }, { key: 'workingSets', label: 'Sets', unit: 'sets' },
  { key: 'minutes', label: 'Time', unit: 'min' }, { key: 'volumeKg', label: 'Volume', unit: 'kg' }, { key: 'kcal', label: 'Energy', unit: 'kcal' },
];
const shortDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const signed = (value: number, digits = 1) => `${value > 0 ? '+' : ''}${num(value, digits)}`;

export default function Progress() {
  const { user } = useApp();
  const [weeks, setWeeks] = useState(12);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [metric, setMetric] = useState<ActivityMetric>('sessions');
  const [week, setWeek] = useState('');
  const [table, setTable] = useState(false);
  const [liftId, setLiftId] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [day, setDay] = useState('');
  const [muscle, setMuscle] = useState('');
  const today = todayISO();
  const from = progressRangeStart(today, weeks);
  const currentWeek = mondayOf(today);
  const units = user?.units ?? 'metric';
  const unit = weightLabel(units);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    void api.overview(weeks).then((overview) => { if (!cancelled) setData(overview); })
      .catch(() => { if (!cancelled) setError('Your progress could not be loaded. Please try again.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [weeks, retry]);

  const liftRows = useMemo(() => (data?.lifts ?? []).map((lift) => ({ ...lift, trend: summarizeLift(lift.points, from, today) }))
    .filter((lift) => lift.trend.points.length > 0), [data, from, today]);
  const eligible = liftRows.filter((lift) => lift.trend.percent !== null);
  const improving = eligible.filter((lift) => lift.trend.percent! > 0);
  const shownLifts = [...liftRows].filter((lift) => lift.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'gain' ? (b.trend.percent ?? -Infinity) - (a.trend.percent ?? -Infinity)
      : sort === 'sessions' ? b.trend.points.length - a.trend.points.length : b.lastDate.localeCompare(a.lastDate));
  const chosenLift = shownLifts.find((lift) => lift.id === liftId) ?? shownLifts[0];
  // Older servers return a truncated history. Start at available records instead of inventing zero weeks before them.
  const available = data?.weeklyHistory ?? data?.weekly ?? [];
  const chartFrom = !data?.weeklyHistory && available.length && available[0].week > from ? available[0].week : from;
  const weekly: WeekRow[] = fillWeeks(available, chartFrom, today);
  const selectedWeek = weekly.findIndex((row) => row.week === week);
  const latestActiveWeek = weekly.map((row) => row.sessions > 0).lastIndexOf(true);
  const selectedIndex = selectedWeek >= 0 ? selectedWeek : latestActiveWeek >= 0 ? latestActiveWeek : weekly.length - 1;
  const selected = weekly[selectedIndex];
  const selectedMetric = METRICS.find((item) => item.key === metric)!;
  const metricUnit = metric === 'volumeKg' ? unit : selectedMetric.unit;
  const value = (row: WeekRow) => metric === 'volumeKg' ? fromKg(row[metric], units) : row[metric];
  const sessionTotal = weekly.reduce((sum, row) => sum + row.sessions, 0);
  const minutesTotal = weekly.reduce((sum, row) => sum + row.minutes, 0);
  const completeWeeks = weekly.filter((row) => row.week < currentWeek);
  const target = data?.weeklyTarget ?? user?.weeklyTarget ?? 4;
  const goalsMet = completeWeeks.filter((row) => row.sessions >= target).length;
  const bestWeek = [...weekly].sort((a, b) => b.sessions - a.sessions)[0];
  const bestLift = [...improving].sort((a, b) => b.trend.percent! - a.trend.percent!)[0];
  const previousWeek = selectedIndex > 0 ? weekly[selectedIndex - 1] : null;
  const change = previousWeek ? percentChange(value(selected), value(previousWeek)) : null;
  const muscleRows = useMemo(() => {
    const totals: Record<string, number> = {};
    const rows = (data?.setsPerWeek ?? []).filter((row) => row.week >= from && row.week <= today);
    for (const row of rows) for (const [name, sets] of Object.entries(row.muscles)) totals[name] = (totals[name] ?? 0) + sets;
    return Object.entries(totals).map(([name, sets]) => ({ name, sets: sets / weeks }))
      .sort((a, b) => b.sets - a.sets);
  }, [data, from, today, weeks]);
  const activeMuscle = muscleRows.find((row) => row.name === muscle) ?? muscleRows[0];
  const calendarStart = weeks > 12 ? progressRangeStart(today, 12) : from;
  const days: string[] = [];
  for (let date = calendarStart; date <= today; date = shiftDays(date, 1)) days.push(date);
  const activeDay = day >= calendarStart && day <= today ? day : today;
  const trainedDays = days.filter((date) => data?.dailySessions ? (data.dailySessions[date] ?? 0) > 0 : Object.prototype.hasOwnProperty.call(data?.daily ?? {}, date));
  const trainedOn = (date: string) => data?.dailySessions ? (data.dailySessions[date] ?? 0) > 0 : Object.prototype.hasOwnProperty.call(data?.daily ?? {}, date);
  const selectedDayCount = data?.dailySessions?.[activeDay];

  return <div className="progress-page stack">
    <div className="page-head"><div><span className="eyebrow">THE WORK ADDS UP</span><h2 className="page-title">Your progress</h2><p className="page-sub">Explore your training. See what’s changing.</p></div>
      <button className="btn btn-ghost" onClick={() => setRetry((n) => n + 1)} disabled={loading}><I.Refresh size={15} /> Refresh</button></div>
    <div className="progress-toolbar"><div className="progress-ranges" role="group" aria-label="Progress date range">{RANGES.map((range) =>
      <button key={range.weeks} aria-pressed={weeks === range.weeks} className={weeks === range.weeks ? 'on' : ''} onClick={() => setWeeks(range.weeks)}>{range.label}</button>)}</div>
      <span>{shortDate(from)} – {shortDate(today)} · current week included</span></div>
    {error ? <div className="dashboard-error" role="alert"><I.Info size={18} /><span>{error}</span><button className="link-btn" onClick={() => setRetry((n) => n + 1)}>Retry</button></div>
      : loading ? <div className="progress-loading" role="status"><span>Loading your training story…</span><div className="skeleton" /><div className="skeleton" /></div>
      : data && <>
        <section className="progress-story"><div><span className="eyebrow">YOUR TRAINING STORY</span>
          <h3>{!sessionTotal ? 'Your next session starts the story.' : eligible.length === 0 ? 'You’re building a baseline.' : improving.length ? 'Your work is showing up.' : 'Every session adds perspective.'}</h3>
          <p>{!sessionTotal ? 'No workouts in this window. Try a longer range, or come back after your next session.' : eligible.length === 0
            ? 'Log the same lift in at least two sessions to see a strength trend. One session is a starting point.'
            : `${improving.length} of ${eligible.length} comparable lifts improved their estimated one-rep max from first to latest session in this range.`}</p></div>
          <div className="story-stats"><div><strong>{sessionTotal}</strong><span>sessions shown</span></div><div><strong>{num(minutesTotal / 60, 1)}<small>h</small></strong><span>training time</span></div><div><strong>{eligible.length ? improving.length : '—'}{eligible.length > 0 && <small>/{eligible.length}</small>}</strong><span>lifts improving</span></div></div>
        </section>
        <div className="progress-activity-grid">
          <section className="card card-pad activity-explorer"><div className="card-head"><div><h3>Training activity</h3><p>Change a metric, then select a week to see the detail.</p></div><ViewToggle table={table} setTable={setTable} label="Training activity" /></div>
            <div className="progress-metrics" role="group" aria-label="Training activity metric">{METRICS.map((item) => <button key={item.key} className={metric === item.key ? 'on' : ''} aria-pressed={metric === item.key} onClick={() => setMetric(item.key)}>{item.label}</button>)}</div>
            {chartFrom > from && <p className="progress-note">Weekly detail is available from {formatDate(chartFrom)}. The chart and totals use those available weeks.</p>}
            {table ? <div className="chart-scroll"><table className="data-table"><thead><tr><th>Week of</th><th>{selectedMetric.label} ({metricUnit})</th><th>Explore</th></tr></thead><tbody>{weekly.map((row) => <tr key={row.week}><td>{formatDate(row.week)}{row.week === currentWeek && ' · ongoing'}</td><td>{num(value(row), 1)}</td><td><button className="link-btn" onClick={() => { setWeek(row.week); setTable(false); }}>View week</button></td></tr>)}</tbody></table></div>
              : <InteractiveTrend points={weekly.map((row) => ({ label: shortDate(row.week), value: value(row) }))} selected={selectedIndex} onSelect={(i) => setWeek(weekly[i].week)} unit={metricUnit} label="Weekly training activity" target={metric === 'sessions' ? target : undefined} />}
            <div className="selected-week" aria-live="polite"><div><span>WEEK OF {shortDate(selected.week).toUpperCase()}</span><strong>{selected.week === currentWeek ? 'This week is still in progress' : selected.sessions ? `${selected.sessions} ${selected.sessions === 1 ? 'session' : 'sessions'} logged` : 'No sessions logged'}</strong>
              <p>{selected.week === currentWeek ? 'Compare completed weeks for a fairer view.' : previousWeek && change !== null ? `${signed(change)}% ${selectedMetric.label.toLowerCase()} vs the previous week.` : previousWeek ? 'No activity in the previous week to calculate a percentage change.' : 'First available week in this view.'}</p></div>
              <div className="week-facts"><span><b>{selected.workingSets}</b>sets</span><span><b>{num(selected.minutes)}</b>min</span><span><b>{num(fromKg(selected.volumeKg, units))}</b>{unit} volume</span></div></div>
            <p className="progress-note">{metric === 'volumeKg' ? 'Volume = load × reps. Compare similar exercise selections; more volume alone does not prove greater strength.' : metric === 'kcal' ? 'Energy is an estimate from logged activity, not a wearable measurement.' : 'Empty weeks stay visible. The dashed line on Sessions is your current weekly target.'}</p>
          </section>
          <aside className="card card-pad progress-insights"><span className="eyebrow">WHAT STANDS OUT</span><h3>A closer look</h3>
            <Insight icon={<I.Target size={18} />} title={`${goalsMet} of ${completeWeeks.length} complete weeks`} body={`Reached your current target of ${target} sessions. The unfinished current week is excluded.`} />
            <Insight icon={<I.TrendingUp size={18} />} title={bestLift ? `${signed(bestLift.trend.percent!)}% · ${bestLift.name}` : 'A trend needs a repeat'} body={bestLift ? 'Largest first-to-latest estimated strength gain among lifts with at least two sessions.' : 'Repeat a lift to compare like with like. Single-session lifts are shown as baselines.'}
              action={bestLift ? () => { setSearch(''); setLiftId(bestLift.id); document.getElementById('lift-explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } : undefined} />
            <Insight icon={<I.Calendar size={18} />} title={bestWeek?.sessions ? `${bestWeek.sessions} sessions · ${shortDate(bestWeek.week)}` : 'Room for your first week'} body={bestWeek?.sessions ? 'Your busiest week in this view. Frequency describes consistency, not workout quality.' : 'Your logged activity will bring this view to life.'} />
          </aside>
        </div>
        <section id="lift-explorer" className="card card-pad lift-explorer"><div className="card-head"><div><h3>Explore a lift</h3><p>Follow one movement across sessions. Choose what you want to measure.</p></div><span className="count-badge">{liftRows.length} lifts</span></div>
          <div className="lift-explorer-grid"><div className="lift-picker"><label className="sr-only" htmlFor="lift-search">Search lifts</label><input id="lift-search" className="input" type="search" placeholder="Search your lifts…" value={search} onChange={(event) => setSearch(event.target.value)} />
            <label className="lift-sort">Sort by<select className="input" value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Most recent</option><option value="gain">Biggest gain</option><option value="sessions">Most logged</option></select></label>
            <div className="lift-choices" role="group" aria-label="Select a lift">{shownLifts.map((lift) => <button key={lift.id} className={chosenLift?.id === lift.id ? 'selected' : ''} aria-pressed={chosenLift?.id === lift.id} onClick={() => setLiftId(lift.id)}><strong>{lift.name}</strong><span>{lift.trend.points.length} {lift.trend.points.length === 1 ? 'session' : 'sessions'} <b className={lift.trend.percent !== null && lift.trend.percent > 0 ? 'positive' : ''}>{lift.trend.percent === null ? 'Baseline' : `${signed(lift.trend.percent)}%`}</b></span></button>)}</div>
            {!shownLifts.length && <p className="progress-note">{search ? 'No matching lifts. Try another search.' : 'No strength lifts recorded in this range.'}</p>}</div>
            {chosenLift ? <LiftDetail key={chosenLift.id} lift={chosenLift} from={from} today={today} units={units} bodyWeight={data.currentWeightKg} /> : <div className="trend-empty"><I.Dumbbell size={28} /><p>Select a lift when you have strength sessions to explore.</p></div>}
          </div>
        </section>
        <section className="card card-pad consistency-explorer"><div className="card-head"><div><h3>Your consistency calendar</h3><p>{weeks > 12 ? 'Latest 12 weeks of this range.' : 'Every day in your selected range.'} Select a day to inspect it.</p></div><span className="count-badge">{trainedDays.length} training days</span></div>
          <div className="calendar-layout"><div className="calendar-scroll"><div className="calendar-day-labels">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((name, i) => <span key={i}>{name}</span>)}</div><div className="interactive-calendar" role="group" aria-label="Training calendar">{days.map((date, index) => <button key={date} data-day={index} tabIndex={activeDay === date ? 0 : -1} onKeyDown={(event) => { const offsets: Record<string, number> = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 }; const offset = offsets[event.key]; if (offset === undefined) return; event.preventDefault(); const next = Math.max(0, Math.min(days.length - 1, index + offset)); setDay(days[next]); event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)?.focus(); }} className={`${trainedOn(date) ? 'trained' : ''} ${activeDay === date ? 'selected' : ''}`} aria-label={`${formatDate(date)}: ${trainedOn(date) ? 'training logged' : 'no session'}`} aria-pressed={activeDay === date} onClick={() => setDay(date)} title={formatDate(date)}><span className="sr-only">{date}</span></button>)}</div></div>
            <div className="calendar-detail" aria-live="polite"><span>{formatDate(activeDay)}</span><strong>{trainedOn(activeDay) ? selectedDayCount !== undefined ? `${selectedDayCount} ${selectedDayCount === 1 ? 'session' : 'sessions'}` : 'Training logged' : 'No session logged'}</strong><p>{trainedOn(activeDay) ? `${num(data.daily[activeDay] ?? 0)} kcal estimated activity energy` : activeDay === today ? 'Today’s page is still open.' : 'An unlogged day is shown as empty.'}</p></div></div>
        </section>
        <div className="grid-2 progress-lower-grid"><section className="card card-pad"><div className="card-head"><div><h3>Where your sets went</h3><p>Average credited sets per selected calendar week, including weeks off.</p></div><I.Layers size={19} /></div>
          <div className="muscle-picker" role="group" aria-label="Select a muscle">{muscleRows.slice(0, 10).map((row) => <button key={row.name} className={activeMuscle?.name === row.name ? 'selected' : ''} aria-pressed={activeMuscle?.name === row.name} onClick={() => setMuscle(row.name)}><span>{row.name}</span><span className="muscle-meter"><span style={{ width: `${row.sets / Math.max(1, muscleRows[0].sets) * 100}%` }} /></span><b>{num(row.sets, 1)}</b></button>)}</div>
          {activeMuscle ? <div className="muscle-detail" aria-live="polite"><strong>{activeMuscle.name}</strong><p>{num(activeMuscle.sets, 1)} credited sets per week. A primary muscle receives 1 set; a secondary muscle receives 0.5.</p>
            <div className="muscle-week-strip" aria-label={`${activeMuscle.name} weekly sets`}>{weekly.slice(-12).map((row) => { const count = data.setsPerWeek.find((item) => item.week === row.week)?.muscles[activeMuscle.name] ?? 0; return <span key={row.week} title={`${formatDate(row.week)}: ${num(count, 1)} sets`}><b>{num(count, 1)}</b><small>{shortDate(row.week)}</small></span>; })}</div></div> : <p className="progress-note">No muscle-set data in this range.</p>}
        </section><BodyWeight data={data} from={from} today={today} units={units} /></div>
      </>}
  </div>;
}

function ViewToggle({ table, setTable, label }: { table: boolean; setTable: (value: boolean) => void; label: string }) {
  return <div className="toggle-view" role="group" aria-label={`${label} view`}><button className={!table ? 'on' : ''} aria-pressed={!table} onClick={() => setTable(false)}>Chart</button><button className={table ? 'on' : ''} aria-pressed={table} onClick={() => setTable(true)}>Table</button></div>;
}

function Insight({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: () => void }) {
  return <div className="progress-insight"><span className="insight-symbol">{icon}</span><div><strong>{title}</strong><p>{body}</p>{action && <button className="link-btn" onClick={action}>Explore this lift <I.ChevronRight size={14} /></button>}</div></div>;
}

function LiftDetail({ lift, from, today, units, bodyWeight }: { lift: LiftProgress; from: string; today: string; units: Units; bodyWeight: number }) {
  const [points, setPoints] = useState<ExercisePoint[] | null>(null);
  const [metric, setMetric] = useState<keyof Omit<ExercisePoint, 'date'>>('e1rm');
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [table, setTable] = useState(false);
  useEffect(() => { let cancelled = false; setError(''); setPoints(null);
    void api.exerciseTrend(lift.id).then((result) => { if (!cancelled) setPoints(result.points); }).catch(() => { if (!cancelled) setError('Session detail is unavailable. Your estimated strength history is still shown.'); });
    return () => { cancelled = true; };
  }, [lift.id, retry]);
  const unit = metric === 'sets' ? 'sets' : weightLabel(units);
  const labels = { e1rm: 'Estimated 1RM', topWeightKg: 'Top set load', volumeKg: 'Volume', sets: 'Working sets' };
  const source = points ?? lift.points.map((point) => ({ ...point, topWeightKg: 0, volumeKg: 0, sets: 0 }));
  const filtered = source.filter((point) => point.date >= from && point.date <= today && Number.isFinite(point[metric])).sort((a, b) => a.date.localeCompare(b.date));
  const values = filtered.map((point) => metric === 'sets' ? point[metric] : fromKg(point[metric], units));
  const index = Math.min(selected ?? Math.max(0, filtered.length - 1), Math.max(0, filtered.length - 1));
  const first = values[0]; const latest = values[values.length - 1];
  const delta = values.length >= 2 ? percentChange(latest, first) : null;
  const strength = summarizeLift(lift.points, from, today);
  return <div className="lift-chart-panel"><div className="lift-chart-title"><div><span className="eyebrow">{lift.category}</span><h4>{lift.name}</h4></div><ViewToggle table={table} setTable={setTable} label="Lift trend" /></div>
    <div className="progress-metrics" role="group" aria-label="Lift metric">{(Object.keys(labels) as (keyof typeof labels)[]).map((key) => <button key={key} disabled={!points && key !== 'e1rm'} aria-pressed={metric === key} className={metric === key ? 'on' : ''} onClick={() => { setMetric(key); setSelected(null); }}>{labels[key]}</button>)}</div>
    {error && <div className="progress-note" role="alert">{error} <button className="link-btn" onClick={() => { setMetric('e1rm'); setRetry((n) => n + 1); }}>Retry</button></div>}
    <div className="lift-summary"><div><span>First</span><b>{values.length ? num(first, 1) : '—'} <small>{unit}</small></b></div><div><span>Latest</span><b>{values.length ? num(latest, 1) : '—'} <small>{unit}</small></b></div><div><span>Change</span><b className={delta !== null && delta > 0 ? 'positive' : ''}>{delta === null ? '—' : `${signed(delta)}%`}</b></div></div>
    {table ? <div className="chart-scroll"><table className="data-table"><thead><tr><th>Session date</th><th>{labels[metric]} ({unit})</th></tr></thead><tbody>{filtered.map((point, i) => <tr key={`${point.date}-${i}`}><td>{formatDate(point.date)}</td><td>{num(values[i], 1)}</td></tr>)}</tbody></table></div>
      : <InteractiveTrend points={filtered.map((point, i) => ({ label: shortDate(point.date), value: values[i] }))} selected={index} onSelect={setSelected} unit={unit} label={`${lift.name} ${labels[metric]}`} variant="line" />}
    <p className="progress-note">{filtered.length < 2 ? 'Baseline only: record this lift in another session to measure change. ' : ''}{metric === 'e1rm' ? 'Estimated from your logged working sets; this is not a tested maximum.' : metric === 'topWeightKg' ? 'Heaviest effective load in a working set. Bodyweight exercises include the recorded bodyweight contribution.' : metric === 'volumeKg' ? 'Sum of effective load × repetitions for this lift in each session.' : 'Warm-up sets are excluded.'}</p>
    {bodyWeight > 0 && strength.best !== null && <div className="lift-relative"><I.Trophy size={16} /><span>Best estimated 1RM in range: <strong>{num(fromKg(strength.best, units), 1)} {weightLabel(units)}</strong> · {num(strength.best / bodyWeight, 2)}× your current body weight</span></div>}
  </div>;
}

function BodyWeight({ data, from, today, units }: { data: Overview; from: string; today: string; units: Units }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const points = data.bodyWeight.filter((point) => point.date >= from && point.date <= today).sort((a, b) => a.date.localeCompare(b.date));
  const unit = weightLabel(units);
  const change = points.length >= 2 ? fromKg(points[points.length - 1].kg - points[0].kg, units) : null;
  return <section className="card card-pad bodyweight-explorer"><div className="card-head"><div><h3>Body weight over time</h3><p>Your recorded weigh-ins within this range.</p></div><ViewToggle table={table} setTable={setTable} label="Body weight" /></div>
    <div className="weight-headline"><strong>{points.length ? num(fromKg(points[points.length - 1].kg, units), 1) : '—'}<small>{unit}</small></strong><span>{change === null ? 'Add at least two weigh-ins to see a change.' : `${signed(change)} ${unit} from first to latest weigh-in`}</span></div>
    {table ? <div className="chart-scroll"><table className="data-table"><thead><tr><th>Date</th><th>Weight ({unit})</th></tr></thead><tbody>{points.map((point, i) => <tr key={`${point.date}-${i}`}><td>{formatDate(point.date)}</td><td>{num(fromKg(point.kg, units), 1)}</td></tr>)}</tbody></table></div>
      : <InteractiveTrend points={points.map((point) => ({ label: shortDate(point.date), value: fromKg(point.kg, units) }))} selected={Math.min(selected ?? Math.max(0, points.length - 1), Math.max(0, points.length - 1))} onSelect={setSelected} unit={unit} label="Recorded body weight" variant="line" />}
    <p className="progress-note">Single readings vary. Use repeated measurements to understand the longer trend. Add weigh-ins from your profile.</p>
  </section>;
}

import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import { formatDate, fromKg, num, parseISO, relativeDay, shiftDays, todayISO, weightLabel } from '../lib/format';
import { BarChart, ChartCard, Heatmap, HorizontalBars, LineChart, SplitBar, type Point } from '../components/charts';
import { EmptyState } from '../components/common';
import * as I from '../components/Icon';
import type { LiftProgress, Overview, Units } from '../lib/types';

const RANGES = [
  { weeks: 6, label: '6w' },
  { weeks: 12, label: '12w' },
  { weeks: 26, label: '6m' },
  { weeks: 52, label: '1y' },
  { weeks: 260, label: 'All' },
];

/** Rough consensus band for weekly hard sets per muscle. */
const SET_TARGET = { low: 10, high: 20 };

export default function Progress() {
  const { user } = useApp();
  const [weeks, setWeeks] = useState(12);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [openLift, setOpenLift] = useState<string | null>(null);

  const units = user?.units ?? 'metric';
  const unit = weightLabel(units);

  useEffect(() => {
    let cancelled = false;
    // Hold the previous render while refetching — no skeleton flash on range change.
    void api.overview(weeks).then((o) => {
      if (cancelled) return;
      setData(o);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [weeks]);

  const heatDays = useMemo(() => {
    const out: { date: string; value: number; label: string }[] = [];
    let cursor = shiftDays(todayISO(), -90);
    while (parseISO(cursor).getDay() !== 1) cursor = shiftDays(cursor, -1);
    const today = todayISO();
    while (cursor <= today) {
      const value = data?.daily[cursor] ?? 0;
      out.push({
        date: cursor,
        value,
        label: value > 0 ? `${formatDate(cursor)}: trained` : `${formatDate(cursor)}: rest`,
      });
      cursor = shiftDays(cursor, 1);
    }
    return out;
  }, [data]);

  const muscleRows = useMemo(
    () => Object.entries(data?.avgSetsPerMuscle ?? {}).slice(0, 10).map(([label, value]) => ({ label, value })),
    [data],
  );

  const bodyWeight: Point[] = useMemo(
    () => (data?.bodyWeight ?? []).map((w) => ({ label: formatDate(w.date), value: fromKg(w.kg, units) })),
    [data, units],
  );

  if (loading) return <p className="muted">Crunching your numbers…</p>;

  if (!data || data.sessionCount === 0) {
    return (
      <EmptyState
        icon={<I.TrendingUp size={42} />}
        title="No progress to show yet"
        body="Finish a couple of workouts and this page fills with strength curves, weekly hard sets and where you are stalling."
      />
    );
  }

  const improving = data.lifts.filter((l) => l.deltaPct > 0);
  const stalled = data.lifts.filter((l) => l.stalled);
  const avgGain = improving.length
    ? improving.reduce((s, l) => s + l.deltaPct, 0) / improving.length
    : 0;

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h2 className="page-title">
            <I.BarChart size={24} /> Progress
          </h2>
          <p className="page-sub">
            Strength change, weekly hard sets and adherence — the things that move. Warm-ups excluded throughout.
          </p>
        </div>
      </div>

      {/* One filter row, scoping everything below it. */}
      <div className="range-row">
        <span className="range-label">Last</span>
        <div className="toggle-view">
          {RANGES.map((r) => (
            <button key={r.weeks} className={weeks === r.weeks ? 'on' : ''} onClick={() => setWeeks(r.weeks)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ tiles */}
      <div className="grid-4">
        <HeadlineTile
          icon={<I.TrendingUp size={20} />}
          label="Lifts improving"
          value={`${improving.length}`}
          sub={`of ${data.lifts.length} tracked`}
          tone={improving.length >= data.lifts.length / 2 ? 'good' : 'neutral'}
        />
        <HeadlineTile
          icon={<I.Zap size={20} />}
          label="Average strength gain"
          value={`${avgGain > 0 ? '+' : ''}${num(avgGain, 1)}%`}
          sub="across improving lifts"
          tone={avgGain > 0 ? 'good' : 'neutral'}
        />
        <HeadlineTile
          icon={<I.Target size={20} />}
          label="Sessions per week"
          value={num(data.consistency.avgPerWeek, 1)}
          sub={`target ${data.consistency.target}`}
          tone={data.consistency.avgPerWeek >= data.consistency.target ? 'good' : 'warn'}
        />
        <HeadlineTile
          icon={<I.Flame size={20} />}
          label="Week streak"
          value={num(data.streak)}
          sub={data.streak === 1 ? 'week in a row' : 'weeks in a row'}
          tone="neutral"
        />
      </div>

      {/* -------------------------------------------------- strength change */}
      <section className="card card-pad">
        <div className="card-head">
          <div>
            <h3>
              <I.TrendingUp size={19} /> Strength by lift
            </h3>
            <p>
              Estimated 1RM, first to latest session in range. Tap a lift for its curve. This is the number that says
              whether you are getting stronger — tonnage is not.
            </p>
          </div>
        </div>

        {data.lifts.length === 0 ? (
          <p className="muted">No strength lifts logged in this range.</p>
        ) : (
          <div className="lift-list">
            {data.lifts.map((lift) => (
              <LiftRow
                key={lift.id}
                lift={lift}
                units={units}
                open={openLift === lift.id}
                onToggle={() => setOpenLift(openLift === lift.id ? null : lift.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------ what to fix */}
      {stalled.length > 0 && (
        <section className="card card-pad insight">
          <div className="card-head">
            <div>
              <h3>
                <I.Info size={19} /> Worth a look
              </h3>
            </div>
          </div>
          <ul className="insight-list">
            {stalled.map((l) => (
              <li key={l.id}>
                <strong>{l.name}</strong> has not beaten {num(fromKg(l.bestE1rm, units), 1)} {unit} since{' '}
                {relativeDay(l.lastDate)}. Try dropping the weight 10% and building back, or add a set.
              </li>
            ))}
            {Object.entries(data.avgSetsPerMuscle)
              .filter(([, n]) => n > 0 && n < SET_TARGET.low)
              .slice(0, 3)
              .map(([m, n]) => (
                <li key={m}>
                  <strong>{m}</strong> is getting {num(n, 1)} hard sets a week — under the {SET_TARGET.low}–
                  {SET_TARGET.high} most people need to grow.
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* ----------------------------------------------------- hard sets */}
      <ChartCard
        title="Hard sets per muscle per week"
        subtitle={`Average over the last ${weeks} weeks. A set counts 1 toward the primary muscle, 0.5 toward secondary. Most people grow on ${SET_TARGET.low}–${SET_TARGET.high}.`}
        icon={<I.Layers size={19} />}
        table={
          <table className="data-table">
            <thead>
              <tr>
                <th>Muscle</th>
                <th>Sets / week</th>
              </tr>
            </thead>
            <tbody>
              {muscleRows.map((m) => (
                <tr key={m.label}>
                  <td>{m.label}</td>
                  <td>{num(m.value, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <HorizontalBars rows={muscleRows} unit="" />
      </ChartCard>

      <div className="grid-2">
        <ChartCard title="Training consistency" subtitle="Days trained over the last 13 weeks" icon={<I.Calendar size={19} />}>
          <Heatmap days={heatDays} />
        </ChartCard>

        <ChartCard
          title="Sessions per week"
          subtitle={`Against your target of ${data.consistency.target}`}
          icon={<I.Target size={19} />}
          table={
            <table className="data-table">
              <thead>
                <tr>
                  <th>Week of</th>
                  <th>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {data.weekly.map((wk) => (
                  <tr key={wk.week}>
                    <td>{formatDate(wk.week)}</td>
                    <td>{wk.sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <BarChart bars={data.weekly.map((wk) => ({ label: formatDate(wk.week), value: wk.sessions }))} />
        </ChartCard>
      </div>

      {/* ----------------------------------------- fat-loss / cardio view */}
      {(data.goal === 'fat-loss' || data.totals.cardioMinutes > 0) && (
        <div className="grid-2">
          <ChartCard
            title="Where the energy went"
            subtitle="Strength work-time burn vs MET-based cardio"
            icon={<I.Flame size={19} />}
            table={
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Energy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Strength</td>
                    <td>{num(data.totals.strengthKcal)} kcal</td>
                  </tr>
                  <tr>
                    <td>Cardio</td>
                    <td>{num(data.totals.cardioKcal)} kcal</td>
                  </tr>
                </tbody>
              </table>
            }
          >
            <SplitBar
              unit="kcal"
              parts={[
                { label: 'Strength', value: data.totals.strengthKcal, color: 'var(--series-1)' },
                { label: 'Cardio', value: data.totals.cardioKcal, color: 'var(--series-2)' },
              ]}
            />
          </ChartCard>

          {bodyWeight.length > 1 ? (
            <ChartCard
              title="Body weight"
              subtitle="Each dated weigh-in"
              icon={<I.Scale size={19} />}
              table={
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.bodyWeight ?? []).map((w) => (
                      <tr key={w.date}>
                        <td>{formatDate(w.date)}</td>
                        <td>
                          {num(fromKg(w.kg, units), 1)} {unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            >
              <LineChart points={bodyWeight} unit={` ${unit}`} height={220} />
            </ChartCard>
          ) : (
            <section className="card card-pad">
              <div className="card-head">
                <div>
                  <h3>
                    <I.Scale size={19} /> Body weight
                  </h3>
                  <p>Log a second weigh-in on your profile and the trend appears here.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ------------------------------------------------- relative strength */}
      {data.currentWeightKg > 0 && data.lifts.some((l) => l.relative > 0) && (
        <section className="card card-pad">
          <div className="card-head">
            <div>
              <h3>
                <I.Trophy size={19} /> Strength for your size
              </h3>
              <p>
                Best estimated 1RM as a multiple of your {num(fromKg(data.currentWeightKg, units), 1)} {unit} body
                weight — comparable across time even as your weight changes.
              </p>
            </div>
          </div>
          <div className="chart-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lift</th>
                  <th>Best e1RM</th>
                  <th>× body weight</th>
                  <th>Last done</th>
                </tr>
              </thead>
              <tbody>
                {[...data.lifts]
                  .sort((a, b) => b.relative - a.relative)
                  .map((l) => (
                    <tr key={l.id}>
                      <td>{l.name}</td>
                      <td>
                        {num(fromKg(l.bestE1rm, units), 1)} {unit}
                      </td>
                      <td>{num(l.relative, 2)}×</td>
                      <td>{relativeDay(l.lastDate)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

function HeadlineTile({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: 'good' | 'warn' | 'neutral';
}) {
  return (
    <div className={`headline-tile ${tone}`}>
      <div className="headline-icon">{icon}</div>
      <div className="headline-label">{label}</div>
      <div className="headline-value">{value}</div>
      <div className="headline-sub">{sub}</div>
    </div>
  );
}

/** A row per lift: sparkline, delta, and the full chart when expanded. */
function LiftRow({
  lift,
  units,
  open,
  onToggle,
}: {
  lift: LiftProgress;
  units: Units;
  open: boolean;
  onToggle: () => void;
}) {
  const unit = weightLabel(units);
  const up = lift.deltaKg > 0;
  const flat = lift.deltaKg === 0;

  return (
    <div className={`lift-row ${open ? 'open' : ''}`}>
      <button className="lift-main" onClick={onToggle} aria-expanded={open}>
        <div className="lift-name">
          <strong>{lift.name}</strong>
          <span className="muted">
            {lift.sessions} {lift.sessions === 1 ? 'session' : 'sessions'} · {relativeDay(lift.lastDate)}
            {lift.stalled && <span className="stall-tag">stalled</span>}
          </span>
        </div>

        <Sparkline points={lift.points.map((p) => p.e1rm)} />

        <div className="lift-delta">
          <b className={up ? 'up' : flat ? '' : 'down'}>
            {up ? '+' : ''}
            {num(fromKg(lift.deltaKg, units), 1)} {unit}
          </b>
          <span className={up ? 'up' : flat ? '' : 'down'}>
            {up ? '▲' : flat ? '–' : '▼'} {num(Math.abs(lift.deltaPct), 1)}%
          </span>
        </div>

        <I.ChevronDown size={17} className={open ? 'flip' : ''} />
      </button>

      {open && (
        <div className="lift-detail">
          <div className="lift-facts">
            <div>
              <span>Start of range</span>
              <b>
                {num(fromKg(lift.firstE1rm, units), 1)} {unit}
              </b>
            </div>
            <div>
              <span>Latest</span>
              <b>
                {num(fromKg(lift.lastE1rm, units), 1)} {unit}
              </b>
            </div>
            <div>
              <span>All-time best</span>
              <b>
                {num(fromKg(lift.bestE1rm, units), 1)} {unit}
              </b>
            </div>
            {lift.relative > 0 && (
              <div>
                <span>× body weight</span>
                <b>{num(lift.relative, 2)}×</b>
              </div>
            )}
          </div>
          {lift.points.length > 1 ? (
            <LineChart
              points={lift.points.map((p) => ({ label: formatDate(p.date), value: fromKg(p.e1rm, units) }))}
              unit={` ${unit}`}
              height={200}
            />
          ) : (
            <p className="muted">One session in this range — nothing to plot yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

/** Inline trend, no axes. Shape only — the numbers are beside it. */
function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return <span className="spark-empty" aria-hidden />;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const w = 88;
  const h = 26;
  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (points.length - 1)) * w},${h - ((v - min) / span) * (h - 4) - 2}`)
    .join(' ');
  const rising = points[points.length - 1] >= points[0];

  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden focusable="false">
      <path d={d} fill="none" stroke={rising ? 'var(--good)' : 'var(--muted-ink)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

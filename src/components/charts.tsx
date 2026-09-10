/*
 * Hand-rolled SVG charts.
 *
 * Rules applied: one y-axis only, single-series charts carry no legend (the
 * title names them), thin marks with hairline solid grid, 4px rounded data-ends
 * anchored to the baseline, a 2px surface gap between adjacent fills, hover
 * tooltips on every mark, and a table view twin so no value is reachable by
 * tooltip alone.
 */
import { useState, type ReactNode } from 'react';
import { num } from '../lib/format';

/* ----------------------------------------------------------------- frame */

export function ChartCard({
  title,
  subtitle,
  icon,
  actions,
  table,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  table?: ReactNode;
  children: ReactNode;
}) {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  return (
    <section className="card card-pad">
      <div className="card-head">
        <div>
          <h3>
            {icon}
            {title}
          </h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="card-head-actions">
          {actions}
          {table && (
            <div className="toggle-view" role="group" aria-label={`${title} view`}>
              <button
                className={view === 'chart' ? 'on' : ''}
                onClick={() => setView('chart')}
                aria-pressed={view === 'chart'}
              >
                Chart
              </button>
              <button
                className={view === 'table' ? 'on' : ''}
                onClick={() => setView('table')}
                aria-pressed={view === 'table'}
              >
                Table
              </button>
            </div>
          )}
        </div>
      </div>
      {view === 'chart' || !table ? children : <div className="chart-scroll">{table}</div>}
    </section>
  );
}

/* ------------------------------------------------------------ math utils */

interface Scale {
  max: number;
  min: number;
  ticks: number[];
}

function niceScale(values: number[], zeroBased: boolean): Scale {
  const hi = Math.max(...values, 0);
  const lo = zeroBased ? 0 : Math.min(...values);
  if (hi === lo) return { min: zeroBased ? 0 : lo - 1, max: hi + 1, ticks: [lo, hi + 1] };
  const rawMin = zeroBased ? 0 : lo - (hi - lo) * 0.15;
  const span = hi - rawMin;
  const step = Math.pow(10, Math.floor(Math.log10(span / 4)));
  const norm = span / 4 / step;
  const mult = norm > 5 ? 10 : norm > 2 ? 5 : norm > 1 ? 2 : 1;
  const s = step * mult;
  const min = Math.floor(rawMin / s) * s;
  const max = Math.ceil(hi / s) * s;
  const ticks: number[] = [];
  for (let v = min; v <= max + s / 2; v += s) ticks.push(Number(v.toFixed(6)));
  return { min, max, ticks };
}

interface Hover {
  x: number;
  y: number;
  title: string;
  value: string;
}

function Tooltip({ hover, w, h }: { hover: Hover | null; w: number; h: number }) {
  if (!hover) return null;
  return (
    <div
      className="tooltip"
      style={{ left: `${(hover.x / w) * 100}%`, top: `${(hover.y / h) * 100}%` }}
      role="status"
    >
      <span className="muted">{hover.title}</span>
      <b>{hover.value}</b>
    </div>
  );
}

/* ------------------------------------------------------------ line chart */

export interface Point {
  label: string;
  value: number;
}

export function LineChart({
  points,
  unit = '',
  height = 260,
}: {
  points: Point[];
  unit?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<Hover | null>(null);
  const W = 720;
  const H = height;
  const pad = { top: 16, right: 22, bottom: 34, left: 48 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  if (points.length === 0) return <p className="muted">No data yet.</p>;

  const scale = niceScale(points.map((p) => p.value), false);
  const span = scale.max - scale.min || 1;
  const x = (i: number) => pad.left + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => pad.top + ih - ((v - scale.min) / span) * ih;

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)},${pad.top + ih} L${x(0).toFixed(1)},${pad.top + ih} Z`;
  const last = points[points.length - 1];

  // Thin out x labels so they never collide.
  const stride = Math.ceil(points.length / 6);

  return (
    <div className="chart-holder">
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Progression over time">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {scale.ticks.map((t) => (
          <g key={t}>
            <line className="chart-grid-line" x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} />
            <text className="chart-tick" x={pad.left - 10} y={y(t)} textAnchor="end" dominantBaseline="middle">
              {num(t, t % 1 === 0 ? 0 : 1)}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#line-fill)" />
        <path d={line} fill="none" stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={`${p.label}-${i}`}>
            <circle className="chart-point" cx={x(i)} cy={y(p.value)} r="4.5" fill="var(--series-1)" />
            <rect
              className="chart-hit"
              x={x(i) - 18}
              y={pad.top}
              width="36"
              height={ih}
              onMouseEnter={() =>
                setHover({ x: x(i), y: y(p.value), title: p.label, value: `${num(p.value, 1)}${unit}` })
              }
              onMouseLeave={() => setHover(null)}
            >
              <title>{`${p.label}: ${num(p.value, 1)}${unit}`}</title>
            </rect>
          </g>
        ))}

        {/* One selective direct label — the latest value — instead of a number on every point. */}
        <text
          className="chart-label"
          x={x(points.length - 1)}
          y={y(last.value) - 14}
          textAnchor="end"
          style={{ fontWeight: 700, fill: 'var(--text)' }}
        >
          {num(last.value, 1)}
          {unit}
        </text>

        <line className="chart-axis-line" x1={pad.left} x2={W - pad.right} y1={pad.top + ih} y2={pad.top + ih} />

        {points.map((p, i) =>
          i % stride === 0 || i === points.length - 1 ? (
            <text key={`x-${i}`} className="chart-tick" x={x(i)} y={H - 12} textAnchor="middle">
              {p.label}
            </text>
          ) : null,
        )}
      </svg>
      <Tooltip hover={hover} w={W} h={H} />
    </div>
  );
}

/* ------------------------------------------------------------- bar chart */

export function BarChart({
  bars,
  unit = '',
  height = 260,
}: {
  bars: Point[];
  unit?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<Hover | null>(null);
  const W = 720;
  const H = height;
  const pad = { top: 16, right: 16, bottom: 38, left: 54 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  if (bars.length === 0) return <p className="muted">No data yet.</p>;

  const scale = niceScale(bars.map((b) => b.value), true);
  const slot = iw / bars.length;
  // A 2px surface gap between adjacent fills, never a stroke around the mark.
  const bw = Math.min(56, slot - 12);
  const y = (v: number) => pad.top + ih - (v / (scale.max || 1)) * ih;
  const stride = Math.ceil(bars.length / 8);

  return (
    <div className="chart-holder">
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Totals by period">
        {scale.ticks.map((t) => (
          <g key={t}>
            <line className="chart-grid-line" x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} />
            <text className="chart-tick" x={pad.left - 10} y={y(t)} textAnchor="end" dominantBaseline="middle">
              {t >= 1000 ? `${num(t / 1000, 1)}k` : num(t)}
            </text>
          </g>
        ))}

        {bars.map((b, i) => {
          const cx = pad.left + slot * i + slot / 2;
          const top = y(b.value);
          const h = Math.max(0, pad.top + ih - top);
          return (
            <g key={`${b.label}-${i}`}>
              <rect
                x={cx - bw / 2}
                y={top}
                width={bw}
                height={h}
                rx={Math.min(4, h / 2)}
                fill="var(--series-1)"
              />
              <rect
                className="chart-hit"
                x={cx - slot / 2}
                y={pad.top}
                width={slot}
                height={ih}
                onMouseEnter={() => setHover({ x: cx, y: top, title: b.label, value: `${num(b.value)}${unit}` })}
                onMouseLeave={() => setHover(null)}
              >
                <title>{`${b.label}: ${num(b.value)}${unit}`}</title>
              </rect>
            </g>
          );
        })}

        <line className="chart-axis-line" x1={pad.left} x2={W - pad.right} y1={pad.top + ih} y2={pad.top + ih} />

        {bars.map((b, i) =>
          i % stride === 0 || i === bars.length - 1 ? (
            <text
              key={`bx-${i}`}
              className="chart-tick"
              x={pad.left + slot * i + slot / 2}
              y={H - 14}
              textAnchor="middle"
            >
              {b.label}
            </text>
          ) : null,
        )}
      </svg>
      <Tooltip hover={hover} w={W} h={H} />
    </div>
  );
}

/* ------------------------------------------------- two-part split (bar) */

/**
 * Part-to-whole for exactly two parts. A 2-slice donut is the anti-pattern this
 * replaces: a split bar with direct labels reads the ratio far more precisely.
 */
export function SplitBar({
  parts,
  unit,
}: {
  parts: { label: string; value: number; color: string }[];
  unit: string;
}) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  if (total <= 0) return <p className="muted">No energy expenditure logged yet.</p>;

  return (
    <div>
      <div className="split-bar" role="img" aria-label={parts.map((p) => `${p.label} ${num(p.value)}${unit}`).join(', ')}>
        {parts.map((p) => (
          <div
            key={p.label}
            className="split-seg"
            style={{ flexGrow: Math.max(p.value, total * 0.005), background: p.color }}
            title={`${p.label}: ${num(p.value)}${unit}`}
          />
        ))}
      </div>
      <div className="split-legend">
        {parts.map((p) => (
          <div key={p.label} className="split-legend-row">
            <span className="legend-swatch" style={{ background: p.color }} />
            <span>{p.label}</span>
            <b>
              {num(p.value)} {unit} · {num((p.value / total) * 100)}%
            </b>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- horizontal bars */

/**
 * Ranked categories. Horizontal because the labels are words: a vertical bar
 * chart with seven muscle names underneath it is unreadable on a phone.
 */
export function HorizontalBars({
  rows,
  unit = '',
}: {
  rows: { label: string; value: number }[];
  unit?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  if (!rows.length) return <p className="muted">No data yet.</p>;
  return (
    <div className="hbars">
      {rows.map((r) => (
        <div key={r.label} className="hbar-row">
          <span className="hbar-label">{r.label}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </div>
          <b className="hbar-value">
            {num(r.value)}
            {unit}
          </b>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- heatmap */

export function Heatmap({ days }: { days: { date: string; value: number; label: string }[] }) {
  const max = Math.max(...days.map((d) => d.value), 1);
  const steps = ['var(--seq-100)', 'var(--seq-250)', 'var(--seq-400)', 'var(--seq-550)', 'var(--seq-700)'];
  const color = (v: number) => {
    if (v <= 0) return 'var(--surface-3)';
    const idx = Math.min(steps.length - 1, Math.floor((v / max) * steps.length));
    return steps[idx];
  };
  return (
    <div>
      <div className="heat-grid">
        {days.map((d) => (
          <div key={d.date} className="heat-cell" style={{ background: color(d.value) }} title={`${d.label}`} />
        ))}
      </div>
      <div className="legend" style={{ marginTop: 14, marginBottom: 0, alignItems: 'center', gap: 6 }}>
        <span className="muted">Less</span>
        {['var(--surface-3)', ...steps].map((c) => (
          <span key={c} className="legend-swatch" style={{ background: c, width: 13, height: 13 }} />
        ))}
        <span className="muted">More</span>
      </div>
    </div>
  );
}

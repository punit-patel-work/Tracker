import { useEffect, useId, useState } from 'react';
import { num } from '../lib/format';

export interface TrendPoint { label: string; value: number; }

/** Mouse, touch, keyboard and a table all expose the same observations. */
export default function InteractiveTrend({ points, selected, onSelect, unit, label, variant = 'bar', target }: {
  points: TrendPoint[]; selected: number; onSelect: (index: number) => void;
  unit: string; label: string; variant?: 'bar' | 'line'; target?: number;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(600);
  const [hovered, setHovered] = useState<number | null>(null);
  const descriptionId = useId();
  useEffect(() => {
    if (!element) return;
    const update = () => setWidth(Math.max(220, element.getBoundingClientRect().width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  useEffect(() => setHovered(null), [points]);
  if (!points.length) return <div className="trend-empty">No observations in this date range.</div>;
  const height = 230;
  const pad = { left: 43, right: 14, top: 20, bottom: 32 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const maximum = Math.max(1, target ?? 0, ...points.map((point) => point.value));
  const minimum = variant === 'line' ? Math.max(0, Math.min(...points.map((point) => point.value)) - Math.max(1, (maximum - Math.min(...points.map((point) => point.value))) * .15)) : 0;
  // Whole-number ticks for counts, sensible larger intervals for loads and volume.
  const rawStep = (maximum - minimum) / 4;
  const step = Math.max(unit === 'sets' || unit === 'sessions' ? 1 : .1, Math.ceil(rawStep / 10 ** Math.floor(Math.log10(rawStep))) * 10 ** Math.floor(Math.log10(rawStep)));
  const bottom = Math.floor(minimum / step) * step;
  const top = Math.ceil(maximum / step) * step;
  const ticks = Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, i) => bottom + i * step);
  const slot = plotWidth / points.length;
  const x = (index: number) => pad.left + slot * (index + .5);
  const y = (value: number) => pad.top + plotHeight * (1 - (value - bottom) / (top - bottom));
  const current = Math.min(Math.max(0, selected), points.length - 1);
  const inspection = points[hovered ?? current] ?? points[current];
  const stride = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(plotWidth / 86))));
  const displayUnit = (value: number) => value === 1 && (unit === 'sessions' || unit === 'sets') ? unit.slice(0, -1) : unit;
  const path = points.map((point, i) => `${i ? 'L' : 'M'}${x(i)},${y(point.value)}`).join(' ');
  return <div ref={setElement} className="interactive-trend">
    <div className="trend-inspection"><span>{inspection.label}</span><strong>{num(inspection.value, 1)} <small>{displayUnit(inspection.value)}</small></strong></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={label} aria-describedby={descriptionId} onPointerLeave={() => setHovered(null)}>
      {ticks.map((tick) => <g key={tick}><line className="chart-grid-line" x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} />
        <text className="chart-tick" x={pad.left - 9} y={y(tick)} textAnchor="end" dominantBaseline="middle">{tick >= 10000 ? `${num(tick / 1000, 1)}k` : num(tick, tick % 1 ? 1 : 0)}</text></g>)}
      {target !== undefined && target > 0 && <g><line x1={pad.left} x2={width - pad.right} y1={y(target)} y2={y(target)} stroke="var(--text-3)" strokeDasharray="4 5" />
        <text className="chart-tick" x={width - pad.right} y={y(target) - 6} textAnchor="end">Goal {num(target)}</text></g>}
      {variant === 'line' && <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />}
      {points.map((point, i) => <g key={`${point.label}-${i}`} role="button" tabIndex={i === current ? 0 : -1} data-point={i}
        className={`trend-mark ${i === current ? 'selected' : ''}`} aria-label={`${point.label}: ${num(point.value, 1)} ${displayUnit(point.value)}`} aria-pressed={i === current}
        onClick={() => onSelect(i)} onPointerEnter={() => setHovered(i)} onFocus={() => onSelect(i)}
        onKeyDown={(event) => {
          let next = i;
          if (event.key === 'ArrowRight') next = Math.min(points.length - 1, i + 1);
          else if (event.key === 'ArrowLeft') next = Math.max(0, i - 1);
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = points.length - 1;
          else if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault(); setHovered(null); onSelect(next);
          event.currentTarget.ownerSVGElement?.querySelector<SVGGElement>(`[data-point="${next}"]`)?.focus();
        }}>
        <rect className="trend-hit" x={x(i) - slot / 2} y={pad.top} width={slot} height={plotHeight + 1} fill="transparent" />
        {variant === 'bar' ? <rect className="trend-bar" x={x(i) - Math.max(2, Math.min(28, slot - 5)) / 2} y={y(point.value || .012 * top)}
          width={Math.max(2, Math.min(28, slot - 5))} height={Math.max(2, plotHeight * point.value / top)} rx="3" /> :
          <circle className="trend-dot" cx={x(i)} cy={y(point.value)} r={i === current ? 6 : 4} />}
        {i === current && <line x1={x(i)} x2={x(i)} y1={pad.top + plotHeight + 5} y2={pad.top + plotHeight + 9} stroke="var(--accent)" strokeWidth="3" />}
      </g>)}
      {points.map((point, i) => (i % stride === 0 && x(points.length - 1) - x(i) >= 86) || i === points.length - 1 ?
        <text className="chart-tick" key={i} x={x(i)} y={height - 8} textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}>{point.label}</text> : null)}
    </svg>
    <p id={descriptionId} className="trend-help">Select a {variant === 'bar' ? 'week' : 'point'} to explore. Use ← → when the chart is focused.</p>
  </div>;
}

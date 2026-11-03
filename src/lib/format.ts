import type { Units } from './types';

export const KG_PER_LB = 0.45359237;

export function todayISO(d = new Date()): string {
  // Local calendar day — never toISOString(), which shifts across UTC midnight.
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function shiftDays(iso: string, delta: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + delta);
  return todayISO(d);
}

export function formatDate(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatLongDate(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function relativeDay(iso: string): string {
  const diff = Math.round((parseISO(todayISO()).getTime() - parseISO(iso).getTime()) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 14) return 'Last week';
  if (diff < 60) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

export function clock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function num(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/* ------------------------------------------------------------------ units */

/** Everything is stored in kg; conversion happens only at the display edge. */
export function fromKg(kg: number | null | undefined, units: Units): number {
  if (kg == null) return 0;
  return units === 'imperial' ? kg / KG_PER_LB : kg;
}

export function toKg(value: number | null | undefined, units: Units): number | null {
  if (value == null || Number.isNaN(value)) return null;
  return units === 'imperial' ? value * KG_PER_LB : value;
}

export function weightLabel(units: Units): string {
  return units === 'imperial' ? 'lb' : 'kg';
}

export function distanceLabel(units: Units): string {
  return units === 'imperial' ? 'mi' : 'km';
}

export function fromKm(km: number | null | undefined, units: Units): number {
  if (km == null) return 0;
  return units === 'imperial' ? km / 1.609344 : km;
}

export function toKm(value: number | null | undefined, units: Units): number | null {
  if (value == null || Number.isNaN(value)) return null;
  return units === 'imperial' ? value * 1.609344 : value;
}

/** Rounds a display weight to something you can actually load on a bar. */
export function roundLoadable(value: number, units: Units): number {
  const step = units === 'imperial' ? 2.5 : 1.25;
  return Math.round(value / step) * step;
}

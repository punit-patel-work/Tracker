/** Calendar-based analytics shared by the API, UI and focused regression tests. */
export function shiftDate(iso, days) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function mondayOf(iso) {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return shiftDate(iso, -((day + 6) % 7));
}

/** N calendar weeks, including the current partial week. */
export function progressRangeStart(today, weeks) {
  return shiftDate(mondayOf(today), -(Math.max(1, weeks) - 1) * 7);
}

/** Fill gaps explicitly. No logged workout is a zero, not an omitted week. */
export function fillWeeks(rows, from, today) {
  const byWeek = new Map(rows.map((row) => [row.week, row]));
  const result = [];
  for (let week = mondayOf(from); week <= today; week = shiftDate(week, 7)) {
    result.push({ week, volumeKg: 0, kcal: 0, sessions: 0, minutes: 0, cardioMinutes: 0, workingSets: 0, ...byWeek.get(week) });
  }
  return result;
}

/** A percentage change has no meaningful baseline when the previous value is zero. */
export function percentChange(current, previous) {
  return previous > 0 ? ((current - previous) / previous) * 100 : null;
}

/** Never borrow points from outside the selected window to manufacture a trend. */
export function summarizeLift(points, from, today) {
  const scoped = points.filter((point) => point.date >= from && point.date <= today && Number.isFinite(point.e1rm) && point.e1rm > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const first = scoped[0]?.e1rm ?? null;
  const latest = scoped[scoped.length - 1]?.e1rm ?? null;
  const delta = scoped.length >= 2 ? latest - first : null;
  return { points: scoped, first, latest, best: scoped.length ? Math.max(...scoped.map((point) => point.e1rm)) : null,
    delta, percent: delta === null ? null : percentChange(latest, first) };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { fillWeeks, mondayOf, percentChange, progressRangeStart, shiftDate, summarizeLift } from '../shared/progress.js';

test('calendar ranges include the current week and handle year/DST boundaries', () => {
  assert.equal(progressRangeStart('2026-10-12', 6), '2026-09-07');
  assert.equal(progressRangeStart('2026-10-18', 6), '2026-09-07');
  assert.equal(mondayOf('2026-01-01'), '2025-12-29');
  assert.equal(shiftDate('2026-03-08', 1), '2026-03-09');
  assert.equal(shiftDate('2024-03-01', -1), '2024-02-29');
});

test('inactive weeks remain visible and older/future activity is excluded', () => {
  const weeks = fillWeeks([{ week: '2026-09-28', sessions: 2 }, { week: '2026-10-12', sessions: 1 },
    { week: '2026-08-24', sessions: 10 }, { week: '2026-10-19', sessions: 5 }], '2026-09-28', '2026-10-14');
  assert.deepEqual(weeks.map((w) => w.sessions), [2, 0, 1]);
  assert.equal(weeks[1].workingSets, 0);
});

test('single-session and zero-baseline values do not imply a percentage trend', () => {
  assert.equal(percentChange(3, 0), null);
  assert.equal(percentChange(0, 3), -100);
  const lift = summarizeLift([{ date: '2026-09-01', e1rm: 70 }, { date: '2026-10-01', e1rm: 100 }], '2026-09-07', '2026-10-12');
  assert.equal(lift.latest, 100);
  assert.equal(lift.delta, null);
  assert.equal(lift.percent, null);
});

test('lift comparisons sort points and exclude future, invalid, and out-of-range records', () => {
  const lift = summarizeLift([{ date: '2026-10-10', e1rm: 90 }, { date: '2026-09-10', e1rm: 100 },
    { date: '2026-11-01', e1rm: 200 }, { date: '2026-08-01', e1rm: 50 }, { date: '2026-10-01', e1rm: NaN }], '2026-09-07', '2026-10-12');
  assert.equal(lift.first, 100);
  assert.equal(lift.latest, 90);
  assert.equal(lift.best, 100);
  assert.equal(lift.percent, -10);
  assert.equal(summarizeLift([], '2026-09-07', '2026-10-12').latest, null);
});

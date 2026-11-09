import { useEffect, useState } from 'react';
import { weekKey } from '../../shared/engine.js';
import { aiApi } from '../lib/ai';
import { formatDate, shiftDays, todayISO } from '../lib/format';
import { useApp } from '../state/app';

type Slot = { date: string; routineId: string };
type Week = { revision: number; slots: Slot[]; completed: Slot[]; preferredDays: string[] };
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export default function WeeklyPlanner() {
  const { routines } = useApp();
  const [week, setWeek] = useState(() => weekKey(todayISO()));
  const [plan, setPlan] = useState<Week | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  const path = '/coaching/weeks/' + week;
  const dirty = plan && JSON.stringify(plan.slots) !== JSON.stringify(slots);
  useEffect(() => {
    const controller = new AbortController();
    setPlan(null); setNotice(''); setError('');
    aiApi<Week>(path, 'GET', undefined, controller.signal).then(data => {
      if (!controller.signal.aborted) { setPlan(data); setSlots(data.slots); }
    }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [path, retry]);
  const setSlot = (date: string, routineId: string) => {
    setNotice('');
    setSlots(old => [...old.filter(s => s.date !== date), ...(routineId ? [{ date, routineId }] : [])].sort((a,b) => a.date.localeCompare(b.date)));
  };
  async function save() {
    if (!plan || saving) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const result = await aiApi<{ revision: number }>(path, 'PUT', { revision: plan.revision, slots });
      setPlan({ ...plan, revision: result.revision, slots }); setNotice('Week saved.');
    } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  }
  function fill() {
    if (!plan) return;
    const choices = plan.preferredDays.length ? plan.preferredDays : weekdays.slice(0, Math.min(routines.length, 7));
    const days = weekdays.filter(day => choices.includes(day));
    const draft = [...slots];
    days.forEach((day, i) => {
      const date = shiftDays(week, weekdays.indexOf(day));
      if (!draft.some(s => s.date === date)) draft.push({ date, routineId: routines[i % routines.length].id });
    });
    setSlots(draft.sort((a,b) => a.date.localeCompare(b.date))); setNotice('');
  }
  const changeWeek = (days: number) => {
    if (!dirty || window.confirm('Discard unsaved changes to this week?')) setWeek(shiftDays(week, days));
  };
  return <section className="card card-pad stack coach-planner"><h2>Weekly planner</h2>
    <div className="dialog-actions planner-date-nav"><button className="btn btn-ghost" disabled={saving} onClick={() => changeWeek(-7)}>Previous week</button>
      <strong>{formatDate(week)} – {formatDate(shiftDays(week,6))}</strong><button className="btn btn-ghost" disabled={saving} onClick={() => changeWeek(7)}>Next week</button></div>
    {error && <p role="alert">{error} <button className="link-btn" onClick={() => setRetry(n => n+1)}>Reload saved week</button></p>}
    {notice && <p role="status">{notice}</p>}
    {!plan && !error && <p>Loading week…</p>}
    {plan && <><button className="btn btn-ghost" disabled={!routines.length || saving} onClick={fill}>Fill open training days</button>
      {weekdays.map((day, i) => {
        const date = shiftDays(week,i);
        const slot = slots.find(s => s.date === date);
        const done = slot && plan.completed.some(s => s.date === date && s.routineId === slot.routineId);
        return <div className="form-grid planner-day" key={date}><label className="field">{day} · {formatDate(date)} {done ? '· Completed' : slot && date < todayISO() ? '· Missed' : ''}
          <select className="input" value={slot?.routineId ?? ''} disabled={saving} onChange={e => setSlot(date,e.target.value)}>
            <option value="">Rest / unscheduled</option>
            {slot && !routines.some(r => r.id === slot.routineId) && <option value={slot.routineId}>Archived routine</option>}
            {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
          {slot && !done && <label className="field">Move session<select className="input" value="" disabled={saving} onChange={e => {
            const dest = e.target.value;
            if (dest) { setSlots(old => old.map(s => s.date === date ? { ...s, date: dest } : s).sort((a,b) => a.date.localeCompare(b.date))); setNotice(''); }
          }}><option value="">Choose an open day</option>{weekdays.map((d,j) => ({ d, date: shiftDays(week,j) })).filter(s => !slots.some(x => x.date === s.date)).map(s => <option key={s.date} value={s.date}>{s.d}</option>)}</select></label>}
        </div>;
      })}
      <button className="btn btn-primary" disabled={!dirty || saving} onClick={() => void save()}>Save week</button>
    </>}
  </section>;
}

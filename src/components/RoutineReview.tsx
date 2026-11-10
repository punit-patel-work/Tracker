import { useEffect, useState } from 'react';
import { aiApi } from '../lib/ai';
import { useExerciseUnits } from '../lib/exerciseUnits';
import { fromKg, weightLabel } from '../lib/format';
import { useApp } from '../state/app';
import type { Routine } from '../lib/types';

type Target = { targetSets: number; targetReps: number; targetWeightKg: number | null };
type Row = { exerciseId: string; name: string; current: Target; proposed: Target | null; reason: string;
  evidence: { id: string; date: string; name: string }[] };
type Review = { summary: string; changes: { exerciseId: string; reason: string; evidenceIds: string[] }[] };
type Data = { rows: Row[]; stamp: string; revision: number; canUndo: boolean; review: Review | null };

export default function RoutineReview({ routine, onClose }: { routine: Routine; onClose: () => void }) {
  const { byId, reloadRoutines } = useApp();
  const [data, setData] = useState<Data | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const path = '/coaching/routines/' + routine.id;
  const exerciseUnits = useExerciseUnits();
  useEffect(() => {
    const controller = new AbortController();
    setData(null); setSelected([]); setError('');
    aiApi<Data>(path, 'GET', undefined, controller.signal).then(value => {
      if (!controller.signal.aborted) setData(value);
    }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [path, refresh]);

  function describe(target: Target, row: Row) {
    const original = routine.exercises.find(e => e.exerciseId === row.exerciseId);
    const ex = byId.get(row.exerciseId);
    if (ex?.type === 'cardio') return (original?.targetCardioMin ?? '—') + ' min';
    if (ex?.isTimed) return target.targetSets + ' × ' + (original?.targetDurationSec ?? '—') + ' sec';
    const units = exerciseUnits.forExercise(row.exerciseId);
    const weight = target.targetWeightKg == null ? '' : ' at ' + Number(fromKg(target.targetWeightKg, units).toFixed(2)) + ' ' + weightLabel(units);
    return target.targetSets + ' × ' + target.targetReps + weight;
  }
  async function run(action: 'review' | 'apply' | 'undo') {
    if (busy || !data) return;
    setBusy(true); setError(''); setNotice('');
    try {
      if (action === 'review') {
        const response = await aiApi<{ draft: { result: Review } }>(path + '/review', 'POST', { consent, stamp: data.stamp });
        setData({ ...data, review: response.draft.result });
      } else {
        await aiApi(path + '/' + action, 'POST', { revision: data.revision, stamp: data.stamp, exerciseIds: selected });
        await reloadRoutines();
        setNotice(action === 'undo' ? 'Previous routine targets restored.' : 'Selected targets saved for your next workout.');
        setRefresh(n => n + 1);
      }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <section className="card card-pad stack">
    <button className="link-btn" disabled={busy} onClick={onClose}>← Back to routines</button>
    <h2>{routine.name} · Next workout</h2>
    {error && <div role="alert">{error} <button className="btn btn-ghost" onClick={() => setRefresh(n => n + 1)}>Refresh review</button></div>}
    {notice && <p role="status">{notice}</p>}
    {!data && !error && <p role="status">Checking recent workouts…</p>}
    {data && <>
      {data.review ? <section><h3>Coach review</h3><p>{data.review.summary}</p></section> :
        <div className="stack"><label><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/> Share this routine, preferences and relevant logs with OpenAI for a review</label>
          <button className="btn btn-ghost" disabled={!consent || busy} onClick={() => void run('review')}>Request AI review</button></div>}
      {data.rows.map(row => {
        const advice = data.review?.changes.find(c => c.exerciseId === row.exerciseId);
        return <article key={row.exerciseId} className="card card-pad">
          <h3>{row.name}</h3><p>{describe(row.current, row)}{row.proposed && <> → <strong>{describe(row.proposed, row)}</strong></>}</p>
          <p>{row.reason}</p>{advice && <p><strong>Coach review</strong> · {advice.reason}</p>}
          {row.evidence.length > 0 && <p className="hint">Based on {row.evidence.map(e => e.name + ' (' + e.date + ')').join(', ')}</p>}
          {row.proposed && <label><input type="checkbox" disabled={busy} checked={selected.includes(row.exerciseId)} onChange={e =>
            setSelected(old => e.target.checked ? [...old, row.exerciseId] : old.filter(id => id !== row.exerciseId))}/> Apply this change</label>}
        </article>;
      })}
      <div className="dialog-actions"><button className="btn btn-primary" disabled={busy || !selected.length} onClick={() => void run('apply')}>Apply selected ({selected.length})</button>
        {data.canUndo && <button className="btn btn-ghost" disabled={busy} onClick={() => void run('undo')}>Undo last adjustment</button>}</div>
    </>}
  </section>;
}

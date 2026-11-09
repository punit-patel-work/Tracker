import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { aiApi, type AiDraft } from '../lib/ai';
import { useApp } from '../state/app';
import type { Session } from '../lib/types';
export default function CoachQuestion({ onAnswer, enabled, onBusyChange }: { onAnswer: (draft: AiDraft) => void; enabled: boolean; onBusyChange?: (busy: boolean) => void }) {
  const { exercises, routines } = useApp();
  const [kind, setKind] = useState('routine');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [consent, setConsent] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  useEffect(() => {
    if (kind !== 'workout') return;
    let active = true;
    api.sessions(100).then(r => { if (active) setSessions(r.sessions); }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [kind]);
  const options = kind === 'exercise' ? exercises : kind === 'routine' ? routines : sessions;
  async function ask() {
    if (busy) return;
    setBusy(true); onBusyChange?.(true); setError('');
    try {
      const response = await aiApi<{ draft: AiDraft }>('/coaching/question','POST',{ consent, subjectType: kind, subjectId: subject, question });
      onAnswer(response.draft);
    } catch(e) { setError((e as Error).message); } finally { setBusy(false); onBusyChange?.(false); }
  }
  return <section className="card card-pad stack"><h2>Ask about your training</h2>
    <fieldset className="ai-fieldset stack" disabled={busy}>
      <label className="field">Ask about<select className="input" value={kind} onChange={e => { setKind(e.target.value); setSubject(''); setError(''); }}>
        <option value="routine">A routine</option><option value="exercise">An exercise</option><option value="workout">A completed workout</option></select></label>
      <label className="field">Training record<select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
        <option value="">Choose a record</option>{options.map(o => <option key={o.id} value={o.id}>{'date' in o ? o.date + ' · ' : ''}{o.name}</option>)}</select></label>
      <label className="field">Your question<textarea className="input" maxLength={700} value={question} onChange={e => setQuestion(e.target.value)}/></label>
      <label><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/> Share this question and relevant training data with OpenAI</label>
      {!enabled && <p>AI questions are currently unavailable.</p>}
      <button className="btn btn-primary" disabled={!enabled || !subject || !question.trim() || !consent} onClick={() => void ask()}>{busy ? 'Preparing answer…' : 'Ask coach'}</button>
    </fieldset>{error && <p role="alert">{error}</p>}
  </section>;
}

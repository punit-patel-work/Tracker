import * as I from '../components/Icon';
import WeeklyPlanner from '../components/WeeklyPlanner';
import CoachQuestion from '../components/CoachQuestion';
import { useEffect,useRef,useState } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import { aiApi,equipmentLabels,type TrainingPreferences,type Bootstrap,type AiDraft,type RoutineResult,type InsightResult,type AiExercise } from '../lib/ai';
import { fromKg,toKg,weightLabel,num } from '../lib/format';
import type { Exercise, Session } from '../lib/types';
import ExerciseAlternatives from '../components/ExerciseAlternatives';
import { useExerciseUnits } from '../lib/exerciseUnits';
import ExercisePicker from '../components/ExercisePicker';
import '../styles/ai.css';
const tools = [
  { id: 'routine', label: 'Build a routine', icon: I.Layers },
  { id: 'planner', label: 'Weekly planner', icon: I.Calendar },
  { id: 'review', label: 'Review my week', icon: I.TrendingUp },
  { id: 'explanation', label: 'Explain a workout', icon: I.Activity },
  { id: 'question', label: 'Ask a question', icon: I.HelpCircle },
  { id: 'saved', label: 'Saved suggestions', icon: I.Save },
] as const;
type CoachTool = typeof tools[number]['id'];
const stepNames = ['Goals & schedule', 'Training background', 'Equipment & preferences'];
const weekdays=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const goals=[['general','General fitness'],['hypertrophy','Build muscle'],['strength','Build strength'],['fat-loss','Support fat loss']];
export default function AiCoach() {
  const {user,exercises,reloadRoutines,offline}=useApp();
  const [boot,setBoot]=useState<Bootstrap|null>(null),[prefs,setPrefs]=useState<TrainingPreferences|null>(null);
  const [tab,setTab]=useState<CoachTool>('routine'),[step,setStep]=useState(0);
  const [draft,setDraft]=useState<AiDraft|null>(null),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [busy,setBusy]=useState(false),[consent,setConsent]=useState(false),[loading,setLoading]=useState(true);
  const [sessions,setSessions]=useState<Session[]>([]),[sessionId,setSessionId]=useState(''),[topic,setTopic]=useState('Explain exercise selection and rep targets');
  const [retry,setRetry]=useState(0),[excluding,setExcluding]=useState(false);
  const [moreSaved,setMoreSaved]=useState(true);
  const [toolBusy, setToolBusy] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { stepHeading.current?.focus(); }, [step]);
  const alive=useRef(true);
  useEffect(()=>{alive.current=true;return ()=>{alive.current=false;};},[]);
  useEffect(()=>{
    const c=new AbortController();setLoading(true);setError('');
    aiApi<Bootstrap>('/bootstrap','GET',undefined,c.signal).then(b=>{
      if(c.signal.aborted)return;setBoot(b);
      setPrefs(b.preferences??{goal:user?.goal??'general',experience:'new',trainingMonths:0,breakWeeks:0,days:Math.min(6,user?.weeklyTarget??3),minutes:45,
        equipment:['full_gym'],preferredDays:[],priorities:[],gender:'unspecified',
        age:user?.birthYear?new Date().getFullYear()-user.birthYear:null,weightKg:user?.currentWeightKg||null,heightCm:user?.heightCm??null,
        excludedExerciseIds:[],preferences:'',limitations:''});
    }).catch(e=>{if(!c.signal.aborted)setError(e.message);}).finally(()=>{if(!c.signal.aborted)setLoading(false);});
    return ()=>c.abort();
  },[user?.id,retry]);
  useEffect(()=>{
    if(tab!=='explanation')return;
    let active=true;
    api.sessions(100).then(r=>{if(active){const done=r.sessions.filter(s=>s.status==='completed');setSessions(done);setSessionId(s=>s||done[0]?.id||'');}}).catch(e=>{if(active)setError(e.message);});
    return ()=>{active=false;};
  },[tab]);
  const patch=(p:Partial<TrainingPreferences>)=>setPrefs(old=>old?{...old,...p}:old);
  const toggle=(key:'equipment'|'priorities'|'preferredDays',value:string)=>{if(!prefs)return;const next=prefs[key].includes(value)?prefs[key].filter(x=>x!==value):[...prefs[key],value];patch({[key]:key==='equipment'?(value==='full_gym'&&next.includes(value)?['full_gym']:next.filter(x=>x!=='full_gym')):next});};
  const run=async()=>{
    if(busy||!prefs)return;setBusy(true);setError('');setNotice('');
    try {
      const path=tab==='routine'?'/routine-draft':tab==='review'?'/weekly-review':'/workout-explanation';
      const body=tab==='routine'?{preferences:prefs,consent}:tab==='review'?{consent}:{consent,sessionId,topic};
      const result=await aiApi<{draft:AiDraft;cached:boolean}>(path,'POST',body);
      if(alive.current){setMoreSaved(true);setDraft(result.draft);setBoot(b=>b?{...b,drafts:[result.draft,...b.drafts.filter(d=>d.id!==result.draft.id)].slice(0,8)}:b);setNotice(result.cached?'Your saved suggestion is ready.':'Your suggestion is ready to review.');}
    }catch(e){if(alive.current)setError((e as Error).message);}finally{if(alive.current)setBusy(false);}
  };
  const savePrefs=async()=>{if(!prefs)return;setBusy(true);setError('');try{await aiApi('/preferences','PUT',prefs);setNotice('Training preferences saved.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const selectTab=(t:CoachTool)=>{if (t === tab) return; setTab(t);setDraft(null);setError('');setNotice('');};
  async function removeSuggestion(id:string) {
    if (!window.confirm('Remove this suggestion from your saved list? Your saved routines will stay available.')) return;
    setBusy(true); setError('');
    try {
      await aiApi('/drafts/'+id,'DELETE');
      setBoot(b => b && ({...b,drafts:b.drafts.filter(d=>d.id!==id)}));
      try { sessionStorage.removeItem('gt.aiDraft.'+user?.id+'.'+id); } catch {}
      const fresh = await aiApi<Bootstrap>('/bootstrap');
      setBoot(fresh); setMoreSaved(true);
    } catch(err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  async function olderSuggestions() {
    if (!boot?.drafts.length) return;
    setBusy(true); setError('');
    try {
      const page=await aiApi<{drafts:AiDraft[];more:boolean}>('/drafts?before='+boot.drafts[boot.drafts.length-1].id);
      setBoot(b=>b && ({...b,drafts:[...b.drafts,...page.drafts]})); setMoreSaved(page.more);
    } catch(err) {setError((err as Error).message);} finally {setBusy(false);}
  }
  if(loading)return <div className="card card-pad" role="status">Loading AI Coach…</div>;
  if(!boot||!prefs)return <div className="card card-pad"><p role="alert">{error||'Could not load AI Coach.'}</p><button className="btn btn-primary" onClick={()=>setRetry(x=>x+1)}>Try again</button></div>;
  const tier=boot.aiTier ?? user?.aiTier ?? 'regular';
  const disabled=busy||offline||!boot.enabled||!boot.configured||tier==='regular';
  const units=user?.units??'metric';
  return <div className="stack ai-page">
    <header className="page-head coach-heading"><h1 className="page-title"><I.Sparkles size={24}/> AI Coach</h1></header>
    <nav className="coach-tools" aria-label="Coach tools">
      {tools.map(({ id, label, icon: Icon }) => <button type="button" key={id}
        disabled={busy || toolBusy} aria-current={tab === id ? 'page' : undefined}
        onClick={() => selectTab(id)}><Icon size={18}/><span>{label}</span></button>)}
    </nav>
    <div className="coach-tool-picker"><label htmlFor="coach-tool">Coach tool</label>
      <select id="coach-tool" className="input" value={tab} disabled={busy || toolBusy} onChange={e => selectTab(e.target.value as CoachTool)}>
        {tools.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
      </select>
    </div>
    <p className="hint">{tier==='regular' ? 'Regular account · AI generation requires Pro or Dev.' : tier==='pro' ? 'Pro · 4 generation requests per 24 hours and 25 per 7 days. Reusing a saved answer is free.' : 'Dev · No personal request limit.'}</p>
    {(!boot.enabled||!boot.configured||offline)&&<p className="offline-note">{offline?'Connect to use AI assistance.':!boot.configured?'AI is not configured on the server.':'AI assistance is paused. Saved suggestions remain available.'}</p>}
    {error&&<p className="form-error" role="alert">{error}</p>}{notice&&<p className="ai-notice" role="status">{notice}</p>}
    {tab === 'planner' ? <WeeklyPlanner/> : tab === 'question' ? <CoachQuestion enabled={!disabled} onBusyChange={setToolBusy} onAnswer={answer => {
      setBoot(b => b && ({ ...b, drafts: [answer, ...b.drafts.filter(d => d.id !== answer.id)].slice(0,8) }));
      setMoreSaved(true); setTab('saved'); setDraft(answer); setError(''); setNotice('');
    }}/> : tab==='saved' ? !draft && <section className="card card-pad"><h2>Saved suggestions</h2><p className="muted">Reopen a suggestion without generating it again. Historical suggestions may need updating as your training changes.</p>
      {!boot.drafts.length?<p>No suggestions yet. Start with your training preferences.</p>:<div className="stack">{boot.drafts.map(d=><div className="saved-suggestion-row" key={d.id}><button disabled={busy} className="ai-saved" onClick={()=>setDraft(d)}><strong>{d.task==='routine'?(d.result as RoutineResult).title:d.task==='review'?'Weekly review':d.task==='question'?(d.question || 'Coaching question'):'Workout explanation'}</strong><span>{new Date(d.createdAt).toLocaleString()}</span></button><button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={()=>void removeSuggestion(d.id)}>Remove</button></div>)}
        {moreSaved && boot.drafts.length>=8 && <button className="btn btn-ghost" disabled={busy} onClick={()=>void olderSuggestions()}>Show older suggestions</button>}</div>}</section>
    :!draft&&<section className={tab === 'routine' ? 'card coach-builder' : 'card card-pad stack'}>
      {tab==='routine'?<>
        <header className="coach-step" aria-live="polite">
          <div><span>Step {step + 1} of {stepNames.length}</span><h2 ref={stepHeading} tabIndex={-1}>{stepNames[step]}</h2></div>
          <div className="coach-step-meter" aria-hidden="true">{stepNames.map((name, index) =>
            <i key={name} className={index <= step ? 'reached' : ''}/>)}</div>
        </header>
        <form onSubmit={e=>{e.preventDefault();if(step<2)setStep(step+1);else void run();}}>
        <fieldset disabled={busy} className="ai-fieldset">
        {step===0&&<div className="form-grid coach-schedule">
          <label className="field ai-span">Main goal<select className="input" value={prefs.goal} onChange={e=>patch({goal:e.target.value})}>{goals.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
          <label className="field">Days per week<input className="input" required type="number" min={1} max={6} value={prefs.days} onChange={e=>patch({days:Number(e.target.value),preferredDays:[]})}/></label>
          <label className="field">Minutes per session<input className="input" required type="number" min={15} max={120} step={5} value={prefs.minutes} onChange={e=>patch({minutes:Number(e.target.value)})}/></label>
          <div className="field ai-span"><span>Preferred weekdays (optional)</span><div className="ai-chips coach-weekdays">{weekdays.map(day=><label key={day}><input type="checkbox" checked={prefs.preferredDays.includes(day)} onChange={()=>toggle('preferredDays',day)}/>{day}</label>)}</div><small>Leave open, or choose {prefs.days} days.</small></div>
          <div className="field ai-span"><span>Areas to prioritize (optional)</span><div className="ai-chips">{['Chest','Back','Legs','Shoulders','Arms','Core','Cardio'].map(v=><label key={v}><input type="checkbox" checked={prefs.priorities.includes(v)} onChange={()=>toggle('priorities',v)}/>{v}</label>)}</div></div>
        </div>}
        {step===1&&<div className="form-grid">
          <label className="field">Training experience<select className="input" value={prefs.experience} onChange={e=>patch({experience:e.target.value})}><option value="new">I have not trained before</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="experienced">Experienced</option><option value="returning">Returning after a break</option></select></label>
          <label className="field">Months of previous training<input className="input" type="number" min={0} max={900} value={prefs.trainingMonths} onChange={e=>patch({trainingMonths:Number(e.target.value)})}/></label>
          <label className="field">Weeks since regular training<input className="input" type="number" min={0} max={520} value={prefs.breakWeeks} onChange={e=>patch({breakWeeks:Number(e.target.value)})}/></label>
          <label className="field">Gender (optional)<select className="input" value={prefs.gender} onChange={e=>patch({gender:e.target.value})}><option value="unspecified">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="nonbinary">Nonbinary</option><option value="self-described">Self-described in preferences</option></select></label>
          <label className="field">Age (optional, adult plans)<input className="input" type="number" min={18} max={100} value={prefs.age??''} onChange={e=>patch({age:e.target.value?Number(e.target.value):null})}/></label>
          <label className="field">Body weight ({weightLabel(units)}, optional)<input className="input" type="number" step="any" min={1} value={prefs.weightKg==null?'':Number(fromKg(prefs.weightKg,units).toFixed(1))} onChange={e=>patch({weightKg:e.target.value?toKg(Number(e.target.value),units):null})}/></label>
          <label className="field">Height (cm, optional)<input className="input" type="number" min={100} max={250} value={prefs.heightCm??''} onChange={e=>patch({heightCm:e.target.value?Number(e.target.value):null})}/></label>
          <p className="hint ai-span">Recent completed workouts and set-level performance help shape your plan. Missing history will be acknowledged; starting weights can remain blank.</p>
        </div>}
        {step===2&&<div className="stack">
          <fieldset className="ai-fieldset"><legend>Available equipment</legend><div className="ai-chips">{Object.entries(equipmentLabels).map(([value,label])=><label key={value}><input type="checkbox" checked={prefs.equipment.includes(value)} onChange={()=>toggle('equipment',value)}/>{label}</label>)}</div><p className="hint">Full gym makes the full catalog available. For home training, select every piece of equipment you have.</p></fieldset>
          <div className="field"><span>Exercises to exclude (optional)</span><div className="ai-chips">{prefs.excludedExerciseIds.map(id=><button type="button" className="btn btn-ghost btn-sm" key={id} onClick={()=>patch({excludedExerciseIds:prefs.excludedExerciseIds.filter(x=>x!==id)})} aria-label={'Remove exclusion '+exercises.find(e=>e.id===id)?.name}>{exercises.find(e=>e.id===id)?.name??'Unavailable exercise'} ×</button>)}</div><button type="button" className="btn btn-ghost" disabled={prefs.excludedExerciseIds.length>=100} onClick={()=>setExcluding(true)}>Choose exercises to avoid</button></div>
          <label className="field">Preferences and familiar exercises<textarea className="input" rows={3} maxLength={1500} value={prefs.preferences} onChange={e=>patch({preferences:e.target.value})} placeholder="Exercises you enjoy, preferred split, recent consistency…"/></label>
          <label className="field">Movement limitations (optional)<textarea className="input" rows={3} maxLength={1500} value={prefs.limitations} onChange={e=>patch({limitations:e.target.value})} placeholder="Movements you need to avoid or guidance you already follow"/></label>
          <p className="hint">This assistant plans general adult fitness training. Injury assessment and rehabilitation need appropriate professional guidance.</p>
          <Consent checked={consent} onChange={setConsent}/>
        </div>}
        <div className="ai-actions">{step>0 && <button type="button" className="btn btn-ghost" onClick={()=>setStep(s=>s-1)}>Back</button>}
          {step===2&&<button type="button" className="btn btn-ghost" onClick={()=>void savePrefs()}>Save preferences</button>}
          <button type="submit" className="btn btn-primary" disabled={step===2&&(disabled||!consent)}>{step<2?'Continue':'Generate my routine'}</button></div>
        </fieldset></form>
      </>:tab==='review'?<><h2>Review the last seven days</h2><p>See your logged training in context, with a comparison to the preceding seven days. The review uses completed workouts and acknowledges missing data.</p><Consent checked={consent} onChange={setConsent}/><button className="btn btn-primary" disabled={disabled||!consent} onClick={()=>void run()}>Review my week</button></>
      :<><h2>Understand a completed workout</h2><div className="form-grid"><label className="field">Workout<select className="input" value={sessionId} onChange={e=>setSessionId(e.target.value)}><option value="">Choose a workout</option>{sessions.map(s=><option key={s.id} value={s.id}>{s.date} · {s.name}</option>)}</select></label><label className="field">What would you like explained?<select className="input" value={topic} onChange={e=>setTopic(e.target.value)}>{['Explain exercise selection and rep targets','Explain the calorie estimate and its limitations','Explain the logged weights, reps and rest periods'].map(t=><option key={t}>{t}</option>)}</select></label></div>{!sessions.length&&<p>Complete a workout first to get an explanation.</p>}<Consent checked={consent} onChange={setConsent}/><button className="btn btn-primary" disabled={disabled||!consent||!sessionId} onClick={()=>void run()}>Explain this workout</button></>}
    </section>}
    {busy&&<div className="ai-progress" role="status"><span className="ai-dot"/>Preparing your suggestion. Detailed plans can take a minute. Your existing workouts stay as they are.</div>}
    {draft&&<><div className="ai-result-head"><span>Generated {new Date(draft.createdAt).toLocaleString()} · Review before applying</span><button className="btn btn-ghost btn-sm" onClick={()=>setDraft(null)}>{tab==='saved'?'Back to saved suggestions':'Adjust request'}</button></div>
      {draft.task==='routine'?<RoutinePreview key={draft.id} draft={draft} onSaved={async()=>{await reloadRoutines();const next=await aiApi<Bootstrap>('/bootstrap');setBoot(next);setMoreSaved(true);}}/>:<Insight draft={draft}/>}</>}
    {excluding&&<ExercisePicker multi exclude={prefs.excludedExerciseIds} onPick={e=>setPrefs(p=>p&&p.excludedExerciseIds.length<100?{...p,excludedExerciseIds:[...new Set([...p.excludedExerciseIds,e.id])]}:p)} onClose={()=>setExcluding(false)}/>}

  </div>;
}
function Consent({checked,onChange}:{checked:boolean;onChange:(v:boolean)=>void}) {
  return <label className="ai-consent"><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/><span>Use my selected profile details and relevant workout records with OpenAI for this suggestion.</span></label>;
}
export function Insight({draft}:{draft:AiDraft}) {
  const result=draft.result as InsightResult;
  return <section className="card card-pad stack"><h2>{draft.task==='review'?'Your training review':draft.task==='question'?(draft.question || 'Your coaching answer'):'Your workout, explained'}</h2>
    {draft.weekly&&<><p>{draft.weekly.from} – {draft.weekly.to}</p><div className="ai-metrics"><div><strong>{draft.weekly.current.sessions}</strong><span>Logged workouts</span></div><div><strong>{draft.weekly.current.workingSets}</strong><span>Working sets</span></div><div><strong>{num(draft.weekly.current.minutes)}</strong><span>Minutes</span></div></div></>}
    <p>{result.summary}</p>{result.observations.map((o,i)=><div key={i}><h3>{o.title}</h3><p>{o.detail}</p>{o.evidenceIds.length>0&&<small className="muted">Based on {o.evidenceIds.map(id=>{const e=draft.evidence?.find(x=>x.id===id);return e?e.date+' '+e.name:'logged workout';}).join('; ')}</small>}</div>)}
    <h3>Next steps</h3><ul>{result.nextSteps.map((s,i)=><li key={i}>{s}</li>)}</ul>
    {result.limitations.length>0&&<details><summary>What this review cannot tell us</summary><ul>{result.limitations.map((s,i)=><li key={i}>{s}</li>)}</ul></details>}
  </section>;
}
export function RoutinePreview({draft,onSaved}:{draft:AiDraft;onSaved:()=>Promise<void>}) {
  const {byId,user}=useApp();const editKey='gt.aiDraft.'+user?.id+'.'+draft.id;
  const [plan,setPlan]=useState(()=>{try{const cached=JSON.parse(sessionStorage.getItem(editKey)??'null');if(cached?.days)return cached as RoutineResult;}catch{}return structuredClone(draft.result as RoutineResult);});
  useEffect(()=>{try{sessionStorage.setItem(editKey,JSON.stringify(plan));}catch{}},[editKey,plan]);
  const [busy,setBusy]=useState<number|null>(null),[saved,setSaved]=useState<number[]>(draft.savedDays??[]),[error,setError]=useState('');
  const [resolve,setResolve]=useState<{day:number;index:number}|null>(null);
  const [swap,setSwap]=useState<{day:number;index:number}|null>(null),[dirty,setDirty]=useState(false);
  useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return ()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  const update=(d:number,i:number,p:Partial<AiExercise>)=>{setDirty(true);setPlan(old=>({...old,days:old.days.map((day,j)=>j===d?{...day,exercises:day.exercises.map((e,k)=>k===i?{...e,...p}:e)}:day)}));};
  const save=async(index:number)=>{
    setBusy(index);setError('');
    const day=plan.days[index];
    try{await aiApi('/drafts/'+draft.id+'/save','POST',{dayIndex:index,name:day.name,note:day.focus,exercises:day.exercises.map(({match,...item})=>item)});setSaved(s=>[...s,index]);setDirty(false);await onSaved();}
    catch(e){setError((e as Error).message);}finally{setBusy(null);}
  };
  function chooseMatch(d:number,i:number,id:string, created?:Exercise) {
    const item = plan.days[d].exercises[i];
    const ex = created ?? byId.get(id);
    if (!ex) return;
    const cardio = ex.type === 'cardio';
    update(d,i,{ exerciseId:id,match:undefined,targetWeightKg:null,targetSets:cardio?1:item.targetSets,
      targetReps:cardio||ex.isTimed?0:item.targetReps||8,targetDurationSec:ex.isTimed?item.targetDurationSec||30:null,
      targetCardioMin:cardio?item.targetCardioMin||10:null,loadReason:'Choose a starting load for the exercise you selected.' });
  }
  const exerciseUnits = useExerciseUnits();
  return <div className="stack"><section className="card card-pad"><h2>{plan.title}</h2><p>{plan.explanation}</p>{plan.limitations.length>0&&<details><summary>Assumptions and limitations</summary><ul>{plan.limitations.map((s,i)=><li key={i}>{s}</li>)}</ul></details>}</section>
    {error&&<p role="alert" className="form-error">{error}</p>}
    {plan.days.map((day,d)=><section className="card card-pad stack" key={d}><div className="ai-day-heading"><label className="field">Session name<input className="input" value={day.name} maxLength={100} disabled={saved.includes(d)} onChange={e=>{setDirty(true);setPlan(p=>({...p,days:p.days.map((x,i)=>i===d?{...x,name:e.target.value}:x)}));}}/></label><span>{day.estimatedMinutes??'—'} min estimated at generation</span></div><p>{day.focus}</p>
      {day.exercises.map((item,i)=>{const ex=byId.get(item.exerciseId);const units=exerciseUnits.forExercise(item.exerciseId);return <div className="ai-exercise" key={i}><div className="ai-exercise-head"><div><h3>{item.match?.name??ex?.name??'Exercise unavailable'}</h3><small>{ex?.equipment} · {ex?.primaryMuscles?.join(', ')}</small></div><button className="btn btn-ghost btn-sm" disabled={saved.includes(d)} onClick={()=>item.match?setResolve({day:d,index:i}):setSwap({day:d,index:i})}>{item.match?'Choose or create exercise':'Alternatives'}</button></div><p>{item.reason}</p>
        {item.match && <div className="stack"><p>Confirm this movement · {item.match.equipment} {item.match.variant}</p>
          {item.match.options.filter(id=>byId.has(id)&&!day.exercises.some(e=>e.exerciseId===id)).map(id=><button className="btn btn-ghost btn-sm" key={id} disabled={busy!==null||saved.includes(d)} onClick={()=>chooseMatch(d,i,id)}>Use {byId.get(id)?.name}</button>)}</div>}
        <fieldset disabled={saved.includes(d)||!!item.match} className="ai-targets ai-fieldset">
          {ex?.type==='cardio'?<Target label="Minutes" value={item.targetCardioMin} min={1} max={90} onChange={v=>update(d,i,{targetCardioMin:v})}/>:<>
          <Target label="Sets" value={item.targetSets} min={1} max={8} onChange={v=>update(d,i,{targetSets:v??0})}/>
          {ex?.isTimed?<Target label="Hold (seconds)" value={item.targetDurationSec} min={5} max={600} onChange={v=>update(d,i,{targetDurationSec:v})}/>:<Target label="Reps" value={item.targetReps} min={1} max={50} onChange={v=>update(d,i,{targetReps:v??0})}/>}
          <Target label={(ex?.isBodyweight?'Added weight':'Weight')+' ('+weightLabel(units)+')'} value={item.targetWeightKg==null?null:Number(fromKg(item.targetWeightKg,units).toFixed(1))} min={0} max={2200} onChange={v=>update(d,i,{targetWeightKg:v==null?null:toKg(v,units)})}/><Target label="Rest (seconds)" value={item.restSec} min={0} max={600} onChange={v=>update(d,i,{restSec:v??0})}/></>}
        </fieldset><p className="hint">{item.loadReason}</p>{ex?.howToUrl&&<a href={ex.howToUrl} target="_blank" rel="noreferrer">Find a technique demonstration ↗</a>}
      </div>;})}
      <button className="btn btn-primary" disabled={busy!==null||saved.includes(d)||day.exercises.some(e=>!e.exerciseId)} onClick={()=>void save(d)}>{saved.includes(d)?'Saved to routines':busy===d?'Saving…':'Save this session to routines'}</button>{saved.includes(d)&&<p className="hint">This session is saved. Make further changes in Routines.</p>}
    </section>)}
    {resolve && <ExercisePicker suggestion={plan.days[resolve.day].exercises[resolve.index].match}
      exclude={[...plan.days[resolve.day].exercises.map(e=>e.exerciseId),...(draft.constraints?.excludedExerciseIds??[])]}
      allowedEquipment={draft.constraints?.equipment} onClose={()=>setResolve(null)}
      onPick={ex=>chooseMatch(resolve.day,resolve.index,ex.id,ex)}/>}
    {swap&&<ExerciseAlternatives sourceId={plan.days[swap.day].exercises[swap.index].exerciseId} exclude={plan.days[swap.day].exercises.map(e=>e.exerciseId)} onClose={()=>setSwap(null)} onPick={ex=>update(swap.day,swap.index,{exerciseId:ex.id,targetWeightKg:null,targetSets:ex.type==='cardio'?1:3,targetReps:ex.type==='cardio'||ex.isTimed?0:8,targetDurationSec:ex.isTimed?30:null,targetCardioMin:ex.type==='cardio'?10:null,reason:'Alternative selected by you.',loadReason:'Choose a starting load for this movement; the previous exercise’s load was cleared.'})}/>}
  </div>;
}
function Target({label,value,min,max,onChange}:{label:string;value:number|null;min:number;max:number;onChange:(v:number|null)=>void}) {
  return <label className="field">{label}<input className="input" type="number" step="any" min={min} max={max} value={value??''} placeholder="Choose during warm-up" onChange={e=>onChange(e.target.value===''?null:Number(e.target.value))}/></label>;
}

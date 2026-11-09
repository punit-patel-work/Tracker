import { useEffect,useState } from 'react';
import { aiApi,equipmentLabels } from '../lib/ai';
import { useApp } from '../state/app';
import { useModal } from './useModal';
import ExercisePicker from './ExercisePicker';
import type { Exercise } from '../lib/types';
import '../styles/ai.css';
type Alternative={exerciseId:string;name:string;equipment:string;reason:string};
export default function ExerciseAlternatives({sourceId,exclude,onPick,onClose}:{sourceId:string;exclude:string[];onPick:(e:Exercise)=>void;onClose:()=>void}) {
  const {byId}=useApp();const ref=useModal(onClose);
  const [rows,setRows]=useState<Alternative[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  const [equipment,setEquipment]=useState('saved');
  const [browsing,setBrowsing]=useState(false);
  const exclusion=exclude.join(',');
  useEffect(()=>{
    const c=new AbortController();setLoading(true);setError('');
    const params=new URLSearchParams({exclude:exclusion});
    if(equipment!=='saved') params.set('equipment',equipment==='bodyweight'?'bodyweight':equipment+',bodyweight');
    aiApi<{alternatives:Alternative[]}>('/alternatives/'+sourceId+'?'+params,'GET',undefined,c.signal)
      .then(r=>setRows(r.alternatives)).catch(e=>{if(!c.signal.aborted)setError(e.message);}).finally(()=>{if(!c.signal.aborted)setLoading(false);});
    return ()=>c.abort();
  },[sourceId,exclusion,equipment]);
  if(browsing)return <ExercisePicker exclude={exclude} onPick={onPick} onClose={onClose}/>;
  return <div className="ai-overlay"><div ref={ref} role="dialog" aria-modal="true" aria-labelledby="alternatives-title" className="card ai-dialog">
    <div className="card-head"><div><h2 id="alternatives-title">Exercise alternatives</h2><p>{byId.get(sourceId)?.name}</p></div><button className="icon-btn" aria-label="Close alternatives" onClick={onClose}>×</button></div>
    <p className="muted">Related movements from the exercise library. Difficulty and technique can differ. Recheck your starting load.</p>
    <label className="field">Available equipment<select className="input" value={equipment} onChange={e=>setEquipment(e.target.value)}><option value="saved">My saved equipment</option>{Object.entries(equipmentLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    {loading?<p role="status">Finding alternatives…</p>:error?<p className="form-error" role="alert">{error}</p>:rows.length? <div className="stack">{rows.map(row=><div className="ai-alternative" key={row.exerciseId}><div><strong>{row.name}</strong><small>{row.equipment}</small><p>{row.reason}</p></div><button className="btn btn-primary btn-sm" onClick={()=>{const ex=byId.get(row.exerciseId);if(ex){onPick(ex);onClose();}}}>Choose</button></div>)}</div>:<p>No maintained alternatives match these filters. You can choose another exercise manually.</p>}
    <div className="ai-actions"><button className="btn btn-ghost" onClick={()=>setBrowsing(true)}>Browse all exercises</button><button className="btn btn-ghost" onClick={onClose}>Close</button></div>
  </div></div>;
}

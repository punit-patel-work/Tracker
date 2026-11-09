import { useEffect,useState } from 'react';
import { useApp } from '../state/app';
import { aiApi } from '../lib/ai';
import '../styles/ai.css';
interface Usage { _id:string;task:string;model:string;status:string;costUsd:number;createdAt:string;usage?:{input_tokens:number;output_tokens:number} }
interface Overview {config:{enabled:boolean;monthlyBudgetUsd:number};ledger:{usedUsd:number;reservedUsd:number;requests:number};
  items:Usage[];groups:{_id:string;requests:number;costUsd:number;inputTokens:number;outputTokens:number}[];
  configured:boolean;models:{routine:string;insights:string}}
export default function AdminAi() {
  const {exercises}=useApp();const [data,setData]=useState<Overview|null>(null),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [enabled,setEnabled]=useState(true),[limit,setLimit]=useState(5),[busy,setBusy]=useState(false),[refresh,setRefresh]=useState(0);
  const [source,setSource]=useState(''),[group,setGroup]=useState(''),[candidates,setCandidates]=useState<string[]>([]),[loadingAlt,setLoadingAlt]=useState(false),[filter,setFilter]=useState('');
  useEffect(()=>{const c=new AbortController();aiApi<Overview>('/admin','GET',undefined,c.signal).then(d=>{setData(d);setEnabled(d.config.enabled);setLimit(d.config.monthlyBudgetUsd);}).catch(e=>{if(!c.signal.aborted)setError(e.message);});return ()=>c.abort();},[refresh]);
  useEffect(()=>{if(!source)return;const c=new AbortController();setLoadingAlt(true);setError('');
    aiApi<{group:string;candidates:string[]}>('/admin/alternatives/'+source,'GET',undefined,c.signal).then(d=>{if(!c.signal.aborted){setGroup(d.group);setCandidates(d.candidates);}})
      .catch(e=>{if(!c.signal.aborted)setError(e.message);}).finally(()=>{if(!c.signal.aborted)setLoadingAlt(false);});return ()=>c.abort();},[source]);
  const save=async()=>{setBusy(true);setError('');try{await aiApi('/admin','PATCH',{enabled,monthlyBudgetUsd:limit});setNotice('AI settings saved.');setRefresh(n=>n+1);}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const saveAlternatives=async()=>{setBusy(true);setError('');try{await aiApi('/admin/alternatives/'+source,'PUT',{group,candidates});setNotice('Reviewed alternative list saved.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const shared=exercises.filter(e=>!e.isCustom&&!e.archived),selected=shared.find(e=>e.id===source);
  return <div className="stack">{error&&<p className="form-error" role="alert">{error}</p>}{notice&&<p className="ai-notice" role="status">{notice}</p>}
    {!data?<p role="status">Loading AI usage…</p>:<>
    <section className="card card-pad stack"><h2>AI controls</h2><p>API key: {data.configured?'configured on server':'not configured'} · All costs below are estimated USD, before tax.</p>
      <div className="ai-metrics"><div><strong>${data.ledger.usedUsd.toFixed(3)}</strong><span>Recorded this UTC month</span></div><div><strong>${data.ledger.reservedUsd.toFixed(3)}</strong><span>Reserved for requests</span></div><div><strong>{data.ledger.requests}</strong><span>Paid request attempts</span></div></div>
      <form className="ai-admin-form" onSubmit={e=>{e.preventDefault();void save();}}><label>AI availability<select className="input" value={String(enabled)} onChange={e=>setEnabled(e.target.value==='true')}><option value="true">Enabled</option><option value="false">Paused</option></select></label>
      <label>Monthly allowance (USD)<input className="input" required type="number" min={0} max={100} step=".5" value={limit} onChange={e=>setLimit(Number(e.target.value))}/></label><button className="btn btn-primary" disabled={busy}>Save settings</button><button type="button" className="btn btn-ghost" onClick={()=>setRefresh(n=>n+1)}>Refresh usage</button></form>
      <p className="hint">Routine model: {data.models.routine}. Insights: {data.models.insights}. Accounting conservatively reserves input and maximum output costs. Failed requests may still be billed; uncertain charges remain reserved or conservatively recorded. Provider billing is authoritative.</p>
    </section>
    <section className="card card-pad"><h2>Usage by feature</h2>{!data.groups.length?<p>No paid requests this month.</p>:data.groups.map(g=><div key={g._id} className="ai-usage-bar"><div><strong>{g._id}</strong><span>{g.requests} requests · ${g.costUsd.toFixed(3)}</span></div><progress aria-label={g._id+' requests'} max={Math.max(...data.groups.map(x=>x.requests))} value={g.requests}/></div>)}
      <div className="ai-scroll"><table className="ai-cost-table"><thead><tr><th>When</th><th>Feature</th><th>Model</th><th>Status</th><th>Input / output</th><th>Est. USD</th></tr></thead><tbody>{data.items.map(r=><tr key={r._id}><td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.task}</td><td>{r.model}</td><td>{r.status}</td><td>{r.usage?.input_tokens??'—'} / {r.usage?.output_tokens??'—'}</td><td>${r.costUsd.toFixed(4)}</td></tr>)}</tbody></table></div>
    </section></>}
    <section className="card card-pad stack"><h2>Maintain exercise alternatives</h2><p>Review related movements before saving. Lists are reusable and do not call GPT. Only choose alternatives whose movement, equipment and difficulty you have checked.</p>
      <label className="field">Shared exercise<select className="input" value={source} onChange={e=>setSource(e.target.value)}><option value="">Select an exercise</option>{shared.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></label>
      {source&&(loadingAlt?<p role="status">Loading alternatives…</p>:<><label className="field">Movement description<input className="input" maxLength={80} value={group} onChange={e=>setGroup(e.target.value)}/></label>
        <label className="field">Find alternatives<input className="input" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search exercise names"/></label>
        <div className="ai-catalog-list">{shared.filter(e=>e.id!==source&&e.type===selected?.type&&!!e.isTimed===!!selected?.isTimed&&e.name.toLowerCase().includes(filter.toLowerCase())).map(e=><label key={e.id}><input type="checkbox" checked={candidates.includes(e.id)} onChange={()=>setCandidates(old=>old.includes(e.id)?old.filter(id=>id!==e.id):[...old,e.id])}/>{e.name}<small>{e.equipment}</small></label>)}</div>
        <button className="btn btn-primary" disabled={busy||!group.trim()||candidates.length>30} onClick={()=>void saveAlternatives()}>Save reviewed alternatives ({candidates.length})</button></>)}
    </section>
  </div>;
}

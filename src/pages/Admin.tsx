import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useApp } from '../state/app';
import { adminApi } from '../lib/admin';
import { ChartCard, LineChart } from '../components/charts';
import { useModal } from '../components/useModal';
import { Logo } from '../components/Logo';
import { CATEGORIES } from '../../shared/catalog.js';
import * as I from '../components/Icon';
import '../styles/admin.css';
import AdminAi from './AdminAi';

type Section = 'overview' | 'users' | 'workouts' | 'routines' | 'exercises' | 'audit' | 'system' | 'ai';
type Row = Record<string, any>;
const sections: { id: Section; title: string; icon: typeof I.Home; description: string }[] = [
  { id: 'overview', title: 'Overview', icon: I.BarChart, description: 'A clear view of your community and its training.' },
  { id: 'users', title: 'Members', icon: I.User, description: 'Manage accounts, access and account status.' },
  { id: 'workouts', title: 'Workouts', icon: I.Dumbbell, description: 'Review training activity across every member.' },
  { id: 'routines', title: 'Routines', icon: I.Layers, description: 'Review training plans and manage their availability.' },
  { id: 'exercises', title: 'Exercise library', icon: I.Search, description: 'Maintain shared exercises and review custom movements.' },
  { id: 'audit', title: 'Activity log', icon: I.History, description: 'An accountable record of administrative changes.' },
  { id: 'ai', title: 'AI assistance', icon: I.Sliders, description: 'Usage, spending controls and maintained exercise alternatives.' },
  { id: 'system', title: 'System & security', icon: I.Sliders, description: 'Connection health, configuration and your admin password.' },
];
const fmt = (value: number = 0) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
const date = (value: string) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const badge = (label: string, kind = '') => <span className={`admin-badge ${kind}`}>{label}</span>;
function exportRows(items: Row[], section: string) {
  const fields = section === 'users' ? ['name', 'email', 'username', 'role', 'suspended', 'createdAt']
    : section === 'workouts' ? ['name', 'date', 'status', 'member', 'kcal', 'minutes']
    : section === 'audit' ? ['createdAt', 'actorName', 'action', 'target', 'summary'] : ['name', 'category', 'type', 'archived'];
  const cell = (v: unknown) => { let s = String(v ?? ''); if (/^[=+\-@\t\r\n]/.test(s)) s = `'${s}`; return `"${s.replace(/"/g, '""')}"`; };
  const lines = [fields.join(','), ...items.map((item) => { const r: Row = { ...item, member: item.user?.email, kcal: item.totals?.totalKcal, minutes: item.totals?.durationMin }; return fields.map((f) => cell(r[f])).join(','); })];
  const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `gym-tracker-${section}-page.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Admin({ themeToggle }: { themeToggle: ReactNode }) {
  const { user, signOut } = useApp();
  const [section, setSection] = useState<Section>(() => sections.find((s) => s.id === window.location.hash.slice(1))?.id ?? 'overview');
  const [query, setQuery] = useState(''); const [status, setStatus] = useState(''); const [skip, setSkip] = useState(0);
  const [days, setDays] = useState(30); const [refresh, setRefresh] = useState(0);
  const [result, setData] = useState<Row | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const data = result?._section === section ? result : null;
  const [notice, setNotice] = useState(''); const [editing, setEditing] = useState<{ type: Section; data: Row } | null>(null);
  const [busy, setBusy] = useState(false); const currentSection = useRef(section); currentSection.current = section;
  const nav = sections.find((s) => s.id === section)!;
  useEffect(() => {
    const onHash = () => { const next = sections.find((s) => s.id === location.hash.slice(1))?.id; if (next) { setSection(next); setSkip(0); setQuery(''); setStatus(''); } };
    window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (section === 'ai') { setLoading(false); setError(''); return; }
    const controller = new AbortController(); setLoading(true); setError(''); setData(null);
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({ q: query, status, skip: String(skip), limit: '25', days: String(days) });
      adminApi(`/${section}?${params}`, 'GET', undefined, controller.signal)
        .then((result) => { if (!controller.signal.aborted) setData({ ...result, _section: section }); })
        .catch((e) => { if (!controller.signal.aborted) setError(e.message); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, query ? 250 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [section, query, status, skip, days, refresh]);
  const go = (next: Section) => { if (next === section) return; location.hash = next; setSection(next); setQuery(''); setStatus(''); setSkip(0); setNotice(''); };
  const reload = () => setRefresh((n) => n + 1);
  const action = async (fn: () => Promise<unknown>, success: string) => {
    setBusy(true); setNotice('');
    try { await fn(); setNotice(success); reload(); } catch (e) { setNotice(e instanceof Error ? e.message : 'Action failed'); } finally { setBusy(false); }
  };
  const open = async (row: Row) => {
    const target = section; setBusy(true);
    try {
      const result = target === 'users' || target === 'workouts' ? await adminApi(`/${target}/${row.id}`) : row;
      if (currentSection.current === target) setEditing({ type: target, data: result });
    } catch (e) { setNotice((e as Error).message); } finally { setBusy(false); }
  };
  const filters: Record<string, [string, string][]> = { users: [['admin', 'Administrators'], ['suspended', 'Suspended']], workouts: [['active', 'In progress'], ['completed', 'Completed']],
    routines: [['active', 'Available'], ['archived', 'Archived']], exercises: [['shared', 'Shared library'], ['custom', 'Custom exercises'], ['archived', 'Archived']] };
  return <div className="admin-app">
    <a className="skip-link" href="#admin-main">Skip to content</a>
    <aside className="admin-sidebar"><a href="/" className="admin-brand"><Logo size={33} showSub={false} /></a><span className="admin-caption">ADMINISTRATION</span>
      <nav aria-label="Administration">{sections.map(({ id, title, icon: Icon }) => <button key={id} className={section === id ? 'selected' : ''} aria-current={section === id ? 'page' : undefined} onClick={() => go(id)}><Icon size={18} /><span>{title}</span></button>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-owner"><span className="admin-avatar">{user?.name.slice(0, 1)}</span><div><strong>{user?.name}</strong><small>{user?.isOwner ? 'Owner administrator' : 'Administrator'}</small></div></div>
        <a href="/">← Back to training</a><button onClick={() => void action(signOut, 'Signed out')} disabled={busy}>Sign out</button></div>
    </aside>
    <div className="admin-body"><header className="admin-topbar"><span>Workspace <span aria-hidden="true">/</span> <strong>{nav.title}</strong></span><div>{badge('Admin access', 'green')}{themeToggle}</div></header>
      <main id="admin-main" tabIndex={-1} className="admin-main">
        <div className="admin-heading"><div><span className="admin-eyebrow">GYM TRACKER · CONTROL CENTER</span><h1>{nav.title}</h1><p>{nav.description}</p></div><div className="admin-actions">
          {section === 'overview' && <select aria-label="Analytics range" className="input" value={days} onChange={(e) => setDays(Number(e.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value={365}>Last year</option></select>}
          <button className="btn btn-ghost" onClick={reload} disabled={loading}>Refresh</button>
          {section === 'users' && <button className="btn btn-primary" onClick={() => setEditing({ type: 'users', data: { user: { name: '', email: '', username: '', role: 'user' }, sessions: [], stats: { workouts: 0, minutes: 0 }, routines: 0 } })}>+ Add member</button>}
          {section === 'exercises' && <button className="btn btn-primary" onClick={() => setEditing({ type: 'exercises', data: {} })}>+ Add exercise</button>}
        </div></div>
        {notice && <div className="admin-notice" role="status">{notice}<button className="icon-btn" aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}
        {!['overview', 'system', 'ai'].includes(section) && <div className="admin-toolbar"><label className="admin-search"><I.Search size={18} /><input placeholder={`Search ${section === 'users' ? 'name, email or username' : nav.title.toLowerCase()}…`} aria-label={`Search ${nav.title}`} value={query} onChange={(e) => { setQuery(e.target.value); setSkip(0); }} /></label>
          {filters[section] && <select className="input" aria-label="Filter status" value={status} onChange={(e) => { setStatus(e.target.value); setSkip(0); }}><option value="">All records</option>{filters[section].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>}
          <button className="btn btn-ghost" disabled={!data?.items?.length} onClick={() => exportRows(data!.items, section)}>Export this page</button></div>}
        {section === 'ai' ? <AdminAi /> : error ? <div className="admin-empty" role="alert"><h2>Unable to load this section</h2><p>{error}</p><button className="btn btn-primary" onClick={reload}>Try again</button></div>
          : loading ? <div className="admin-loading" role="status"><div /><div /><div /><p>Loading {nav.title.toLowerCase()}…</p></div>
          : data && section === 'overview' ? <Overview data={data} go={go} />
          : data && section === 'system' ? <System data={data} />
          : data && <><div className="admin-table-card"><div className="admin-table-label"><strong>{nav.title}</strong><span>{fmt(data.total)} records</span></div>
              <div className="admin-table-scroll"><table className="admin-table"><thead><tr>
                {section === 'users' ? <><th>Member</th><th>Access</th><th>AI account type</th><th>Status</th><th>Joined</th><th>Last sign-in</th><th>Actions</th></>
                  : section === 'workouts' ? <><th>Workout</th><th>Member</th><th>Status</th><th>Duration</th><th>Est. calories</th><th>Actions</th></>
                  : section === 'exercises' ? <><th>Exercise</th><th>Category</th><th>Owner</th><th>MET</th><th>Status</th><th>Actions</th></>
                  : section === 'routines' ? <><th>Routine</th><th>Member</th><th>Exercises</th><th>Status</th><th>Updated</th><th>Actions</th></>
                  : <><th>When</th><th>Administrator</th><th>Action</th><th>Details</th></>}
              </tr></thead><tbody>{data.items.map((r: Row) => <tr key={r.id}>
                {section === 'users' ? <><td><strong>{r.name}</strong><small>{r.email}</small><small>{r.username && `@${r.username}`}</small></td><td>{badge(r.isOwner ? 'Owner' : r.role === 'admin' ? 'Admin' : 'Member', r.role === 'admin' ? 'green' : '')}</td><td>{badge(r.aiTier === 'dev' ? 'Dev' : r.aiTier === 'pro' ? 'Pro' : 'Regular')}</td><td>{badge(r.suspended ? 'Suspended' : 'Active', r.suspended ? 'red' : 'green')}</td><td>{date(r.createdAt)}</td><td>{date(r.lastLoginAt)}</td><td><button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => void open(r)}>View member</button></td></>
                : section === 'workouts' ? <><td><strong>{r.name}</strong><small>{r.date}</small></td><td>{r.user?.name ?? 'Deleted member'}<small>{r.user?.email}</small></td><td>{badge(r.status === 'active' ? 'In progress' : 'Completed', r.status === 'active' ? 'amber' : 'green')}</td><td>{fmt(r.totals?.durationMin)} min</td><td>{fmt(r.totals?.totalKcal)} kcal</td><td><button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => void open(r)}>View workout</button></td></>
                : section === 'exercises' ? <><td><strong>{r.name}</strong><small>{r.equipment} · {r.type}</small></td><td>{r.category}</td><td>{r.owner?.name ?? 'Shared library'}</td><td>{r.met}</td><td>{badge(r.archived ? 'Archived' : 'Available', r.archived ? '' : 'green')}</td><td><button className="btn btn-ghost btn-sm" onClick={() => void open(r)}>Edit</button></td></>
                : section === 'routines' ? <><td><strong>{r.name}</strong><small>{r.note}</small></td><td>{r.user?.name ?? 'Deleted member'}</td><td>{r.exercises.length}</td><td>{badge(r.archived ? 'Archived' : 'Available', r.archived ? '' : 'green')}</td><td>{date(r.updatedAt)}</td><td><button className="btn btn-ghost btn-sm" onClick={() => void open(r)}>Manage</button></td></>
                : <><td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.actorName}</td><td><code>{r.action}</code></td><td>{r.summary}</td></>}
              </tr>)}</tbody></table></div>
              {!data.items.length && <div className="admin-empty"><I.Search size={30} /><h2>No records found</h2><p>{query || status ? 'Try another search or remove a filter.' : 'New activity will appear here.'}</p></div>}
              <div className="admin-pagination"><span>{data.total ? `${skip + 1}–${Math.min(skip + data.items.length, data.total)} of ${fmt(data.total)}` : '0 records'}</span><div><button className="btn btn-ghost btn-sm" disabled={!skip} onClick={() => setSkip(Math.max(0, skip - 25))}>Previous</button><button className="btn btn-ghost btn-sm" disabled={skip + 25 >= data.total} onClick={() => setSkip(skip + 25)}>Next</button></div></div></div></>}
        <footer className="admin-footer">Gym Tracker Administration <span>All times shown in your local time zone.</span></footer>
      </main></div>
    {editing && <Editor type={editing.type} data={editing.data} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setNotice('Changes saved.'); reload(); }} />}
  </div>;
}

function Overview({ data: d, go }: { data: Row; go: (s: Section) => void }) {
  const cards = [ ['Members', d.counts.users, `${d.counts.admins} ${d.counts.admins === 1 ? 'administrator' : 'administrators'}`, I.User], ['Completed workouts', d.counts.workouts, `${d.counts.active} currently in progress`, I.Dumbbell],
    ['Active members', d.totals.activeMembers, `Trained in the last ${d.range.days} days`, I.BarChart], ['Training hours', d.totals.minutes / 60, `${fmt(d.totals.sessions)} workouts in this period`, I.Timer] ] as const;
  return <div className="admin-overview"><div className="admin-metrics">{cards.map(([title, value, sub, Icon]) => <section key={title} className="admin-metric"><div><span>{title}</span><Icon size={19} /></div><strong>{fmt(value)}</strong><small>{sub}</small></section>)}</div>
    <div className="admin-chart-grid">{(['workouts', 'signups'] as const).map((key) => <ChartCard key={key} title={key === 'workouts' ? 'Training activity' : 'Community growth'} subtitle={`${d.range.from} — ${d.range.to} · ${key === 'workouts' ? 'Completed workouts per day' : 'New members per day'}`}
      table={<table className="admin-table"><thead><tr><th>Date</th><th>{key === 'workouts' ? 'Workouts' : 'Sign-ups'}</th></tr></thead><tbody>{d.series.map((p: Row) => <tr key={p.date}><td>{p.date}</td><td>{p[key]}</td></tr>)}</tbody></table>}>
      <LineChart points={d.series.map((p: Row) => ({ label: p.date, value: p[key] }))} height={240} zeroBased integerTicks /></ChartCard>)}</div>
    <div className="admin-chart-grid"><section className="admin-panel"><div className="admin-panel-head"><h2>Most logged exercises</h2><span>This period</span></div>
      {d.popular.length ? d.popular.map((r: Row, i: number) => <div className="admin-rank" key={r._id}><span>{String(i + 1).padStart(2, '0')}</span><div><strong>{r.name ?? 'Archived exercise'}</strong><div className="admin-rank-track"><div style={{ width: `${r.count / d.popular[0].count * 100}%` }} /></div></div><b>{fmt(r.count)}</b></div>) : <p className="muted">No workouts recorded in this period.</p>}
    </section><section className="admin-panel"><div className="admin-panel-head"><h2>At a glance</h2><span>This period</span></div><dl className="admin-summary"><div><dt>Completed working sets</dt><dd>{fmt(d.totals.sets)}</dd></div><div><dt>Estimated calories</dt><dd>{fmt(d.totals.kcal)} kcal</dd></div><div><dt>Available routines</dt><dd>{fmt(d.counts.routines)}</dd></div><div><dt>Available exercises</dt><dd>{fmt(d.counts.exercises)}</dd></div><div><dt>Suspended accounts</dt><dd>{fmt(d.counts.suspended)}</dd></div></dl><p className="hint">Calories are estimates from logged activity and each workout’s recorded body weight.</p></section></div>
    <section className="admin-panel"><div className="admin-panel-head"><h2>Latest workouts</h2><button className="btn btn-ghost btn-sm" onClick={() => go('workouts')}>View all →</button></div>
      {!d.latest.length ? <p className="muted">Your community’s first workout will appear here.</p> : <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Workout</th><th>Member</th><th>Date</th><th>Status</th><th>Est. calories</th></tr></thead><tbody>{d.latest.map((r: Row) => <tr key={r.id}><td><strong>{r.name}</strong></td><td>{r.user?.name ?? 'Deleted member'}</td><td>{r.date}</td><td>{badge(r.status, r.status === 'active' ? 'amber' : 'green')}</td><td>{fmt(r.totals?.totalKcal)} kcal</td></tr>)}</tbody></table></div>}
    </section><section className="admin-panel"><div className="admin-panel-head"><h2>Recent admin activity</h2><button className="btn btn-ghost btn-sm" onClick={() => go('audit')}>View log →</button></div>
      {d.activity.length ? d.activity.map((r: Row) => <div className="admin-activity" key={r.id}><span className="admin-activity-dot" /><div><strong>{r.actorName}</strong> · {r.summary}<small>{new Date(r.createdAt).toLocaleString()}</small></div></div>) : <p className="muted">Administrative changes will be recorded here.</p>}</section>
  </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="admin-field"><span>{label}</span>{children}</label>; }
function Editor({ type, data, onClose, onSaved }: { type: Section; data: Row; onClose: () => void; onSaved: () => void }) {
  const { user, exercises } = useApp();
  const source = data.user && type === 'users' ? data.user : data.session && type === 'workouts' ? data.session : data;
  const [draft, setDraft] = useState<Row>(() => ({ ...structuredClone(source), durationMin: Math.max(0.01, Number(source.totals?.durationMin?.toFixed(2) ?? 45)) }));
  const initial = useRef(JSON.stringify(draft)); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const patch = (key: string, value: any) => setDraft((old) => ({ ...old, [key]: value }));
  const changed = JSON.stringify(draft) !== initial.current;
  const close = () => { if (!busy && (!changed || confirm('Discard unsaved changes?'))) onClose(); };
  const dialog = useModal(close);
  useEffect(() => { const warn = (e: BeforeUnloadEvent) => { if (changed) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [changed]);
  const locked = type === 'users' && (source.isOwner || source.id === user?.id || (source.role === 'admin' && !user?.isOwner));
  const ownTier = type === 'users' && user?.isOwner && source.id === user.id;
  const live = type === 'workouts' && source.status === 'active';
  const save = async () => {
    setBusy(true); setError('');
    try {
      let body: Row = { ...draft };
      if (type === 'users') body = ownTier ? { revision: draft.revision, aiTier: draft.aiTier ?? 'regular' } : source.id ? { revision: draft.revision, aiTier: draft.aiTier ?? 'regular', name: draft.name, suspended: !!draft.suspended, ...(user?.isOwner ? { role: draft.role } : {}) }
        : { aiTier: draft.aiTier ?? 'regular', name: draft.name, email: draft.email, username: draft.username, password: draft.password, role: draft.role };
      if (type === 'routines') body = { revision: draft.revision, name: draft.name, note: draft.note, archived: draft.archived, exercises: draft.exercises.map((e: Row) => ({ ...e, exerciseId: e.exercise })) };
      if (type === 'workouts') body = { revision: draft.revision, name: draft.name, date: draft.date, durationMin: Number(draft.durationMin), entries: draft.entries };
      if (type === 'exercises') body = { ...draft, type: draft.type ?? 'strength', category: draft.category ?? 'chest', equipment: draft.equipment ?? 'Other' };
      await adminApi(`/${type}${source.id ? `/${source.id}` : ''}`, source.id ? 'PATCH' : 'POST', body); onSaved();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const command = async (path: string, method: string, message: string) => { if (!confirm(message)) return; setBusy(true); setError(''); try { await adminApi(path, method, { revision: source.revision }); onSaved(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } };
  const input = (key: string, label: string, kind = 'text', props: Row = {}) => <Field label={label}><input className="input" type={kind} value={draft[key] ?? ''} onChange={(e) => patch(key, kind === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)} {...props} /></Field>;
  const checkbox = (key: string, label: string) => <label className="admin-check"><input type="checkbox" checked={!!draft[key]} onChange={(e) => patch(key, e.target.checked)} />{label}</label>;
  const selection = (key: string, label: string, options: [string, string][], fallback: string) => <Field label={label}><select className="input" value={draft[key] ?? fallback} onChange={(e) => patch(key, e.target.value)}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></Field>;
  const names = new Map([...(data.exercises ?? []), ...exercises].map((e: Row) => [e.id, e.name]));
  const addExercise = (exerciseId: string) => {
    if (!exerciseId) return;
    const ex = exercises.find((e) => e.id === exerciseId); if (!ex) return;
    if (type === 'routines') patch('exercises', [...draft.exercises, { exercise: ex.id, name: ex.name, targetSets: 3, targetReps: 8, targetWeightKg: null, restSec: 90 }]);
    else patch('entries', [...draft.entries, { exerciseId, sets: ex.type === 'strength' ? [{ reps: 8, weightKg: 0, done: true }] : [], cardio: ex.type === 'cardio' ? { durationMin: 20, distanceKm: null, intensity: 'moderate', done: true } : null }]);
  };
  const picker = <Field label="Add shared exercise"><select className="input" value="" onChange={(e) => addExercise(e.target.value)}><option value="">Choose an exercise…</option>{exercises.filter((e) => !e.isCustom && !e.archived && !(draft.entries ?? draft.exercises ?? []).some((r: Row) => (r.exerciseId ?? r.exercise) === e.id)).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></Field>;
  return <div className="admin-backdrop" onClick={(e) => { if (e.target === e.currentTarget) close(); }}><div className="admin-dialog" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="admin-editor-title"><header><div><span className="admin-eyebrow">{type}</span><h2 id="admin-editor-title">{source.name || (type === 'users' ? 'New member' : 'New shared exercise')}</h2></div><button className="icon-btn" aria-label="Close editor" onClick={close} disabled={busy}>×</button></header>
    <form onSubmit={(e) => { e.preventDefault(); void save(); }}><div className="admin-dialog-body">{error && <p className="form-error" role="alert">{error}</p>}
      {type === 'users' && <><div className="admin-member-facts"><strong>{source.email}</strong><span>{source.username && `@${source.username}`} · Joined {date(source.createdAt)}</span></div><div className="admin-mini-metrics"><div><strong>{data.stats.workouts}</strong><span>Workouts</span></div><div><strong>{fmt(data.stats.minutes / 60)}</strong><span>Training hours</span></div><div><strong>{data.routines}</strong><span>Routines</span></div></div>
        <fieldset disabled={busy || (locked && !ownTier)}>{selection('aiTier', 'AI account type', [['regular','Regular'],['pro','Pro'],['dev','Dev']], 'regular')}</fieldset>
        {locked && <p className="admin-notice">{source.isOwner ? 'The owner account is protected. Change your password in System & security.' : 'Only the owner can manage this administrator.'}</p>}
        <fieldset disabled={busy || locked}>{input('name', 'Display name', 'text', { required: true, maxLength: 120 })}
          {!source.id && <>{input('email', 'Email', 'email', { required: true, autoComplete: 'off' })}{input('username', 'Username (optional)', 'text', { pattern: '[a-zA-Z0-9_]{3,40}', autoComplete: 'off' })}{input('password', 'Initial password', 'password', { required: true, minLength: 12, maxLength: 72, autoComplete: 'new-password' })}<p className="hint">No email is sent automatically. Share the login details with the intended member through your usual secure channel.</p></>}
          {user?.isOwner && selection('role', 'Account access', [['user', 'Member'], ['admin', 'Administrator']], 'user')}{source.id && checkbox('suspended', 'Suspend account access')}</fieldset>
        <h3>Recent workouts</h3>{data.sessions.map((s: Row) => <div className="admin-detail-line" key={s.id}><span>{s.name}</span><small>{s.date} · {s.status}</small></div>)}{!data.sessions.length && <p className="muted">No workouts recorded.</p>}
        {!locked && source.id && <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => void command(`/users/${source.id}/revoke`, 'POST', `Sign ${source.name} out on all devices?`)}>Sign out all devices</button>}
        {!locked && source.id && <button type="button" className="btn admin-danger" disabled={busy} onClick={() => void command(`/users/${source.id}`, 'DELETE', `Permanently delete ${source.email} and their workouts, routines and suggestions?`)}>Delete account permanently</button>}</>}
      {type === 'exercises' && <fieldset disabled={busy}><div className="admin-form-grid">{input('name', 'Exercise name', 'text', { required: true, maxLength: 120 })}{input('equipment', 'Equipment')}
        {selection('category', 'Category', CATEGORIES.map((c: Row) => [c.id, c.name]), 'chest')}{selection('type', 'Exercise type', [['strength', 'Strength'], ['cardio', 'Cardio']], 'strength')}
        {input('met', 'Effort rating (MET)', 'number', { min: 0.1, max: 30, step: 0.1, required: true })}{input('defaultRestSec', 'Default rest (seconds)', 'number', { min: 0, max: 3600 })}
        {input('barWeightKg', 'Bar weight (kg)', 'number', { min: 0, max: 100, step: 0.1 })}{input('bodyweightFactor', 'Bodyweight factor', 'number', { min: 0, max: 2, step: 0.05 })}
      </div>{selection('energyModel', 'Calorie model', [['fixed', 'Exercise MET + intensity'], ['walk-run', 'Walking / running speed'], ['cycling', 'Cycling speed'], ['rowing', 'Rowing speed']], 'fixed')}
      {(['primaryMuscles', 'secondaryMuscles'] as const).map((key) => <Field key={key} label={key === 'primaryMuscles' ? 'Primary muscles (comma separated)' : 'Secondary muscles (comma separated)'}><input className="input" defaultValue={(draft[key] ?? []).join(', ')} onChange={(e) => patch(key, e.target.value.split(',').map((v) => v.trim()).filter(Boolean))} /></Field>)}
      <div className="admin-checks">{checkbox('isBodyweight', 'Uses body weight')}{checkbox('isTimed', 'Timed sets')}{checkbox('isBarbell', 'Barbell exercise')}{checkbox('isDistanceBased', 'Log distance')}{checkbox('archived', 'Archived')}</div><p className="hint">Library edits apply to future calculations. Previously saved calorie totals are preserved.</p></fieldset>}
      {type === 'routines' && <fieldset disabled={busy}>{input('name', 'Routine name', 'text', { required: true })}<Field label="Notes"><textarea className="input" value={draft.note ?? ''} onChange={(e) => patch('note', e.target.value)} maxLength={2000} /></Field>{checkbox('archived', 'Archive this routine')}
        {draft.exercises.map((entry: Row, i: number) => <div className="admin-entry" key={entry.exercise}><strong>{entry.name ?? names.get(entry.exercise)}</strong><div className="admin-form-grid">{[['targetSets', 'Sets'], ['targetReps', 'Reps'], ['targetWeightKg', 'Target kg'], ['restSec', 'Rest seconds']].map(([key, label]) => <Field key={key} label={label}><input className="input" type="number" min={key === 'targetSets' ? 1 : 0} step={key === 'targetWeightKg' ? '0.1' : '1'} value={entry[key] ?? ''} onChange={(e) => patch('exercises', draft.exercises.map((r: Row, j: number) => j === i ? { ...r, [key]: e.target.value === '' ? null : Number(e.target.value) } : r))} /></Field>)}</div><button type="button" className="btn btn-ghost btn-sm" onClick={() => patch('exercises', draft.exercises.filter((_: Row, j: number) => j !== i))}>Remove exercise</button></div>)}{picker}</fieldset>}
      {type === 'workouts' && <><p className="muted">{source.user?.name} · {source.bodyWeightKg} kg recorded body weight</p>{live && <p className="admin-notice">This workout is in progress. Its member can finish it before administrative editing.</p>}<fieldset disabled={busy || live}><div className="admin-form-grid">{input('name', 'Workout name', 'text', { required: true, maxLength: 120 })}{input('date', 'Workout date', 'date', { required: true })}{input('durationMin', 'Duration (minutes)', 'number', { min: 0.01, max: 600, step: 0.01, required: true })}</div>
        {(draft.entries ?? []).map((entry: Row, i: number) => {
          const setEntry = (next: Row) => patch('entries', draft.entries.map((e: Row, j: number) => i === j ? next : e));
          return <div className="admin-entry" key={entry.exerciseId}><strong>{names.get(entry.exerciseId) ?? 'Archived exercise'}</strong>
            {entry.cardio ? <div className="admin-form-grid">{[['durationMin', 'Cardio minutes'], ['distanceKm', 'Distance (km)']].map(([key, label]) => <Field key={key} label={label}><input className="input" type="number" min={0} step="0.01" value={entry.cardio[key] ?? ''} onChange={(e) => setEntry({ ...entry, cardio: { ...entry.cardio, [key]: e.target.value === '' ? null : Number(e.target.value) } })} /></Field>)}<Field label="Intensity"><select className="input" value={entry.cardio.intensity} onChange={(e) => setEntry({ ...entry, cardio: { ...entry.cardio, intensity: e.target.value } })}>{['light', 'moderate', 'vigorous', 'max'].map((v) => <option key={v}>{v}</option>)}</select></Field></div>
              : <>{entry.sets.map((set: Row, j: number) => <div className="admin-set" key={j}><b>{j + 1}</b>{[['reps', 'Reps'], ['weightKg', 'kg'], ['durationSec', 'Seconds'], ['restSec', 'Rest sec'], ['rpe', 'RPE']].map(([key, label]) => <Field key={key} label={label}><input className="input" type="number" min={0} step={key === 'reps' ? 1 : '0.1'} value={set[key] ?? ''} onChange={(e) => setEntry({ ...entry, sets: entry.sets.map((s: Row, k: number) => k === j ? { ...s, [key]: e.target.value === '' ? null : Number(e.target.value) } : s) })} /></Field>)}<label className="admin-check"><input type="checkbox" checked={!!set.isWarmup} onChange={(e) => setEntry({ ...entry, sets: entry.sets.map((s: Row, k: number) => k === j ? { ...s, isWarmup: e.target.checked } : s) })} />Warm-up</label><button type="button" className="icon-btn" aria-label={`Remove set ${j + 1}`} onClick={() => setEntry({ ...entry, sets: entry.sets.filter((_: Row, k: number) => j !== k) })}>×</button></div>)}<button type="button" className="btn btn-ghost btn-sm" onClick={() => setEntry({ ...entry, sets: [...entry.sets, { reps: 8, weightKg: 0, done: true }] })}>+ Add set</button></>}
            <Field label="Exercise notes"><input className="input" value={entry.notes ?? ''} maxLength={2000} onChange={(e) => setEntry({ ...entry, notes: e.target.value })} /></Field><button type="button" className="btn btn-ghost btn-sm" onClick={() => patch('entries', draft.entries.filter((_: Row, j: number) => i !== j))}>Remove exercise</button></div>;
        })}{picker}</fieldset>{!live && <button type="button" className="btn admin-danger" disabled={busy} onClick={() => void command(`/workouts/${source.id}`, 'DELETE', `Permanently delete “${source.name}” from this member's history? This cannot be undone.`)}>Delete workout permanently</button>}</>}
    </div><footer><button className="btn btn-ghost" type="button" onClick={close} disabled={busy}>Close</button>{(!locked || ownTier) && !live && <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>}</footer></form></div></div>;
}

function System({ data }: { data: Row }) {
  const [current, setCurrent] = useState(''); const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const change = async (event: React.FormEvent) => { event.preventDefault(); setMessage(''); if (password !== confirmation) { setMessage('New passwords do not match.'); return; } setBusy(true); try { await adminApi('/password', 'POST', { currentPassword: current, password }); setCurrent(''); setPassword(''); setConfirmation(''); setMessage('Password changed. Your other sessions have been signed out.'); } catch (e) { setMessage((e as Error).message); } finally { setBusy(false); } };
  return <div className="admin-chart-grid"><section className="admin-panel"><div className="admin-panel-head"><h2>System health</h2>{badge('API connected', 'green')}</div><dl className="admin-summary">{[
    ['Database', `${data.database} · ${data.databaseLatencyMs} ms`], ['Environment', data.environment], ['Process uptime', `${fmt(data.uptimeSeconds / 60)} minutes`], ['Runtime', data.nodeVersion],
    ['Calculation version', data.calculationVersion], ['Active workout constraint', data.uniqueActiveWorkoutIndex ? 'Enabled' : 'Missing — check database indexes'], ['Email configuration', data.mailConfigured ? 'Configured (delivery not checked)' : 'Not configured'], ['Catalog revision', data.catalog?.revision ?? 'Not recorded'],
  ].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><p className="hint">Status is checked when this section loads. Secrets and database credentials are never exposed here.</p></section>
    <section className="admin-panel"><h2>Change admin password</h2><p className="muted">Use a unique password with at least 12 characters. Other sessions will be signed out.</p><form onSubmit={(e) => void change(e)}><fieldset disabled={busy}><Field label="Current password"><input className="input" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} /></Field><Field label="New password"><input className="input" type="password" autoComplete="new-password" minLength={12} maxLength={72} required value={password} onChange={(e) => setPassword(e.target.value)} /></Field><Field label="Confirm new password"><input className="input" type="password" autoComplete="new-password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></Field><button className="btn btn-primary" type="submit">{busy ? 'Updating…' : 'Update password'}</button></fieldset>{message && <p role="status">{message}</p>}</form></section></div>;
}

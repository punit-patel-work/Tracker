import { useState } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import { bmr } from '../../shared/engine.js';
import { formatDate, fromKg, num, relativeDay, toKg, todayISO, weightLabel } from '../lib/format';
import { Toast, useToast } from '../components/common';
import * as I from '../components/Icon';
import type { Goal, Sex, Units } from '../lib/types';

const GOALS: { id: Goal; label: string }[] = [
  { id: 'strength', label: 'Get stronger' },
  { id: 'hypertrophy', label: 'Build muscle' },
  { id: 'fat-loss', label: 'Lose fat' },
  { id: 'general', label: 'Stay in shape' },
];

export default function ProfilePage() {
  const { user, setUser, signOut } = useApp();
  const toast = useToast();
  const [weighIn, setWeighIn] = useState('');
  const [danger, setDanger] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;
  const units = user.units;
  const unit = weightLabel(units);
  const age = user.birthYear ? new Date().getFullYear() - user.birthYear : 0;
  const metrics = { sex: user.sex, weightKg: user.currentWeightKg, heightCm: user.heightCm ?? 0, age };
  const rest = bmr(metrics);

  const patch = async (body: Parameters<typeof api.updateMe>[0], message?: string) => {
    const { user: saved } = await api.updateMe(body);
    setUser(saved);
    if (message) toast.show(message);
  };

  const logWeight = async () => {
    const kg = toKg(Number(weighIn), units);
    if (!kg || kg <= 0) return;
    const { user: saved } = await api.addWeight(Math.round(kg * 10) / 10);
    setUser(saved);
    setWeighIn('');
    toast.show('Weight logged');
  };

  const alreadyToday = user.weighIns.some((w) => w.date === todayISO());

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h2 className="page-title">
            <I.User size={24} /> {user.name}
          </h2>
          <p className="page-sub">
            {user.email}{' '}
            {user.emailVerified ? (
              <span className="verified-pill">
                <I.Check size={12} /> Verified
              </span>
            ) : (
              <span className="unverified-pill">Unverified</span>
            )}
          </p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost" onClick={() => void signOut()}>
            <I.LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------- weigh-in */}
      <section className="card card-pad">
        <div className="card-head">
          <div>
            <h3>
              <I.Scale size={19} /> Body weight
            </h3>
            <p>
              Logged as a dated entry. Past workouts keep the weight you were on the day, so old calorie figures never
              change under you.
            </p>
          </div>
        </div>

        <div className="weigh-row">
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label htmlFor="pf-weight">Today's weight ({unit})</label>
            <input
              id="pf-weight"
              className="input"
              inputMode="decimal"
              placeholder={user.currentWeightKg ? String(num(fromKg(user.currentWeightKg, units), 1)) : ''}
              value={weighIn}
              onChange={(e) => setWeighIn(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={logWeight} disabled={!weighIn}>
            {alreadyToday ? 'Update' : 'Log'}
          </button>
        </div>

        {user.weighIns.length > 0 && (
          <div className="weigh-list">
            {[...user.weighIns]
              .slice(-6)
              .reverse()
              .map((entry) => (
                <div key={entry.date} className="weigh-item">
                  <span>{formatDate(entry.date)}</span>
                  <b>
                    {num(fromKg(entry.kg, units), 1)} {unit}
                  </b>
                  <span className="muted">{relativeDay(entry.date)}</span>
                  <button
                    className="icon-btn sm danger"
                    aria-label={`Remove weigh-in from ${formatDate(entry.date)}`}
                    onClick={async () => {
                      const { user: saved } = await api.removeWeight(entry.date);
                      setUser(saved);
                    }}
                  >
                    <I.X size={14} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- BMR */}
      <div className="hero-card">
        <div className="hero-icon">
          <I.Flame size={28} />
        </div>
        <div>
          <div className="hero-eyebrow">Resting energy · Mifflin–St Jeor</div>
          <div className="hero-value">
            {num(rest)}
            <span>kcal / day</span>
          </div>
          <div className="hero-note">
            What your body spends doing nothing, from {num(fromKg(user.currentWeightKg, units), 1)} {unit},{' '}
            {user.heightCm ?? 0} cm, {age} years. Workout burn is reported on top of this figure.
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- metrics */}
      <section className="card card-pad">
        <div className="card-head">
          <div>
            <h3>
              <I.Sliders size={19} /> Metrics &amp; preferences
            </h3>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="pf-name">Name</label>
            <input
              id="pf-name"
              className="input"
              defaultValue={user.name}
              onBlur={(e) => e.target.value !== user.name && void patch({ name: e.target.value }, 'Name updated')}
            />
          </div>
          <div className="field">
            <label htmlFor="pf-height">Height (cm)</label>
            <input
              id="pf-height"
              className="input"
              inputMode="numeric"
              defaultValue={user.heightCm ?? ''}
              onBlur={(e) =>
                Number(e.target.value) !== user.heightCm &&
                void patch({ heightCm: Number(e.target.value) }, 'Height updated')
              }
            />
          </div>
          <div className="field">
            <label htmlFor="pf-year">Birth year</label>
            <input
              id="pf-year"
              className="input"
              inputMode="numeric"
              defaultValue={user.birthYear ?? ''}
              onBlur={(e) =>
                Number(e.target.value) !== user.birthYear &&
                void patch({ birthYear: Number(e.target.value) }, 'Birth year updated')
              }
            />
          </div>
          <div className="field">
            <label htmlFor="pf-sex">Biological sex</label>
            <select
              id="pf-sex"
              className="select"
              value={user.sex}
              onChange={(e) => void patch({ sex: e.target.value as Sex }, 'Updated')}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="field full">
            <span className="field-label">Units</span>
            <div className="segmented lg">
              {(['metric', 'imperial'] as Units[]).map((u) => (
                <button key={u} className={units === u ? 'on' : ''} onClick={() => void patch({ units: u }, 'Units changed')}>
                  {u === 'metric' ? 'Kilograms' : 'Pounds'}
                </button>
              ))}
            </div>
            <p className="hint">Everything is stored in kilograms — this only changes what you see and type.</p>
          </div>

          <div className="field full">
            <span className="field-label">Goal</span>
            <div className="chip-row">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  className={`chip ${user.goal === g.id ? 'active' : ''}`}
                  onClick={() => void patch({ goal: g.id }, 'Goal updated')}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field full">
            <span className="field-label">Weekly session target</span>
            <div className="segmented lg">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  className={user.weeklyTarget === n ? 'on' : ''}
                  onClick={() => void patch({ weeklyTarget: n }, 'Target updated')}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="field full">
            <span className="field-label">Keep Screen Awake (Display Always Open)</span>
            <div className="segmented lg">
              {[
                { id: 'workout', label: 'During Workout' },
                { id: 'always', label: 'Always On Website' },
                { id: 'never', label: 'Disabled' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  className={(user.keepAwake ?? 'workout') === opt.id ? 'on' : ''}
                  onClick={() => void patch({ keepAwake: opt.id as any }, 'Screen wake setting updated')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="hint">Prevents your phone or device screen from dimming or turning off while using the app.</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- account */}
      <section className="card card-pad">
        <div className="card-head">
          <div>
            <h3>
              <I.Download size={19} /> Your data
            </h3>
            <p>Everything you have logged, in a format you can keep.</p>
          </div>
        </div>
        <div className="chip-row">
          <a className="btn btn-ghost" href={api.exportUrl('csv')} download>
            <I.Download size={16} /> Export CSV
          </a>
          <a className="btn btn-ghost" href={api.exportUrl('json')} download>
            <I.Download size={16} /> Export JSON
          </a>
        </div>
        <p className="hint">
          CSV is one row per set — drop it straight into a spreadsheet. JSON includes routines and custom exercises.
        </p>
      </section>

      <section className="card card-pad">
        <div className="card-head">
          <div>
            <h3>Account</h3>
            <p>Your workouts are saved to your account, so they follow you to any device you sign in on.</p>
          </div>
        </div>

        {!danger ? (
          <button className="link-btn danger-link" onClick={() => setDanger(true)}>
            Delete my account and all training data
          </button>
        ) : (
          <div className="danger-zone">
            <p>
              <strong>This deletes everything</strong> — every workout, routine and custom exercise. It cannot be
              undone. Confirm with your password.
            </p>
            <div className="weigh-row">
              <input
                className="input"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
              <button
                className="btn btn-danger"
                onClick={async () => {
                  try {
                    await api.deleteAccount(password);
                    window.location.reload();
                  } catch (e) {
                    setError(e instanceof Error ? e.message : 'Could not delete the account');
                  }
                }}
              >
                Delete forever
              </button>
              <button className="btn btn-ghost" onClick={() => setDanger(false)}>
                Cancel
              </button>
            </div>
            {error && <p className="form-error">{error}</p>}
          </div>
        )}
      </section>

      <Toast message={toast.message} />
    </div>
  );
}

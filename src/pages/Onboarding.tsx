import { useState } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import { bmr } from '../../shared/engine.js';
import { fromKg, num, roundLoadable, toKg, weightLabel } from '../lib/format';
import * as I from '../components/Icon';
import type { Goal, Sex, Units } from '../lib/types';

const GOALS: { id: Goal; label: string; blurb: string }[] = [
  { id: 'strength', label: 'Get stronger', blurb: 'Heavy, low reps. Progress tracked by estimated 1RM.' },
  { id: 'hypertrophy', label: 'Build muscle', blurb: 'Moderate reps. Progress tracked by weekly volume.' },
  { id: 'fat-loss', label: 'Lose fat', blurb: 'Calorie burn and cardio minutes take the front seat.' },
  { id: 'general', label: 'Stay in shape', blurb: 'Consistency first — streaks and session count.' },
];

/**
 * Three short steps, asked once, each explaining why it is being asked. The old
 * sign-in screen collected these every visit and used them for nothing.
 */
export default function Onboarding() {
  const { user, setUser } = useApp();
  const [step, setStep] = useState(0);
  const [units, setUnits] = useState<Units>(user?.units ?? 'metric');
  const [sex, setSex] = useState<Sex>(user?.sex ?? 'male');
  const [birthYear, setBirthYear] = useState(user?.birthYear ? String(user.birthYear) : '');
  const [heightCm, setHeightCm] = useState(user?.heightCm ? String(user.heightCm) : '');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<Goal>(user?.goal ?? 'general');
  const [weeklyTarget, setWeeklyTarget] = useState(user?.weeklyTarget ?? 4);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const unit = weightLabel(units);
  const heightLabel = units === 'imperial' ? 'Height (in)' : 'Height (cm)';
  const heightValue = units === 'imperial' ? (Number(heightCm) / 2.54 || '') : heightCm;

  const weightKg = toKg(Number(weight), units) ?? 0;
  const age = birthYear ? new Date().getFullYear() - Number(birthYear) : 0;
  const estimate = bmr({ sex, weightKg, heightCm: Number(heightCm), age });

  const step1Valid = !!birthYear && Number(birthYear) > 1900 && Number(heightCm) > 80;
  const step2Valid = weightKg > 20;

  const finish = async () => {
    setBusy(true);
    setError('');
    try {
      const { user: saved } = await api.updateMe({
        units,
        sex,
        birthYear: Number(birthYear),
        heightCm: Math.round(Number(heightCm)),
        weightKg: Math.round(weightKg * 10) / 10,
        goal,
        weeklyTarget,
      });
      setUser(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your details');
      setBusy(false);
    }
  };

  return (
    <div className="onboard">
      <div className="onboard-card">
        <div className="onboard-progress" aria-label={`Step ${step + 1} of 3`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>

        {step === 0 && (
          <>
            <h2>A few basics, {user?.name?.split(' ')[0]}</h2>
            <p className="muted">
              Age, height and sex go into the Mifflin–St Jeor equation. Without them a calorie figure is a guess.
            </p>

            <div className="field">
              <span className="field-label">Units</span>
              <div className="segmented lg">
                <button className={units === 'metric' ? 'on' : ''} onClick={() => setUnits('metric')}>
                  Metric (kg)
                </button>
                <button className={units === 'imperial' ? 'on' : ''} onClick={() => setUnits('imperial')}>
                  Imperial (lb)
                </button>
              </div>
            </div>

            <div className="field">
              <span className="field-label">Biological sex</span>
              <div className="segmented lg">
                <button className={sex === 'male' ? 'on' : ''} onClick={() => setSex('male')}>
                  Male
                </button>
                <button className={sex === 'female' ? 'on' : ''} onClick={() => setSex('female')}>
                  Female
                </button>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="ob-year">Birth year</label>
                <input
                  id="ob-year"
                  className="input"
                  inputMode="numeric"
                  placeholder="1999"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                />
                {age > 0 && <p className="hint">{age} years old</p>}
              </div>
              <div className="field">
                <label htmlFor="ob-height">{heightLabel}</label>
                <input
                  id="ob-height"
                  className="input"
                  inputMode="decimal"
                  value={heightValue}
                  onChange={(e) =>
                    setHeightCm(units === 'imperial' ? String(Number(e.target.value) * 2.54) : e.target.value)
                  }
                />
              </div>
            </div>

            <button className="btn btn-primary btn-lg wide" disabled={!step1Valid} onClick={() => setStep(1)}>
              Continue <I.ChevronRight size={17} />
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2>What do you weigh right now?</h2>
            <p className="muted">
              Body weight is the multiplier in every calorie estimate. It is stored as a dated entry, so past workouts
              keep the weight you were when you did them.
            </p>

            <div className="field">
              <label htmlFor="ob-weight">Body weight ({unit})</label>
              <input
                id="ob-weight"
                className="input xl"
                inputMode="decimal"
                placeholder={units === 'imperial' ? '180' : '82'}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                autoFocus
              />
            </div>

            {estimate > 0 && (
              <div className="callout">
                <I.Flame size={19} />
                <div>
                  <strong>{num(estimate)} kcal/day</strong> at complete rest. Workout burn is reported on top of this.
                </div>
              </div>
            )}

            <div className="onboard-actions">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>
                <I.ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary btn-lg" disabled={!step2Valid} onClick={() => setStep(2)}>
                Continue <I.ChevronRight size={17} />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>What are you training for?</h2>
            <p className="muted">This decides which number the home screen leads with. You can change it any time.</p>

            <div className="goal-list">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  className={`goal-card ${goal === g.id ? 'on' : ''}`}
                  onClick={() => setGoal(g.id)}
                  aria-pressed={goal === g.id}
                >
                  <div className="goal-head">
                    <strong>{g.label}</strong>
                    <span className={`radio ${goal === g.id ? 'on' : ''}`} aria-hidden />
                  </div>
                  <span className="muted">{g.blurb}</span>
                </button>
              ))}
            </div>

            <div className="field">
              <span className="field-label">Sessions per week you are aiming for</span>
              <div className="segmented lg">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button key={n} className={weeklyTarget === n ? 'on' : ''} onClick={() => setWeeklyTarget(n)}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="onboard-actions">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                <I.ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary btn-lg" onClick={finish} disabled={busy}>
                {busy ? 'Saving...' : 'Start training'}
              </button>
            </div>
          </>
        )}
      </div>

      {step === 1 && weightKg > 0 && (
        <p className="onboard-foot muted">
          Stored as {num(fromKg(roundLoadable(weightKg, units), units), 1)} {unit}
        </p>
      )}
    </div>
  );
}

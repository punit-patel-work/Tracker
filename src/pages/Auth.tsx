import { useState, type FormEvent, type ReactNode } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import * as I from '../components/Icon';

type Mode = 'login' | 'signup' | 'forgot' | 'reset';

/** A ?reset=<token> link drops you straight into setting a new password. */
function tokenFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('reset');
}

export default function Auth({ themeToggle }: { themeToggle: ReactNode }) {
  const { signIn, signUp, setUser } = useApp();
  const [resetToken] = useState(tokenFromUrl);
  const [mode, setMode] = useState<Mode>(resetToken ? 'reset' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const go = (next: Mode) => {
    setMode(next);
    setError('');
    setNotice('');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await signIn(email, password);
      else if (mode === 'signup') await signUp(name, email, password);
      else if (mode === 'forgot') {
        // The response also carries the link in development; never shown, or
        // the reset would not require access to the inbox at all.
        await api.forgot(email);
        setNotice('If an account exists for that address, we have sent a reset link. It expires in one hour.');
      } else if (mode === 'reset') {
        const { user } = await api.reset(resetToken ?? '', password);
        window.history.replaceState({}, '', window.location.pathname);
        setUser(user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const heading =
    mode === 'login'
      ? 'Welcome back'
      : mode === 'signup'
        ? 'Create your account'
        : mode === 'forgot'
          ? 'Reset your password'
          : 'Choose a new password';

  const blurb =
    mode === 'login'
      ? 'Sign in to pick up where your last session left off.'
      : mode === 'signup'
        ? 'Takes about thirty seconds. Your training history lives with your account.'
        : mode === 'forgot'
          ? 'Enter your email and we will create a one-hour reset link.'
          : 'Pick something at least 8 characters. You will be signed in straight away.';

  return (
    <div className="auth">
      <div className="auth-theme">{themeToggle}</div>

      <aside className="auth-pitch">
        <div className="brand-mark lg">
          <I.Flame size={30} />
        </div>
        <h1>
          Track the lift,
          <br />
          not the spreadsheet.
        </h1>
        <p>
          Log a set in two taps, see what you lifted last time before you load the bar, and let the calorie maths take
          care of itself.
        </p>
        <ul className="auth-points">
          <li>
            <I.Repeat size={17} /> Every set prefilled from last session
          </li>
          <li>
            <I.Timer size={17} /> Rest timer that keeps running while you scroll
          </li>
          <li>
            <I.Trophy size={17} /> Personal records spotted automatically
          </li>
          <li>
            <I.Flame size={17} /> Calorie burn from real MET values, not guesses
          </li>
        </ul>
      </aside>

      <main className="auth-panel">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-card-head">
            <h2>{heading}</h2>
            <p className="muted">{blurb}</p>
          </div>

          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="au-name">Name</label>
              <input
                id="au-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          {mode !== 'reset' && (
            <div className="field">
              <label htmlFor="au-email">Email</label>
              <input
                id="au-email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          )}

          {mode !== 'forgot' && (
          <div className="field">
            <label htmlFor="au-pw">{mode === 'reset' ? 'New password' : 'Password'}</label>
            <div className="input-affix">
              <input
                id="au-pw"
                className="input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'login' ? undefined : 8}
                required
              />
              <button
                type="button"
                className="affix-btn"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {mode !== 'login' && <p className="hint">At least 8 characters.</p>}
            {mode === 'login' && (
              <button type="button" className="link-btn forgot-link" onClick={() => go('forgot')}>
                Forgot password?
              </button>
            )}
          </div>
          )}

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <div className="callout" role="status">
              <I.Check size={18} />
              <div>{notice}</div>
            </div>
          )}

          <button className="btn btn-primary btn-lg wide" type="submit" disabled={busy}>
            {busy
              ? 'One moment...'
              : mode === 'login'
                ? 'Sign in'
                : mode === 'signup'
                  ? 'Create account'
                  : mode === 'forgot'
                    ? 'Send reset link'
                    : 'Set password and sign in'}
          </button>

          <p className="auth-switch">
            {mode === 'login' && (
              <>
                Don't have an account?{' '}
                <button type="button" className="link-btn" onClick={() => go('signup')}>
                  Create one
                </button>
              </>
            )}
            {mode === 'signup' && (
              <>
                Already have one?{' '}
                <button type="button" className="link-btn" onClick={() => go('login')}>
                  Sign in
                </button>
              </>
            )}
            {(mode === 'forgot' || mode === 'reset') && (
              <button type="button" className="link-btn" onClick={() => go('login')}>
                Back to sign in
              </button>
            )}
          </p>
        </form>
      </main>
    </div>
  );
}

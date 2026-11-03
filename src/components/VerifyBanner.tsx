import { useEffect, useState } from 'react';
import { useApp } from '../state/app';
import { api } from '../lib/api';
import * as I from './Icon';

/** Pulls ?verify=<token> out of the URL exactly once, on first load. */
export function useEmailVerification() {
  const { user, setUser } = useApp();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('verify');
    if (!token) return;
    window.history.replaceState({}, '', window.location.pathname);

    void api
      .verifyEmail(token)
      .then(async () => {
        setResult({ ok: true, message: 'Email confirmed. Account recovery is set up.' });
        // Refresh the signed-in user so the banner disappears immediately.
        try {
          const { user: fresh } = await api.me();
          setUser(fresh);
        } catch {
          /* verifying while signed out is fine — sign in as normal */
        }
      })
      .catch((err) => setResult({ ok: false, message: err instanceof Error ? err.message : 'Could not confirm' }));
    // Intentionally runs once: the token is consumed and stripped from the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { result, dismiss: () => setResult(null), verified: user?.emailVerified ?? true };
}

export function VerifyResult({ result, onDismiss }: { result: { ok: boolean; message: string }; onDismiss: () => void }) {
  return (
    <div className={`verify-toast ${result.ok ? 'ok' : 'bad'}`} role="status">
      {result.ok ? <I.Check size={17} /> : <I.Info size={17} />}
      <span>{result.message}</span>
      <button onClick={onDismiss} aria-label="Dismiss">
        <I.X size={15} />
      </button>
    </div>
  );
}

/**
 * Soft prompt, not a gate. An unverified address only costs you account
 * recovery, so blocking someone from logging a workout over it is the wrong
 * trade — but a mistyped email should not go unnoticed either.
 */
export function VerifyBanner() {
  const { user } = useApp();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [hidden, setHidden] = useState(false);

  if (!user || user.emailVerified || hidden) return null;

  // The API also returns the link in development, but it is never rendered:
  // clicking it here would confirm the address without proving you can read
  // the inbox, which is the only thing verification is for.
  const resend = async () => {
    setState('sending');
    try {
      await api.resendVerification();
      setState('sent');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="verify-banner">
      <I.Info size={18} />
      <div className="verify-body">
        <strong>Confirm {user.email}</strong>
        <span className="muted">
          {state === 'sent'
            ? 'Sent — check your inbox and spam folder.'
            : state === 'error'
              ? 'Could not send just now. Try again in a few minutes.'
              : 'Without it you cannot reset your password if you forget it.'}
        </span>
      </div>
      <div className="verify-actions">
        <button className="btn btn-ghost btn-sm" onClick={resend} disabled={state === 'sending' || state === 'sent'}>
          {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Sent' : 'Resend'}
        </button>
        <button className="icon-btn sm" onClick={() => setHidden(true)} aria-label="Hide until next visit">
          <I.X size={15} />
        </button>
      </div>
    </div>
  );
}

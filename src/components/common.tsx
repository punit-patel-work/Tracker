import { useEffect, useState, type ReactNode } from 'react';

/** Re-renders on an interval — used by the session clock and the rest timer. */
export function useTick(ms: number, enabled = true): number {
  const [, setN] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setN((n) => n + 1), ms);
    return () => window.clearInterval(id);
  }, [ms, enabled]);
  return Date.now();
}

/**
 * Holds the screen awake while a workout is running, so the phone does not lock
 * between sets. Re-acquires after the tab is backgrounded — the browser drops
 * the lock automatically and does not give it back on its own.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let released = false;

    const acquire = async () => {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        /* denied, low battery, or unsupported — not worth surfacing */
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible' && !released) void acquire();
    };

    void acquire();
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      released = true;
      document.removeEventListener('visibilitychange', onVisible);
      void sentinel?.release().catch(() => {});
    };
  }, [active]);
}

/**
 * True while the on-screen keyboard is up. Used to pull the fixed bottom bars
 * out of the way — otherwise the tab bar sits on top of the set input you are
 * currently typing into.
 */
export function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setOpen(vv.height < window.innerHeight * 0.75);
    vv.addEventListener('resize', onResize);
    onResize();
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  return open;
}

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="card empty">
      {icon}
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function Stat({
  icon,
  label,
  value,
  suffix,
  tint,
  tintSoft,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  suffix?: string;
  tint?: string;
  tintSoft?: string;
}) {
  return (
    <div
      className="stat"
      style={{ ['--tint' as string]: tint, ['--tint-soft' as string]: tintSoft }}
    >
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          {value}
          {suffix && <small>{suffix}</small>}
        </div>
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="toast" role="status">
      {message}
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(null), 2600);
    return () => window.clearTimeout(id);
  }, [message]);
  return { message, show: setMessage };
}

import { useState, type ComponentType } from 'react';
import { useApp } from './state/app';
import { useWorkout } from './state/workout';
import { useTheme } from './state/theme';
import { clock, fromKg, num, weightLabel } from './lib/format';
import { useKeyboardOpen, useTick, useWakeLock } from './components/common';
import RestTimer from './components/RestTimer';
import { useEmailVerification, VerifyBanner, VerifyResult } from './components/VerifyBanner';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Workout from './pages/Workout';
import Routines from './pages/Routines';
import HistoryPage from './pages/HistoryPage';
import Progress from './pages/Progress';
import ProfilePage from './pages/ProfilePage';
import * as I from './components/Icon';

type Page = 'home' | 'workout' | 'routines' | 'history' | 'progress' | 'profile';

const NAV: { id: Page; label: string; short: string; icon: ComponentType<{ size?: number }> }[] = [
  { id: 'home', label: 'Home', short: 'Home', icon: I.Home },
  { id: 'routines', label: 'Routines', short: 'Routines', icon: I.Layers },
  { id: 'history', label: 'History', short: 'History', icon: I.History },
  { id: 'progress', label: 'Progress', short: 'Progress', icon: I.BarChart },
  { id: 'profile', label: 'Profile', short: 'You', icon: I.User },
];

export default function App() {
  const { ready, user, backendError, retryBoot } = useApp();
  const theme = useTheme();
  // Handled before the auth branch: a confirmation link works signed in or out.
  const verification = useEmailVerification();

  const themeToggle = (
    <button
      className="icon-btn"
      onClick={theme.toggle}
      aria-label={`Switch to ${theme.resolved === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme.resolved === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme.resolved === 'dark' ? <I.Sun size={19} /> : <I.Moon size={19} />}
    </button>
  );

  if (!ready) {
    return (
      <div className="splash">
        <div className="brand-mark lg">
          <I.Flame size={30} />
        </div>
        <p className="muted">Loading your training…</p>
      </div>
    );
  }

  // Distinguish "server is down" from "you are signed out" — dropping someone
  // at a login form that cannot possibly succeed is the worst of both.
  if (backendError) {
    return (
      <div className="splash">
        <div className="brand-mark lg">
          <I.Flame size={30} />
        </div>
        <div className="down-card">
          <h2>Can't connect</h2>
          <p>
            Gym Tracker can't reach your workouts right now. Your data is safe — this is a connection problem, not a
            lost account.
          </p>
          {/* The operator (you) needs the real cause; a user does not need it shouted at them. */}
          <details className="down-details">
            <summary>Technical details</summary>
            <p>{backendError}</p>
          </details>
          <div className="dialog-actions">
            <button className="btn btn-primary" onClick={retryBoot}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Auth themeToggle={themeToggle} />
        {verification.result && <VerifyResult result={verification.result} onDismiss={verification.dismiss} />}
      </>
    );
  }
  if (!user.onboardedAt) return <Onboarding />;

  return (
    <>
      <Shell themeToggle={themeToggle} />
      {verification.result && <VerifyResult result={verification.result} onDismiss={verification.dismiss} />}
    </>
  );
}

function Shell({ themeToggle }: { themeToggle: React.ReactNode }) {
  const { user } = useApp();
  const w = useWorkout();
  const [page, setPage] = useState<Page>('home');
  const now = useTick(1000, !!w.session);
  const keyboardOpen = useKeyboardOpen();
  useWakeLock(!!w.session); // don't let the phone lock between sets

  const go = (next: string) => {
    setPage(next as Page);
    window.scrollTo({ top: 0 });
  };

  const units = user?.units ?? 'metric';
  const showMiniBar = !!w.session && page !== 'workout';

  return (
    <div
      className={`app ${w.session ? 'has-session' : ''} ${w.rest ? 'resting' : ''} ${
        keyboardOpen ? 'keyboard-open' : ''
      }`}
    >
      <header className="header">
        <div className="header-inner">
          <button className="brand" onClick={() => go('home')}>
            <div className="brand-mark">
              <I.Flame size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-title">Gym Tracker</span>
              <span className="brand-sub">Strength &amp; cardio log</span>
            </div>
          </button>

          <nav className="nav desktop-only" aria-label="Sections">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => go(item.id)}
                  aria-current={page === item.id ? 'page' : undefined}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="header-actions">
            {themeToggle}
            <button className="user-chip desktop-only" onClick={() => go('profile')}>
              <I.User size={16} />
              {user?.name?.split(' ')[0]}
            </button>
          </div>
        </div>
      </header>

      <div className="shell">
        <VerifyBanner />
        <main>
          {page === 'home' && <Home go={go} />}
          {page === 'workout' && <Workout go={go} />}
          {page === 'routines' && <Routines go={go} />}
          {page === 'history' && <HistoryPage />}
          {page === 'progress' && <Progress />}
          {page === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* A running workout must never be more than one tap away. */}
      {showMiniBar && w.session && (
        <button className="mini-bar" onClick={() => go('workout')}>
          <span className="pulse" aria-hidden />
          <div>
            <strong>{w.session.name}</strong>
            <span>
              {clock(now - new Date(w.session.startedAt).getTime())} · {w.totals?.workingSets ?? 0} sets ·{' '}
              {num(fromKg(w.totals?.volumeKg ?? 0, units))} {weightLabel(units)}
            </span>
          </div>
          <span className="mini-cta">Resume</span>
        </button>
      )}

      {w.session && <RestTimer />}

      <nav className="tabbar mobile-only" aria-label="Sections">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={page === item.id ? 'active' : ''}
              onClick={() => go(item.id)}
              aria-current={page === item.id ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{item.short}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

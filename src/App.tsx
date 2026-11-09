import { lazy, Suspense, useState, type ComponentType } from 'react';
const Admin = lazy(() => import('./pages/Admin'));
const AiCoach = lazy(() => import('./pages/AiCoach'));

import { useApp } from './state/app';

import { useWorkout } from './state/workout';

import { workoutElapsedMs } from '../shared/engine.js';
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

import { Logo } from './components/Logo';



type Page = 'home' | 'workout' | 'routines' | 'history' | 'progress' | 'profile' | 'ai';



const NAV: { id: Page; label: string; short: string; icon: ComponentType<{ size?: number }> }[] = [

  { id: 'home', label: 'Today', short: 'Today', icon: I.Home },

  { id: 'routines', label: 'Routines', short: 'Routines', icon: I.Layers },

  { id: 'history', label: 'History', short: 'History', icon: I.History },

  { id: 'progress', label: 'Progress', short: 'Progress', icon: I.BarChart },

  { id: 'ai', label: 'AI Coach', short: 'AI Coach', icon: I.Sparkles },
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

        <Logo size={64} variant="mark" />

        <p className="muted">Loading your training…</p>

      </div>

    );

  }



  // Distinguish "server is down" from "you are signed out" — dropping someone

  // at a login form that cannot possibly succeed is the worst of both.

  if (backendError) {

    return (

      <div className="splash">

        <Logo size={64} variant="mark" />

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

  if (window.location.pathname.replace(/\/$/, '') === '/admin') {
    if (user.role !== 'admin') return <div className="splash"><h1>Administrator access required</h1><a className="btn btn-primary" href="/">Back to Gym Tracker</a></div>;
    return <Suspense fallback={<div className="splash">Loading administration…</div>}><Admin themeToggle={themeToggle} /></Suspense>;
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

  const { user, offline, retryBoot } = useApp();

  const w = useWorkout();

  const [page, setPage] = useState<Page>(() => window.location.pathname.replace(/\/$/, '') === '/ai' ? 'ai' : 'home');

  const now = useTick(1000, !!w.session);

  const keyboardOpen = useKeyboardOpen();

  useWakeLock(user?.keepAwake ?? 'workout', !!w.session);



  const go = (next: string) => {

    setPage(next as Page);
    window.history.replaceState(null, '', next === 'ai' ? '/ai' : '/');

    window.scrollTo({ top: 0 });

  };



  const units = user?.units ?? 'metric';

  const showMiniBar = !!w.session && page !== 'workout';

  const section = page === 'workout' ? 'Active workout' : NAV.find((item) => item.id === page)?.label;

  const initials = user?.name.split(/\s+/).filter(Boolean).slice(0, 2).map((name) => name[0]).join('').toUpperCase();



  return (

    <div

      className={`app ${w.session ? 'has-session' : ''} ${w.rest ? 'resting' : ''} ${

        keyboardOpen ? 'keyboard-open' : ''

      }`}

    >

      <a className="skip-link" href="#main-content">Skip to content</a>

      <aside className="sidebar desktop-only">

        <button className="brand sidebar-brand" onClick={() => go('home')} aria-label="Gym Tracker Home">

          <Logo size={34} showSub={false} />

        </button>

        <span className="nav-caption">Your training</span>

        <nav className="nav" aria-label="Sections">

          {NAV.map((item) => {

            const Icon = item.icon;

            return (

              <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`}

                onClick={() => go(item.id)} aria-current={page === item.id ? 'page' : undefined}>

                <Icon size={18} />{item.label}

                {page === item.id && <span className="nav-active-dot" aria-hidden="true" />}

              </button>

            );

          })}

        </nav>

        {w.session && (

          <button className="sidebar-session" onClick={() => go('workout')}>

            <span className="pulse" aria-hidden="true" />

            <div><strong>Workout in progress</strong><span>Back to your session</span></div>

            <I.ChevronRight size={16} />

          </button>

        )}

        <div className="sidebar-bottom">

          <div className="sidebar-note"><I.Dumbbell size={19} /><p>One session at a time.<br /><span>Make it count.</span></p></div>

          <button className="sidebar-account" onClick={() => go('profile')}>

            <span className="avatar" aria-hidden="true">{initials}</span>

            <span><strong>{user?.name}</strong><small>Account & preferences</small></span>

            <I.ChevronRight size={15} />

          </button>

        </div>

      </aside>

      <header className="header">

        <div className="header-inner">

          <button className="brand mobile-only" onClick={() => go('home')} aria-label="Gym Tracker Home">

            <Logo size={30} showSub={false} />

          </button>



          <div className="header-location desktop-only"><span>My training</span><I.ChevronRight size={14} /><strong>{section}</strong></div>



          <div className="header-actions">
            {user?.role === 'admin' && <a className="btn btn-ghost btn-sm" href="/admin">Admin portal</a>}

            <span className="header-date desktop-only"><I.Calendar size={15} />{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>

            {themeToggle}

          </div>

        </div>

      </header>



      <div className="shell">

        <VerifyBanner />

        {offline && <div className="offline-note" role="status">Offline copy · {user?.name}. Changes stay on this device until you reconnect. <button className="btn btn-ghost btn-sm" onClick={retryBoot}>Retry connection</button></div>}

        <main id="main-content" tabIndex={-1}>

          {page === 'home' && <Home go={go} />}

          {page === 'workout' && <Workout go={go} />}

          {page === 'routines' && <Routines go={go} />}

          {page === 'history' && <HistoryPage />}

          {page === 'progress' && <Progress />}

          {page === 'profile' && <ProfilePage />}
          {page === 'ai' && <Suspense fallback={<p>Loading training assistant…</p>}><AiCoach key={user?.id} /></Suspense>}

        </main>

      </div>



      {/* A running workout must never be more than one tap away. */}

      {showMiniBar && w.session && (

        <button className="mini-bar" onClick={() => go('workout')}>

          <span className="pulse" aria-hidden />

          <div>

            <strong>{w.session.name}</strong>

            <span>

              {clock(workoutElapsedMs(w.session, now))} · {w.totals?.workingSets ?? 0} sets ·{' '}

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

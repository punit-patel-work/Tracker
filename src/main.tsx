import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider, useApp } from './state/app';
import { WorkoutProvider } from './state/workout';
import './styles/app.css';
import './styles/ui.css';
import './styles/training.css';

function AccountApp() {
  const { user } = useApp();
  return <WorkoutProvider key={user?.id ?? 'signed-out'}><App /></WorkoutProvider>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <AccountApp />
    </AppProvider>
  </StrictMode>,
);

// Production only — a service worker in dev fights Vite's HMR.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline support is a bonus, never a requirement */
    });
  });
}

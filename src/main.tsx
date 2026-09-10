import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './state/app';
import { WorkoutProvider } from './state/workout';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
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

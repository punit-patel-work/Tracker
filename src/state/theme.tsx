import { useCallback, useEffect, useState } from 'react';
type ThemeChoice = 'light' | 'dark' | 'system';

const KEY = 'gt.theme';

function read(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>(read);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: 'light' | 'dark' = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice;

  useEffect(() => {
    const root = document.documentElement;
    if (choice === 'system') delete root.dataset.theme;
    else root.dataset.theme = choice;
    root.style.colorScheme = resolved;
    try {
      if (choice === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, choice);
    } catch {
      /* ignore */
    }
  }, [choice, resolved]);

  const toggle = useCallback(() => {
    setChoice(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved]);

  return { choice, resolved, setChoice, toggle };
}

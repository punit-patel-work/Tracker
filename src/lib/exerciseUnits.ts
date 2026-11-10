import { useSyncExternalStore } from 'react';
import { useApp } from '../state/app';
import type { Units } from './types';

const prefix = 'gt.exerciseUnit.';
const fallback = new Map<string, string>();
const listeners = new Set<() => void>();
let revision = 0;

function notify() {
  revision++;
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key === null || event.key.startsWith(prefix)) notify();
}

function subscribe(listener: () => void) {
  if (!listeners.size) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener('storage', onStorage);
  };
}

const getRevision = () => revision;

export function useExerciseUnits() {
  const { user } = useApp();
  useSyncExternalStore(subscribe, getRevision);
  const profileUnit = user?.units ?? 'metric';
  const key = (id: string) => prefix + user?.id + '.' + id;

  function choice(id: string): Units | '' {
    const storageKey = key(id);
    let value = fallback.get(storageKey);
    if (value === undefined) {
      try { value = localStorage.getItem(storageKey) ?? ''; } catch { return ''; }
    }
    return value === 'metric' || value === 'imperial' ? value : '';
  }

  function setChoice(id: string, unit: Units | '') {
    if (!user) return;
    const storageKey = key(id);
    try {
      if (unit) localStorage.setItem(storageKey, unit);
      else localStorage.removeItem(storageKey);
      fallback.delete(storageKey);
    } catch {
      // Keep logging in the chosen unit when browser storage is unavailable.
      fallback.set(storageKey, unit);
    }
    notify();
  }

  return { profileUnit, choice, setChoice, forExercise: (id: string) => choice(id) || profileUnit };
}

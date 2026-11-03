import { useEffect, useRef } from 'react';
import { useWorkout } from '../state/workout';
import { useTick } from './common';
import * as I from './Icon';

/**
 * Sticky rest timer. Deliberately global rather than a chip inside the exercise
 * card: you scroll while you rest, and a countdown you can scroll away from is
 * a countdown you stop trusting.
 */
export default function RestTimer() {
  const { rest, adjustRest, stopRest } = useWorkout();
  const now = useTick(250, !!rest);
  const fired = useRef(false);

  const remainingMs = rest ? Math.max(0, rest.endsAt - now) : 0;
  const seconds = Math.ceil(remainingMs / 1000);

  useEffect(() => {
    if (!rest) {
      fired.current = false;
      return;
    }
    if (remainingMs === 0 && !fired.current) {
      fired.current = true;
      beep();
      if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
      window.setTimeout(stopRest, 1500);
    }
  }, [rest, remainingMs, stopRest]);

  if (!rest) return null;

  const progress = rest.total > 0 ? remainingMs / (rest.total * 1000) : 0;
  const done = remainingMs === 0;

  return (
    <div className={`rest-bar ${done ? 'done' : ''}`} role="timer" aria-live="off">
      <div className="rest-fill" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      <div className="rest-content">
        <span className="rest-label">{done ? 'Rest over' : 'Resting'}</span>
        <strong className="rest-count">
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
        </strong>
        <div className="rest-actions">
          <button className="rest-btn" onClick={() => adjustRest(-15)} aria-label="Take 15 seconds off">
            −15s
          </button>
          <button className="rest-btn" onClick={() => adjustRest(15)} aria-label="Add 15 seconds">
            +15s
          </button>
          <button className="rest-btn skip" onClick={stopRest} aria-label="Skip rest">
            <I.X size={16} /> Skip
          </button>
        </div>
      </div>
    </div>
  );
}

/** Short tone via WebAudio so the timer works without shipping an audio file. */
function beep() {
  try {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
    osc.onended = () => ctx.close();
  } catch {
    /* audio blocked until the user interacts — the visual countdown still works */
  }
}

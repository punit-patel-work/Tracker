export type Units = 'metric' | 'imperial';
export type Sex = 'male' | 'female';
export type Goal = 'strength' | 'hypertrophy' | 'fat-loss' | 'general';
export type Intensity = 'light' | 'moderate' | 'vigorous' | 'max';

export interface WeighIn {
  date: string;
  kg: number;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  sex: Sex;
  birthYear: number | null;
  heightCm: number | null;
  units: Units;
  goal: Goal;
  weeklyTarget: number;
  weighIns: WeighIn[];
  favorites: Record<string, string[]>;
  onboardedAt: string | null;
  currentWeightKg: number;
}

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  type: 'strength' | 'cardio';
  category: string;
  equipment: string;
  muscles: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  /** Opens a demonstration search in a new tab. */
  howToUrl: string;
  met: number;
  defaultRestSec: number;
  isBarbell: boolean;
  barWeightKg: number;
  /** Lifts your own body — `weightKg` on a set means *added* weight. */
  isBodyweight: boolean;
  bodyweightFactor: number;
  /** Held for time; sets carry `durationSec` instead of reps. */
  isTimed: boolean;
  isDistanceBased: boolean;
  isCustom: boolean;
}

export interface WorkSet {
  reps: number | null;
  weightKg: number | null;
  durationSec?: number | null;
  rpe?: number | null;
  isWarmup?: boolean;
  done?: boolean;
  restSec?: number | null;
}

export interface Cardio {
  durationMin: number | null;
  distanceKm: number | null;
  incline?: number | null;
  level?: number | null;
  intensity: Intensity;
  done?: boolean;
}

export interface Entry {
  exerciseId: string;
  sets: WorkSet[];
  cardio?: Cardio | null;
  notes?: string;
}

export interface Totals {
  volumeKg: number;
  strengthKcal: number;
  cardioKcal: number;
  totalKcal: number;
  workingSets: number;
  cardioMinutes: number;
  durationMin: number;
  muscleVolume: Record<string, number>;
}

export interface Session {
  id: string;
  date: string;
  name: string;
  routineId: string | null;
  status: 'active' | 'completed';
  startedAt: string;
  endedAt: string | null;
  bodyWeightKg: number;
  notes: string;
  totals: Partial<Totals>;
  entries: Entry[];
}

export interface RoutineExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetWeightKg: number | null;
  restSec: number | null;
}

export interface Routine {
  id: string;
  name: string;
  note: string;
  lastPerformedAt: string | null;
  exercises: RoutineExercise[];
}

export interface PreviousPerformance {
  date: string;
  /** Body weight that day — needed to resolve bodyweight-exercise loads. */
  bodyWeightKg: number;
  sets: { reps: number | null; weightKg: number | null; durationSec?: number | null; isWarmup?: boolean }[];
  cardio: Cardio | null;
  bestE1rm: number;
}

export interface NewPR {
  exerciseId: string;
  name: string;
  e1rm: number;
  previous: number;
  reps?: number;
  weightKg?: number;
}

export interface WeekRow {
  week: string;
  volumeKg: number;
  kcal: number;
  sessions: number;
  minutes: number;
  cardioMinutes: number;
  workingSets: number;
}

export interface LiftProgress {
  id: string;
  name: string;
  category: string;
  points: { date: string; e1rm: number }[];
  sessions: number;
  firstE1rm: number;
  lastE1rm: number;
  deltaKg: number;
  deltaPct: number;
  bestE1rm: number;
  /** Trained recently but no longer setting bests. */
  stalled: boolean;
  lastDate: string;
  /** Best e1RM as a multiple of current body weight. */
  relative: number;
}

export interface Consistency {
  weeks: number;
  sessionsInRange: number;
  avgPerWeek: number;
  target: number;
  adherencePct: number;
}

export interface Overview {
  sessionCount: number;
  streak: number;
  goal: Goal;
  range: { weeks: number; from: string };
  lifts: LiftProgress[];
  consistency: Consistency;
  /** Hard sets per muscle, per week. The hypertrophy dose, not tonnage. */
  setsPerWeek: { week: string; muscles: Record<string, number> }[];
  avgSetsPerMuscle: Record<string, number>;
  currentWeightKg: number;
  totals: {
    volumeKg: number;
    kcal: number;
    strengthKcal: number;
    cardioKcal: number;
    workingSets: number;
    cardioMinutes: number;
    minutes: number;
  };
  weekly: WeekRow[];
  thisWeek: WeekRow;
  lastWeek: WeekRow;
  muscleVolume: Record<string, number>;
  daily: Record<string, number>;
  prs: {
    exerciseId: string;
    name: string;
    bestWeightKg: number;
    bestWeightReps?: number;
    bestE1rm: number;
    date: string;
  }[];
  trackable: { id: string; name: string; sessions: number }[];
  bodyWeight: WeighIn[];
  weeklyTarget: number;
}

export interface ExercisePoint {
  date: string;
  e1rm: number;
  topWeightKg: number;
  volumeKg: number;
  sets: number;
}

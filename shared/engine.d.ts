export interface EngineExercise {
  _id?: string;
  slug: string;
  name: string;
  type: 'strength' | 'cardio';
  category: string;
  equipment: string;
  muscles: string[];
  met: number;
  defaultRestSec: number;
  isBarbell?: boolean;
  barWeightKg?: number;
  isBodyweight?: boolean;
  bodyweightFactor?: number;
  isTimed?: boolean;
  isDistanceBased?: boolean;
}

export interface EngineSet {
  reps: number | null;
  weightKg: number | null;
  durationSec?: number | null;
  rpe?: number | null;
  isWarmup?: boolean;
  done?: boolean;
  restSec?: number | null;
}

export interface EngineCardio {
  durationMin: number | null;
  distanceKm: number | null;
  intensity: 'light' | 'moderate' | 'vigorous' | 'max';
  done?: boolean;
}

export interface EngineEntry {
  exerciseId: string;
  sets: EngineSet[];
  cardio?: EngineCardio | null;
  notes?: string;
}

export interface EngineSession {
  entries: EngineEntry[];
  bodyWeightKg: number;
  startedAt: string | number | Date;
  endedAt?: string | number | Date | null;
  date: string;
}

export interface EngineProfile {
  sex: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  age: number;
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

export interface PersonalRecord {
  exerciseId: string;
  name: string;
  bestWeightKg: number;
  bestWeightReps?: number;
  bestE1rm: number;
  date: string;
}

export declare const CALC_VERSION: number;
export declare const INTENSITY_FACTOR: Record<string, number>;
export declare function metKcal(met: number, weightKg: number, minutes: number): number;
export declare function bmr(p: Partial<EngineProfile>): number;
export declare function ageFromBirthYear(birthYear: number): number;
export declare function estimated1RM(weightKg: number, reps: number): number;
export declare function isWorkingSet(set: EngineSet): boolean;
export declare function effectiveLoadKg(
  ex: EngineExercise | undefined,
  set: EngineSet | undefined,
  bodyWeightKg: number,
): number;
export declare function setVolume(sets: EngineSet[], ex?: EngineExercise, bodyWeightKg?: number): number;
export declare function bestE1rm(sets: EngineSet[], ex?: EngineExercise, bodyWeightKg?: number): number;
export declare function strengthKcal(ex: EngineExercise, sets: EngineSet[], bodyWeightKg: number): number;
export declare function cardioKcal(ex: EngineExercise, cardio: EngineCardio | null | undefined, bodyWeightKg: number): number;
export declare function sessionTotals(session: EngineSession, byId: Map<string, EngineExercise>): Totals;
export declare function netKcal(gross: number, profile: EngineProfile, minutes: number): number;
export declare function platesPerSide(
  totalKg: number,
  barKg?: number,
  units?: 'metric' | 'imperial',
): { plates: number[]; leftover: number } | null;
export declare function personalRecords(sessions: EngineSession[], byId: Map<string, EngineExercise>): PersonalRecord[];
export declare function suggestNextWeight(
  previous: { sets: EngineSet[] } | null | undefined,
  exercise: EngineExercise | undefined,
): { fromKg: number; toKg: number; stepKg: number; sets: number; reps: number } | null;
export declare function weekKey(iso: string): string;
export declare function weekStreak(dates: string[]): number;

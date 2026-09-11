import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/* ------------------------------------------------------------------- user */

const WeighInSchema = new Schema(
  { date: { type: String, required: true }, kg: { type: Number, required: true } },
  { _id: false },
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },

    sex: { type: String, enum: ['male', 'female'], default: 'male' },
    birthYear: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    goal: { type: String, enum: ['strength', 'hypertrophy', 'fat-loss', 'general'], default: 'general' },
    weeklyTarget: { type: Number, default: 4 },

    /** Body weight is a time series — a session keeps the weight it was logged at. */
    weighIns: { type: [WeighInSchema], default: [] },

    /** Exercises the user wants surfaced first, keyed by category. */
    favorites: { type: Map, of: [String], default: {} },

    onboardedAt: { type: Date, default: null },

    /** Password reset: the token is stored hashed, so a DB leak cannot use it. */
    resetTokenHash: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },

    /**
     * Email verification. Not a gate on using the app — it matters for account
     * recovery: an unverified (mistyped) address means a lost account.
     */
    emailVerified: { type: Boolean, default: false },
    verifyTokenHash: { type: String, default: null },
    verifyTokenExpires: { type: Date, default: null },
  },
  { timestamps: true },
);

/** Weight as of a given day, falling back to the closest earlier entry. */
UserSchema.methods.weightOn = function weightOn(iso) {
  const sorted = [...this.weighIns].sort((a, b) => a.date.localeCompare(b.date));
  let match = null;
  for (const w of sorted) if (w.date <= iso) match = w;
  return (match ?? sorted[0])?.kg ?? 0;
};

UserSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id,
    email: this.email,
    emailVerified: this.emailVerified,
    name: this.name,
    sex: this.sex,
    birthYear: this.birthYear,
    heightCm: this.heightCm,
    units: this.units,
    goal: this.goal,
    weeklyTarget: this.weeklyTarget,
    weighIns: this.weighIns,
    favorites: Object.fromEntries(this.favorites ?? []),
    onboardedAt: this.onboardedAt,
    currentWeightKg: this.weighIns.length ? this.weighIns[this.weighIns.length - 1].kg : 0,
  };
};

/* --------------------------------------------------------------- exercise */

const ExerciseSchema = new Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['strength', 'cardio'], required: true },
    category: { type: String, required: true, index: true },
    equipment: { type: String, default: 'Other' },
    /** Full list for display; the split below drives set/volume attribution. */
    muscles: { type: [String], default: [] },
    primaryMuscles: { type: [String], default: [] },
    secondaryMuscles: { type: [String], default: [] },
    /** Where to learn the movement. Generated from the name unless overridden. */
    howToUrl: { type: String, default: '' },
    met: { type: Number, default: 5 },
    defaultRestSec: { type: Number, default: 90 },
    isBarbell: { type: Boolean, default: false },
    barWeightKg: { type: Number, default: 0 },
    /** Lifts your own body: weightKg on a set then means *added* weight. */
    isBodyweight: { type: Boolean, default: false },
    bodyweightFactor: { type: Number, default: 0 },
    /** Held for time rather than counted in reps. */
    isTimed: { type: Boolean, default: false },
    isDistanceBased: { type: Boolean, default: false },
    /** null = shipped catalog, visible to everyone. */
    owner: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ExerciseSchema.index({ owner: 1, slug: 1 }, { unique: true });

/* ---------------------------------------------------------------- routine */

const RoutineExerciseSchema = new Schema(
  {
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    targetSets: { type: Number, default: 3 },
    targetReps: { type: Number, default: 8 },
    targetWeightKg: { type: Number, default: null },
    restSec: { type: Number, default: null },
  },
  { _id: false },
);

const RoutineSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    note: { type: String, default: '' },
    exercises: { type: [RoutineExerciseSchema], default: [] },
    lastPerformedAt: { type: Date, default: null },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

/* ---------------------------------------------------------------- session */

const SetSchema = new Schema(
  {
    reps: { type: Number, default: null },
    weightKg: { type: Number, default: null },
    durationSec: { type: Number, default: null },
    rpe: { type: Number, default: null },
    isWarmup: { type: Boolean, default: false },
    done: { type: Boolean, default: false },
    restSec: { type: Number, default: null },
  },
  { _id: false },
);

const CardioSchema = new Schema(
  {
    durationMin: { type: Number, default: null },
    distanceKm: { type: Number, default: null },
    incline: { type: Number, default: null },
    level: { type: Number, default: null },
    intensity: { type: String, enum: ['light', 'moderate', 'vigorous', 'max'], default: 'moderate' },
    avgHeartRate: { type: Number, default: null },
    done: { type: Boolean, default: false },
  },
  { _id: false },
);

const EntrySchema = new Schema(
  {
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: [SetSchema], default: [] },
    cardio: { type: CardioSchema, default: null },
    notes: { type: String, default: '' },
  },
  { _id: false },
);

const SessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    /** Local calendar day, never derived from UTC on the server. */
    date: { type: String, required: true },
    name: { type: String, default: 'Workout' },
    routine: { type: Schema.Types.ObjectId, ref: 'Routine', default: null },
    status: { type: String, enum: ['active', 'completed'], default: 'active', index: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, default: null },
    /** Snapshot: past sessions never get rewritten when the user's weight changes. */
    bodyWeightKg: { type: Number, required: true },
    entries: { type: [EntrySchema], default: [] },
    notes: { type: String, default: '' },
    totals: { type: Object, default: {} },
    calcVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
);

SessionSchema.index({ user: 1, date: -1 });
SessionSchema.index({ user: 1, status: 1 });
/** Backs the "what did I lift last time?" lookup, run on every workout screen. */
SessionSchema.index({ user: 1, 'entries.exercise': 1, date: -1 });

export const User = model('User', UserSchema);
export const Exercise = model('Exercise', ExerciseSchema);
export const Routine = model('Routine', RoutineSchema);
export const Session = model('Session', SessionSchema);

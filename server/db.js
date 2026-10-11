import mongoose from 'mongoose';
import { CATALOG } from '../shared/catalog.js';
import { Exercise, Routine, Session } from './models.js';
import { sessionTotals } from '../shared/engine.js';

/** Readable connection state for the health endpoint and the /api guard. */
export const dbState = { connected: false, lastError: null, attempts: 0 };

const RETRY_MS = 15000;

let pendingConnect = null;

export async function ensureDbConnected() {
  if (mongoose.connection.readyState >= 1) {
    dbState.connected = true;
    return true;
  }

  if (!process.env.MONGODB_URI) {
    dbState.lastError = 'MONGODB_URI is missing — check Vercel environment variables';
    dbState.connected = false;
    return false;
  }

  if (pendingConnect) {
    await pendingConnect;
    return dbState.connected;
  }

  mongoose.set('strictQuery', true);

  pendingConnect = (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
      dbState.connected = true;
      dbState.lastError = null;
      await seedCatalog();
    } catch (err) {
      dbState.connected = false;
      dbState.lastError = explain(err);
    } finally {
      pendingConnect = null;
    }
  })();

  await pendingConnect;
  return dbState.connected;
}

/**
 * Connects in the background and keeps retrying. The HTTP server starts either
 * way: a dead database should produce one clear 503 per request, not a refused
 * TCP connection that surfaces as an unreadable proxy error in the client.
 */
export function connectDb() {
  if (mongoose.connection.readyState >= 1) {
    dbState.connected = true;
    return;
  }

  if (!process.env.MONGODB_URI) {
    dbState.lastError = 'MONGODB_URI is missing — copy .env.example to .env';
    console.error(`[db] ${dbState.lastError}`);
    return;
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('disconnected', () => {
    if (dbState.connected) console.warn('[db] disconnected');
    dbState.connected = false;
  });

  void attempt();
}

async function attempt() {
  dbState.attempts += 1;
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    dbState.connected = true;
    dbState.lastError = null;
    console.log(`[db] connected to ${mongoose.connection.name}`);
    await seedCatalog();
  } catch (err) {
    dbState.connected = false;
    dbState.lastError = explain(err);
    console.error(`[db] ${dbState.lastError}`);
    console.error(`[db] retrying in ${RETRY_MS / 1000}s (attempt ${dbState.attempts})`);
    setTimeout(() => void attempt(), RETRY_MS).unref?.();
  }
}

/** Turns the driver's wall of text into the one line that says what to do. */
function explain(err) {
  const msg = String(err?.message ?? err);
  if (/IP that isn't whitelisted|whitelist/i.test(msg)) {
    return "Atlas refused this IP. Add your current public IP under Network Access in the Atlas UI (it changes when your ISP reassigns it, and 'temporary access' entries expire after 6 hours).";
  }
  if (/bad auth|Authentication failed/i.test(msg)) {
    return 'Atlas rejected the credentials in MONGODB_URI — check the username and password.';
  }
  if (/ENOTFOUND|querySrv/i.test(msg)) {
    return 'Cannot resolve the cluster hostname in MONGODB_URI — check the connection string, or that this machine is online.';
  }
  return msg.slice(0, 300);
}

const LEGACY_SLUG_MAP = {
  'bench-press': 'barbell-flat-bench-press',
  'smith-bench-press': 'smith-machine-bench-press',
  'chest-press-machine': 'chest-press-machine',
  'incline-chest-press-machine': 'incline-chest-press-machine',
  'incline-db-press': 'dumbbell-incline-bench-press',
  'pec-deck': 'pec-deck-butterfly-machine',
  'cable-fly': 'cable-crossover-flyes',
  'assisted-dip-machine': 'assisted-dip-machine-chest-focus',
  'dips': 'parallel-bar-dip-chest-emphasis',
  'push-ups': 'standard-push-up',
  'deadlift': 'conventional-barbell-deadlift',
  'barbell-row': 'barbell-bent-over-row',
  'lat-pulldown': 'lat-pulldown-machine',
  'seated-row': 'seated-cable-row',
  't-bar-row': 'chest-supported-t-bar-row-machine',
  'pull-ups': 'pull-up-overhand-grip',
  'assisted-pullup-machine': 'assisted-pull-up-machine',
  'reverse-pec-deck': 'reverse-pec-deck-rear-delt-fly',
  'back-extension': 'back-extension-hyperextension-machine',
  'face-pull': 'cable-face-pull',
  'ohp': 'standing-barbell-overhead-press-military-press',
  'smith-ohp': 'smith-machine-overhead-press',
  'shoulder-press-machine': 'seated-shoulder-press-machine',
  'db-shoulder-press': 'seated-dumbbell-shoulder-press',
  'lateral-raise': 'standing-dumbbell-lateral-raise',
  'lateral-raise-machine': 'lateral-raise-machine',
  'cable-lateral-raise': 'cable-lateral-raise',
  'cable-front-raise': 'cable-front-raise',
  'back-squat': 'barbell-back-squat-high-bar',
  'front-squat': 'barbell-front-squat',
  'smith-squat': 'smith-machine-squat',
  'hack-squat': 'hack-squat-machine',
  'leg-press': 'leg-press-45-degree-seated',
  'rdl': 'barbell-romanian-deadlift',
  'leg-extension': 'leg-extension-machine',
  'leg-curl': 'lying-leg-curl-machine',
  'seated-leg-curl': 'seated-leg-curl-machine',
  'walking-lunge': 'dumbbell-walking-lunge',
  'glute-drive': 'glute-drive-machine-hip-thrust',
  'hip-abduction': 'hip-abduction-machine',
  'hip-adduction': 'hip-adduction-machine',
  'calf-raise': 'standing-calf-raise-machine',
  'seated-calf-raise': 'seated-calf-raise-machine',
  'barbell-curl': 'standing-barbell-curl',
  'cable-curl': 'cable-bicep-curl',
  'preacher-curl-machine': 'preacher-curl-machine',
  'hammer-curl': 'dumbbell-hammer-curl',
  'cable-hammer-curl': 'cable-hammer-curl-rope',
  'rope-pushdown': 'cable-triceps-pushdown',
  'triceps-extension-machine': 'triceps-extension-machine',
  'overhead-triceps-cable': 'cable-overhead-triceps-extension',
  'skullcrusher': 'ez-bar-skull-crusher',
  'ab-crunch-machine': 'abdominal-crunch-machine',
  'woodchopper': 'cable-woodchopper-torso-rotation',
  'captains-chair': 'captain-s-chair-leg-raise-tower',
  'decline-crunch': 'decline-ab-bench-crunch',
  'cable-crunch': 'kneeling-cable-crunch',
  'hanging-leg-raise': 'hanging-straight-leg-raise',
  'plank': 'forearm-plank',
  'treadmill': 'treadmill-running-walking',
  'incline-walk': 'incline-treadmill-walking',
  'outdoor-run': 'jogging-self-selected-pace',
  'stair-climber': 'stair-climber-stairmaster',
  'bike': 'stationary-bike-upright',
  'recumbent-bike': 'recumbent-bike',
  'rower': 'rowing-machine-ergometer',
  'elliptical': 'elliptical-trainer',
  'air-bike': 'assault-air-bike',
  'skierg': 'skierg-machine',
  'jacobs-ladder': 'jacobs-ladder-machine',
  'jump-rope': 'jump-rope-moderate-100-120-skips-minute',
};

async function mergeAndPruneOldCatalogExercises() {
  try {
    const validSlugs = new Set(CATALOG.map((e) => e.slug));
    const oldExercises = await Exercise.find({
      owner: null,
      slug: { $nin: Array.from(validSlugs) },
    });

    if (!oldExercises.length) return;

    for (const oldDoc of oldExercises) {
      const targetSlug = LEGACY_SLUG_MAP[oldDoc.slug];
      if (targetSlug) {
        const newDoc = await Exercise.findOne({ owner: null, slug: targetSlug });
        if (newDoc && String(oldDoc._id) !== String(newDoc._id)) {
          await Session.updateMany(
            { 'entries.exercise': oldDoc._id },
            { $set: { 'entries.$[el].exercise': newDoc._id } },
            { arrayFilters: [{ 'el.exercise': oldDoc._id }] },
          );
          await Routine.updateMany(
            { 'exercises.exercise': oldDoc._id },
            { $set: { 'exercises.$[el].exercise': newDoc._id } },
            { arrayFilters: [{ 'el.exercise': oldDoc._id }] },
          );
        }
      }
      await Exercise.deleteOne({ _id: oldDoc._id });
    }
    console.log(`[db] pruned and merged ${oldExercises.length} legacy catalog exercises`);
  } catch (err) {
    console.error('[db] warning during legacy catalog cleanup:', err.message);
  }
}

/** Idempotent: upserts the shipped catalog, leaves user-created exercises alone. */
async function seedCatalog() {
  const ops = CATALOG.map((ex) => ({
    updateOne: {
      filter: { slug: ex.slug, owner: null },
      update: { $set: { ...ex, owner: null, archived: false } },
      upsert: true,
    },
  }));
  const res = await Exercise.bulkWrite(ops, { ordered: false });
  const added = res.upsertedCount ?? 0;
  if (added) console.log(`[db] seeded ${added} catalog exercises`);
  await mergeAndPruneOldCatalogExercises();
  void migrateStaleSessions();
}

async function migrateStaleSessions() {
  try {
    const sessions = await Session.find({ status: 'completed' });
    let updatedCount = 0;
    for (const doc of sessions) {
      let changed = false;
      for (const entry of doc.entries ?? []) {
        for (const set of entry.sets ?? []) {
          if (!set.done && ((set.reps ?? 0) > 0 || (set.durationSec ?? 0) > 0 || (set.weightKg ?? 0) > 0)) {
            set.done = true;
            changed = true;
          }
        }
        if (entry.cardio && !entry.cardio.done && ((entry.cardio.durationMin ?? 0) > 0 || (entry.cardio.distanceKm ?? 0) > 0)) {
          entry.cardio.done = true;
          changed = true;
        }
      }
      if (changed) {
        const docs = await Exercise.find({ _id: { $in: doc.entries.map((e) => e.exercise) } }).lean();
        const byId = new Map(docs.map((d) => [String(d._id), d]));
        doc.totals = sessionTotals(
          {
            entries: doc.entries.map((e) => ({ exerciseId: String(e.exercise), sets: e.sets, cardio: e.cardio })),
            bodyWeightKg: doc.bodyWeightKg,
            startedAt: doc.startedAt,
            endedAt: doc.endedAt,
            date: doc.date,
          },
          byId,
        );
        await doc.save();
        updatedCount += 1;
      }
    }
    if (updatedCount) console.log(`[db] migrated ${updatedCount} historical sessions to mark logged sets as done`);
  } catch (err) {
    console.error('[db] session migration warning:', err.message);
  }
}

import mongoose from 'mongoose';
import { CATALOG } from '../shared/catalog.js';
import { Exercise, Session } from './models.js';
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

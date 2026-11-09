import mongoose from 'mongoose';
import { CATALOG } from '../shared/catalog.js';
import { Exercise, Session } from './models.js';
import { seedAlternatives } from './ai/seed.js';

/** Readable connection state for the health endpoint and the /api guard. */
export const dbState = { connected: false, lastError: null, attempts: 0 };

const RETRY_MS = 15000;

let pendingConnect = null;

export async function ensureDbConnected() {
  if (dbState.connected && mongoose.connection.readyState === 1) return true;

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
      if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
      await initializeDatabase();
      dbState.connected = true;
      dbState.lastError = null;
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
  if (dbState.connected && mongoose.connection.readyState === 1) return;

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
    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    await initializeDatabase();
    dbState.connected = true;
    dbState.lastError = null;
    console.log(`[db] connected to ${mongoose.connection.name}`);
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

// No history rewrites on startup. Catalog changes preserve original IDs and
// archive removed records so history can still resolve them.
export async function initializeDatabase() {
  await Session.init();
  await Session.collection.createIndex({ user: 1 }, {
    unique: true, partialFilterExpression: { status: 'active' }, name: 'one_active_workout_per_user',
  });
  const metadata = mongoose.connection.collection('app_metadata');
  const revision = 'catalog-2026-11-ai-v2';
  if ((await metadata.findOne({ _id: 'catalog' }))?.revision === revision) return;
  const customized = new Set((await Exercise.find({ owner: null, adminModified: true }).select('slug').lean()).map((e) => e.slug));
  const updates = CATALOG.filter((ex) => !customized.has(ex.slug)).map((ex) => ({ updateOne: {
    filter: { slug: ex.slug, owner: null }, update: { $set: { ...ex, owner: null, archived: false } }, upsert: true,
  } }));
  if (updates.length) await Exercise.bulkWrite(updates, { ordered: false });
  await Exercise.updateMany({ owner: null, adminModified: { $ne: true }, slug: { $nin: CATALOG.map((e) => e.slug) } }, { $set: { archived: true } });
  await seedAlternatives();
  await metadata.updateOne({ _id: 'catalog' }, { $set: { revision, updatedAt: new Date() } }, { upsert: true });
}

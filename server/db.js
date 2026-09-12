import mongoose from 'mongoose';
import { CATALOG } from '../shared/catalog.js';
import { Exercise } from './models.js';

/** Readable connection state for the health endpoint and the /api guard. */
export const dbState = { connected: false, lastError: null, attempts: 0 };

const RETRY_MS = 15000;

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
}

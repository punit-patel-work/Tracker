import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDb, dbState } from './db.js';
import { verifyMailer } from './mailer.js';
import authRoutes from './routes/auth.routes.js';
import meRoutes from './routes/me.routes.js';
import exerciseRoutes from './routes/exercises.routes.js';
import routineRoutes from './routes/routines.routes.js';
import sessionRoutes from './routes/sessions.routes.js';
import statsRoutes from './routes/stats.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(compression()); // JSON stat payloads compress ~8x
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: dbState.connected ? 'connected' : 'unavailable', reason: dbState.lastError }),
);

/**
 * Every data route needs the database. Answering with a plain 503 and the real
 * reason beats letting each query hang until the driver times out.
 */
app.use('/api', (_req, res, next) => {
  if (dbState.connected) return next();
  res.status(503).json({ error: dbState.lastError ?? 'Database is starting up — try again in a moment' });
});

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);

// In production the API also serves the built SPA.
const dist = path.join(__dirname, '..', 'dist');
app.use(
  express.static(dist, {
    setHeaders(res, filePath) {
      // Vite fingerprints everything in /assets, so those can be cached hard.
      // index.html and the service worker must always be revalidated.
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }),
);
app.get(/^(?!\/api).*/, (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(dist, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  const status = err.status ?? 500;
  res.status(status).json({ error: status === 500 ? 'Something went wrong on the server' : err.message });
});

const port = Number(process.env.PORT) || 4000;

// Listen first, connect second. A database outage should not take the whole
// server down — it should be one legible error in the UI.
app.listen(port, () => console.log(`[api] listening on http://localhost:${port}`));
connectDb();
void verifyMailer();

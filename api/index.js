import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { connectDb, dbState } from '../server/db.js';
import authRoutes from '../server/routes/auth.routes.js';
import meRoutes from '../server/routes/me.routes.js';
import exerciseRoutes from '../server/routes/exercises.routes.js';
import routineRoutes from '../server/routes/routines.routes.js';
import sessionRoutes from '../server/routes/sessions.routes.js';
import statsRoutes from '../server/routes/stats.routes.js';

const app = express();

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Connect DB (uses cached connection across serverless invocations)
connectDb();

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: dbState.connected ? 'connected' : 'unavailable', reason: dbState.lastError }),
);

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

app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  const status = err.status ?? 500;
  res.status(status).json({ error: status === 500 ? 'Something went wrong on the server' : err.message });
});

export default app;

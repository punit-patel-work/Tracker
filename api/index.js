import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { ensureDbConnected, dbState } from '../server/db.js';
import authRoutes from '../server/routes/auth.routes.js';
import meRoutes from '../server/routes/me.routes.js';
import exerciseRoutes from '../server/routes/exercises.routes.js';
import routineRoutes from '../server/routes/routines.routes.js';
import sessionRoutes from '../server/routes/sessions.routes.js';
import statsRoutes from '../server/routes/stats.routes.js';
import adminRoutes from '../server/routes/admin.routes.js';

const app = express();

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/api', async (_req, res, next) => {
  const ok = await ensureDbConnected();
  if (ok) return next();
  res.status(503).json({ error: dbState.lastError ?? 'Database connection failed' });
});

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  const status = err.status ?? (err.name === 'VersionError' ? 409 : ['ValidationError', 'CastError'].includes(err.name) ? 400 : 500);
  if (err.name === 'VersionError') return res.status(409).json({ error: 'This workout changed on another device. Review the latest version before saving.' });
  res.status(status).json({ error: status === 500 ? 'Something went wrong on the server' : err.message });
});

export default app;

import jwt from 'jsonwebtoken';
import { User } from './models.js';
import { timeZone } from './validation.js';

const COOKIE = 'gt_token';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function issueToken(res, user) {
  const token = jwt.sign({ sub: String(user._id), version: user.sessionVersion ?? 0 }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.cookie(COOKIE, token, {
    httpOnly: true, // not readable from JS, so an XSS bug cannot lift the session
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_MS,
    path: '/',
  });
}

export function clearToken(res) {
  res.clearCookie(COOKIE, { path: '/' });
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE];
    if (!token) return res.status(401).json({ error: 'Not signed in' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Session no longer valid' });
    if (user.suspended) return res.status(403).json({ error: 'This account is suspended. Contact the administrator.' });
    if ((payload.version ?? 0) !== (user.sessionVersion ?? 0)) return res.status(401).json({ error: 'Session expired. Sign in again.' });
    req.user = user;
    req.timeZone = timeZone(req.get('X-Time-Zone') || user.timeZone || 'UTC');
    next();
  } catch (error) {
    if (error.status === 400) return next(error);
    if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError' && error.name !== 'NotBeforeError') return next(error);
    res.status(401).json({ error: 'Session expired, sign in again' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required' });
  next();
}

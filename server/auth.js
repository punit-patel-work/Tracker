import jwt from 'jsonwebtoken';
import { User } from './models.js';

const COOKIE = 'gt_token';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function issueToken(res, userId) {
  const token = jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired, sign in again' });
  }
}

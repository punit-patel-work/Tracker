import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { User, Exercise, Routine } from '../models.js';
import { STARTER_ROUTINES } from '../../shared/catalog.js';
import { clearToken, issueToken, requireAuth } from '../auth.js';
import { clearLimit, ipEmailKey, rateLimit } from '../rateLimit.js';
import { mailReady, sendPasswordReset, sendVerification } from '../mailer.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIFTEEN_MIN = 15 * 60 * 1000;

const loginLimit = rateLimit({ windowMs: FIFTEEN_MIN, max: 10, keyFn: ipEmailKey });
const signupLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });
const forgotLimit = rateLimit({ windowMs: FIFTEEN_MIN, max: 5, keyFn: ipEmailKey });
// /reset carries a token, not an email, so an email-keyed bucket would collapse
// every user onto one counter and throttle them with each other's attempts.
const resetLimit = rateLimit({ windowMs: FIFTEEN_MIN, max: 20 });
const resendLimit = rateLimit({ windowMs: FIFTEEN_MIN, max: 3, keyFn: (req) => `verify|${req.user?.id ?? req.ip}` });

const appUrl = (req) => process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

/**
 * Issues a fresh 24-hour verification token and emails it. Returns the link so
 * the caller can expose it outside production, matching the reset flow.
 */
async function issueVerification(user, req) {
  const token = crypto.randomBytes(32).toString('hex');
  user.verifyTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  user.verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const link = `${appUrl(req)}/?verify=${token}`;
  let sent = false;
  if (mailReady) {
    try {
      await sendVerification(user.email, link, user.name);
      sent = true;
      console.log(`[auth] verification email sent to ${user.email}`);
    } catch (err) {
      console.error(`[auth] verification email failed: ${String(err.message).slice(0, 200)}`);
    }
  }
  if (!sent) console.log(`\n[auth] verify ${user.email}\n[auth] ${link}\n`);
  return { link: process.env.NODE_ENV !== 'production' ? link : null, sent };
}

/** New accounts get the four starter routines so day one is not a blank page. */
async function createStarterRoutines(userId) {
  const slugs = STARTER_ROUTINES.flatMap((r) => r.exercises.map((e) => e.slug));
  const found = await Exercise.find({ owner: null, slug: { $in: slugs } }).select('_id slug').lean();
  const bySlug = new Map(found.map((e) => [e.slug, e._id]));

  const docs = STARTER_ROUTINES.map((r) => ({
    user: userId,
    name: r.name,
    note: r.note,
    exercises: r.exercises
      .filter((e) => bySlug.has(e.slug))
      .map((e) => ({ exercise: bySlug.get(e.slug), targetSets: e.targetSets, targetReps: e.targetReps })),
  }));
  await Routine.insertMany(docs);
}

router.post('/signup', signupLimit, async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
  if (!EMAIL_RE.test(email ?? '')) return res.status(400).json({ error: 'Enter a valid email address' });
  if ((password ?? '').length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) return res.status(409).json({ error: 'An account with that email already exists' });

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: await bcrypt.hash(password, 12),
  });

  await createStarterRoutines(user._id);
  const verify = await issueVerification(user, req);
  issueToken(res, user._id);
  // Signing in immediately: verification protects account *recovery*, not access.
  // Blocking someone from logging their workout until they check email is hostile.
  res.status(201).json({ user: user.toPublic(), verifyLink: verify.link });
});

/* --------------------------------------------------- email verification */

router.post('/verify', resetLimit, async (req, res) => {
  const token = String(req.body?.token ?? '');
  if (!token) return res.status(400).json({ error: 'Verification link is missing its token' });

  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ verifyTokenHash: hash, verifyTokenExpires: { $gt: new Date() } });
  if (!user) {
    return res.status(400).json({ error: 'That confirmation link is invalid or has expired. Send yourself a new one.' });
  }

  user.emailVerified = true;
  user.verifyTokenHash = null;
  user.verifyTokenExpires = null;
  await user.save();

  // Deliberately does NOT sign you in. Controlling the inbox proves ownership
  // of the address, not knowledge of the password.
  res.json({ ok: true, email: user.email });
});

router.post('/resend-verification', requireAuth, resendLimit, async (req, res) => {
  if (req.user.emailVerified) return res.json({ ok: true, alreadyVerified: true });
  const verify = await issueVerification(req.user, req);
  res.json({ ok: true, sent: verify.sent, verifyLink: verify.link });
});

router.post('/login', loginLimit, async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = await User.findOne({ email: (email ?? '').toLowerCase().trim() });
  // Same message either way — never reveal which half was wrong.
  const ok = user && (await bcrypt.compare(password ?? '', user.passwordHash));
  if (!ok) return res.status(401).json({ error: 'Email or password is incorrect' });

  clearLimit(ipEmailKey(req));
  issueToken(res, user._id);
  res.json({ user: user.toPublic() });
});

/* ------------------------------------------------------- password reset */

/**
 * Always answers 200, whether or not the address exists — a different response
 * would turn this into an account-enumeration oracle.
 *
 * The link is emailed when SMTP is configured. Without it, the link is logged
 * server-side and returned in the response outside production so the flow is
 * still usable.
 */
router.post('/forgot', forgotLimit, async (req, res) => {
  const email = String(req.body?.email ?? '').toLowerCase().trim();
  const user = await User.findOne({ email });

  let devLink = null;
  let sent = false;

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const base = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const link = `${base}/?reset=${token}`;

    if (mailReady) {
      try {
        await sendPasswordReset(user.email, link, user.name);
        sent = true;
        console.log(`[auth] reset email sent to ${email}`);
      } catch (err) {
        // Never fail the request on a mail error — fall back to the log.
        console.error(`[auth] reset email failed: ${String(err.message).slice(0, 200)}`);
      }
    }
    if (!sent) console.log(`\n[auth] password reset for ${email}\n[auth] ${link}\n`);

    // Outside production the link comes back in the response too, so the flow
    // is testable and usable without waiting on an inbox. Never in production.
    if (process.env.NODE_ENV !== 'production') devLink = link;
  }

  res.json({ ok: true, devLink, emailed: sent });
});

router.post('/reset', resetLimit, async (req, res) => {
  const { token, password } = req.body ?? {};
  if ((password ?? '').length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (!token) return res.status(400).json({ error: 'Reset link is missing its token' });

  const hash = crypto.createHash('sha256').update(String(token)).digest('hex');
  const user = await User.findOne({ resetTokenHash: hash, resetTokenExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ error: 'That reset link is invalid or has expired. Request a new one.' });

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetTokenHash = null;
  user.resetTokenExpires = null;
  await user.save();

  // Sign them straight in — bouncing back to a login form here is pointless.
  issueToken(res, user._id);
  res.json({ user: user.toPublic() });
});

router.post('/logout', (_req, res) => {
  clearToken(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user.toPublic() });
});

export default router;

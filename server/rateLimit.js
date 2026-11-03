/**
 * In-memory rate limiter for the credential endpoints. No dependency and no
 * shared store — good enough for a single-process personal server. Behind
 * multiple instances this would need Redis.
 */

const buckets = new Map();

/** Drop expired buckets occasionally so the map cannot grow without bound. */
function sweep(now) {
  if (buckets.size < 500) return;
  for (const [key, b] of buckets) if (b.resetAt < now) buckets.delete(key);
}

export function rateLimit({ windowMs, max, keyFn }) {
  return (req, res, next) => {
    const now = Date.now();
    sweep(now);

    const key = keyFn ? keyFn(req) : req.ip;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    bucket.count += 1;
    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} minute${retryAfter > 60 ? 's' : ''}.`,
      });
    }
    next();
  };
}

/** A successful sign-in should not leave the account throttled. */
export function clearLimit(key) {
  buckets.delete(key);
}

/** Keyed by IP *and* email so one attacker cannot lock out a real user. */
export function ipEmailKey(req) {
  return `${req.ip}|${String(req.body?.email ?? '').toLowerCase().trim()}`;
}

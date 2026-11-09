import { todayFor } from './validation.js';
import { Session } from './models.js';

const cache = new Map();
const MAX_ENTRIES = 100;
// The database signature detects edits/deletions across processes. Cached results
// are never reused solely because this particular API instance saw no writes.
export async function cacheOverview(req, res, next) {
  const query = { user: req.user._id, status: 'completed' };
  const [latest, count] = await Promise.all([
    Session.findOne(query).sort({ updatedAt: -1, _id: -1 }).select('_id updatedAt __v').lean(),
    Session.countDocuments(query),
  ]);
  const key = JSON.stringify([String(req.user._id), req.user.updatedAt, req.timeZone,
    todayFor(req.timeZone), String(req.query.weeks ?? 12), count, latest]);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return res.json(hit.data);
  const send = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode === 200) {
      if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value);
      cache.set(key, { data, expires: Date.now() + 60000 });
    }
    return send(data);
  };
  next();
}

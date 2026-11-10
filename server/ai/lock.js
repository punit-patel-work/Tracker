import { randomUUID } from 'node:crypto';
import { AiLock } from './models.js';

export async function acquireAiLock(userId) {
  const lock = { _id:String(userId), owner:randomUUID() };
  try {
    await AiLock.findOneAndUpdate({ _id:lock._id, expiresAt:{ $lt:new Date() } },
      { $set:{ expiresAt:new Date(Date.now()+150000), owner:lock.owner } }, { upsert:true });
    return lock;
  } catch (err) {
    if (err.code !== 11000) throw err;
    throw Object.assign(new Error('Another AI or account operation is finishing. Try again shortly.'), { status:409,code:'busy' });
  }
}
export const releaseAiLock = lock => AiLock.deleteOne(lock);

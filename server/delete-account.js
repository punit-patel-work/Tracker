import { User, WeekPlan, Session, Routine, Exercise } from './models.js';
import { acquireAiLock, releaseAiLock } from './ai/lock.js';
import { AiDraft, AiPreferences, AiUsage, AiAlternative } from './ai/models.js';

export async function deleteAccount(user) {
  const lock = await acquireAiLock(user._id);
  try {
    await removeUserRecords(user);
  } finally {
    await releaseAiLock(lock);
  }
}

async function removeUserRecords(user) {
  const filter = { user: user._id };
  const locked = await User.updateOne({ _id: user._id, __v: user.__v, isOwner: { $ne: true } },
    { $set: { suspended: true }, $inc: { sessionVersion: 1, __v: 1 } });
  if (!locked.modifiedCount) throw Object.assign(new Error('Account changed. Refresh before deleting.'), { status: 409 });
  const custom = await Exercise.distinct('_id', { owner: user._id });
  await Promise.all([
    WeekPlan.deleteMany(filter), AiDraft.deleteMany(filter), AiPreferences.deleteMany(filter),
    AiUsage.deleteMany(filter),
    Session.deleteMany(filter), Routine.deleteMany(filter), AiAlternative.deleteMany({ source: { $in: custom } }),
    Exercise.deleteMany({ owner: user._id }),
  ]);
  await User.deleteOne({ _id: user._id });
}

/** Read-only preflight: report duplicate active sessions without changing data. */
import 'dotenv/config';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI before running this check');
const connection = await mongoose.createConnection(process.env.MONGODB_URI, {
  autoIndex: false, serverSelectionTimeoutMS: 15000,
}).asPromise();
try {
  const duplicates = await connection.collection('sessions').aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$user', sessions: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();
  console.log(JSON.stringify({ duplicateAccounts: duplicates.length, duplicates }, null, 2));
  if (duplicates.length) {
    console.error('Back up and review these sessions before enabling the unique active-workout index. No records were changed.');
    process.exitCode = 1;
  }
} finally { await connection.close(); }

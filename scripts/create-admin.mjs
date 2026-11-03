/** Explicit, one-time account provisioning. Never called on app startup. */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, AdminAudit } from '../server/models.js';

const username = (process.env.ADMIN_USERNAME ?? '').trim().toLowerCase();
const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!/^[a-z0-9_]{3,40}$/.test(username) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Set ADMIN_USERNAME and ADMIN_EMAIL');
if (!password || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) throw new Error('Set ADMIN_PASSWORD (8+ characters, at most 72 UTF-8 bytes)');
if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI');
try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await User.init();
  const claimed = await User.findOne({ username });
  if (claimed && claimed.email !== email) throw new Error('Username belongs to another email; no account was changed');
  let user = await User.findOne({ email });
  const existing = !!user;
  if (!user) user = new User({ email, name: 'Punit Patel', timeZone: 'America/Toronto' });
  if (!existing || !await bcrypt.compare(password, user.passwordHash) || user.role !== 'admin') {
    user.passwordHash = await bcrypt.hash(password, 12);
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
  }
  user.username = username; user.role = 'admin'; user.isOwner = true; user.suspended = false;
  await user.save();
  await AdminAudit.create({ actor: user._id, actorName: user.name, action: 'admin.provision', target: String(user._id), summary: existing ? 'Granted owner access to existing account; training data preserved' : 'Created owner administrator account' });
  console.log(JSON.stringify({ ok: true, username: user.username, email: user.email, role: user.role, existingAccountPreserved: existing }));
} catch (error) {
  console.error('Admin provisioning failed:', error.code === 11000 ? 'Email or username already exists' : error.name === 'MongooseServerSelectionError' ? 'Database unavailable; check network access and configuration' : error.message);
  process.exitCode = 1;
} finally { delete process.env.ADMIN_PASSWORD; await mongoose.disconnect(); }

import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const AiPreferences = model('AiPreferences', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  preferences: { type: Object, required: true },
}, { timestamps: true }));
export const AiDraft = model('AiDraft', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true }, task: { type: String, required: true },
  result: Object, context: Object, savedDays: { type: [Number], default: [] }, model: String, usage: Object, costUsd: { type: Number, default: 0 },
}, { timestamps: true }).index({ user: 1, key: 1 }, { unique: true }).index({ user: 1, createdAt: -1 }));
export const AiUsage = model('AiUsage', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, task: String, model: String,
  status: String, usage: Object, costUsd: { type: Number, default: 0 }, errorCode: String, durationMs: Number,
}, { timestamps: true }).index({ createdAt: -1 }));
export const AiBudget = model('AiBudget', new Schema({
  _id: String, usedUsd: { type: Number, default: 0 },
  reservedUsd: { type: Number, default: 0 }, requests: { type: Number, default: 0 },
}));
export const AiSettings = model('AiSettings', new Schema({
  _id: String, enabled: { type: Boolean, default: true }, monthlyBudgetUsd: { type: Number, default: 5 },
}, { timestamps: true }));
export const AiLock = model('AiLock', new Schema({ _id: String, expiresAt: Date, owner: String }));
export const AiAlternative = model('AiAlternative', new Schema({
  source: { type: Schema.Types.ObjectId, ref: 'Exercise', unique: true, required: true },
  fingerprint: String, candidates: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
  group: String, curated: { type: Boolean, default: false },
}, { timestamps: true }));

import { Router } from 'express';
import { Routine } from '../models.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const list = await Routine.find({ user: req.user._id, archived: false }).sort({ createdAt: 1 }).lean();
  res.json({ routines: list.map(serialize) });
});

router.post('/', async (req, res) => {
  const { name, note, exercises } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Give the routine a name' });
  const doc = await Routine.create({
    user: req.user._id,
    name: name.trim(),
    note: note ?? '',
    exercises: normalize(exercises),
  });
  res.status(201).json({ routine: serialize(doc.toObject()) });
});

router.patch('/:id', async (req, res) => {
  const doc = await Routine.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ error: 'Routine not found' });
  if (req.body.name !== undefined) doc.name = req.body.name;
  if (req.body.note !== undefined) doc.note = req.body.note;
  if (req.body.exercises !== undefined) doc.exercises = normalize(req.body.exercises);
  await doc.save();
  res.json({ routine: serialize(doc.toObject()) });
});

router.delete('/:id', async (req, res) => {
  const doc = await Routine.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { archived: true },
    { new: true },
  );
  if (!doc) return res.status(404).json({ error: 'Routine not found' });
  res.json({ ok: true });
});

function normalize(list) {
  return (list ?? [])
    .filter((e) => e.exerciseId)
    .map((e) => ({
      exercise: e.exerciseId,
      targetSets: Number(e.targetSets) || 3,
      targetReps: Number(e.targetReps) || 8,
      targetWeightKg: e.targetWeightKg ?? null,
      restSec: e.restSec ?? null,
    }));
}

function serialize(r) {
  return {
    id: String(r._id),
    name: r.name,
    note: r.note,
    lastPerformedAt: r.lastPerformedAt,
    exercises: (r.exercises ?? []).map((e) => ({
      exerciseId: String(e.exercise),
      targetSets: e.targetSets,
      targetReps: e.targetReps,
      targetWeightKg: e.targetWeightKg,
      restSec: e.restSec,
    })),
  };
}

export default router;

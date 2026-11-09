import { Router } from 'express';
import { Routine } from '../models.js';
import { routineInput, accessibleExercises, text, id } from '../validation.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const list = await Routine.find({ user: req.user._id, archived: false }).sort({ createdAt: 1 }).lean();
  res.json({ routines: list.map(serialize) });
});

router.post('/', async (req, res) => {
  const { name, note, exercises } = req.body ?? {};
  text(name, 'Routine name'); text(note ?? '', 'Routine notes', 2000, false);
  const validated = routineInput(exercises);
  await accessibleExercises(validated.map((e) => e.exercise), req.user._id);
  if (!name?.trim()) return res.status(400).json({ error: 'Give the routine a name' });
  const doc = await Routine.create({
    user: req.user._id,
    name: name.trim(),
    note: note ?? '',
    exercises: validated,
  });
  res.status(201).json({ routine: serialize(doc.toObject()) });
});

router.patch('/:id', async (req, res) => {
  id(req.params.id);
  const doc = await Routine.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ error: 'Routine not found' });
  if (req.body.revision !== undefined && req.body.revision !== doc.__v) return res.status(409).json({ error: 'This routine changed. Reopen the editor to see the current targets.' });
  if (req.body.name !== undefined) doc.name = text(req.body.name, 'Routine name');
  if (req.body.note !== undefined) doc.note = text(req.body.note, 'Routine notes', 2000, false);
  if (req.body.exercises !== undefined) doc.exercises = routineInput(req.body.exercises);
  await accessibleExercises(doc.exercises.map((e) => String(e.exercise)), req.user._id);
  await doc.save();
  res.json({ routine: serialize(doc.toObject()) });
});

router.delete('/:id', async (req, res) => {
  const doc = await Routine.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: { archived: true }, $inc: { __v: 1 } },
    { returnDocument: 'after' },
  );
  if (!doc) return res.status(404).json({ error: 'Routine not found' });
  res.json({ ok: true });
});

function serialize(r) {
  return {
    id: String(r._id),
    revision: r.__v ?? 0,
    name: r.name,
    note: r.note,
    lastPerformedAt: r.lastPerformedAt,
    exercises: (r.exercises ?? []).map((e) => ({
      exerciseId: String(e.exercise),
      targetSets: e.targetSets,
      targetReps: e.targetReps,
      repCeiling: e.repCeiling ?? null,
      incrementKg: e.incrementKg ?? null,
      targetWeightKg: e.targetWeightKg,
      restSec: e.restSec,
      targetDurationSec: e.targetDurationSec,
      targetCardioMin: e.targetCardioMin,
    })),
  };
}

export default router;

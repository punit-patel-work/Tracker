import { Router } from 'express';
import { Exercise } from '../models.js';
import { requireAuth } from '../auth.js';
import { howToUrlFor } from '../../shared/catalog.js';

const router = Router();
router.use(requireAuth);

/** Shipped catalog plus this user's own, never anyone else's. */
router.get('/', async (req, res) => {
  const list = await Exercise.find({
    archived: false,
    $or: [{ owner: null }, { owner: req.user._id }],
  })
    .sort({ name: 1 })
    .lean();
  res.json({ exercises: list.map(serialize) });
});

router.post('/', async (req, res) => {
  const { name, category, type, equipment, muscles, met, defaultRestSec, isBarbell, isDistanceBased } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Exercise name is required' });
  if (!category) return res.status(400).json({ error: 'Pick a category' });

  const list = (muscles ?? []).filter(Boolean);
  const slug = `${slugify(name)}-${Date.now().toString(36)}`;
  const doc = await Exercise.create({
    slug,
    name: name.trim(),
    type: type === 'cardio' ? 'cardio' : 'strength',
    category,
    equipment: equipment?.trim() || 'Other',
    muscles: list,
    // First one entered is treated as primary; the rest as secondary.
    primaryMuscles: list.slice(0, 1),
    secondaryMuscles: list.slice(1),
    howToUrl: howToUrlFor(name.trim()),
    met: Number(met) || (type === 'cardio' ? 7 : 5),
    defaultRestSec: Number(defaultRestSec) || 90,
    isBarbell: !!isBarbell,
    barWeightKg: isBarbell ? 20 : 0,
    isDistanceBased: !!isDistanceBased,
    owner: req.user._id,
  });
  res.status(201).json({ exercise: serialize(doc.toObject()) });
});

router.patch('/:id', async (req, res) => {
  // Only user-created exercises are editable; the shared catalog is read-only.
  const doc = await Exercise.findOne({ _id: req.params.id, owner: req.user._id });
  if (!doc) return res.status(404).json({ error: 'Custom exercise not found' });
  for (const k of ['name', 'category', 'equipment', 'muscles', 'met', 'defaultRestSec', 'archived']) {
    if (req.body[k] !== undefined) doc[k] = req.body[k];
  }
  await doc.save();
  res.json({ exercise: serialize(doc.toObject()) });
});

function serialize(e) {
  return {
    id: String(e._id),
    slug: e.slug,
    name: e.name,
    type: e.type,
    category: e.category,
    equipment: e.equipment,
    muscles: e.muscles,
    primaryMuscles: e.primaryMuscles ?? [],
    secondaryMuscles: e.secondaryMuscles ?? [],
    howToUrl: e.howToUrl || howToUrlFor(e.name),
    met: e.met,
    defaultRestSec: e.defaultRestSec,
    isBarbell: e.isBarbell,
    barWeightKg: e.barWeightKg,
    isBodyweight: e.isBodyweight,
    bodyweightFactor: e.bodyweightFactor,
    isTimed: e.isTimed,
    isDistanceBased: e.isDistanceBased,
    isCustom: !!e.owner,
  };
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'exercise';
}

export default router;

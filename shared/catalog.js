/**
 * Master Exercise Catalog — 530 Exercises & MET Activity Entries.
 * Updated 2026 with 2024 Adult Compendium of Physical Activities METs.
 */

export const CATEGORIES = [
  {
    "id": "chest",
    "name": "Chest"
  },
  {
    "id": "back",
    "name": "Back"
  },
  {
    "id": "shoulders",
    "name": "Shoulders"
  },
  {
    "id": "legs",
    "name": "Legs"
  },
  {
    "id": "arms",
    "name": "Arms"
  },
  {
    "id": "core",
    "name": "Core"
  },
  {
    "id": "cardio",
    "name": "Cardio"
  },
  {
    "id": "full-body",
    "name": "Full Body & Power"
  },
  {
    "id": "mobility",
    "name": "Warm-Up & Mobility"
  },
  {
    "id": "stretching",
    "name": "Stretching"
  },
  {
    "id": "classes",
    "name": "Pool, Classes & Courts"
  }
];

export function howToUrlFor(name) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`how to ${name} proper form technique`)}`;
}

export const CATALOG = [
  {
    "id": "EX-101",
    "slug": "chest-press-machine",
    "name": "Chest Press Machine",
    "type": "strength",
    "category": "chest",
    "equipment": "Machine (Selectorized or Plate-Loaded)",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Pectoralis Major",
      "Anterior Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Chest%20Press%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-102",
    "slug": "pec-deck-butterfly-machine",
    "name": "Pec Deck / Butterfly Machine",
    "type": "strength",
    "category": "chest",
    "equipment": "Machine",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Pec%20Deck%20%2F%20Butterfly%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-103",
    "slug": "cable-crossover-flyes",
    "name": "Cable Crossover / Flyes",
    "type": "strength",
    "category": "chest",
    "equipment": "Cable",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Crossover%20%2F%20Flyes%20proper%20form%20technique"
  },
  {
    "id": "EX-104",
    "slug": "incline-chest-press-machine",
    "name": "Incline Chest Press Machine",
    "type": "strength",
    "category": "chest",
    "equipment": "Machine",
    "primaryMuscles": [
      "Upper Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Upper Pectoralis Major",
      "Anterior Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Incline%20Chest%20Press%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-105",
    "slug": "assisted-dip-machine-chest-focus",
    "name": "Assisted Dip Machine (Chest Focus)",
    "type": "strength",
    "category": "chest",
    "equipment": "Machine",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Assisted%20Dip%20Machine%20(Chest%20Focus)%20proper%20form%20technique"
  },
  {
    "id": "EX-106",
    "slug": "smith-machine-bench-press",
    "name": "Smith Machine Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Smith Machine / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Pectoralis Major",
      "Anterior Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-107",
    "slug": "plate-loaded-chest-press",
    "name": "Plate-Loaded Chest Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Plate-Loaded%20Chest%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-108",
    "slug": "single-arm-machine-chest-press",
    "name": "Single-Arm Machine Chest Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Machine%20Chest%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-109",
    "slug": "decline-chest-press-machine",
    "name": "Decline Chest Press Machine",
    "type": "strength",
    "category": "chest",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Decline%20Chest%20Press%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-110",
    "slug": "barbell-flat-bench-press",
    "name": "Barbell Flat Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Barbell / Bench / Rack",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Flat%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-111",
    "slug": "barbell-incline-bench-press",
    "name": "Barbell Incline Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Barbell / Bench / Rack",
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Emphasis)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Pectoralis Major (Clavicular Emphasis)",
      "Anterior Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Incline%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-112",
    "slug": "barbell-decline-bench-press",
    "name": "Barbell Decline Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Barbell / Bench / Rack",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Decline%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-113",
    "slug": "paused-barbell-bench-press",
    "name": "Paused Barbell Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Barbell / Bench / Rack",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Paused%20Barbell%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-114",
    "slug": "barbell-floor-press",
    "name": "Barbell Floor Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Barbell / Rack / Floor",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Floor%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-115",
    "slug": "dumbbell-flat-bench-press",
    "name": "Dumbbell Flat Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Flat%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-116",
    "slug": "dumbbell-incline-bench-press",
    "name": "Dumbbell Incline Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Emphasis)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Pectoralis Major (Clavicular Emphasis)",
      "Anterior Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Incline%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-117",
    "slug": "dumbbell-decline-bench-press",
    "name": "Dumbbell Decline Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Decline%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-118",
    "slug": "dumbbell-neutral-grip-bench-press",
    "name": "Dumbbell Neutral-Grip Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Neutral-Grip%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-119",
    "slug": "single-arm-dumbbell-bench-press",
    "name": "Single-Arm Dumbbell Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Obliques"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Dumbbell%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-120",
    "slug": "dumbbell-squeeze-press-crush-press",
    "name": "Dumbbell Squeeze Press / Crush Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Squeeze%20Press%20%2F%20Crush%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-121",
    "slug": "dumbbell-floor-press",
    "name": "Dumbbell Floor Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Floor",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Floor%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-122",
    "slug": "dumbbell-flat-fly",
    "name": "Dumbbell Flat Fly",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Biceps (Stabilization)"
    ],
    "muscles": [
      "Pectoralis Major",
      "Anterior Deltoids",
      "Biceps (Stabilization)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Flat%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-123",
    "slug": "dumbbell-incline-fly",
    "name": "Dumbbell Incline Fly",
    "type": "strength",
    "category": "chest",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Emphasis)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Biceps (Stabilization)"
    ],
    "muscles": [
      "Pectoralis Major (Clavicular Emphasis)",
      "Anterior Deltoids",
      "Biceps (Stabilization)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Incline%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-124",
    "slug": "smith-machine-incline-bench-press",
    "name": "Smith Machine Incline Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Smith Machine / Bench",
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Emphasis)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Pectoralis Major (Clavicular Emphasis)",
      "Anterior Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Incline%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-125",
    "slug": "smith-machine-decline-bench-press",
    "name": "Smith Machine Decline Bench Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Smith Machine / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Decline%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-126",
    "slug": "standing-cable-chest-press",
    "name": "Standing Cable Chest Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Cable%20Chest%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-127",
    "slug": "single-arm-cable-chest-press",
    "name": "Single-Arm Cable Chest Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Obliques"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Cable%20Chest%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-128",
    "slug": "cable-low-to-high-fly",
    "name": "Cable Low-to-High Fly",
    "type": "strength",
    "category": "chest",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Emphasis)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major (Clavicular Emphasis)",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Low-to-High%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-129",
    "slug": "cable-high-to-low-fly",
    "name": "Cable High-to-Low Fly",
    "type": "strength",
    "category": "chest",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Pectoralis Major (Sternocostal Emphasis)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major (Sternocostal Emphasis)",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20High-to-Low%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-130",
    "slug": "flat-bench-cable-fly",
    "name": "Flat Bench Cable Fly",
    "type": "strength",
    "category": "chest",
    "equipment": "Cable / Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Flat%20Bench%20Cable%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-131",
    "slug": "incline-bench-cable-fly",
    "name": "Incline Bench Cable Fly",
    "type": "strength",
    "category": "chest",
    "equipment": "Cable / Incline Bench",
    "primaryMuscles": [
      "Pectoralis Major (Clavicular Emphasis)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major (Clavicular Emphasis)",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Incline%20Bench%20Cable%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-132",
    "slug": "standard-push-up",
    "name": "Standard Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Floor",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standard%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-133",
    "slug": "incline-push-up",
    "name": "Incline Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Stable Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Incline%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-134",
    "slug": "decline-push-up",
    "name": "Decline Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Stable Bench",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Decline%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-135",
    "slug": "kneeling-push-up",
    "name": "Kneeling Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Floor",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kneeling%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-136",
    "slug": "wide-hand-push-up",
    "name": "Wide-Hand Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Floor",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wide-Hand%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-137",
    "slug": "push-up-on-handles",
    "name": "Push-Up on Handles",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Push-Up Handles",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Push-Up%20on%20Handles%20proper%20form%20technique"
  },
  {
    "id": "EX-138",
    "slug": "weighted-push-up",
    "name": "Weighted Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Weighted Vest",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Weighted%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-139",
    "slug": "resistance-band-push-up",
    "name": "Resistance-Band Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Resistance Band",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-140",
    "slug": "suspension-chest-press-trx-push-up",
    "name": "Suspension Chest Press / TRX Push-Up",
    "type": "strength",
    "category": "chest",
    "equipment": "Suspension Trainer",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suspension%20Chest%20Press%20%2F%20TRX%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-141",
    "slug": "parallel-bar-dip-chest-emphasis",
    "name": "Parallel-Bar Dip (Chest Emphasis)",
    "type": "strength",
    "category": "chest",
    "equipment": "Bodyweight / Dip Bars",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Parallel-Bar%20Dip%20(Chest%20Emphasis)%20proper%20form%20technique"
  },
  {
    "id": "EX-142",
    "slug": "resistance-band-chest-press",
    "name": "Resistance-Band Chest Press",
    "type": "strength",
    "category": "chest",
    "equipment": "Resistance Band / Secure Anchor",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Chest%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-143",
    "slug": "resistance-band-chest-fly",
    "name": "Resistance-Band Chest Fly",
    "type": "strength",
    "category": "chest",
    "equipment": "Resistance Band / Secure Anchor",
    "primaryMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Chest%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-201",
    "slug": "lat-pulldown-machine",
    "name": "Lat Pulldown Machine",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Machine",
    "primaryMuscles": [
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Biceps",
      "Rhomboids",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Lat%20Pulldown%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-202",
    "slug": "seated-cable-row",
    "name": "Seated Cable Row",
    "type": "strength",
    "category": "back",
    "equipment": "Cable",
    "primaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Latissimus Dorsi",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Cable%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-203",
    "slug": "chest-supported-t-bar-row-machine",
    "name": "Chest-Supported T-Bar Row Machine",
    "type": "strength",
    "category": "back",
    "equipment": "Machine",
    "primaryMuscles": [
      "Rhomboids",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Rhomboids",
      "Latissimus Dorsi",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Chest-Supported%20T-Bar%20Row%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-204",
    "slug": "assisted-pull-up-machine",
    "name": "Assisted Pull-Up Machine",
    "type": "strength",
    "category": "back",
    "equipment": "Machine",
    "primaryMuscles": [
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Core",
      "Upper Back"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Biceps",
      "Core",
      "Upper Back"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Assisted%20Pull-Up%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-205",
    "slug": "reverse-pec-deck-rear-delt-fly",
    "name": "Reverse Pec Deck (Rear Delt Fly)",
    "type": "strength",
    "category": "back",
    "equipment": "Machine",
    "primaryMuscles": [
      "Posterior Deltoids"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "muscles": [
      "Posterior Deltoids",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Reverse%20Pec%20Deck%20(Rear%20Delt%20Fly)%20proper%20form%20technique"
  },
  {
    "id": "EX-206",
    "slug": "back-extension-hyperextension-machine",
    "name": "Back Extension / Hyperextension Machine",
    "type": "strength",
    "category": "back",
    "equipment": "Machine",
    "primaryMuscles": [
      "Erector Spinae"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings (depending on machine design)"
    ],
    "muscles": [
      "Erector Spinae",
      "Glutes",
      "Hamstrings (depending on machine design)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Back%20Extension%20%2F%20Hyperextension%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-207",
    "slug": "cable-face-pull",
    "name": "Cable Face Pull",
    "type": "strength",
    "category": "back",
    "equipment": "Cable",
    "primaryMuscles": [
      "Rear Deltoids",
      "External Rotators"
    ],
    "secondaryMuscles": [
      "Middle and Lower Trapezius",
      "Rhomboids"
    ],
    "muscles": [
      "Rear Deltoids",
      "External Rotators",
      "Middle and Lower Trapezius",
      "Rhomboids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Face%20Pull%20proper%20form%20technique"
  },
  {
    "id": "EX-208",
    "slug": "wide-grip-lat-pulldown",
    "name": "Wide-Grip Lat Pulldown",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Lat Pulldown Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wide-Grip%20Lat%20Pulldown%20proper%20form%20technique"
  },
  {
    "id": "EX-209",
    "slug": "neutral-grip-lat-pulldown",
    "name": "Neutral-Grip Lat Pulldown",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Lat Pulldown Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Neutral-Grip%20Lat%20Pulldown%20proper%20form%20technique"
  },
  {
    "id": "EX-210",
    "slug": "underhand-lat-pulldown",
    "name": "Underhand Lat Pulldown",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Lat Pulldown Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Underhand%20Lat%20Pulldown%20proper%20form%20technique"
  },
  {
    "id": "EX-211",
    "slug": "single-arm-cable-lat-pulldown",
    "name": "Single-Arm Cable Lat Pulldown",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Lat Pulldown Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Cable%20Lat%20Pulldown%20proper%20form%20technique"
  },
  {
    "id": "EX-212",
    "slug": "half-kneeling-cable-lat-pulldown",
    "name": "Half-Kneeling Cable Lat Pulldown",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Lat Pulldown Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Half-Kneeling%20Cable%20Lat%20Pulldown%20proper%20form%20technique"
  },
  {
    "id": "EX-213",
    "slug": "straight-arm-cable-pulldown",
    "name": "Straight-Arm Cable Pulldown",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Lat Pulldown Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Triceps (Long Head)",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Triceps (Long Head)",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Straight-Arm%20Cable%20Pulldown%20proper%20form%20technique"
  },
  {
    "id": "EX-214",
    "slug": "kneeling-cable-pullover",
    "name": "Kneeling Cable Pullover",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Lat Pulldown Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Triceps (Long Head)",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Triceps (Long Head)",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kneeling%20Cable%20Pullover%20proper%20form%20technique"
  },
  {
    "id": "EX-215",
    "slug": "plate-loaded-high-row",
    "name": "Plate-Loaded High Row",
    "type": "strength",
    "category": "back",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Plate-Loaded%20High%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-216",
    "slug": "plate-loaded-low-row",
    "name": "Plate-Loaded Low Row",
    "type": "strength",
    "category": "back",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Plate-Loaded%20Low%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-217",
    "slug": "iso-lateral-seated-row-machine",
    "name": "Iso-Lateral Seated Row Machine",
    "type": "strength",
    "category": "back",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Iso-Lateral%20Seated%20Row%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-218",
    "slug": "chest-supported-row-machine",
    "name": "Chest-Supported Row Machine",
    "type": "strength",
    "category": "back",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Chest-Supported%20Row%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-219",
    "slug": "machine-pullover",
    "name": "Machine Pullover",
    "type": "strength",
    "category": "back",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Triceps (Long Head)"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Pectoralis Major",
      "Triceps (Long Head)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Machine%20Pullover%20proper%20form%20technique"
  },
  {
    "id": "EX-220",
    "slug": "wide-grip-seated-cable-row",
    "name": "Wide-Grip Seated Cable Row",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Row Station",
    "primaryMuscles": [
      "Middle Trapezius",
      "Rhomboids",
      "Rear Deltoids"
    ],
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Biceps"
    ],
    "muscles": [
      "Middle Trapezius",
      "Rhomboids",
      "Rear Deltoids",
      "Latissimus Dorsi",
      "Biceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wide-Grip%20Seated%20Cable%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-221",
    "slug": "single-arm-seated-cable-row",
    "name": "Single-Arm Seated Cable Row",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Row Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Seated%20Cable%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-222",
    "slug": "standing-cable-row",
    "name": "Standing Cable Row",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Row Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Cable%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-223",
    "slug": "half-kneeling-single-arm-cable-row",
    "name": "Half-Kneeling Single-Arm Cable Row",
    "type": "strength",
    "category": "back",
    "equipment": "Cable / Row Station",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Obliques"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Half-Kneeling%20Single-Arm%20Cable%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-224",
    "slug": "one-arm-dumbbell-row",
    "name": "One-Arm Dumbbell Row",
    "type": "strength",
    "category": "back",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20One-Arm%20Dumbbell%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-225",
    "slug": "chest-supported-dumbbell-row",
    "name": "Chest-Supported Dumbbell Row",
    "type": "strength",
    "category": "back",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Chest-Supported%20Dumbbell%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-226",
    "slug": "dumbbell-bent-over-row",
    "name": "Dumbbell Bent-Over Row",
    "type": "strength",
    "category": "back",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Bent-Over%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-227",
    "slug": "dumbbell-seal-row",
    "name": "Dumbbell Seal Row",
    "type": "strength",
    "category": "back",
    "equipment": "Dumbbells / High Flat Bench",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Seal%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-228",
    "slug": "dumbbell-pullover",
    "name": "Dumbbell Pullover",
    "type": "strength",
    "category": "back",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Teres Major",
      "Triceps (Long Head)"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Pectoralis Major",
      "Teres Major",
      "Triceps (Long Head)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Pullover%20proper%20form%20technique"
  },
  {
    "id": "EX-229",
    "slug": "barbell-bent-over-row",
    "name": "Barbell Bent-Over Row",
    "type": "strength",
    "category": "back",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Bent-Over%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-230",
    "slug": "underhand-barbell-row",
    "name": "Underhand Barbell Row",
    "type": "strength",
    "category": "back",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Underhand%20Barbell%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-231",
    "slug": "pendlay-row",
    "name": "Pendlay Row",
    "type": "strength",
    "category": "back",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Pendlay%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-232",
    "slug": "barbell-seal-row",
    "name": "Barbell Seal Row",
    "type": "strength",
    "category": "back",
    "equipment": "Barbell / High Flat Bench",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Seal%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-233",
    "slug": "landmine-t-bar-row",
    "name": "Landmine T-Bar Row",
    "type": "strength",
    "category": "back",
    "equipment": "Barbell / Landmine / Row Handle",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Landmine%20T-Bar%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-234",
    "slug": "meadows-row",
    "name": "Meadows Row",
    "type": "strength",
    "category": "back",
    "equipment": "Barbell / Landmine",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Meadows%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-235",
    "slug": "smith-machine-bent-over-row",
    "name": "Smith Machine Bent-Over Row",
    "type": "strength",
    "category": "back",
    "equipment": "Smith Machine",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Bent-Over%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-236",
    "slug": "pull-up-overhand-grip",
    "name": "Pull-Up (Overhand Grip)",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Pull-Up%20(Overhand%20Grip)%20proper%20form%20technique"
  },
  {
    "id": "EX-237",
    "slug": "chin-up-underhand-grip",
    "name": "Chin-Up (Underhand Grip)",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Chin-Up%20(Underhand%20Grip)%20proper%20form%20technique"
  },
  {
    "id": "EX-238",
    "slug": "neutral-grip-pull-up",
    "name": "Neutral-Grip Pull-Up",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Neutral-Grip Pull-Up Handles",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Neutral-Grip%20Pull-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-239",
    "slug": "resistance-band-assisted-pull-up",
    "name": "Resistance-Band Assisted Pull-Up",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Pull-Up Bar / Resistance Band",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Assisted%20Pull-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-240",
    "slug": "weighted-pull-up",
    "name": "Weighted Pull-Up",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Pull-Up Bar / Weighted Vest or Dip Belt",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Weighted%20Pull-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-241",
    "slug": "eccentric-pull-up-negative-pull-up",
    "name": "Eccentric Pull-Up / Negative Pull-Up",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Biceps",
      "Brachialis",
      "Lower Trapezius",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Eccentric%20Pull-Up%20%2F%20Negative%20Pull-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-242",
    "slug": "scapular-pull-up",
    "name": "Scapular Pull-Up",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Lower Trapezius",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Forearms"
    ],
    "muscles": [
      "Lower Trapezius",
      "Latissimus Dorsi",
      "Rhomboids",
      "Forearms"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Scapular%20Pull-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-243",
    "slug": "inverted-row",
    "name": "Inverted Row",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Fixed Bar",
    "primaryMuscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Core"
    ],
    "muscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Latissimus Dorsi",
      "Biceps",
      "Rear Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Inverted%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-244",
    "slug": "suspension-row-trx-row",
    "name": "Suspension Row / TRX Row",
    "type": "strength",
    "category": "back",
    "equipment": "Suspension Trainer",
    "primaryMuscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Core"
    ],
    "muscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Latissimus Dorsi",
      "Biceps",
      "Rear Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suspension%20Row%20%2F%20TRX%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-245",
    "slug": "45-degree-back-extension",
    "name": "45-Degree Back Extension",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / 45-Degree Back Extension Bench",
    "primaryMuscles": [
      "Erector Spinae",
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Erector Spinae",
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%2045-Degree%20Back%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-246",
    "slug": "weighted-45-degree-back-extension",
    "name": "Weighted 45-Degree Back Extension",
    "type": "strength",
    "category": "back",
    "equipment": "Weight Plate / 45-Degree Back Extension Bench",
    "primaryMuscles": [
      "Erector Spinae",
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Erector Spinae",
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Weighted%2045-Degree%20Back%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-247",
    "slug": "reverse-hyperextension",
    "name": "Reverse Hyperextension",
    "type": "strength",
    "category": "back",
    "equipment": "Reverse Hyperextension Machine",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Erector Spinae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Reverse%20Hyperextension%20proper%20form%20technique"
  },
  {
    "id": "EX-248",
    "slug": "prone-back-extension",
    "name": "Prone Back Extension",
    "type": "strength",
    "category": "back",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Erector Spinae"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "muscles": [
      "Erector Spinae",
      "Glutes"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Prone%20Back%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-249",
    "slug": "resistance-band-seated-row",
    "name": "Resistance-Band Seated Row",
    "type": "strength",
    "category": "back",
    "equipment": "Resistance Band / Secure Anchor",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps",
      "Rear Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Seated%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-301",
    "slug": "seated-shoulder-press-machine",
    "name": "Seated Shoulder Press Machine",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Machine",
    "primaryMuscles": [
      "Anterior & Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Pectoralis"
    ],
    "muscles": [
      "Anterior & Lateral Deltoids",
      "Triceps",
      "Upper Pectoralis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Shoulder%20Press%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-302",
    "slug": "lateral-raise-machine",
    "name": "Lateral Raise Machine",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Machine",
    "primaryMuscles": [
      "Lateral (Side) Deltoids"
    ],
    "secondaryMuscles": [
      "Upper Trapezius"
    ],
    "muscles": [
      "Lateral (Side) Deltoids",
      "Upper Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Lateral%20Raise%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-303",
    "slug": "cable-lateral-raise",
    "name": "Cable Lateral Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable",
    "primaryMuscles": [
      "Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Upper Trapezius"
    ],
    "muscles": [
      "Lateral Deltoids",
      "Upper Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Lateral%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-304",
    "slug": "smith-machine-overhead-press",
    "name": "Smith Machine Overhead Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Smith Machine",
    "primaryMuscles": [
      "Anterior Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius"
    ],
    "muscles": [
      "Anterior Deltoids",
      "Triceps",
      "Upper Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Overhead%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-305",
    "slug": "cable-front-raise",
    "name": "Cable Front Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable",
    "primaryMuscles": [
      "Anterior Deltoids"
    ],
    "secondaryMuscles": [
      "Upper Pectoralis"
    ],
    "muscles": [
      "Anterior Deltoids",
      "Upper Pectoralis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Front%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-306",
    "slug": "seated-dumbbell-shoulder-press",
    "name": "Seated Dumbbell Shoulder Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Dumbbell%20Shoulder%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-307",
    "slug": "standing-dumbbell-shoulder-press",
    "name": "Standing Dumbbell Shoulder Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Dumbbell%20Shoulder%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-308",
    "slug": "arnold-press",
    "name": "Arnold Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Arnold%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-309",
    "slug": "neutral-grip-dumbbell-shoulder-press",
    "name": "Neutral-Grip Dumbbell Shoulder Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Neutral-Grip%20Dumbbell%20Shoulder%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-310",
    "slug": "single-arm-dumbbell-shoulder-press",
    "name": "Single-Arm Dumbbell Shoulder Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbell",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Dumbbell%20Shoulder%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-311",
    "slug": "standing-barbell-overhead-press-military-press",
    "name": "Standing Barbell Overhead Press / Military Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Barbell%20Overhead%20Press%20%2F%20Military%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-312",
    "slug": "seated-barbell-shoulder-press",
    "name": "Seated Barbell Shoulder Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Barbell / Bench / Rack",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Barbell%20Shoulder%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-313",
    "slug": "z-press",
    "name": "Z Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Barbell / Floor",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Upper Trapezius",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Z%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-314",
    "slug": "half-kneeling-landmine-press",
    "name": "Half-Kneeling Landmine Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Barbell / Landmine",
    "primaryMuscles": [
      "Anterior Deltoids",
      "Upper Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior Deltoids",
      "Upper Pectoralis Major",
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Half-Kneeling%20Landmine%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-315",
    "slug": "standing-single-arm-landmine-press",
    "name": "Standing Single-Arm Landmine Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Barbell / Landmine",
    "primaryMuscles": [
      "Anterior Deltoids",
      "Upper Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior Deltoids",
      "Upper Pectoralis Major",
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Single-Arm%20Landmine%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-316",
    "slug": "standing-dumbbell-lateral-raise",
    "name": "Standing Dumbbell Lateral Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Supraspinatus",
      "Trapezius"
    ],
    "muscles": [
      "Lateral Deltoids",
      "Supraspinatus",
      "Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Dumbbell%20Lateral%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-317",
    "slug": "seated-dumbbell-lateral-raise",
    "name": "Seated Dumbbell Lateral Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Supraspinatus",
      "Trapezius"
    ],
    "muscles": [
      "Lateral Deltoids",
      "Supraspinatus",
      "Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Dumbbell%20Lateral%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-318",
    "slug": "leaning-dumbbell-lateral-raise",
    "name": "Leaning Dumbbell Lateral Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbell / Stable Support",
    "primaryMuscles": [
      "Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Supraspinatus",
      "Trapezius"
    ],
    "muscles": [
      "Lateral Deltoids",
      "Supraspinatus",
      "Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Leaning%20Dumbbell%20Lateral%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-319",
    "slug": "dumbbell-scaption-raise",
    "name": "Dumbbell Scaption Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids",
      "Supraspinatus"
    ],
    "secondaryMuscles": [
      "Serratus Anterior",
      "Trapezius"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Supraspinatus",
      "Serratus Anterior",
      "Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Scaption%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-320",
    "slug": "dumbbell-front-raise",
    "name": "Dumbbell Front Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Anterior Deltoids"
    ],
    "secondaryMuscles": [
      "Upper Pectoralis Major",
      "Serratus Anterior"
    ],
    "muscles": [
      "Anterior Deltoids",
      "Upper Pectoralis Major",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Front%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-321",
    "slug": "weight-plate-front-raise",
    "name": "Weight Plate Front Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Weight Plate",
    "primaryMuscles": [
      "Anterior Deltoids"
    ],
    "secondaryMuscles": [
      "Upper Pectoralis Major",
      "Serratus Anterior"
    ],
    "muscles": [
      "Anterior Deltoids",
      "Upper Pectoralis Major",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Weight%20Plate%20Front%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-322",
    "slug": "chest-supported-dumbbell-reverse-fly",
    "name": "Chest-Supported Dumbbell Reverse Fly",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Posterior Deltoids"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "muscles": [
      "Posterior Deltoids",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Chest-Supported%20Dumbbell%20Reverse%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-323",
    "slug": "bent-over-dumbbell-reverse-fly",
    "name": "Bent-Over Dumbbell Reverse Fly",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Posterior Deltoids"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "muscles": [
      "Posterior Deltoids",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bent-Over%20Dumbbell%20Reverse%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-324",
    "slug": "chest-supported-rear-delt-row",
    "name": "Chest-Supported Rear Delt Row",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Posterior Deltoids"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Biceps"
    ],
    "muscles": [
      "Posterior Deltoids",
      "Rhomboids",
      "Middle Trapezius",
      "Biceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Chest-Supported%20Rear%20Delt%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-325",
    "slug": "cable-reverse-fly",
    "name": "Cable Reverse Fly",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Posterior Deltoids"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "muscles": [
      "Posterior Deltoids",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Reverse%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-326",
    "slug": "single-arm-cable-rear-delt-fly",
    "name": "Single-Arm Cable Rear Delt Fly",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Posterior Deltoids"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "muscles": [
      "Posterior Deltoids",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Cable%20Rear%20Delt%20Fly%20proper%20form%20technique"
  },
  {
    "id": "EX-327",
    "slug": "behind-body-cable-lateral-raise",
    "name": "Behind-Body Cable Lateral Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Supraspinatus",
      "Trapezius"
    ],
    "muscles": [
      "Lateral Deltoids",
      "Supraspinatus",
      "Trapezius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Behind-Body%20Cable%20Lateral%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-328",
    "slug": "cable-shoulder-press",
    "name": "Cable Shoulder Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Shoulder%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-329",
    "slug": "cable-external-rotation-elbow-at-side",
    "name": "Cable External Rotation (Elbow at Side)",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Infraspinatus",
      "Teres Minor"
    ],
    "secondaryMuscles": [
      "Posterior Deltoids"
    ],
    "muscles": [
      "Infraspinatus",
      "Teres Minor",
      "Posterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20External%20Rotation%20(Elbow%20at%20Side)%20proper%20form%20technique"
  },
  {
    "id": "EX-330",
    "slug": "cable-internal-rotation-elbow-at-side",
    "name": "Cable Internal Rotation (Elbow at Side)",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Adjustable Pulleys",
    "primaryMuscles": [
      "Subscapularis"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Latissimus Dorsi"
    ],
    "muscles": [
      "Subscapularis",
      "Pectoralis Major",
      "Latissimus Dorsi"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Internal%20Rotation%20(Elbow%20at%20Side)%20proper%20form%20technique"
  },
  {
    "id": "EX-331",
    "slug": "dumbbell-shrug",
    "name": "Dumbbell Shrug",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms"
    ],
    "muscles": [
      "Upper Trapezius",
      "Levator Scapulae",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Shrug%20proper%20form%20technique"
  },
  {
    "id": "EX-332",
    "slug": "barbell-shrug",
    "name": "Barbell Shrug",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms"
    ],
    "muscles": [
      "Upper Trapezius",
      "Levator Scapulae",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Shrug%20proper%20form%20technique"
  },
  {
    "id": "EX-333",
    "slug": "smith-machine-shrug",
    "name": "Smith Machine Shrug",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Smith Machine",
    "primaryMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms"
    ],
    "muscles": [
      "Upper Trapezius",
      "Levator Scapulae",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Shrug%20proper%20form%20technique"
  },
  {
    "id": "EX-334",
    "slug": "cable-shrug",
    "name": "Cable Shrug",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Low Pulley",
    "primaryMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms"
    ],
    "muscles": [
      "Upper Trapezius",
      "Levator Scapulae",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Shrug%20proper%20form%20technique"
  },
  {
    "id": "EX-335",
    "slug": "machine-shrug",
    "name": "Machine Shrug",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Machine (Plate-Loaded or Selectorized)",
    "primaryMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms"
    ],
    "muscles": [
      "Upper Trapezius",
      "Levator Scapulae",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Machine%20Shrug%20proper%20form%20technique"
  },
  {
    "id": "EX-336",
    "slug": "resistance-band-pull-apart",
    "name": "Resistance-Band Pull-Apart",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Resistance Band",
    "primaryMuscles": [
      "Posterior Deltoids",
      "Middle Trapezius",
      "Rhomboids"
    ],
    "secondaryMuscles": [
      "External Rotators"
    ],
    "muscles": [
      "Posterior Deltoids",
      "Middle Trapezius",
      "Rhomboids",
      "External Rotators"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Pull-Apart%20proper%20form%20technique"
  },
  {
    "id": "EX-337",
    "slug": "resistance-band-external-rotation",
    "name": "Resistance-Band External Rotation",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Resistance Band",
    "primaryMuscles": [
      "Infraspinatus",
      "Teres Minor"
    ],
    "secondaryMuscles": [
      "Posterior Deltoids"
    ],
    "muscles": [
      "Infraspinatus",
      "Teres Minor",
      "Posterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20External%20Rotation%20proper%20form%20technique"
  },
  {
    "id": "EX-338",
    "slug": "resistance-band-overhead-press",
    "name": "Resistance-Band Overhead Press",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Resistance Band",
    "primaryMuscles": [
      "Anterior and Lateral Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Serratus Anterior"
    ],
    "muscles": [
      "Anterior and Lateral Deltoids",
      "Triceps",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Overhead%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-339",
    "slug": "side-lying-dumbbell-external-rotation",
    "name": "Side-Lying Dumbbell External Rotation",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Light Dumbbell / Mat",
    "primaryMuscles": [
      "Infraspinatus",
      "Teres Minor"
    ],
    "secondaryMuscles": [
      "Posterior Deltoids"
    ],
    "muscles": [
      "Infraspinatus",
      "Teres Minor",
      "Posterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Side-Lying%20Dumbbell%20External%20Rotation%20proper%20form%20technique"
  },
  {
    "id": "EX-340",
    "slug": "prone-y-raise",
    "name": "Prone Y Raise",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Bodyweight or Light Dumbbells / Incline Bench",
    "primaryMuscles": [
      "Lower Trapezius"
    ],
    "secondaryMuscles": [
      "Serratus Anterior",
      "Posterior Deltoids"
    ],
    "muscles": [
      "Lower Trapezius",
      "Serratus Anterior",
      "Posterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Prone%20Y%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-341",
    "slug": "serratus-cable-punch",
    "name": "Serratus Cable Punch",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Serratus Anterior"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Pectoralis Major"
    ],
    "muscles": [
      "Serratus Anterior",
      "Anterior Deltoids",
      "Pectoralis Major"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Serratus%20Cable%20Punch%20proper%20form%20technique"
  },
  {
    "id": "EX-342",
    "slug": "pike-push-up",
    "name": "Pike Push-Up",
    "type": "strength",
    "category": "shoulders",
    "equipment": "Bodyweight / Floor",
    "primaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Upper Pectoralis Major",
      "Serratus Anterior",
      "Core"
    ],
    "muscles": [
      "Anterior Deltoids",
      "Triceps",
      "Upper Pectoralis Major",
      "Serratus Anterior",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Pike%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-401",
    "slug": "leg-press-45-degree-seated",
    "name": "Leg Press (45-Degree / Seated)",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Adductors",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Adductors",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Leg%20Press%20(45-Degree%20%2F%20Seated)%20proper%20form%20technique"
  },
  {
    "id": "EX-402",
    "slug": "hack-squat-machine",
    "name": "Hack Squat Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hack%20Squat%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-403",
    "slug": "leg-extension-machine",
    "name": "Leg Extension Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Quadriceps (Isolation)"
    ],
    "secondaryMuscles": [],
    "muscles": [
      "Quadriceps (Isolation)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Leg%20Extension%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-404",
    "slug": "seated-leg-curl-machine",
    "name": "Seated Leg Curl Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Calves (Gastrocnemius)"
    ],
    "muscles": [
      "Hamstrings",
      "Calves (Gastrocnemius)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Leg%20Curl%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-405",
    "slug": "lying-leg-curl-machine",
    "name": "Lying Leg Curl Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Calves"
    ],
    "muscles": [
      "Hamstrings",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Lying%20Leg%20Curl%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-406",
    "slug": "smith-machine-squat",
    "name": "Smith Machine Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Smith Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-407",
    "slug": "hip-abduction-machine",
    "name": "Hip Abduction Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Gluteus Medius & Minimus"
    ],
    "secondaryMuscles": [
      "Tensor Fasciae Latae"
    ],
    "muscles": [
      "Gluteus Medius & Minimus",
      "Tensor Fasciae Latae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hip%20Abduction%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-408",
    "slug": "hip-adduction-machine",
    "name": "Hip Adduction Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Adductors (Inner Thigh)"
    ],
    "secondaryMuscles": [],
    "muscles": [
      "Adductors (Inner Thigh)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hip%20Adduction%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-409",
    "slug": "standing-calf-raise-machine",
    "name": "Standing Calf Raise Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Calves (Gastrocnemius)"
    ],
    "secondaryMuscles": [
      "Soleus"
    ],
    "muscles": [
      "Calves (Gastrocnemius)",
      "Soleus"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Calf%20Raise%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-410",
    "slug": "seated-calf-raise-machine",
    "name": "Seated Calf Raise Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Calves (Soleus)"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "muscles": [
      "Calves (Soleus)",
      "Gastrocnemius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Calf%20Raise%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-411",
    "slug": "glute-drive-machine-hip-thrust",
    "name": "Glute Drive / Machine Hip Thrust",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Glute%20Drive%20%2F%20Machine%20Hip%20Thrust%20proper%20form%20technique"
  },
  {
    "id": "EX-412",
    "slug": "horizontal-seated-leg-press",
    "name": "Horizontal / Seated Leg Press",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Horizontal%20%2F%20Seated%20Leg%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-413",
    "slug": "single-leg-leg-press",
    "name": "Single-Leg Leg Press",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Leg%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-414",
    "slug": "plate-loaded-squat-v-squat-power-squat-machine",
    "name": "Plate-Loaded Squat / V-Squat / Power Squat Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine (Plate-Loaded)",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Plate-Loaded%20Squat%20%2F%20V-Squat%20%2F%20Power%20Squat%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-415",
    "slug": "pendulum-squat",
    "name": "Pendulum Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Pendulum Squat Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Pendulum%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-416",
    "slug": "belt-squat",
    "name": "Belt Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Belt Squat Machine / Belt",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Belt%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-417",
    "slug": "single-leg-extension",
    "name": "Single-Leg Extension",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "None Significant"
    ],
    "muscles": [
      "Quadriceps",
      "None Significant"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-418",
    "slug": "standing-leg-curl-machine",
    "name": "Standing Leg Curl Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "muscles": [
      "Hamstrings",
      "Gastrocnemius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Leg%20Curl%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-419",
    "slug": "single-leg-seated-leg-curl",
    "name": "Single-Leg Seated Leg Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "muscles": [
      "Hamstrings",
      "Gastrocnemius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Seated%20Leg%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-420",
    "slug": "single-leg-lying-leg-curl",
    "name": "Single-Leg Lying Leg Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "muscles": [
      "Hamstrings",
      "Gastrocnemius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Lying%20Leg%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-421",
    "slug": "glute-kickback-machine",
    "name": "Glute Kickback Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Glute%20Kickback%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-422",
    "slug": "standing-multi-hip-abduction",
    "name": "Standing Multi-Hip Abduction",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Gluteus Medius and Minimus"
    ],
    "secondaryMuscles": [
      "Tensor Fasciae Latae"
    ],
    "muscles": [
      "Gluteus Medius and Minimus",
      "Tensor Fasciae Latae"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Multi-Hip%20Abduction%20proper%20form%20technique"
  },
  {
    "id": "EX-423",
    "slug": "standing-multi-hip-adduction",
    "name": "Standing Multi-Hip Adduction",
    "type": "strength",
    "category": "legs",
    "equipment": "Machine",
    "primaryMuscles": [
      "Hip Adductors"
    ],
    "secondaryMuscles": [
      "Core Stabilizers"
    ],
    "muscles": [
      "Hip Adductors",
      "Core Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Multi-Hip%20Adduction%20proper%20form%20technique"
  },
  {
    "id": "EX-424",
    "slug": "barbell-back-squat-high-bar",
    "name": "Barbell Back Squat (High Bar)",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Back%20Squat%20(High%20Bar)%20proper%20form%20technique"
  },
  {
    "id": "EX-425",
    "slug": "barbell-back-squat-low-bar",
    "name": "Barbell Back Squat (Low Bar)",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Back%20Squat%20(Low%20Bar)%20proper%20form%20technique"
  },
  {
    "id": "EX-426",
    "slug": "barbell-front-squat",
    "name": "Barbell Front Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Front%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-427",
    "slug": "barbell-box-squat",
    "name": "Barbell Box Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack / Box",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Box%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-428",
    "slug": "safety-bar-squat",
    "name": "Safety-Bar Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Safety Squat Bar / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Safety-Bar%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-429",
    "slug": "zercher-squat",
    "name": "Zercher Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Zercher%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-430",
    "slug": "barbell-split-squat",
    "name": "Barbell Split Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Split%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-431",
    "slug": "barbell-reverse-lunge",
    "name": "Barbell Reverse Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Reverse%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-432",
    "slug": "barbell-walking-lunge",
    "name": "Barbell Walking Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Walking%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-433",
    "slug": "goblet-squat",
    "name": "Goblet Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbell",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Goblet%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-434",
    "slug": "dumbbell-squat",
    "name": "Dumbbell Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-435",
    "slug": "dumbbell-front-squat",
    "name": "Dumbbell Front Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Front%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-436",
    "slug": "dumbbell-sumo-squat",
    "name": "Dumbbell Sumo Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbell",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Adductors"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Sumo%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-437",
    "slug": "heel-elevated-goblet-squat",
    "name": "Heel-Elevated Goblet Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbell / Heel Wedge",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Heel-Elevated%20Goblet%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-438",
    "slug": "dumbbell-split-squat",
    "name": "Dumbbell Split Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Split%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-439",
    "slug": "dumbbell-bulgarian-split-squat",
    "name": "Dumbbell Bulgarian Split Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells / Stable Bench",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Bulgarian%20Split%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-440",
    "slug": "dumbbell-reverse-lunge",
    "name": "Dumbbell Reverse Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Reverse%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-441",
    "slug": "dumbbell-forward-lunge",
    "name": "Dumbbell Forward Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Forward%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-442",
    "slug": "dumbbell-walking-lunge",
    "name": "Dumbbell Walking Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Walking%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-443",
    "slug": "dumbbell-lateral-lunge",
    "name": "Dumbbell Lateral Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbell or Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Adductors"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Lateral%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-444",
    "slug": "dumbbell-step-up",
    "name": "Dumbbell Step-Up",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells / Stable Box",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Step-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-445",
    "slug": "dumbbell-lateral-step-up",
    "name": "Dumbbell Lateral Step-Up",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells / Stable Box",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hip Abductors",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Hip Abductors",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Lateral%20Step-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-446",
    "slug": "landmine-squat",
    "name": "Landmine Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Landmine",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Landmine%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-447",
    "slug": "smith-machine-split-squat",
    "name": "Smith Machine Split Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Smith Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Split%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-448",
    "slug": "smith-machine-bulgarian-split-squat",
    "name": "Smith Machine Bulgarian Split Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Smith Machine / Stable Bench",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Bulgarian%20Split%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-449",
    "slug": "smith-machine-reverse-lunge",
    "name": "Smith Machine Reverse Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Smith Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Reverse%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-450",
    "slug": "barbell-romanian-deadlift",
    "name": "Barbell Romanian Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Romanian%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-451",
    "slug": "conventional-barbell-deadlift",
    "name": "Conventional Barbell Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
      "Erector Spinae",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Conventional%20Barbell%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-452",
    "slug": "sumo-barbell-deadlift",
    "name": "Sumo Barbell Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Adductors"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Adductors",
      "Hamstrings",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Sumo%20Barbell%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-453",
    "slug": "trap-bar-deadlift",
    "name": "Trap-Bar Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Trap Bar",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Trap-Bar%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-454",
    "slug": "dumbbell-romanian-deadlift",
    "name": "Dumbbell Romanian Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Romanian%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-455",
    "slug": "single-leg-dumbbell-romanian-deadlift",
    "name": "Single-Leg Dumbbell Romanian Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbell or Dumbbells",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Hip Abductors",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Hip Abductors",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Dumbbell%20Romanian%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-456",
    "slug": "b-stance-kickstand-romanian-deadlift",
    "name": "B-Stance / Kickstand Romanian Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells or Barbell",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20B-Stance%20%2F%20Kickstand%20Romanian%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-457",
    "slug": "smith-machine-romanian-deadlift",
    "name": "Smith Machine Romanian Deadlift",
    "type": "strength",
    "category": "legs",
    "equipment": "Smith Machine",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Romanian%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-458",
    "slug": "barbell-good-morning",
    "name": "Barbell Good Morning",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Erector Spinae",
      "Adductors",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Good%20Morning%20proper%20form%20technique"
  },
  {
    "id": "EX-459",
    "slug": "cable-pull-through",
    "name": "Cable Pull-Through",
    "type": "strength",
    "category": "legs",
    "equipment": "Cable / Rope Attachment",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Erector Spinae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Pull-Through%20proper%20form%20technique"
  },
  {
    "id": "EX-460",
    "slug": "barbell-hip-thrust",
    "name": "Barbell Hip Thrust",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Padded Bench",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Hip%20Thrust%20proper%20form%20technique"
  },
  {
    "id": "EX-461",
    "slug": "smith-machine-hip-thrust",
    "name": "Smith Machine Hip Thrust",
    "type": "strength",
    "category": "legs",
    "equipment": "Smith Machine / Padded Bench",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Hip%20Thrust%20proper%20form%20technique"
  },
  {
    "id": "EX-462",
    "slug": "dumbbell-hip-thrust",
    "name": "Dumbbell Hip Thrust",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbell / Padded Bench",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Hip%20Thrust%20proper%20form%20technique"
  },
  {
    "id": "EX-463",
    "slug": "single-leg-hip-thrust",
    "name": "Single-Leg Hip Thrust",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Stable Bench",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Hip%20Thrust%20proper%20form%20technique"
  },
  {
    "id": "EX-464",
    "slug": "barbell-glute-bridge",
    "name": "Barbell Glute Bridge",
    "type": "strength",
    "category": "legs",
    "equipment": "Barbell / Mat",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Glute%20Bridge%20proper%20form%20technique"
  },
  {
    "id": "EX-465",
    "slug": "bodyweight-glute-bridge",
    "name": "Bodyweight Glute Bridge",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bodyweight%20Glute%20Bridge%20proper%20form%20technique"
  },
  {
    "id": "EX-466",
    "slug": "single-leg-glute-bridge",
    "name": "Single-Leg Glute Bridge",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Glute%20Bridge%20proper%20form%20technique"
  },
  {
    "id": "EX-467",
    "slug": "frog-pump",
    "name": "Frog Pump",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Frog%20Pump%20proper%20form%20technique"
  },
  {
    "id": "EX-468",
    "slug": "cable-glute-kickback",
    "name": "Cable Glute Kickback",
    "type": "strength",
    "category": "legs",
    "equipment": "Cable / Ankle Cuff",
    "primaryMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Glute%20Kickback%20proper%20form%20technique"
  },
  {
    "id": "EX-469",
    "slug": "cable-standing-hip-abduction",
    "name": "Cable Standing Hip Abduction",
    "type": "strength",
    "category": "legs",
    "equipment": "Cable / Ankle Cuff",
    "primaryMuscles": [
      "Gluteus Medius and Minimus"
    ],
    "secondaryMuscles": [
      "Tensor Fasciae Latae",
      "Core"
    ],
    "muscles": [
      "Gluteus Medius and Minimus",
      "Tensor Fasciae Latae",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Standing%20Hip%20Abduction%20proper%20form%20technique"
  },
  {
    "id": "EX-470",
    "slug": "cable-standing-hip-adduction",
    "name": "Cable Standing Hip Adduction",
    "type": "strength",
    "category": "legs",
    "equipment": "Cable / Ankle Cuff",
    "primaryMuscles": [
      "Hip Adductors"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Hip Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Standing%20Hip%20Adduction%20proper%20form%20technique"
  },
  {
    "id": "EX-471",
    "slug": "cable-standing-hip-flexion",
    "name": "Cable Standing Hip Flexion",
    "type": "strength",
    "category": "legs",
    "equipment": "Cable / Ankle Cuff",
    "primaryMuscles": [
      "Iliopsoas",
      "Rectus Femoris"
    ],
    "secondaryMuscles": [
      "Sartorius",
      "Core"
    ],
    "muscles": [
      "Iliopsoas",
      "Rectus Femoris",
      "Sartorius",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Standing%20Hip%20Flexion%20proper%20form%20technique"
  },
  {
    "id": "EX-472",
    "slug": "nordic-hamstring-curl",
    "name": "Nordic Hamstring Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Purpose-Built Ankle Anchor",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Nordic%20Hamstring%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-473",
    "slug": "assisted-nordic-hamstring-curl",
    "name": "Assisted Nordic Hamstring Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Secure Ankle Anchor / Resistance Band",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Assisted%20Nordic%20Hamstring%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-474",
    "slug": "glute-ham-raise",
    "name": "Glute-Ham Raise",
    "type": "strength",
    "category": "legs",
    "equipment": "Glute-Ham Developer",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Glute-Ham%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-475",
    "slug": "stability-ball-hamstring-curl",
    "name": "Stability-Ball Hamstring Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Stability Ball",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stability-Ball%20Hamstring%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-476",
    "slug": "slider-hamstring-curl",
    "name": "Slider Hamstring Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Exercise Sliders",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Slider%20Hamstring%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-477",
    "slug": "single-leg-slider-hamstring-curl",
    "name": "Single-Leg Slider Hamstring Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Exercise Sliders",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Slider%20Hamstring%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-478",
    "slug": "suspension-hamstring-curl",
    "name": "Suspension Hamstring Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Suspension Trainer",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suspension%20Hamstring%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-479",
    "slug": "resistance-band-leg-curl",
    "name": "Resistance-Band Leg Curl",
    "type": "strength",
    "category": "legs",
    "equipment": "Resistance Band / Secure Anchor",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Leg%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-480",
    "slug": "bodyweight-squat",
    "name": "Bodyweight Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bodyweight%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-481",
    "slug": "bodyweight-split-squat",
    "name": "Bodyweight Split Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bodyweight%20Split%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-482",
    "slug": "bodyweight-reverse-lunge",
    "name": "Bodyweight Reverse Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bodyweight%20Reverse%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-483",
    "slug": "bodyweight-lateral-lunge",
    "name": "Bodyweight Lateral Lunge",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Adductors"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bodyweight%20Lateral%20Lunge%20proper%20form%20technique"
  },
  {
    "id": "EX-484",
    "slug": "assisted-pistol-squat",
    "name": "Assisted Pistol Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Assisted%20Pistol%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-485",
    "slug": "wall-sit",
    "name": "Wall Sit",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Wall",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wall%20Sit%20proper%20form%20technique"
  },
  {
    "id": "EX-486",
    "slug": "sit-to-stand-box-squat",
    "name": "Sit-to-Stand / Box Squat",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Stable Bench",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Sit-to-Stand%20%2F%20Box%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-487",
    "slug": "controlled-step-down",
    "name": "Controlled Step-Down",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Low Stable Step",
    "primaryMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hip Abductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Hip Abductors",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Controlled%20Step-Down%20proper%20form%20technique"
  },
  {
    "id": "EX-488",
    "slug": "side-lying-hip-abduction",
    "name": "Side-Lying Hip Abduction",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Gluteus Medius and Minimus"
    ],
    "secondaryMuscles": [
      "Tensor Fasciae Latae"
    ],
    "muscles": [
      "Gluteus Medius and Minimus",
      "Tensor Fasciae Latae"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Side-Lying%20Hip%20Abduction%20proper%20form%20technique"
  },
  {
    "id": "EX-489",
    "slug": "clamshell",
    "name": "Clamshell",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Gluteus Medius",
      "Hip External Rotators"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus"
    ],
    "muscles": [
      "Gluteus Medius",
      "Hip External Rotators",
      "Gluteus Maximus"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Clamshell%20proper%20form%20technique"
  },
  {
    "id": "EX-490",
    "slug": "mini-band-lateral-walk",
    "name": "Mini-Band Lateral Walk",
    "type": "strength",
    "category": "legs",
    "equipment": "Mini Resistance Band",
    "primaryMuscles": [
      "Hip Abductors"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Quadriceps"
    ],
    "muscles": [
      "Hip Abductors",
      "Gluteus Maximus",
      "Quadriceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Mini-Band%20Lateral%20Walk%20proper%20form%20technique"
  },
  {
    "id": "EX-491",
    "slug": "mini-band-monster-walk",
    "name": "Mini-Band Monster Walk",
    "type": "strength",
    "category": "legs",
    "equipment": "Mini Resistance Band",
    "primaryMuscles": [
      "Hip Abductors",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Quadriceps"
    ],
    "muscles": [
      "Hip Abductors",
      "Gluteus Maximus",
      "Quadriceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Mini-Band%20Monster%20Walk%20proper%20form%20technique"
  },
  {
    "id": "EX-492",
    "slug": "bodyweight-standing-calf-raise",
    "name": "Bodyweight Standing Calf Raise",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Foot and Ankle Stabilizers"
    ],
    "muscles": [
      "Gastrocnemius",
      "Soleus",
      "Foot and Ankle Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bodyweight%20Standing%20Calf%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-493",
    "slug": "single-leg-calf-raise",
    "name": "Single-Leg Calf Raise",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Foot and Ankle Stabilizers"
    ],
    "muscles": [
      "Gastrocnemius",
      "Soleus",
      "Foot and Ankle Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Calf%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-494",
    "slug": "dumbbell-standing-calf-raise",
    "name": "Dumbbell Standing Calf Raise",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells / Stable Support",
    "primaryMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Foot and Ankle Stabilizers"
    ],
    "muscles": [
      "Gastrocnemius",
      "Soleus",
      "Foot and Ankle Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Standing%20Calf%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-495",
    "slug": "smith-machine-calf-raise",
    "name": "Smith Machine Calf Raise",
    "type": "strength",
    "category": "legs",
    "equipment": "Smith Machine / Suitable Platform",
    "primaryMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Foot and Ankle Stabilizers"
    ],
    "muscles": [
      "Gastrocnemius",
      "Soleus",
      "Foot and Ankle Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Smith%20Machine%20Calf%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-496",
    "slug": "leg-press-calf-raise",
    "name": "Leg Press Calf Raise",
    "type": "strength",
    "category": "legs",
    "equipment": "Leg Press Machine",
    "primaryMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Foot and Ankle Stabilizers"
    ],
    "muscles": [
      "Gastrocnemius",
      "Soleus",
      "Foot and Ankle Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Leg%20Press%20Calf%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-497",
    "slug": "dumbbell-seated-calf-raise",
    "name": "Dumbbell Seated Calf Raise",
    "type": "strength",
    "category": "legs",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Soleus"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "muscles": [
      "Soleus",
      "Gastrocnemius"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Seated%20Calf%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-498",
    "slug": "tibialis-raise-against-wall",
    "name": "Tibialis Raise Against Wall",
    "type": "strength",
    "category": "legs",
    "equipment": "Bodyweight / Wall",
    "primaryMuscles": [
      "Tibialis Anterior"
    ],
    "secondaryMuscles": [
      "Toe Extensors"
    ],
    "muscles": [
      "Tibialis Anterior",
      "Toe Extensors"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Tibialis%20Raise%20Against%20Wall%20proper%20form%20technique"
  },
  {
    "id": "EX-499",
    "slug": "tibialis-raise-machine",
    "name": "Tibialis Raise Machine",
    "type": "strength",
    "category": "legs",
    "equipment": "Tibialis Machine",
    "primaryMuscles": [
      "Tibialis Anterior"
    ],
    "secondaryMuscles": [
      "Toe Extensors"
    ],
    "muscles": [
      "Tibialis Anterior",
      "Toe Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Tibialis%20Raise%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-501",
    "slug": "cable-bicep-curl",
    "name": "Cable Bicep Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Forearms"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Bicep%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-502",
    "slug": "preacher-curl-machine",
    "name": "Preacher Curl Machine",
    "type": "strength",
    "category": "arms",
    "equipment": "Machine",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "muscles": [
      "Biceps Brachii",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Preacher%20Curl%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-503",
    "slug": "cable-triceps-pushdown",
    "name": "Cable Triceps Pushdown",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "muscles": [
      "Triceps Brachii",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Triceps%20Pushdown%20proper%20form%20technique"
  },
  {
    "id": "EX-504",
    "slug": "triceps-extension-machine",
    "name": "Triceps Extension Machine",
    "type": "strength",
    "category": "arms",
    "equipment": "Machine",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [],
    "muscles": [
      "Triceps Brachii"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Triceps%20Extension%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-505",
    "slug": "cable-overhead-triceps-extension",
    "name": "Cable Overhead Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable",
    "primaryMuscles": [
      "Triceps (Long Head)"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "muscles": [
      "Triceps (Long Head)",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Overhead%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-506",
    "slug": "cable-hammer-curl-rope",
    "name": "Cable Hammer Curl (Rope)",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable",
    "primaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii"
    ],
    "muscles": [
      "Brachialis",
      "Brachioradialis",
      "Biceps Brachii"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Hammer%20Curl%20(Rope)%20proper%20form%20technique"
  },
  {
    "id": "EX-507",
    "slug": "standing-dumbbell-curl",
    "name": "Standing Dumbbell Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Dumbbell%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-508",
    "slug": "alternating-dumbbell-curl",
    "name": "Alternating Dumbbell Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Alternating%20Dumbbell%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-509",
    "slug": "seated-dumbbell-curl",
    "name": "Seated Dumbbell Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Dumbbell%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-510",
    "slug": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells / Incline Bench",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Incline%20Dumbbell%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-511",
    "slug": "dumbbell-preacher-curl",
    "name": "Dumbbell Preacher Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbell / Preacher Bench",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Preacher%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-512",
    "slug": "dumbbell-concentration-curl",
    "name": "Dumbbell Concentration Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbell / Bench",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Concentration%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-513",
    "slug": "dumbbell-spider-curl",
    "name": "Dumbbell Spider Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells / Incline Bench",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Spider%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-514",
    "slug": "dumbbell-hammer-curl",
    "name": "Dumbbell Hammer Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii"
    ],
    "muscles": [
      "Brachialis",
      "Brachioradialis",
      "Biceps Brachii"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Hammer%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-515",
    "slug": "cross-body-hammer-curl",
    "name": "Cross-Body Hammer Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii"
    ],
    "muscles": [
      "Brachialis",
      "Brachioradialis",
      "Biceps Brachii"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cross-Body%20Hammer%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-516",
    "slug": "dumbbell-zottman-curl",
    "name": "Dumbbell Zottman Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Biceps Brachii",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Forearm Extensors"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachioradialis",
      "Brachialis",
      "Forearm Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Zottman%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-517",
    "slug": "standing-barbell-curl",
    "name": "Standing Barbell Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Barbell%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-518",
    "slug": "ez-bar-curl",
    "name": "EZ-Bar Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "EZ Bar",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20EZ-Bar%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-519",
    "slug": "ez-bar-preacher-curl",
    "name": "EZ-Bar Preacher Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "EZ Bar / Preacher Bench",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20EZ-Bar%20Preacher%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-520",
    "slug": "barbell-drag-curl",
    "name": "Barbell Drag Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Drag%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-521",
    "slug": "barbell-reverse-curl",
    "name": "Barbell Reverse Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Brachioradialis",
      "Brachialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Wrist Extensors"
    ],
    "muscles": [
      "Brachioradialis",
      "Brachialis",
      "Biceps Brachii",
      "Wrist Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Reverse%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-522",
    "slug": "ez-bar-reverse-curl",
    "name": "EZ-Bar Reverse Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "EZ Bar",
    "primaryMuscles": [
      "Brachioradialis",
      "Brachialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Wrist Extensors"
    ],
    "muscles": [
      "Brachioradialis",
      "Brachialis",
      "Biceps Brachii",
      "Wrist Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20EZ-Bar%20Reverse%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-523",
    "slug": "single-arm-cable-curl",
    "name": "Single-Arm Cable Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Cable%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-524",
    "slug": "behind-body-cable-curl-bayesian-curl",
    "name": "Behind-Body Cable Curl / Bayesian Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Behind-Body%20Cable%20Curl%20%2F%20Bayesian%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-525",
    "slug": "high-pulley-cable-curl",
    "name": "High-Pulley Cable Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20High-Pulley%20Cable%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-526",
    "slug": "cable-preacher-curl",
    "name": "Cable Preacher Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Preacher Bench",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Preacher%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-527",
    "slug": "cable-reverse-curl",
    "name": "Cable Reverse Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Brachioradialis",
      "Brachialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Wrist Extensors"
    ],
    "muscles": [
      "Brachioradialis",
      "Brachialis",
      "Biceps Brachii",
      "Wrist Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Reverse%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-528",
    "slug": "seated-biceps-curl-machine",
    "name": "Seated Biceps Curl Machine",
    "type": "strength",
    "category": "arms",
    "equipment": "Machine",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Biceps%20Curl%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-529",
    "slug": "resistance-band-biceps-curl",
    "name": "Resistance-Band Biceps Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Resistance Band",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Brachioradialis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Biceps%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-530",
    "slug": "resistance-band-hammer-curl",
    "name": "Resistance-Band Hammer Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Resistance Band",
    "primaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii"
    ],
    "muscles": [
      "Brachialis",
      "Brachioradialis",
      "Biceps Brachii"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Hammer%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-531",
    "slug": "suspension-biceps-curl",
    "name": "Suspension Biceps Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Suspension Trainer",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Core"
    ],
    "muscles": [
      "Biceps Brachii",
      "Forearms",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suspension%20Biceps%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-532",
    "slug": "rope-triceps-pushdown",
    "name": "Rope Triceps Pushdown",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Rope Attachment",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Rope%20Triceps%20Pushdown%20proper%20form%20technique"
  },
  {
    "id": "EX-533",
    "slug": "straight-bar-triceps-pushdown",
    "name": "Straight-Bar Triceps Pushdown",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Straight Bar",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Straight-Bar%20Triceps%20Pushdown%20proper%20form%20technique"
  },
  {
    "id": "EX-534",
    "slug": "v-bar-triceps-pushdown",
    "name": "V-Bar Triceps Pushdown",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / V-Bar",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20V-Bar%20Triceps%20Pushdown%20proper%20form%20technique"
  },
  {
    "id": "EX-535",
    "slug": "single-arm-cable-triceps-pushdown",
    "name": "Single-Arm Cable Triceps Pushdown",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Cable%20Triceps%20Pushdown%20proper%20form%20technique"
  },
  {
    "id": "EX-536",
    "slug": "single-arm-overhead-cable-triceps-extension",
    "name": "Single-Arm Overhead Cable Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Overhead%20Cable%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-537",
    "slug": "cross-body-cable-triceps-extension",
    "name": "Cross-Body Cable Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cross-Body%20Cable%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-538",
    "slug": "cable-triceps-kickback",
    "name": "Cable Triceps Kickback",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Triceps%20Kickback%20proper%20form%20technique"
  },
  {
    "id": "EX-539",
    "slug": "lying-cable-triceps-extension",
    "name": "Lying Cable Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Bench",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Lying%20Cable%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-540",
    "slug": "two-hand-dumbbell-overhead-triceps-extension",
    "name": "Two-Hand Dumbbell Overhead Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbell",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Two-Hand%20Dumbbell%20Overhead%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-541",
    "slug": "single-arm-dumbbell-overhead-triceps-extension",
    "name": "Single-Arm Dumbbell Overhead Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbell",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Dumbbell%20Overhead%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-542",
    "slug": "lying-dumbbell-triceps-extension",
    "name": "Lying Dumbbell Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Lying%20Dumbbell%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-543",
    "slug": "dumbbell-triceps-kickback",
    "name": "Dumbbell Triceps Kickback",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbell / Bench",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Triceps%20Kickback%20proper%20form%20technique"
  },
  {
    "id": "EX-544",
    "slug": "ez-bar-skull-crusher",
    "name": "EZ-Bar Skull Crusher",
    "type": "strength",
    "category": "arms",
    "equipment": "EZ Bar / Bench",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20EZ-Bar%20Skull%20Crusher%20proper%20form%20technique"
  },
  {
    "id": "EX-545",
    "slug": "ez-bar-overhead-triceps-extension",
    "name": "EZ-Bar Overhead Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "EZ Bar / Bench",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20EZ-Bar%20Overhead%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-546",
    "slug": "close-grip-barbell-bench-press",
    "name": "Close-Grip Barbell Bench Press",
    "type": "strength",
    "category": "arms",
    "equipment": "Barbell / Bench / Rack",
    "primaryMuscles": [
      "Triceps",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Triceps",
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Close-Grip%20Barbell%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-547",
    "slug": "close-grip-smith-machine-bench-press",
    "name": "Close-Grip Smith Machine Bench Press",
    "type": "strength",
    "category": "arms",
    "equipment": "Smith Machine / Bench",
    "primaryMuscles": [
      "Triceps",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Triceps",
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Close-Grip%20Smith%20Machine%20Bench%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-548",
    "slug": "seated-dip-triceps-press-machine",
    "name": "Seated Dip / Triceps Press Machine",
    "type": "strength",
    "category": "arms",
    "equipment": "Machine",
    "primaryMuscles": [
      "Triceps"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Triceps",
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Dip%20%2F%20Triceps%20Press%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-549",
    "slug": "assisted-dip-triceps-emphasis",
    "name": "Assisted Dip (Triceps Emphasis)",
    "type": "strength",
    "category": "arms",
    "equipment": "Assisted Dip Machine",
    "primaryMuscles": [
      "Triceps"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Triceps",
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Assisted%20Dip%20(Triceps%20Emphasis)%20proper%20form%20technique"
  },
  {
    "id": "EX-550",
    "slug": "parallel-bar-dip-triceps-emphasis",
    "name": "Parallel-Bar Dip (Triceps Emphasis)",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Dip Bars",
    "primaryMuscles": [
      "Triceps"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "muscles": [
      "Triceps",
      "Pectoralis Major",
      "Anterior Deltoids"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Parallel-Bar%20Dip%20(Triceps%20Emphasis)%20proper%20form%20technique"
  },
  {
    "id": "EX-551",
    "slug": "close-grip-push-up",
    "name": "Close-Grip Push-Up",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Floor",
    "primaryMuscles": [
      "Triceps",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Triceps",
      "Pectoralis Major",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Close-Grip%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-552",
    "slug": "diamond-push-up",
    "name": "Diamond Push-Up",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Floor",
    "primaryMuscles": [
      "Triceps",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Triceps",
      "Pectoralis Major",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Diamond%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-553",
    "slug": "suspension-triceps-extension",
    "name": "Suspension Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Suspension Trainer",
    "primaryMuscles": [
      "Triceps"
    ],
    "secondaryMuscles": [
      "Core",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Triceps",
      "Core",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suspension%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-554",
    "slug": "resistance-band-triceps-pushdown",
    "name": "Resistance-Band Triceps Pushdown",
    "type": "strength",
    "category": "arms",
    "equipment": "Resistance Band / High Anchor",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Triceps%20Pushdown%20proper%20form%20technique"
  },
  {
    "id": "EX-555",
    "slug": "resistance-band-overhead-triceps-extension",
    "name": "Resistance-Band Overhead Triceps Extension",
    "type": "strength",
    "category": "arms",
    "equipment": "Resistance Band",
    "primaryMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anconeus",
      "Forearms (Grip)"
    ],
    "muscles": [
      "Triceps Brachii",
      "Anconeus",
      "Forearms (Grip)"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Overhead%20Triceps%20Extension%20proper%20form%20technique"
  },
  {
    "id": "EX-556",
    "slug": "seated-dumbbell-wrist-curl",
    "name": "Seated Dumbbell Wrist Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Wrist Flexors"
    ],
    "secondaryMuscles": [
      "Finger Flexors"
    ],
    "muscles": [
      "Wrist Flexors",
      "Finger Flexors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Dumbbell%20Wrist%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-557",
    "slug": "seated-barbell-wrist-curl",
    "name": "Seated Barbell Wrist Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Barbell / Bench",
    "primaryMuscles": [
      "Wrist Flexors"
    ],
    "secondaryMuscles": [
      "Finger Flexors"
    ],
    "muscles": [
      "Wrist Flexors",
      "Finger Flexors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Barbell%20Wrist%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-558",
    "slug": "seated-dumbbell-reverse-wrist-curl",
    "name": "Seated Dumbbell Reverse Wrist Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Dumbbells / Bench",
    "primaryMuscles": [
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Finger Extensors"
    ],
    "muscles": [
      "Wrist Extensors",
      "Finger Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Dumbbell%20Reverse%20Wrist%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-559",
    "slug": "seated-barbell-reverse-wrist-curl",
    "name": "Seated Barbell Reverse Wrist Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Barbell / Bench",
    "primaryMuscles": [
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Finger Extensors"
    ],
    "muscles": [
      "Wrist Extensors",
      "Finger Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Barbell%20Reverse%20Wrist%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-560",
    "slug": "cable-wrist-curl",
    "name": "Cable Wrist Curl",
    "type": "strength",
    "category": "arms",
    "equipment": "Cable / Low Pulley",
    "primaryMuscles": [
      "Wrist Flexors"
    ],
    "secondaryMuscles": [
      "Finger Flexors"
    ],
    "muscles": [
      "Wrist Flexors",
      "Finger Flexors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Wrist%20Curl%20proper%20form%20technique"
  },
  {
    "id": "EX-561",
    "slug": "wrist-roller",
    "name": "Wrist Roller",
    "type": "strength",
    "category": "arms",
    "equipment": "Wrist Roller / Weight",
    "primaryMuscles": [
      "Wrist Flexors and Extensors"
    ],
    "secondaryMuscles": [
      "Finger Flexors",
      "Deltoids"
    ],
    "muscles": [
      "Wrist Flexors and Extensors",
      "Finger Flexors",
      "Deltoids"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wrist%20Roller%20proper%20form%20technique"
  },
  {
    "id": "EX-562",
    "slug": "dumbbell-forearm-pronation-supination",
    "name": "Dumbbell Forearm Pronation / Supination",
    "type": "strength",
    "category": "arms",
    "equipment": "Light Dumbbell",
    "primaryMuscles": [
      "Forearm Pronators and Supinators"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Wrist Stabilizers"
    ],
    "muscles": [
      "Forearm Pronators and Supinators",
      "Biceps Brachii",
      "Wrist Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Forearm%20Pronation%20%2F%20Supination%20proper%20form%20technique"
  },
  {
    "id": "EX-563",
    "slug": "plate-pinch-hold",
    "name": "Plate Pinch Hold",
    "type": "strength",
    "category": "arms",
    "equipment": "Weight Plates",
    "primaryMuscles": [
      "Finger and Thumb Flexors"
    ],
    "secondaryMuscles": [
      "Wrist Stabilizers"
    ],
    "muscles": [
      "Finger and Thumb Flexors",
      "Wrist Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Plate%20Pinch%20Hold%20proper%20form%20technique"
  },
  {
    "id": "EX-564",
    "slug": "hand-gripper-squeeze",
    "name": "Hand Gripper Squeeze",
    "type": "strength",
    "category": "arms",
    "equipment": "Hand Gripper",
    "primaryMuscles": [
      "Finger Flexors"
    ],
    "secondaryMuscles": [
      "Thumb Muscles"
    ],
    "muscles": [
      "Finger Flexors",
      "Thumb Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hand%20Gripper%20Squeeze%20proper%20form%20technique"
  },
  {
    "id": "EX-565",
    "slug": "dead-hang",
    "name": "Dead Hang",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Finger Flexors"
    ],
    "secondaryMuscles": [
      "Scapular and Shoulder Stabilizers"
    ],
    "muscles": [
      "Finger Flexors",
      "Scapular and Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dead%20Hang%20proper%20form%20technique"
  },
  {
    "id": "EX-566",
    "slug": "towel-hang",
    "name": "Towel Hang",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Pull-Up Bar / Secure Towel",
    "primaryMuscles": [
      "Finger Flexors"
    ],
    "secondaryMuscles": [
      "Scapular and Shoulder Stabilizers"
    ],
    "muscles": [
      "Finger Flexors",
      "Scapular and Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Towel%20Hang%20proper%20form%20technique"
  },
  {
    "id": "EX-601",
    "slug": "abdominal-crunch-machine",
    "name": "Abdominal Crunch Machine",
    "type": "strength",
    "category": "core",
    "equipment": "Machine",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Abdominal%20Crunch%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-602",
    "slug": "cable-woodchopper-torso-rotation",
    "name": "Cable Woodchopper / Torso Rotation",
    "type": "strength",
    "category": "core",
    "equipment": "Cable",
    "primaryMuscles": [
      "Obliques"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Transversus Abdominis"
    ],
    "muscles": [
      "Obliques",
      "Rectus Abdominis",
      "Transversus Abdominis"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Woodchopper%20%2F%20Torso%20Rotation%20proper%20form%20technique"
  },
  {
    "id": "EX-603",
    "slug": "captain-s-chair-leg-raise-tower",
    "name": "Captain's Chair Leg Raise Tower",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Machine",
    "primaryMuscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl",
      "Obliques",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Captain's%20Chair%20Leg%20Raise%20Tower%20proper%20form%20technique"
  },
  {
    "id": "EX-604",
    "slug": "decline-ab-bench-crunch",
    "name": "Decline Ab Bench Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Bench",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Decline%20Ab%20Bench%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-605",
    "slug": "kneeling-cable-crunch",
    "name": "Kneeling Cable Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Cable / Rope Attachment",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kneeling%20Cable%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-606",
    "slug": "standing-cable-crunch",
    "name": "Standing Cable Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Cable / Rope Attachment",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Cable%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-607",
    "slug": "high-to-low-cable-wood-chop",
    "name": "High-to-Low Cable Wood Chop",
    "type": "strength",
    "category": "core",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Obliques"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Shoulder and Hip Muscles"
    ],
    "muscles": [
      "Obliques",
      "Rectus Abdominis",
      "Shoulder and Hip Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20High-to-Low%20Cable%20Wood%20Chop%20proper%20form%20technique"
  },
  {
    "id": "EX-608",
    "slug": "low-to-high-cable-lift",
    "name": "Low-to-High Cable Lift",
    "type": "strength",
    "category": "core",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Obliques"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Shoulder and Hip Muscles"
    ],
    "muscles": [
      "Obliques",
      "Rectus Abdominis",
      "Shoulder and Hip Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Low-to-High%20Cable%20Lift%20proper%20form%20technique"
  },
  {
    "id": "EX-609",
    "slug": "cable-pallof-press",
    "name": "Cable Pallof Press",
    "type": "strength",
    "category": "core",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Obliques",
      "Transversus Abdominis",
      "Rectus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Pallof%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-610",
    "slug": "half-kneeling-pallof-press",
    "name": "Half-Kneeling Pallof Press",
    "type": "strength",
    "category": "core",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Half-Kneeling%20Pallof%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-611",
    "slug": "cable-pallof-hold",
    "name": "Cable Pallof Hold",
    "type": "strength",
    "category": "core",
    "equipment": "Cable / Adjustable Pulley",
    "primaryMuscles": [
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Glutes"
    ],
    "muscles": [
      "Obliques",
      "Transversus Abdominis",
      "Rectus Abdominis",
      "Glutes"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cable%20Pallof%20Hold%20proper%20form%20technique"
  },
  {
    "id": "EX-612",
    "slug": "rotary-torso-machine",
    "name": "Rotary Torso Machine",
    "type": "strength",
    "category": "core",
    "equipment": "Machine",
    "primaryMuscles": [
      "Obliques"
    ],
    "secondaryMuscles": [
      "Transversus Abdominis",
      "Spinal Stabilizers"
    ],
    "muscles": [
      "Obliques",
      "Transversus Abdominis",
      "Spinal Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Rotary%20Torso%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-613",
    "slug": "floor-crunch",
    "name": "Floor Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Floor%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-614",
    "slug": "reverse-crunch",
    "name": "Reverse Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Reverse%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-615",
    "slug": "bicycle-crunch",
    "name": "Bicycle Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Hip Flexors"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bicycle%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-616",
    "slug": "heel-touch-crunch",
    "name": "Heel-Touch Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Obliques",
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "muscles": [
      "Obliques",
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Heel-Touch%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-617",
    "slug": "toe-reach-crunch",
    "name": "Toe-Reach Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Toe-Reach%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-618",
    "slug": "sit-up",
    "name": "Sit-Up",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Hip Flexors",
      "Obliques"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Sit-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-619",
    "slug": "v-up",
    "name": "V-Up",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Hip Flexors",
      "Obliques"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20V-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-620",
    "slug": "lying-leg-raise",
    "name": "Lying Leg Raise",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis and Obliques (Stabilization)"
    ],
    "muscles": [
      "Hip Flexors",
      "Rectus Abdominis and Obliques (Stabilization)"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Lying%20Leg%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-621",
    "slug": "flutter-kick",
    "name": "Flutter Kick",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis and Obliques (Stabilization)"
    ],
    "muscles": [
      "Hip Flexors",
      "Rectus Abdominis and Obliques (Stabilization)"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Flutter%20Kick%20proper%20form%20technique"
  },
  {
    "id": "EX-622",
    "slug": "dead-bug",
    "name": "Dead Bug",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Hip Flexors",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Hip Flexors",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dead%20Bug%20proper%20form%20technique"
  },
  {
    "id": "EX-623",
    "slug": "hollow-body-hold",
    "name": "Hollow Body Hold",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Hip Flexors",
      "Quadriceps"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Hip Flexors",
      "Quadriceps"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hollow%20Body%20Hold%20proper%20form%20technique"
  },
  {
    "id": "EX-624",
    "slug": "bird-dog",
    "name": "Bird Dog",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Spinal Stabilizers",
      "Abdominal Wall"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Deltoids"
    ],
    "muscles": [
      "Spinal Stabilizers",
      "Abdominal Wall",
      "Glutes",
      "Deltoids"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bird%20Dog%20proper%20form%20technique"
  },
  {
    "id": "EX-625",
    "slug": "forearm-plank",
    "name": "Forearm Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Forearm%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-626",
    "slug": "high-plank",
    "name": "High Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20High%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-627",
    "slug": "kneeling-plank",
    "name": "Kneeling Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kneeling%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-628",
    "slug": "side-plank",
    "name": "Side Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Obliques",
      "Quadratus Lumborum"
    ],
    "secondaryMuscles": [
      "Gluteus Medius",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Obliques",
      "Quadratus Lumborum",
      "Gluteus Medius",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Side%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-629",
    "slug": "kneeling-side-plank",
    "name": "Kneeling Side Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Obliques",
      "Quadratus Lumborum"
    ],
    "secondaryMuscles": [
      "Gluteus Medius",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Obliques",
      "Quadratus Lumborum",
      "Gluteus Medius",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kneeling%20Side%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-630",
    "slug": "plank-shoulder-tap",
    "name": "Plank Shoulder Tap",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Plank%20Shoulder%20Tap%20proper%20form%20technique"
  },
  {
    "id": "EX-631",
    "slug": "long-lever-plank",
    "name": "Long-Lever Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Long-Lever%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-632",
    "slug": "body-saw",
    "name": "Body Saw",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Exercise Sliders",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Body%20Saw%20proper%20form%20technique"
  },
  {
    "id": "EX-633",
    "slug": "copenhagen-side-plank",
    "name": "Copenhagen Side Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Stable Bench",
    "primaryMuscles": [
      "Hip Adductors",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Quadratus Lumborum",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Hip Adductors",
      "Obliques",
      "Quadratus Lumborum",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Copenhagen%20Side%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-634",
    "slug": "rkc-plank",
    "name": "RKC Plank",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Transversus Abdominis",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20RKC%20Plank%20proper%20form%20technique"
  },
  {
    "id": "EX-635",
    "slug": "hanging-knee-raise",
    "name": "Hanging Knee Raise",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Forearms",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl",
      "Obliques",
      "Forearms",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hanging%20Knee%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-636",
    "slug": "hanging-straight-leg-raise",
    "name": "Hanging Straight-Leg Raise",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Forearms",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl",
      "Obliques",
      "Forearms",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hanging%20Straight-Leg%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-637",
    "slug": "captain-s-chair-knee-raise",
    "name": "Captain's Chair Knee Raise",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Captain's Chair",
    "primaryMuscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl",
      "Obliques",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Captain's%20Chair%20Knee%20Raise%20proper%20form%20technique"
  },
  {
    "id": "EX-638",
    "slug": "toes-to-bar",
    "name": "Toes-to-Bar",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Pull-Up Bar",
    "primaryMuscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Forearms",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Hip Flexors; Rectus Abdominis with Pelvic Curl",
      "Obliques",
      "Forearms",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Toes-to-Bar%20proper%20form%20technique"
  },
  {
    "id": "EX-639",
    "slug": "stability-ball-crunch",
    "name": "Stability-Ball Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Stability Ball",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stability-Ball%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-640",
    "slug": "stability-ball-rollout",
    "name": "Stability-Ball Rollout",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Stability Ball",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Latissimus Dorsi",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stability-Ball%20Rollout%20proper%20form%20technique"
  },
  {
    "id": "EX-641",
    "slug": "stability-ball-stir-the-pot",
    "name": "Stability-Ball Stir-the-Pot",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Stability Ball",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Glutes",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stability-Ball%20Stir-the-Pot%20proper%20form%20technique"
  },
  {
    "id": "EX-642",
    "slug": "stability-ball-knee-tuck",
    "name": "Stability-Ball Knee Tuck",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Stability Ball",
    "primaryMuscles": [
      "Abdominal Wall",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Abdominal Wall",
      "Hip Flexors",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stability-Ball%20Knee%20Tuck%20proper%20form%20technique"
  },
  {
    "id": "EX-643",
    "slug": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout",
    "type": "strength",
    "category": "core",
    "equipment": "Bodyweight / Ab Wheel / Mat",
    "primaryMuscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques",
      "Latissimus Dorsi",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Ab%20Wheel%20Rollout%20proper%20form%20technique"
  },
  {
    "id": "EX-644",
    "slug": "suspension-knee-tuck",
    "name": "Suspension Knee Tuck",
    "type": "strength",
    "category": "core",
    "equipment": "Suspension Trainer",
    "primaryMuscles": [
      "Abdominal Wall",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Abdominal Wall",
      "Hip Flexors",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suspension%20Knee%20Tuck%20proper%20form%20technique"
  },
  {
    "id": "EX-645",
    "slug": "suspension-pike",
    "name": "Suspension Pike",
    "type": "strength",
    "category": "core",
    "equipment": "Suspension Trainer",
    "primaryMuscles": [
      "Abdominal Wall",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Abdominal Wall",
      "Hip Flexors",
      "Shoulder Stabilizers"
    ],
    "met": 3,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suspension%20Pike%20proper%20form%20technique"
  },
  {
    "id": "EX-646",
    "slug": "weighted-floor-crunch",
    "name": "Weighted Floor Crunch",
    "type": "strength",
    "category": "core",
    "equipment": "Weight Plate / Mat",
    "primaryMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Rectus Abdominis",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Weighted%20Floor%20Crunch%20proper%20form%20technique"
  },
  {
    "id": "EX-647",
    "slug": "weighted-russian-twist",
    "name": "Weighted Russian Twist",
    "type": "strength",
    "category": "core",
    "equipment": "Medicine Ball or Dumbbell / Mat",
    "primaryMuscles": [
      "Obliques"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "muscles": [
      "Obliques",
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Weighted%20Russian%20Twist%20proper%20form%20technique"
  },
  {
    "id": "EX-648",
    "slug": "dumbbell-side-bend",
    "name": "Dumbbell Side Bend",
    "type": "strength",
    "category": "core",
    "equipment": "Dumbbell",
    "primaryMuscles": [
      "Obliques",
      "Quadratus Lumborum"
    ],
    "secondaryMuscles": [
      "Spinal Stabilizers"
    ],
    "muscles": [
      "Obliques",
      "Quadratus Lumborum",
      "Spinal Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Side%20Bend%20proper%20form%20technique"
  },
  {
    "id": "EX-649",
    "slug": "resistance-band-pallof-press",
    "name": "Resistance-Band Pallof Press",
    "type": "strength",
    "category": "core",
    "equipment": "Resistance Band / Secure Anchor",
    "primaryMuscles": [
      "Obliques",
      "Transversus Abdominis"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Glutes"
    ],
    "muscles": [
      "Obliques",
      "Transversus Abdominis",
      "Rectus Abdominis",
      "Glutes"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Resistance-Band%20Pallof%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-701",
    "slug": "treadmill-running-walking",
    "name": "Treadmill (Running/Walking)",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Calves",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Calves",
      "Glutes",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20(Running%2FWalking)%20proper%20form%20technique"
  },
  {
    "id": "EX-702",
    "slug": "stair-climber-stairmaster",
    "name": "Stair Climber / StairMaster",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core Stability"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Calves",
      "Hamstrings",
      "Core Stability"
    ],
    "met": 9.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stair%20Climber%20%2F%20StairMaster%20proper%20form%20technique"
  },
  {
    "id": "EX-703",
    "slug": "stationary-bike-upright",
    "name": "Stationary Bike (Upright)",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 6.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Bike%20(Upright)%20proper%20form%20technique"
  },
  {
    "id": "EX-704",
    "slug": "recumbent-bike",
    "name": "Recumbent Bike",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Hamstrings",
      "Glutes",
      "Calves"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Recumbent%20Bike%20proper%20form%20technique"
  },
  {
    "id": "EX-705",
    "slug": "rowing-machine-ergometer",
    "name": "Rowing Machine (Ergometer)",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi",
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "met": 5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Rowing%20Machine%20(Ergometer)%20proper%20form%20technique"
  },
  {
    "id": "EX-706",
    "slug": "elliptical-trainer",
    "name": "Elliptical Trainer",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Calves",
      "Core; Arms and Upper Back with Moving Handles"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Core; Arms and Upper Back with Moving Handles"
    ],
    "met": 5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Elliptical%20Trainer%20proper%20form%20technique"
  },
  {
    "id": "EX-707",
    "slug": "assault-air-bike",
    "name": "Assault / Air Bike",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Upper Back",
      "Triceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids",
      "Pectoralis Major",
      "Upper Back",
      "Triceps",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Assault%20%2F%20Air%20Bike%20proper%20form%20technique"
  },
  {
    "id": "EX-708",
    "slug": "skierg-machine",
    "name": "SkiErg Machine",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Triceps",
      "Core"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Glutes"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Triceps",
      "Core",
      "Rectus Abdominis",
      "Glutes"
    ],
    "met": 10.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20SkiErg%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-709",
    "slug": "jacobs-ladder-machine",
    "name": "Jacobs Ladder Machine",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Cardio Machine",
    "primaryMuscles": [
      "Full Body (Quads",
      "Calves",
      "Core",
      "Shoulders)"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Upper Body"
    ],
    "muscles": [
      "Full Body (Quads",
      "Calves",
      "Core",
      "Shoulders)",
      "Glutes",
      "Upper Body"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Jacobs%20Ladder%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-710",
    "slug": "treadmill-walk-1-2-1-9-mph-1-9-3-1-km-h-flat",
    "name": "Treadmill Walk: 1.2-1.9 mph / 1.9-3.1 km/h, Flat",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 2.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Walk%3A%201.2-1.9%20mph%20%2F%201.9-3.1%20km%2Fh%2C%20Flat%20proper%20form%20technique"
  },
  {
    "id": "EX-711",
    "slug": "treadmill-walk-2-0-2-4-mph-3-2-3-9-km-h-flat",
    "name": "Treadmill Walk: 2.0-2.4 mph / 3.2-3.9 km/h, Flat",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Walk%3A%202.0-2.4%20mph%20%2F%203.2-3.9%20km%2Fh%2C%20Flat%20proper%20form%20technique"
  },
  {
    "id": "EX-712",
    "slug": "treadmill-walk-2-5-2-9-mph-4-0-4-7-km-h-flat",
    "name": "Treadmill Walk: 2.5-2.9 mph / 4.0-4.7 km/h, Flat",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Walk%3A%202.5-2.9%20mph%20%2F%204.0-4.7%20km%2Fh%2C%20Flat%20proper%20form%20technique"
  },
  {
    "id": "EX-713",
    "slug": "treadmill-walk-3-0-3-4-mph-4-8-5-5-km-h-flat",
    "name": "Treadmill Walk: 3.0-3.4 mph / 4.8-5.5 km/h, Flat",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 3.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Walk%3A%203.0-3.4%20mph%20%2F%204.8-5.5%20km%2Fh%2C%20Flat%20proper%20form%20technique"
  },
  {
    "id": "EX-714",
    "slug": "treadmill-walk-3-5-3-9-mph-5-6-6-3-km-h-flat",
    "name": "Treadmill Walk: 3.5-3.9 mph / 5.6-6.3 km/h, Flat",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 4.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Walk%3A%203.5-3.9%20mph%20%2F%205.6-6.3%20km%2Fh%2C%20Flat%20proper%20form%20technique"
  },
  {
    "id": "EX-715",
    "slug": "treadmill-walk-4-0-4-4-mph-6-4-7-1-km-h-flat",
    "name": "Treadmill Walk: 4.0-4.4 mph / 6.4-7.1 km/h, Flat",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 5.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Walk%3A%204.0-4.4%20mph%20%2F%206.4-7.1%20km%2Fh%2C%20Flat%20proper%20form%20technique"
  },
  {
    "id": "EX-716",
    "slug": "incline-treadmill-walking",
    "name": "Incline Treadmill Walking",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Incline%20Treadmill%20Walking%20proper%20form%20technique"
  },
  {
    "id": "EX-717",
    "slug": "level-running-4-0-4-2-mph-6-4-6-8-km-h",
    "name": "Level Running: 4.0-4.2 mph / 6.4-6.8 km/h",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill at 0% Grade or Level Track",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Level%20Running%3A%204.0-4.2%20mph%20%2F%206.4-6.8%20km%2Fh%20proper%20form%20technique"
  },
  {
    "id": "EX-718",
    "slug": "level-running-5-0-5-2-mph-8-0-8-4-km-h",
    "name": "Level Running: 5.0-5.2 mph / 8.0-8.4 km/h",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill at 0% Grade or Level Track",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 8.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Level%20Running%3A%205.0-5.2%20mph%20%2F%208.0-8.4%20km%2Fh%20proper%20form%20technique"
  },
  {
    "id": "EX-719",
    "slug": "level-running-6-0-6-3-mph-9-7-10-1-km-h",
    "name": "Level Running: 6.0-6.3 mph / 9.7-10.1 km/h",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill at 0% Grade or Level Track",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 9.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Level%20Running%3A%206.0-6.3%20mph%20%2F%209.7-10.1%20km%2Fh%20proper%20form%20technique"
  },
  {
    "id": "EX-720",
    "slug": "level-running-7-0-mph-11-3-km-h",
    "name": "Level Running: 7.0 mph / 11.3 km/h",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill at 0% Grade or Level Track",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 11,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Level%20Running%3A%207.0%20mph%20%2F%2011.3%20km%2Fh%20proper%20form%20technique"
  },
  {
    "id": "EX-721",
    "slug": "level-running-8-0-mph-12-9-km-h",
    "name": "Level Running: 8.0 mph / 12.9 km/h",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill at 0% Grade or Level Track",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 12,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Level%20Running%3A%208.0%20mph%20%2F%2012.9%20km%2Fh%20proper%20form%20technique"
  },
  {
    "id": "EX-722",
    "slug": "treadmill-walk-run-intervals",
    "name": "Treadmill Walk-Run Intervals",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Walk-Run%20Intervals%20proper%20form%20technique"
  },
  {
    "id": "EX-723",
    "slug": "treadmill-running-intervals-sprints",
    "name": "Treadmill Running Intervals / Sprints",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treadmill%20Running%20Intervals%20%2F%20Sprints%20proper%20form%20technique"
  },
  {
    "id": "EX-724",
    "slug": "curved-manual-treadmill-walking",
    "name": "Curved Manual Treadmill Walking",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Curved Manual Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Curved%20Manual%20Treadmill%20Walking%20proper%20form%20technique"
  },
  {
    "id": "EX-725",
    "slug": "curved-manual-treadmill-running",
    "name": "Curved Manual Treadmill Running",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Curved Manual Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Curved%20Manual%20Treadmill%20Running%20proper%20form%20technique"
  },
  {
    "id": "EX-726",
    "slug": "indoor-track-walking-self-selected-pace",
    "name": "Indoor Track Walking: Self-Selected Pace",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Indoor Track",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 4,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Indoor%20Track%20Walking%3A%20Self-Selected%20Pace%20proper%20form%20technique"
  },
  {
    "id": "EX-727",
    "slug": "jogging-self-selected-pace",
    "name": "Jogging: Self-Selected Pace",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Indoor Track or Treadmill",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 7.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Jogging%3A%20Self-Selected%20Pace%20proper%20form%20technique"
  },
  {
    "id": "EX-728",
    "slug": "stair-walking-slow-pace",
    "name": "Stair Walking: Slow Pace",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Staircase",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 4.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stair%20Walking%3A%20Slow%20Pace%20proper%20form%20technique"
  },
  {
    "id": "EX-729",
    "slug": "shuttle-runs-forward-backward-and-lateral",
    "name": "Shuttle Runs: Forward, Backward and Lateral",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Open Floor / Cones",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hip Abductors",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hip Abductors",
      "Adductors",
      "Core"
    ],
    "met": 11,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Shuttle%20Runs%3A%20Forward%2C%20Backward%20and%20Lateral%20proper%20form%20technique"
  },
  {
    "id": "EX-730",
    "slug": "stationary-cycling-25-30-watts",
    "name": "Stationary Cycling: 25-30 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 3.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%2025-30%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-731",
    "slug": "stationary-cycling-50-watts",
    "name": "Stationary Cycling: 50 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 4,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%2050%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-732",
    "slug": "stationary-cycling-60-watts",
    "name": "Stationary Cycling: 60 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%2060%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-733",
    "slug": "stationary-cycling-70-80-watts",
    "name": "Stationary Cycling: 70-80 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 5.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%2070-80%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-734",
    "slug": "stationary-cycling-90-100-watts",
    "name": "Stationary Cycling: 90-100 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%2090-100%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-735",
    "slug": "stationary-cycling-101-125-watts",
    "name": "Stationary Cycling: 101-125 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 6.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%20101-125%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-736",
    "slug": "stationary-cycling-126-150-watts",
    "name": "Stationary Cycling: 126-150 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%20126-150%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-737",
    "slug": "stationary-cycling-151-199-watts",
    "name": "Stationary Cycling: 151-199 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 10.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%20151-199%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-738",
    "slug": "stationary-cycling-200-229-watts",
    "name": "Stationary Cycling: 200-229 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Cycle Ergometer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Hip Flexors"
    ],
    "met": 10.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Cycling%3A%20200-229%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-739",
    "slug": "spin-indoor-cycling-class",
    "name": "Spin / Indoor Cycling Class",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Indoor Cycling Bike",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "met": 9,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Spin%20%2F%20Indoor%20Cycling%20Class%20proper%20form%20technique"
  },
  {
    "id": "EX-740",
    "slug": "stationary-bike-intervals",
    "name": "Stationary Bike Intervals",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Stationary Bike",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Calves"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Stationary%20Bike%20Intervals%20proper%20form%20technique"
  },
  {
    "id": "EX-741",
    "slug": "rowing-ergometer-100-149-watts",
    "name": "Rowing Ergometer: 100-149 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Rowing Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi",
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "met": 7.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Rowing%20Ergometer%3A%20100-149%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-742",
    "slug": "rowing-ergometer-150-199-watts",
    "name": "Rowing Ergometer: 150-199 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Rowing Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi",
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "met": 11,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Rowing%20Ergometer%3A%20150-199%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-743",
    "slug": "rowing-ergometer-200-or-more-watts",
    "name": "Rowing Ergometer: 200 or More Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Rowing Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi",
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "met": 14,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Rowing%20Ergometer%3A%20200%20or%20More%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-744",
    "slug": "rowing-ergometer-intervals",
    "name": "Rowing Ergometer Intervals",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Rowing Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi",
      "Hamstrings",
      "Upper Back",
      "Biceps",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Rowing%20Ergometer%20Intervals%20proper%20form%20technique"
  },
  {
    "id": "EX-745",
    "slug": "elliptical-trainer-vigorous-effort",
    "name": "Elliptical Trainer: Vigorous Effort",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Elliptical Trainer",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core; Arms with Moving Handles"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Core; Arms with Moving Handles"
    ],
    "met": 9,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Elliptical%20Trainer%3A%20Vigorous%20Effort%20proper%20form%20technique"
  },
  {
    "id": "EX-746",
    "slug": "pedal-stepper-step-machine",
    "name": "Pedal Stepper / Step Machine",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Pedal Stepper",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Pedal%20Stepper%20%2F%20Step%20Machine%20proper%20form%20technique"
  },
  {
    "id": "EX-747",
    "slug": "arc-trainer-adaptive-motion-trainer",
    "name": "Arc Trainer / Adaptive Motion Trainer",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Specialty Cardio Machine",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Hip Stabilizers",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Arc%20Trainer%20%2F%20Adaptive%20Motion%20Trainer%20proper%20form%20technique"
  },
  {
    "id": "EX-748",
    "slug": "vertical-climber-versaclimber",
    "name": "Vertical Climber / VersaClimber",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Vertical Climber",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Calves",
      "Deltoids",
      "Biceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Latissimus Dorsi",
      "Calves",
      "Deltoids",
      "Biceps",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Vertical%20Climber%20%2F%20VersaClimber%20proper%20form%20technique"
  },
  {
    "id": "EX-749",
    "slug": "arm-ergometer-hand-bike-15-watts",
    "name": "Arm Ergometer / Hand Bike: 15 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Arm Ergometer",
    "primaryMuscles": [
      "Deltoids",
      "Pectoralis Major",
      "Upper Back"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Triceps",
      "Forearms"
    ],
    "muscles": [
      "Deltoids",
      "Pectoralis Major",
      "Upper Back",
      "Biceps",
      "Triceps",
      "Forearms"
    ],
    "met": 2,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Arm%20Ergometer%20%2F%20Hand%20Bike%3A%2015%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-750",
    "slug": "arm-ergometer-hand-bike-25-30-watts",
    "name": "Arm Ergometer / Hand Bike: 25-30 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Arm Ergometer",
    "primaryMuscles": [
      "Deltoids",
      "Pectoralis Major",
      "Upper Back"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Triceps",
      "Forearms"
    ],
    "muscles": [
      "Deltoids",
      "Pectoralis Major",
      "Upper Back",
      "Biceps",
      "Triceps",
      "Forearms"
    ],
    "met": 2.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Arm%20Ergometer%20%2F%20Hand%20Bike%3A%2025-30%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-751",
    "slug": "arm-ergometer-hand-bike-45-watts",
    "name": "Arm Ergometer / Hand Bike: 45 Watts",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Arm Ergometer",
    "primaryMuscles": [
      "Deltoids",
      "Pectoralis Major",
      "Upper Back"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Triceps",
      "Forearms"
    ],
    "muscles": [
      "Deltoids",
      "Pectoralis Major",
      "Upper Back",
      "Biceps",
      "Triceps",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Arm%20Ergometer%20%2F%20Hand%20Bike%3A%2045%20Watts%20proper%20form%20technique"
  },
  {
    "id": "EX-752",
    "slug": "jump-rope-slow-under-100-skips-minute",
    "name": "Jump Rope (Slow: Under 100 Skips/Minute)",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Jump Rope",
    "primaryMuscles": [
      "Calves",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Forearms",
      "Deltoids",
      "Core"
    ],
    "muscles": [
      "Calves",
      "Quadriceps",
      "Glutes",
      "Forearms",
      "Deltoids",
      "Core"
    ],
    "met": 8.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Jump%20Rope%20(Slow%3A%20Under%20100%20Skips%2FMinute)%20proper%20form%20technique"
  },
  {
    "id": "EX-753",
    "slug": "jump-rope-moderate-100-120-skips-minute",
    "name": "Jump Rope (Moderate: 100-120 Skips/Minute)",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Jump Rope",
    "primaryMuscles": [
      "Calves",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Forearms",
      "Deltoids",
      "Core"
    ],
    "muscles": [
      "Calves",
      "Quadriceps",
      "Glutes",
      "Forearms",
      "Deltoids",
      "Core"
    ],
    "met": 11.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Jump%20Rope%20(Moderate%3A%20100-120%20Skips%2FMinute)%20proper%20form%20technique"
  },
  {
    "id": "EX-754",
    "slug": "jump-rope-fast-120-160-skips-minute",
    "name": "Jump Rope (Fast: 120-160 Skips/Minute)",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Jump Rope",
    "primaryMuscles": [
      "Calves",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Forearms",
      "Deltoids",
      "Core"
    ],
    "muscles": [
      "Calves",
      "Quadriceps",
      "Glutes",
      "Forearms",
      "Deltoids",
      "Core"
    ],
    "met": 12.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Jump%20Rope%20(Fast%3A%20120-160%20Skips%2FMinute)%20proper%20form%20technique"
  },
  {
    "id": "EX-755",
    "slug": "jumping-jacks",
    "name": "Jumping Jacks",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Calves",
      "Hip Abductors",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Core"
    ],
    "muscles": [
      "Calves",
      "Hip Abductors",
      "Deltoids",
      "Quadriceps",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Jumping%20Jacks%20proper%20form%20technique"
  },
  {
    "id": "EX-756",
    "slug": "low-impact-step-jacks",
    "name": "Low-Impact Step Jacks",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Hip Abductors",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Calves",
      "Quadriceps",
      "Core"
    ],
    "muscles": [
      "Hip Abductors",
      "Deltoids",
      "Calves",
      "Quadriceps",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Low-Impact%20Step%20Jacks%20proper%20form%20technique"
  },
  {
    "id": "EX-757",
    "slug": "high-knees-running-in-place",
    "name": "High Knees / Running in Place",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Hip Flexors",
      "Quadriceps",
      "Calves"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "muscles": [
      "Hip Flexors",
      "Quadriceps",
      "Calves",
      "Glutes",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20High%20Knees%20%2F%20Running%20in%20Place%20proper%20form%20technique"
  },
  {
    "id": "EX-758",
    "slug": "mountain-climbers",
    "name": "Mountain Climbers",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Flexors",
      "Abdominal Wall"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Triceps",
      "Quadriceps"
    ],
    "muscles": [
      "Hip Flexors",
      "Abdominal Wall",
      "Deltoids",
      "Triceps",
      "Quadriceps"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Mountain%20Climbers%20proper%20form%20technique"
  },
  {
    "id": "EX-759",
    "slug": "standing-march-with-arm-swings",
    "name": "Standing March with Arm Swings",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Hip Flexors",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Calves",
      "Deltoids",
      "Core"
    ],
    "muscles": [
      "Hip Flexors",
      "Quadriceps",
      "Calves",
      "Deltoids",
      "Core"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20March%20with%20Arm%20Swings%20proper%20form%20technique"
  },
  {
    "id": "EX-760",
    "slug": "shadow-boxing",
    "name": "Shadow Boxing",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Deltoids",
      "Pectoralis Major",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Calves",
      "Glutes"
    ],
    "muscles": [
      "Deltoids",
      "Pectoralis Major",
      "Triceps",
      "Obliques",
      "Calves",
      "Glutes"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Shadow%20Boxing%20proper%20form%20technique"
  },
  {
    "id": "EX-761",
    "slug": "heavy-bag-boxing",
    "name": "Heavy Bag Boxing",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Punching Bag / Boxing Gloves",
    "primaryMuscles": [
      "Deltoids",
      "Pectoralis Major",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Glutes",
      "Calves"
    ],
    "muscles": [
      "Deltoids",
      "Pectoralis Major",
      "Triceps",
      "Obliques",
      "Glutes",
      "Calves"
    ],
    "met": 5.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Heavy%20Bag%20Boxing%20proper%20form%20technique"
  },
  {
    "id": "EX-762",
    "slug": "battle-ropes-alternating-waves",
    "name": "Battle Ropes: Alternating Waves",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Battle Ropes / Secure Anchor",
    "primaryMuscles": [
      "Deltoids",
      "Forearms"
    ],
    "secondaryMuscles": [
      "Core",
      "Quadriceps",
      "Glutes"
    ],
    "muscles": [
      "Deltoids",
      "Forearms",
      "Core",
      "Quadriceps",
      "Glutes"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Battle%20Ropes%3A%20Alternating%20Waves%20proper%20form%20technique"
  },
  {
    "id": "EX-763",
    "slug": "battle-ropes-double-arm-waves-slams",
    "name": "Battle Ropes: Double-Arm Waves / Slams",
    "type": "cardio",
    "category": "cardio",
    "equipment": "Battle Ropes / Secure Anchor",
    "primaryMuscles": [
      "Deltoids",
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Core",
      "Glutes",
      "Forearms"
    ],
    "muscles": [
      "Deltoids",
      "Latissimus Dorsi",
      "Core",
      "Glutes",
      "Forearms"
    ],
    "met": 6,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Battle%20Ropes%3A%20Double-Arm%20Waves%20%2F%20Slams%20proper%20form%20technique"
  },
  {
    "id": "EX-801",
    "slug": "farmer-s-carry",
    "name": "Farmer's Carry",
    "type": "strength",
    "category": "full-body",
    "equipment": "Dumbbells or Kettlebells",
    "primaryMuscles": [
      "Forearm Grip",
      "Trapezius",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Forearm Grip",
      "Trapezius",
      "Glutes",
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Farmer's%20Carry%20proper%20form%20technique"
  },
  {
    "id": "EX-802",
    "slug": "suitcase-carry",
    "name": "Suitcase Carry",
    "type": "strength",
    "category": "full-body",
    "equipment": "Single Dumbbell or Kettlebell",
    "primaryMuscles": [
      "Obliques",
      "Quadratus Lumborum",
      "Forearm Grip"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Trapezius",
      "Leg Muscles"
    ],
    "muscles": [
      "Obliques",
      "Quadratus Lumborum",
      "Forearm Grip",
      "Glutes",
      "Trapezius",
      "Leg Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Suitcase%20Carry%20proper%20form%20technique"
  },
  {
    "id": "EX-803",
    "slug": "front-rack-carry",
    "name": "Front-Rack Carry",
    "type": "strength",
    "category": "full-body",
    "equipment": "Dumbbells or Kettlebells",
    "primaryMuscles": [
      "Abdominal Wall",
      "Upper Back"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Glutes",
      "Leg Muscles"
    ],
    "muscles": [
      "Abdominal Wall",
      "Upper Back",
      "Deltoids",
      "Glutes",
      "Leg Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Front-Rack%20Carry%20proper%20form%20technique"
  },
  {
    "id": "EX-804",
    "slug": "overhead-carry",
    "name": "Overhead Carry",
    "type": "strength",
    "category": "full-body",
    "equipment": "Dumbbells or Kettlebells",
    "primaryMuscles": [
      "Deltoids",
      "Trapezius",
      "Serratus Anterior"
    ],
    "secondaryMuscles": [
      "Abdominal Wall",
      "Glutes",
      "Leg Muscles"
    ],
    "muscles": [
      "Deltoids",
      "Trapezius",
      "Serratus Anterior",
      "Abdominal Wall",
      "Glutes",
      "Leg Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Overhead%20Carry%20proper%20form%20technique"
  },
  {
    "id": "EX-805",
    "slug": "trap-bar-carry",
    "name": "Trap-Bar Carry",
    "type": "strength",
    "category": "full-body",
    "equipment": "Trap Bar",
    "primaryMuscles": [
      "Forearm Grip",
      "Trapezius",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Forearm Grip",
      "Trapezius",
      "Glutes",
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Trap-Bar%20Carry%20proper%20form%20technique"
  },
  {
    "id": "EX-806",
    "slug": "sandbag-bear-hug-carry",
    "name": "Sandbag Bear-Hug Carry",
    "type": "strength",
    "category": "full-body",
    "equipment": "Sandbag",
    "primaryMuscles": [
      "Abdominal Wall",
      "Upper Back",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Quadriceps",
      "Calves"
    ],
    "muscles": [
      "Abdominal Wall",
      "Upper Back",
      "Glutes",
      "Biceps",
      "Quadriceps",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Sandbag%20Bear-Hug%20Carry%20proper%20form%20technique"
  },
  {
    "id": "EX-807",
    "slug": "kettlebell-deadlift",
    "name": "Kettlebell Deadlift",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebell",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kettlebell%20Deadlift%20proper%20form%20technique"
  },
  {
    "id": "EX-808",
    "slug": "kettlebell-goblet-squat",
    "name": "Kettlebell Goblet Squat",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebell",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kettlebell%20Goblet%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-809",
    "slug": "kettlebell-front-rack-squat",
    "name": "Kettlebell Front-Rack Squat",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebells",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Upper Back",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Upper Back",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kettlebell%20Front-Rack%20Squat%20proper%20form%20technique"
  },
  {
    "id": "EX-810",
    "slug": "kettlebell-turkish-get-up",
    "name": "Kettlebell Turkish Get-Up",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebell",
    "primaryMuscles": [
      "Shoulder Stabilizers",
      "Abdominal Wall",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Triceps",
      "Upper Back"
    ],
    "muscles": [
      "Shoulder Stabilizers",
      "Abdominal Wall",
      "Glutes",
      "Quadriceps",
      "Triceps",
      "Upper Back"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kettlebell%20Turkish%20Get-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-811",
    "slug": "dumbbell-renegade-row",
    "name": "Dumbbell Renegade Row",
    "type": "strength",
    "category": "full-body",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Abdominal Wall"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Deltoids",
      "Glutes"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Abdominal Wall",
      "Biceps",
      "Rear Deltoids",
      "Glutes"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Renegade%20Row%20proper%20form%20technique"
  },
  {
    "id": "EX-812",
    "slug": "two-hand-kettlebell-swing",
    "name": "Two-Hand Kettlebell Swing",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebell",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Two-Hand%20Kettlebell%20Swing%20proper%20form%20technique"
  },
  {
    "id": "EX-813",
    "slug": "single-arm-kettlebell-swing",
    "name": "Single-Arm Kettlebell Swing",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebell",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Erector Spinae",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Arm%20Kettlebell%20Swing%20proper%20form%20technique"
  },
  {
    "id": "EX-814",
    "slug": "kettlebell-clean",
    "name": "Kettlebell Clean",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebell",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Deltoids",
      "Quadriceps",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kettlebell%20Clean%20proper%20form%20technique"
  },
  {
    "id": "EX-815",
    "slug": "kettlebell-snatch",
    "name": "Kettlebell Snatch",
    "type": "strength",
    "category": "full-body",
    "equipment": "Kettlebell",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Deltoids",
      "Quadriceps",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Kettlebell%20Snatch%20proper%20form%20technique"
  },
  {
    "id": "EX-816",
    "slug": "dumbbell-snatch",
    "name": "Dumbbell Snatch",
    "type": "strength",
    "category": "full-body",
    "equipment": "Dumbbell",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Deltoids",
      "Quadriceps",
      "Trapezius",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Snatch%20proper%20form%20technique"
  },
  {
    "id": "EX-817",
    "slug": "dumbbell-clean-and-press",
    "name": "Dumbbell Clean and Press",
    "type": "strength",
    "category": "full-body",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Triceps",
      "Trapezius",
      "Core"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Deltoids",
      "Hamstrings",
      "Triceps",
      "Trapezius",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Clean%20and%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-818",
    "slug": "dumbbell-thruster",
    "name": "Dumbbell Thruster",
    "type": "strength",
    "category": "full-body",
    "equipment": "Dumbbells",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Abdominal Wall"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids",
      "Triceps",
      "Abdominal Wall"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dumbbell%20Thruster%20proper%20form%20technique"
  },
  {
    "id": "EX-819",
    "slug": "barbell-thruster",
    "name": "Barbell Thruster",
    "type": "strength",
    "category": "full-body",
    "equipment": "Barbell",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Abdominal Wall"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids",
      "Triceps",
      "Abdominal Wall"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Thruster%20proper%20form%20technique"
  },
  {
    "id": "EX-820",
    "slug": "barbell-push-press",
    "name": "Barbell Push Press",
    "type": "strength",
    "category": "full-body",
    "equipment": "Barbell / Rack",
    "primaryMuscles": [
      "Deltoids",
      "Triceps",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Trapezius",
      "Core"
    ],
    "muscles": [
      "Deltoids",
      "Triceps",
      "Quadriceps",
      "Glutes",
      "Trapezius",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Push%20Press%20proper%20form%20technique"
  },
  {
    "id": "EX-821",
    "slug": "barbell-power-clean",
    "name": "Barbell Power Clean",
    "type": "strength",
    "category": "full-body",
    "equipment": "Barbell / Lifting Platform",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
      "Trapezius"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
      "Trapezius",
      "Deltoids",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Power%20Clean%20proper%20form%20technique"
  },
  {
    "id": "EX-822",
    "slug": "barbell-hang-power-clean",
    "name": "Barbell Hang Power Clean",
    "type": "strength",
    "category": "full-body",
    "equipment": "Barbell / Lifting Platform",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
      "Trapezius"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
      "Trapezius",
      "Deltoids",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Hang%20Power%20Clean%20proper%20form%20technique"
  },
  {
    "id": "EX-823",
    "slug": "barbell-power-snatch",
    "name": "Barbell Power Snatch",
    "type": "strength",
    "category": "full-body",
    "equipment": "Barbell / Lifting Platform",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
      "Trapezius"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Core",
      "Forearms"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
      "Trapezius",
      "Deltoids",
      "Core",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Power%20Snatch%20proper%20form%20technique"
  },
  {
    "id": "EX-824",
    "slug": "barbell-clean-and-jerk",
    "name": "Barbell Clean and Jerk",
    "type": "strength",
    "category": "full-body",
    "equipment": "Barbell / Lifting Platform",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Deltoids",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Trapezius",
      "Core"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Deltoids",
      "Triceps",
      "Hamstrings",
      "Trapezius",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": true,
    "barWeightKg": 20,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Barbell%20Clean%20and%20Jerk%20proper%20form%20technique"
  },
  {
    "id": "EX-825",
    "slug": "sled-push",
    "name": "Sled Push",
    "type": "strength",
    "category": "full-body",
    "equipment": "Sled / Turf",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Core",
      "Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Core",
      "Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Sled%20Push%20proper%20form%20technique"
  },
  {
    "id": "EX-826",
    "slug": "backward-sled-drag",
    "name": "Backward Sled Drag",
    "type": "strength",
    "category": "full-body",
    "equipment": "Sled / Turf",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Backward%20Sled%20Drag%20proper%20form%20technique"
  },
  {
    "id": "EX-827",
    "slug": "forward-sled-drag-with-harness",
    "name": "Forward Sled Drag with Harness",
    "type": "strength",
    "category": "full-body",
    "equipment": "Sled / Harness / Turf",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Calves"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Core"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Calves",
      "Quadriceps",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Forward%20Sled%20Drag%20with%20Harness%20proper%20form%20technique"
  },
  {
    "id": "EX-828",
    "slug": "sled-rope-pull",
    "name": "Sled Rope Pull",
    "type": "strength",
    "category": "full-body",
    "equipment": "Sled / Rope / Turf",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Upper Back",
      "Biceps"
    ],
    "secondaryMuscles": [
      "Core",
      "Glutes",
      "Forearms"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Upper Back",
      "Biceps",
      "Core",
      "Glutes",
      "Forearms"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Sled%20Rope%20Pull%20proper%20form%20technique"
  },
  {
    "id": "EX-829",
    "slug": "medicine-ball-overhead-slam",
    "name": "Medicine-Ball Overhead Slam",
    "type": "strength",
    "category": "full-body",
    "equipment": "Slam Ball / Suitable Floor",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Abdominal Wall"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Deltoids",
      "Glutes",
      "Quadriceps"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Abdominal Wall",
      "Triceps",
      "Deltoids",
      "Glutes",
      "Quadriceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Medicine-Ball%20Overhead%20Slam%20proper%20form%20technique"
  },
  {
    "id": "EX-830",
    "slug": "medicine-ball-rotational-throw",
    "name": "Medicine-Ball Rotational Throw",
    "type": "strength",
    "category": "full-body",
    "equipment": "Medicine Ball / Approved Wall",
    "primaryMuscles": [
      "Obliques",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Obliques",
      "Glutes",
      "Pectoralis Major",
      "Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Medicine-Ball%20Rotational%20Throw%20proper%20form%20technique"
  },
  {
    "id": "EX-831",
    "slug": "medicine-ball-chest-pass",
    "name": "Medicine-Ball Chest Pass",
    "type": "strength",
    "category": "full-body",
    "equipment": "Medicine Ball / Approved Wall",
    "primaryMuscles": [
      "Pectoralis Major",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Triceps",
      "Anterior Deltoids",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Medicine-Ball%20Chest%20Pass%20proper%20form%20technique"
  },
  {
    "id": "EX-832",
    "slug": "wall-ball-squat-throw",
    "name": "Wall Ball Squat Throw",
    "type": "strength",
    "category": "full-body",
    "equipment": "Wall Ball / Approved Target",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids",
      "Triceps",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wall%20Ball%20Squat%20Throw%20proper%20form%20technique"
  },
  {
    "id": "EX-833",
    "slug": "squat-jump",
    "name": "Squat Jump",
    "type": "strength",
    "category": "full-body",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Squat%20Jump%20proper%20form%20technique"
  },
  {
    "id": "EX-834",
    "slug": "box-jump",
    "name": "Box Jump",
    "type": "strength",
    "category": "full-body",
    "equipment": "Bodyweight / Stable Plyometric Box",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Box%20Jump%20proper%20form%20technique"
  },
  {
    "id": "EX-835",
    "slug": "lateral-skater-hop",
    "name": "Lateral Skater Hop",
    "type": "strength",
    "category": "full-body",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Glutes",
      "Quadriceps",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hip Abductors",
      "Adductors",
      "Core"
    ],
    "muscles": [
      "Glutes",
      "Quadriceps",
      "Calves",
      "Hip Abductors",
      "Adductors",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Lateral%20Skater%20Hop%20proper%20form%20technique"
  },
  {
    "id": "EX-836",
    "slug": "broad-jump",
    "name": "Broad Jump",
    "type": "strength",
    "category": "full-body",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Broad%20Jump%20proper%20form%20technique"
  },
  {
    "id": "EX-837",
    "slug": "burpee",
    "name": "Burpee",
    "type": "strength",
    "category": "full-body",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Deltoids",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Pectoralis Major",
      "Triceps",
      "Deltoids",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Burpee%20proper%20form%20technique"
  },
  {
    "id": "EX-838",
    "slug": "step-back-burpee-no-jump",
    "name": "Step-Back Burpee (No Jump)",
    "type": "strength",
    "category": "full-body",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Abdominal Wall"
    ],
    "secondaryMuscles": [
      "Pectoralis Major",
      "Deltoids",
      "Triceps"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Abdominal Wall",
      "Pectoralis Major",
      "Deltoids",
      "Triceps"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Step-Back%20Burpee%20(No%20Jump)%20proper%20form%20technique"
  },
  {
    "id": "EX-839",
    "slug": "bear-crawl",
    "name": "Bear Crawl",
    "type": "strength",
    "category": "full-body",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Deltoids",
      "Abdominal Wall",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Glutes",
      "Hip Flexors"
    ],
    "muscles": [
      "Deltoids",
      "Abdominal Wall",
      "Quadriceps",
      "Triceps",
      "Glutes",
      "Hip Flexors"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bear%20Crawl%20proper%20form%20technique"
  },
  {
    "id": "EX-901",
    "slug": "arm-circles",
    "name": "Arm Circles",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Shoulder Muscles and Joint"
    ],
    "secondaryMuscles": [
      "Upper Back"
    ],
    "muscles": [
      "Shoulder Muscles and Joint",
      "Upper Back"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Arm%20Circles%20proper%20form%20technique"
  },
  {
    "id": "EX-902",
    "slug": "arm-swings-chest-openers",
    "name": "Arm Swings / Chest Openers",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Pectoralis Major",
      "Shoulder Muscles"
    ],
    "secondaryMuscles": [
      "Upper Back"
    ],
    "muscles": [
      "Pectoralis Major",
      "Shoulder Muscles",
      "Upper Back"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Arm%20Swings%20%2F%20Chest%20Openers%20proper%20form%20technique"
  },
  {
    "id": "EX-903",
    "slug": "shoulder-controlled-articular-rotations",
    "name": "Shoulder Controlled Articular Rotations",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Shoulder Joint and Rotator Cuff"
    ],
    "secondaryMuscles": [
      "Scapular Stabilizers"
    ],
    "muscles": [
      "Shoulder Joint and Rotator Cuff",
      "Scapular Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Shoulder%20Controlled%20Articular%20Rotations%20proper%20form%20technique"
  },
  {
    "id": "EX-904",
    "slug": "scapular-wall-slides",
    "name": "Scapular Wall Slides",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Wall",
    "primaryMuscles": [
      "Serratus Anterior",
      "Trapezius"
    ],
    "secondaryMuscles": [
      "Rotator Cuff"
    ],
    "muscles": [
      "Serratus Anterior",
      "Trapezius",
      "Rotator Cuff"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Scapular%20Wall%20Slides%20proper%20form%20technique"
  },
  {
    "id": "EX-905",
    "slug": "scapular-push-up",
    "name": "Scapular Push-Up",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Floor",
    "primaryMuscles": [
      "Serratus Anterior"
    ],
    "secondaryMuscles": [
      "Abdominal Wall",
      "Shoulder Stabilizers"
    ],
    "muscles": [
      "Serratus Anterior",
      "Abdominal Wall",
      "Shoulder Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Scapular%20Push-Up%20proper%20form%20technique"
  },
  {
    "id": "EX-906",
    "slug": "thoracic-open-book",
    "name": "Thoracic Open Book",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Thoracic Spine",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Shoulder Muscles"
    ],
    "muscles": [
      "Thoracic Spine",
      "Pectoralis Major",
      "Obliques",
      "Shoulder Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Thoracic%20Open%20Book%20proper%20form%20technique"
  },
  {
    "id": "EX-907",
    "slug": "quadruped-thoracic-rotation",
    "name": "Quadruped Thoracic Rotation",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Thoracic Spine",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Scapular Stabilizers"
    ],
    "muscles": [
      "Thoracic Spine",
      "Obliques",
      "Scapular Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Quadruped%20Thoracic%20Rotation%20proper%20form%20technique"
  },
  {
    "id": "EX-908",
    "slug": "cat-cow",
    "name": "Cat-Cow",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Spinal Mobility"
    ],
    "secondaryMuscles": [
      "Abdominal Wall",
      "Spinal Extensors"
    ],
    "muscles": [
      "Spinal Mobility",
      "Abdominal Wall",
      "Spinal Extensors"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cat-Cow%20proper%20form%20technique"
  },
  {
    "id": "EX-909",
    "slug": "thread-the-needle",
    "name": "Thread-the-Needle",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Thoracic Spine",
      "Posterior Shoulder"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "muscles": [
      "Thoracic Spine",
      "Posterior Shoulder",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Thread-the-Needle%20proper%20form%20technique"
  },
  {
    "id": "EX-910",
    "slug": "dowel-shoulder-pass-through",
    "name": "Dowel Shoulder Pass-Through",
    "type": "strength",
    "category": "arms",
    "equipment": "Dowel or Very Light Band",
    "primaryMuscles": [
      "Shoulder Joint",
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Latissimus Dorsi"
    ],
    "muscles": [
      "Shoulder Joint",
      "Pectoralis Major",
      "Latissimus Dorsi"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Dowel%20Shoulder%20Pass-Through%20proper%20form%20technique"
  },
  {
    "id": "EX-911",
    "slug": "wrist-circles",
    "name": "Wrist Circles",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Wrist Flexors and Extensors"
    ],
    "secondaryMuscles": [
      "Forearm Rotators"
    ],
    "muscles": [
      "Wrist Flexors and Extensors",
      "Forearm Rotators"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wrist%20Circles%20proper%20form%20technique"
  },
  {
    "id": "EX-912",
    "slug": "quadruped-wrist-rocks",
    "name": "Quadruped Wrist Rocks",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Wrist Flexors and Extensors"
    ],
    "secondaryMuscles": [
      "Finger Flexors"
    ],
    "muscles": [
      "Wrist Flexors and Extensors",
      "Finger Flexors"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Quadruped%20Wrist%20Rocks%20proper%20form%20technique"
  },
  {
    "id": "EX-913",
    "slug": "forward-and-backward-leg-swings",
    "name": "Forward-and-Backward Leg Swings",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Hip Flexors",
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Core",
      "Hip Stabilizers"
    ],
    "muscles": [
      "Hip Flexors",
      "Glutes",
      "Hamstrings",
      "Core",
      "Hip Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Forward-and-Backward%20Leg%20Swings%20proper%20form%20technique"
  },
  {
    "id": "EX-914",
    "slug": "side-to-side-leg-swings",
    "name": "Side-to-Side Leg Swings",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Hip Adductors and Abductors"
    ],
    "secondaryMuscles": [
      "Core",
      "Hip Rotators"
    ],
    "muscles": [
      "Hip Adductors and Abductors",
      "Core",
      "Hip Rotators"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Side-to-Side%20Leg%20Swings%20proper%20form%20technique"
  },
  {
    "id": "EX-915",
    "slug": "hip-circles-hip-controlled-articular-rotations",
    "name": "Hip Circles / Hip Controlled Articular Rotations",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Hip Joint and Hip Rotators"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Adductors"
    ],
    "muscles": [
      "Hip Joint and Hip Rotators",
      "Glutes",
      "Adductors"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hip%20Circles%20%2F%20Hip%20Controlled%20Articular%20Rotations%20proper%20form%20technique"
  },
  {
    "id": "EX-916",
    "slug": "90-90-hip-switches",
    "name": "90/90 Hip Switches",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Internal and External Rotators"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "muscles": [
      "Hip Internal and External Rotators",
      "Glutes",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%2090%2F90%20Hip%20Switches%20proper%20form%20technique"
  },
  {
    "id": "EX-917",
    "slug": "adductor-rock-back",
    "name": "Adductor Rock-Back",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Adductors"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "muscles": [
      "Hip Adductors",
      "Glutes",
      "Hamstrings"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Adductor%20Rock-Back%20proper%20form%20technique"
  },
  {
    "id": "EX-918",
    "slug": "knee-to-wall-ankle-rocks",
    "name": "Knee-to-Wall Ankle Rocks",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Wall",
    "primaryMuscles": [
      "Ankle Joint",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior"
    ],
    "muscles": [
      "Ankle Joint",
      "Soleus",
      "Tibialis Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Knee-to-Wall%20Ankle%20Rocks%20proper%20form%20technique"
  },
  {
    "id": "EX-919",
    "slug": "ankle-circles",
    "name": "Ankle Circles",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Ankle Joint and Surrounding Muscles"
    ],
    "secondaryMuscles": [
      "Foot Stabilizers"
    ],
    "muscles": [
      "Ankle Joint and Surrounding Muscles",
      "Foot Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Ankle%20Circles%20proper%20form%20technique"
  },
  {
    "id": "EX-920",
    "slug": "walking-knee-hugs",
    "name": "Walking Knee Hugs",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Glutes",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Calves",
      "Core"
    ],
    "muscles": [
      "Glutes",
      "Hip Flexors",
      "Calves",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Walking%20Knee%20Hugs%20proper%20form%20technique"
  },
  {
    "id": "EX-921",
    "slug": "walking-quadriceps-pull",
    "name": "Walking Quadriceps Pull",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Hip Flexors",
      "Balance Muscles"
    ],
    "muscles": [
      "Quadriceps",
      "Hip Flexors",
      "Balance Muscles"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Walking%20Quadriceps%20Pull%20proper%20form%20technique"
  },
  {
    "id": "EX-922",
    "slug": "walking-hamstring-sweep",
    "name": "Walking Hamstring Sweep",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Calves",
      "Glutes"
    ],
    "muscles": [
      "Hamstrings",
      "Calves",
      "Glutes"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Walking%20Hamstring%20Sweep%20proper%20form%20technique"
  },
  {
    "id": "EX-923",
    "slug": "walking-lunge-with-rotation",
    "name": "Walking Lunge with Rotation",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Open Floor",
    "primaryMuscles": [
      "Hip Flexors",
      "Glutes",
      "Thoracic Spine"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Obliques"
    ],
    "muscles": [
      "Hip Flexors",
      "Glutes",
      "Thoracic Spine",
      "Quadriceps",
      "Obliques"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Walking%20Lunge%20with%20Rotation%20proper%20form%20technique"
  },
  {
    "id": "EX-924",
    "slug": "world-s-greatest-stretch-dynamic-lunge-rotation",
    "name": "World's Greatest Stretch (Dynamic Lunge Rotation)",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Flexors",
      "Adductors",
      "Thoracic Spine"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Glutes"
    ],
    "muscles": [
      "Hip Flexors",
      "Adductors",
      "Thoracic Spine",
      "Hamstrings",
      "Glutes"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20World's%20Greatest%20Stretch%20(Dynamic%20Lunge%20Rotation)%20proper%20form%20technique"
  },
  {
    "id": "EX-925",
    "slug": "inchworm-walkout",
    "name": "Inchworm Walkout",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hamstrings",
      "Abdominal Wall"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Serratus Anterior"
    ],
    "muscles": [
      "Hamstrings",
      "Abdominal Wall",
      "Deltoids",
      "Serratus Anterior"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Inchworm%20Walkout%20proper%20form%20technique"
  },
  {
    "id": "EX-926",
    "slug": "bodyweight-hip-hinge-drill",
    "name": "Bodyweight Hip-Hinge Drill",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Dowel",
    "primaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Spinal Stabilizers"
    ],
    "muscles": [
      "Glutes",
      "Hamstrings",
      "Spinal Stabilizers"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bodyweight%20Hip-Hinge%20Drill%20proper%20form%20technique"
  },
  {
    "id": "EX-927",
    "slug": "deep-squat-pry",
    "name": "Deep Squat Pry",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Hips",
      "Ankles",
      "Adductors"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "muscles": [
      "Hips",
      "Ankles",
      "Adductors",
      "Glutes",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Deep%20Squat%20Pry%20proper%20form%20technique"
  },
  {
    "id": "EX-928",
    "slug": "standing-hip-airplane-supported",
    "name": "Standing Hip Airplane (Supported)",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Hip Rotators",
      "Gluteus Medius"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "muscles": [
      "Hip Rotators",
      "Gluteus Medius",
      "Hamstrings",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Hip%20Airplane%20(Supported)%20proper%20form%20technique"
  },
  {
    "id": "EX-929",
    "slug": "supported-single-leg-balance",
    "name": "Supported Single-Leg Balance",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Hip Stabilizers",
      "Foot and Ankle Muscles"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Hip Stabilizers",
      "Foot and Ankle Muscles",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Supported%20Single-Leg%20Balance%20proper%20form%20technique"
  },
  {
    "id": "EX-930",
    "slug": "single-leg-balance-with-reach",
    "name": "Single-Leg Balance with Reach",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Hip Stabilizers",
      "Foot and Ankle Muscles"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Hip Stabilizers",
      "Foot and Ankle Muscles",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Single-Leg%20Balance%20with%20Reach%20proper%20form%20technique"
  },
  {
    "id": "EX-931",
    "slug": "heel-to-toe-tandem-walk",
    "name": "Heel-to-Toe Tandem Walk",
    "type": "strength",
    "category": "arms",
    "equipment": "Bodyweight / Clear Floor",
    "primaryMuscles": [
      "Hip Stabilizers",
      "Foot and Ankle Muscles"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "muscles": [
      "Hip Stabilizers",
      "Foot and Ankle Muscles",
      "Core"
    ],
    "met": 3.5,
    "defaultRestSec": 90,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Heel-to-Toe%20Tandem%20Walk%20proper%20form%20technique"
  },
  {
    "id": "EX-1001",
    "slug": "doorway-chest-stretch",
    "name": "Doorway Chest Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Doorway",
    "primaryMuscles": [
      "Pectoralis Major and Minor"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major and Minor",
      "Anterior Deltoids"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Doorway%20Chest%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1002",
    "slug": "bench-chest-stretch",
    "name": "Bench Chest Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Bench",
    "primaryMuscles": [
      "Pectoralis Major and Minor"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "muscles": [
      "Pectoralis Major and Minor",
      "Anterior Deltoids"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bench%20Chest%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1003",
    "slug": "cross-body-shoulder-stretch",
    "name": "Cross-Body Shoulder Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Posterior Deltoid",
      "Posterior Shoulder"
    ],
    "secondaryMuscles": [
      "Upper Back"
    ],
    "muscles": [
      "Posterior Deltoid",
      "Posterior Shoulder",
      "Upper Back"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cross-Body%20Shoulder%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1004",
    "slug": "overhead-triceps-stretch",
    "name": "Overhead Triceps Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Triceps (Long Head)"
    ],
    "secondaryMuscles": [
      "Latissimus Dorsi"
    ],
    "muscles": [
      "Triceps (Long Head)",
      "Latissimus Dorsi"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Overhead%20Triceps%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1005",
    "slug": "bench-lat-stretch",
    "name": "Bench Lat Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Bench",
    "primaryMuscles": [
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Teres Major",
      "Triceps (Long Head)"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Teres Major",
      "Triceps (Long Head)"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bench%20Lat%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1006",
    "slug": "standing-side-reach",
    "name": "Standing Side Reach",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Quadratus Lumborum"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Obliques",
      "Quadratus Lumborum"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Side%20Reach%20proper%20form%20technique"
  },
  {
    "id": "EX-1007",
    "slug": "child-s-pose",
    "name": "Child's Pose",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Spinal Extensors"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Spinal Extensors",
      "Glutes"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Child's%20Pose%20proper%20form%20technique"
  },
  {
    "id": "EX-1008",
    "slug": "child-s-pose-with-side-reach",
    "name": "Child's Pose with Side Reach",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Quadratus Lumborum"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Spinal Extensors"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Quadratus Lumborum",
      "Obliques",
      "Spinal Extensors"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Child's%20Pose%20with%20Side%20Reach%20proper%20form%20technique"
  },
  {
    "id": "EX-1009",
    "slug": "seated-upper-back-reach",
    "name": "Seated Upper-Back Reach",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Posterior Deltoids"
    ],
    "muscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Posterior Deltoids"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Upper-Back%20Reach%20proper%20form%20technique"
  },
  {
    "id": "EX-1010",
    "slug": "gentle-upper-trapezius-stretch",
    "name": "Gentle Upper-Trapezius Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Levator Scapulae"
    ],
    "muscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Gentle%20Upper-Trapezius%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1011",
    "slug": "gentle-levator-scapulae-stretch",
    "name": "Gentle Levator Scapulae Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Upper Trapezius"
    ],
    "muscles": [
      "Levator Scapulae",
      "Upper Trapezius"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Gentle%20Levator%20Scapulae%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1012",
    "slug": "wrist-flexor-stretch",
    "name": "Wrist Flexor Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Wrist and Finger Flexors"
    ],
    "secondaryMuscles": [
      "Forearm Muscles"
    ],
    "muscles": [
      "Wrist and Finger Flexors",
      "Forearm Muscles"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wrist%20Flexor%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1013",
    "slug": "wrist-extensor-stretch",
    "name": "Wrist Extensor Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Wrist and Finger Extensors"
    ],
    "secondaryMuscles": [
      "Forearm Muscles"
    ],
    "muscles": [
      "Wrist and Finger Extensors",
      "Forearm Muscles"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wrist%20Extensor%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1014",
    "slug": "standing-biceps-stretch",
    "name": "Standing Biceps Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Wall",
    "primaryMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Pectoralis Major"
    ],
    "muscles": [
      "Biceps Brachii",
      "Anterior Deltoids",
      "Pectoralis Major"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Biceps%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1015",
    "slug": "half-kneeling-hip-flexor-stretch",
    "name": "Half-Kneeling Hip Flexor Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Quadriceps"
    ],
    "muscles": [
      "Hip Flexors",
      "Quadriceps"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Half-Kneeling%20Hip%20Flexor%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1016",
    "slug": "couch-stretch",
    "name": "Couch Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Padded Support",
    "primaryMuscles": [
      "Rectus Femoris",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Other Quadriceps"
    ],
    "muscles": [
      "Rectus Femoris",
      "Hip Flexors",
      "Other Quadriceps"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Couch%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1017",
    "slug": "standing-quadriceps-stretch",
    "name": "Standing Quadriceps Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Stable Support",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Hip Flexors"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Quadriceps%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1018",
    "slug": "side-lying-quadriceps-stretch",
    "name": "Side-Lying Quadriceps Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "muscles": [
      "Quadriceps",
      "Hip Flexors"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Side-Lying%20Quadriceps%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1019",
    "slug": "supine-hamstring-stretch-with-strap",
    "name": "Supine Hamstring Stretch with Strap",
    "type": "strength",
    "category": "stretching",
    "equipment": "Stretching Strap / Mat",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Calves"
    ],
    "muscles": [
      "Hamstrings",
      "Calves"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Supine%20Hamstring%20Stretch%20with%20Strap%20proper%20form%20technique"
  },
  {
    "id": "EX-1020",
    "slug": "seated-hamstring-stretch",
    "name": "Seated Hamstring Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Bench",
    "primaryMuscles": [
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Calves"
    ],
    "muscles": [
      "Hamstrings",
      "Calves"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Hamstring%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1021",
    "slug": "figure-four-glute-stretch",
    "name": "Figure-Four Glute Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Deep Hip Rotators"
    ],
    "secondaryMuscles": [
      "Gluteus Medius"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Deep Hip Rotators",
      "Gluteus Medius"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Figure-Four%20Glute%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1022",
    "slug": "seated-figure-four-stretch",
    "name": "Seated Figure-Four Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Bench",
    "primaryMuscles": [
      "Gluteus Maximus",
      "Deep Hip Rotators"
    ],
    "secondaryMuscles": [
      "Gluteus Medius"
    ],
    "muscles": [
      "Gluteus Maximus",
      "Deep Hip Rotators",
      "Gluteus Medius"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Seated%20Figure-Four%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1023",
    "slug": "butterfly-adductor-stretch",
    "name": "Butterfly Adductor Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Adductors"
    ],
    "secondaryMuscles": [
      "Hip Rotators"
    ],
    "muscles": [
      "Hip Adductors",
      "Hip Rotators"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Butterfly%20Adductor%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1024",
    "slug": "wide-kneeling-adductor-stretch",
    "name": "Wide-Kneeling Adductor Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Hip Adductors"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "muscles": [
      "Hip Adductors",
      "Glutes"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Wide-Kneeling%20Adductor%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1025",
    "slug": "standing-lateral-lunge-adductor-stretch",
    "name": "Standing Lateral-Lunge Adductor Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight",
    "primaryMuscles": [
      "Hip Adductors"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Glutes"
    ],
    "muscles": [
      "Hip Adductors",
      "Hamstrings",
      "Glutes"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Standing%20Lateral-Lunge%20Adductor%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1026",
    "slug": "straight-knee-wall-calf-stretch",
    "name": "Straight-Knee Wall Calf Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Wall",
    "primaryMuscles": [
      "Gastrocnemius"
    ],
    "secondaryMuscles": [
      "Soleus"
    ],
    "muscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Straight-Knee%20Wall%20Calf%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1027",
    "slug": "bent-knee-wall-calf-stretch",
    "name": "Bent-Knee Wall Calf Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Wall",
    "primaryMuscles": [
      "Soleus"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "muscles": [
      "Soleus",
      "Gastrocnemius"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Bent-Knee%20Wall%20Calf%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1028",
    "slug": "knee-to-chest-stretch",
    "name": "Knee-to-Chest Stretch",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Glutes",
      "Lumbar Extensors"
    ],
    "secondaryMuscles": [
      "Hip Muscles"
    ],
    "muscles": [
      "Glutes",
      "Lumbar Extensors",
      "Hip Muscles"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Knee-to-Chest%20Stretch%20proper%20form%20technique"
  },
  {
    "id": "EX-1029",
    "slug": "gentle-supine-spinal-rotation",
    "name": "Gentle Supine Spinal Rotation",
    "type": "strength",
    "category": "stretching",
    "equipment": "Bodyweight / Mat",
    "primaryMuscles": [
      "Trunk Rotators",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Lumbar and Thoracic Muscles"
    ],
    "muscles": [
      "Trunk Rotators",
      "Glutes",
      "Lumbar and Thoracic Muscles"
    ],
    "met": 2.3,
    "defaultRestSec": 45,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": true,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Gentle%20Supine%20Spinal%20Rotation%20proper%20form%20technique"
  },
  {
    "id": "EX-1101",
    "slug": "freestyle-lap-swimming-easy-recreational",
    "name": "Freestyle Lap Swimming: Easy / Recreational",
    "type": "cardio",
    "category": "classes",
    "equipment": "Swimming Pool",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Pectoralis Major",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Glutes",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Pectoralis Major",
      "Deltoids",
      "Triceps",
      "Glutes",
      "Core"
    ],
    "met": 5.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Freestyle%20Lap%20Swimming%3A%20Easy%20%2F%20Recreational%20proper%20form%20technique"
  },
  {
    "id": "EX-1102",
    "slug": "freestyle-lap-swimming-fast-vigorous",
    "name": "Freestyle Lap Swimming: Fast / Vigorous",
    "type": "cardio",
    "category": "classes",
    "equipment": "Swimming Pool",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Pectoralis Major",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Glutes",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Pectoralis Major",
      "Deltoids",
      "Triceps",
      "Glutes",
      "Core"
    ],
    "met": 9.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Freestyle%20Lap%20Swimming%3A%20Fast%20%2F%20Vigorous%20proper%20form%20technique"
  },
  {
    "id": "EX-1103",
    "slug": "backstroke-recreational",
    "name": "Backstroke: Recreational",
    "type": "cardio",
    "category": "classes",
    "equipment": "Swimming Pool",
    "primaryMuscles": [
      "Latissimus Dorsi",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Glutes",
      "Core"
    ],
    "muscles": [
      "Latissimus Dorsi",
      "Deltoids",
      "Triceps",
      "Glutes",
      "Core"
    ],
    "met": 4.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Backstroke%3A%20Recreational%20proper%20form%20technique"
  },
  {
    "id": "EX-1104",
    "slug": "breaststroke-recreational",
    "name": "Breaststroke: Recreational",
    "type": "cardio",
    "category": "classes",
    "equipment": "Swimming Pool",
    "primaryMuscles": [
      "Pectoralis Major",
      "Latissimus Dorsi",
      "Hip Adductors"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Core"
    ],
    "muscles": [
      "Pectoralis Major",
      "Latissimus Dorsi",
      "Hip Adductors",
      "Quadriceps",
      "Glutes",
      "Core"
    ],
    "met": 5.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Breaststroke%3A%20Recreational%20proper%20form%20technique"
  },
  {
    "id": "EX-1105",
    "slug": "treading-water-moderate-effort",
    "name": "Treading Water: Moderate Effort",
    "type": "cardio",
    "category": "classes",
    "equipment": "Swimming Pool",
    "primaryMuscles": [
      "Hip Adductors",
      "Hip Flexors",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Core",
      "Calves"
    ],
    "muscles": [
      "Hip Adductors",
      "Hip Flexors",
      "Deltoids",
      "Core",
      "Calves"
    ],
    "met": 3.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Treading%20Water%3A%20Moderate%20Effort%20proper%20form%20technique"
  },
  {
    "id": "EX-1106",
    "slug": "water-walking-moderate-pace",
    "name": "Water Walking: Moderate Pace",
    "type": "cardio",
    "category": "classes",
    "equipment": "Swimming Pool",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hip Flexors",
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "met": 4.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": true,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Water%20Walking%3A%20Moderate%20Pace%20proper%20form%20technique"
  },
  {
    "id": "EX-1107",
    "slug": "water-aerobics-aquafit-general",
    "name": "Water Aerobics / Aquafit: General",
    "type": "cardio",
    "category": "classes",
    "equipment": "Swimming Pool",
    "primaryMuscles": [
      "Full Body; Emphasis Varies"
    ],
    "secondaryMuscles": [
      "Core and Limb Stabilizers"
    ],
    "muscles": [
      "Full Body; Emphasis Varies",
      "Core and Limb Stabilizers"
    ],
    "met": 5.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Water%20Aerobics%20%2F%20Aquafit%3A%20General%20proper%20form%20technique"
  },
  {
    "id": "EX-1108",
    "slug": "low-impact-aerobics-class",
    "name": "Low-Impact Aerobics Class",
    "type": "cardio",
    "category": "classes",
    "equipment": "Open Studio / Bodyweight",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hip Abductors",
      "Core",
      "Deltoids"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hip Abductors",
      "Core",
      "Deltoids"
    ],
    "met": 4.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Low-Impact%20Aerobics%20Class%20proper%20form%20technique"
  },
  {
    "id": "EX-1109",
    "slug": "step-aerobics-4-inch-10-cm-step",
    "name": "Step Aerobics: 4-Inch / 10-cm Step",
    "type": "cardio",
    "category": "classes",
    "equipment": "Aerobic Step / Studio",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Hamstrings",
      "Core"
    ],
    "met": 5.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Step%20Aerobics%3A%204-Inch%20%2F%2010-cm%20Step%20proper%20form%20technique"
  },
  {
    "id": "EX-1110",
    "slug": "zumba-dance-fitness-class",
    "name": "Zumba / Dance Fitness Class",
    "type": "cardio",
    "category": "classes",
    "equipment": "Open Studio / Bodyweight",
    "primaryMuscles": [
      "Lower Body; Emphasis Varies"
    ],
    "secondaryMuscles": [
      "Core",
      "Deltoids"
    ],
    "muscles": [
      "Lower Body; Emphasis Varies",
      "Core",
      "Deltoids"
    ],
    "met": 6.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Zumba%20%2F%20Dance%20Fitness%20Class%20proper%20form%20technique"
  },
  {
    "id": "EX-1111",
    "slug": "mat-pilates-traditional",
    "name": "Mat Pilates: Traditional",
    "type": "cardio",
    "category": "classes",
    "equipment": "Mat / Bodyweight",
    "primaryMuscles": [
      "Abdominal Wall",
      "Spinal Stabilizers"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hip Muscles"
    ],
    "muscles": [
      "Abdominal Wall",
      "Spinal Stabilizers",
      "Glutes",
      "Hip Muscles"
    ],
    "met": 1.8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Mat%20Pilates%3A%20Traditional%20proper%20form%20technique"
  },
  {
    "id": "EX-1112",
    "slug": "hatha-yoga-class",
    "name": "Hatha Yoga Class",
    "type": "cardio",
    "category": "classes",
    "equipment": "Mat / Bodyweight",
    "primaryMuscles": [
      "Varies by Pose"
    ],
    "secondaryMuscles": [
      "Core",
      "Hip and Shoulder Stabilizers"
    ],
    "muscles": [
      "Varies by Pose",
      "Core",
      "Hip and Shoulder Stabilizers"
    ],
    "met": 2.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Hatha%20Yoga%20Class%20proper%20form%20technique"
  },
  {
    "id": "EX-1113",
    "slug": "vinyasa-yoga-class",
    "name": "Vinyasa Yoga Class",
    "type": "cardio",
    "category": "classes",
    "equipment": "Mat / Bodyweight",
    "primaryMuscles": [
      "Varies by Pose"
    ],
    "secondaryMuscles": [
      "Core",
      "Hip and Shoulder Stabilizers"
    ],
    "muscles": [
      "Varies by Pose",
      "Core",
      "Hip and Shoulder Stabilizers"
    ],
    "met": 2.7,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Vinyasa%20Yoga%20Class%20proper%20form%20technique"
  },
  {
    "id": "EX-1114",
    "slug": "power-yoga-class",
    "name": "Power Yoga Class",
    "type": "cardio",
    "category": "classes",
    "equipment": "Mat / Bodyweight",
    "primaryMuscles": [
      "Varies by Pose"
    ],
    "secondaryMuscles": [
      "Core",
      "Hip and Shoulder Stabilizers"
    ],
    "muscles": [
      "Varies by Pose",
      "Core",
      "Hip and Shoulder Stabilizers"
    ],
    "met": 4,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Power%20Yoga%20Class%20proper%20form%20technique"
  },
  {
    "id": "EX-1115",
    "slug": "moderate-circuit-training",
    "name": "Moderate Circuit Training",
    "type": "cardio",
    "category": "classes",
    "equipment": "Equipment Varies",
    "primaryMuscles": [
      "Full Body; Depends on Stations"
    ],
    "secondaryMuscles": [
      "Core and Grip"
    ],
    "muscles": [
      "Full Body; Depends on Stations",
      "Core and Grip"
    ],
    "met": 5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Moderate%20Circuit%20Training%20proper%20form%20technique"
  },
  {
    "id": "EX-1116",
    "slug": "vigorous-circuit-with-minimal-rest",
    "name": "Vigorous Circuit with Minimal Rest",
    "type": "cardio",
    "category": "classes",
    "equipment": "Equipment Varies",
    "primaryMuscles": [
      "Full Body; Depends on Stations"
    ],
    "secondaryMuscles": [
      "Core and Grip"
    ],
    "muscles": [
      "Full Body; Depends on Stations",
      "Core and Grip"
    ],
    "met": 7.5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Vigorous%20Circuit%20with%20Minimal%20Rest%20proper%20form%20technique"
  },
  {
    "id": "EX-1117",
    "slug": "cardio-kickboxing",
    "name": "Cardio Kickboxing",
    "type": "cardio",
    "category": "classes",
    "equipment": "Open Studio / Bodyweight",
    "primaryMuscles": [
      "Deltoids",
      "Glutes",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Triceps",
      "Calves"
    ],
    "muscles": [
      "Deltoids",
      "Glutes",
      "Quadriceps",
      "Obliques",
      "Triceps",
      "Calves"
    ],
    "met": 7.3,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": true,
    "bodyweightFactor": 0.6,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Cardio%20Kickboxing%20proper%20form%20technique"
  },
  {
    "id": "EX-1118",
    "slug": "basketball-shooting-practice",
    "name": "Basketball: Shooting Practice",
    "type": "cardio",
    "category": "classes",
    "equipment": "Basketball Court / Ball",
    "primaryMuscles": [
      "Deltoids",
      "Triceps",
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "muscles": [
      "Deltoids",
      "Triceps",
      "Quadriceps",
      "Glutes",
      "Calves",
      "Core"
    ],
    "met": 5,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Basketball%3A%20Shooting%20Practice%20proper%20form%20technique"
  },
  {
    "id": "EX-1119",
    "slug": "basketball-game-play",
    "name": "Basketball: Game Play",
    "type": "cardio",
    "category": "classes",
    "equipment": "Basketball Court / Ball",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Calves"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Triceps",
      "Core"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Deltoids",
      "Triceps",
      "Core"
    ],
    "met": 8,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Basketball%3A%20Game%20Play%20proper%20form%20technique"
  },
  {
    "id": "EX-1120",
    "slug": "racquetball-general",
    "name": "Racquetball: General",
    "type": "cardio",
    "category": "classes",
    "equipment": "Racquetball Court / Racquet / Ball",
    "primaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids"
    ],
    "secondaryMuscles": [
      "Calves",
      "Forearms",
      "Obliques"
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Deltoids",
      "Calves",
      "Forearms",
      "Obliques"
    ],
    "met": 7,
    "defaultRestSec": 60,
    "isBarbell": false,
    "barWeightKg": 0,
    "isBodyweight": false,
    "bodyweightFactor": 0,
    "isTimed": false,
    "isDistanceBased": false,
    "howToUrl": "https://www.youtube.com/results?search_query=how%20to%20Racquetball%3A%20General%20proper%20form%20technique"
  }
];

export const STARTER_ROUTINES = [
  {
    name: 'Push Day',
    note: 'Chest, shoulders, triceps',
    exercises: [
      { slug: 'chest-press-machine', targetSets: 4, targetReps: 8 },
      { slug: 'seated-shoulder-press-machine', targetSets: 3, targetReps: 10 },
      { slug: 'incline-chest-press-machine', targetSets: 3, targetReps: 10 },
      { slug: 'lateral-raise-machine', targetSets: 3, targetReps: 15 },
      { slug: 'cable-triceps-pushdown', targetSets: 3, targetReps: 12 },
    ],
  },
  {
    name: 'Pull Day',
    note: 'Back and biceps',
    exercises: [
      { slug: 'lat-pulldown-machine', targetSets: 4, targetReps: 10 },
      { slug: 'seated-cable-row', targetSets: 3, targetReps: 10 },
      { slug: 'chest-supported-t-bar-row-machine', targetSets: 3, targetReps: 10 },
      { slug: 'cable-face-pull', targetSets: 3, targetReps: 15 },
      { slug: 'cable-bicep-curl', targetSets: 3, targetReps: 12 },
    ],
  },
  {
    name: 'Leg Day',
    note: 'Quads, hamstrings, glutes, calves',
    exercises: [
      { slug: 'leg-press-45-degree-seated', targetSets: 4, targetReps: 10 },
      { slug: 'hack-squat-machine', targetSets: 3, targetReps: 10 },
      { slug: 'lying-leg-curl-machine', targetSets: 3, targetReps: 12 },
      { slug: 'leg-extension-machine', targetSets: 3, targetReps: 12 },
      { slug: 'standing-calf-raise-machine', targetSets: 4, targetReps: 15 },
    ],
  },
  {
    name: 'Conditioning & Core',
    note: 'Cardio and core',
    exercises: [
      { slug: 'rowing-machine-ergometer', targetSets: 1, targetReps: 0 },
      { slug: 'stair-climber-stairmaster', targetSets: 1, targetReps: 0 },
      { slug: 'abdominal-crunch-machine', targetSets: 3, targetReps: 15 },
      { slug: 'forearm-plank', targetSets: 3, targetReps: 1 },
    ],
  },
];

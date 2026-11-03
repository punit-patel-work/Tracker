# Gym & Cardio Tracker — Architecture Outline

> **Status: original design doc.** The app that shipped is described in
> [README.md](README.md) and departs from this in three deliberate ways: routines replaced
> the per-category "customizer" as the organising idea, body weight became a `weighIns`
> time series on the user rather than a separate table, and the whole thing runs on
> MongoDB rather than the relational schema sketched below. The calorie model, the
> warm-up/working-set distinction and the `calc_version` idea all survived intact.


**Stack assumption:** SPA (React + TypeScript) → REST API (Node/Express or FastAPI) → relational DB (SQLite for single-user local, Postgres if hosted). Single-user-first, but every table carries `user_id` so multi-user needs no migration.

**Units:** store canonical metric (kg, cm, meters, seconds). Convert at the UI edge only, driven by `users.unit_preference`.

---

## 1. User Profile and Metrics

### `users`
| Field | Type | Notes |
|---|---|---|
| `user_id` | int PK | |
| `email` | string unique | |
| `password_hash` | string | omit if local-only |
| `display_name` | string | |
| `birth_date` | date | age derived, never stored stale |
| `sex` | enum(`male`,`female`,`other`) | drives BMR formula branch |
| `height_cm` | float | changes rarely |
| `unit_preference` | enum(`metric`,`imperial`) | display only |
| `created_at` | timestamp | |

### `body_metrics` (time series — weight changes, so it cannot live on `users`)
| Field | Type | Notes |
|---|---|---|
| `metric_id` | int PK | |
| `user_id` | int FK | |
| `recorded_on` | date | unique with `user_id` |
| `weight_kg` | float | |
| `body_fat_pct` | float, nullable | |
| `resting_hr` | int, nullable | optional calorie refinement |

### Use in calorie calculation
- **Weight** — the direct multiplier in the MET formula. Resolve as *the most recent `body_metrics` row on or before the workout date*, so historical logs keep their historically-correct burn and are not retroactively rewritten when the user's weight changes.
- **Age, sex, height, weight** — inputs to BMR (Mifflin–St Jeor), used to report *net* calories (gross burn − BMR for the same interval).
- **Resting HR** — optional; enables the HR-based (Keytel) estimate when a session records average HR.
- Fallback: if no `body_metrics` row exists, block calorie display and prompt for weight rather than guessing a default.

---

## 2. Exercise Database

### `exercises` (seeded catalog + user-created)
| Field | Type | Notes |
|---|---|---|
| `exercise_id` | int PK | |
| `name` | string | e.g. "Barbell Bench Press" |
| `type` | enum(`strength`,`cardio`) | drives which logging form renders |
| `primary_muscle_group` | string | Chest, Back, Legs, Shoulders, Biceps, Triceps, Core, Full Body |
| `secondary_muscle_groups` | string[] / JSON | for volume-distribution charts |
| `equipment` | enum | Barbell, Dumbbell, Machine, Cable, Bodyweight, Treadmill, Bike, Rower, Other |
| `met_value` | float | baseline MET at moderate effort (see §7) |
| `is_distance_based` | bool | cardio only; shows distance field |
| `default_rest_seconds` | int | prefills rest timer |
| `is_custom` | bool | user-created |
| `owner_user_id` | int FK, nullable | non-null only when `is_custom` |
| `is_archived` | bool | soft-delete; preserves historical logs |

**Rule:** exercises are never hard-deleted — archiving hides them from pickers while keeping foreign keys in history intact.

---

## 3. Workout Logging

Three-level hierarchy: **session → entry (one exercise) → sets/cardio detail.** This keeps a single date/duration on the session, allows exercise reordering, and makes per-exercise history a single indexed query.

### `workout_sessions`
| Field | Type | Notes |
|---|---|---|
| `session_id` | int PK | |
| `user_id` | int FK | |
| `date` | date | indexed with `user_id` |
| `started_at` / `ended_at` | timestamp, nullable | drives strength-session duration |
| `avg_heart_rate` | int, nullable | optional calorie refinement |
| `notes` | text, nullable | |
| `calories_total` | float, nullable | denormalized cache, recomputed on entry change |

### `workout_entries`
| Field | Type | Notes |
|---|---|---|
| `entry_id` | int PK | |
| `session_id` | int FK cascade | |
| `exercise_id` | int FK | |
| `order_index` | int | display order within session |
| `notes` | text, nullable | |
| `calories_burned` | float | computed at write time (§7) |

### 3a. Strength — `strength_sets`
| Field | Type | Notes |
|---|---|---|
| `set_id` | int PK | |
| `entry_id` | int FK cascade | |
| `set_number` | int | 1-indexed |
| `reps` | int | |
| `weight_kg` | float | `0` for bodyweight |
| `rest_seconds` | int, nullable | rest taken *after* this set |
| `rpe` | float, nullable | 1–10, optional intensity signal |
| `is_warmup` | bool | excluded from volume/PR charts |

**Flow:** pick exercise → rows of `reps × weight` → "+ Set" duplicates the previous row's values (fastest common case) → rest timer auto-starts from `default_rest_seconds` on set completion.

### 3b. Cardio — `cardio_details` (one row per entry)
| Field | Type | Notes |
|---|---|---|
| `detail_id` | int PK | |
| `entry_id` | int FK cascade, unique | |
| `duration_seconds` | int | required — the calorie driver |
| `distance_m` | float, nullable | shown when `is_distance_based` |
| `intensity` | enum(`light`,`moderate`,`vigorous`,`max`) | selects the MET tier (§7) |
| `avg_speed_kph` | float, nullable | auto-derived from distance/duration if blank |
| `incline_pct` / `resistance_level` | float / int, nullable | machine settings |
| `avg_heart_rate` | int, nullable | |

**Date association (both types):** the client posts `date`; the server never infers it from server time (timezone bugs). Logging into a past date reuses or creates that date's session.

---

## 4. Categorization and Customization

Categories are a **user-facing grouping layer**, deliberately separate from `primary_muscle_group` — a user may want "Push Day" or "Arms" spanning several muscle groups.

### `categories`
`category_id` PK · `user_id` FK (nullable = system default) · `name` (Chest, Shoulders, Triceps, Back, Legs, Cardio) · `icon` · `order_index` · `is_archived`

### `exercise_categories` (M:N — an exercise can sit in several categories)
`exercise_id` FK · `category_id` FK · PK on the pair

### `user_category_exercises` (the customization layer)
| Field | Type | Notes |
|---|---|---|
| `user_id` | int FK | |
| `category_id` | int FK | |
| `exercise_id` | int FK | |
| `order_index` | int | user's preferred order on Today's Workout |
| `is_pinned` | bool | surfaces at top |

PK on (`user_id`, `category_id`, `exercise_id`).

**Customization page (`/settings/categories`):**
- Left: category list (reorderable, add/rename/archive).
- Right: two-pane picker for the selected category — *Available* (all exercises tagged to it, plus search across the whole DB) vs *My List* (rows in `user_category_exercises`), with drag-to-reorder.
- "Create custom exercise" inline, auto-tagged to the open category.
- Empty `user_category_exercises` for a category ⇒ Today's Workout falls back to showing all exercises tagged in `exercise_categories`, so a new user is never shown a blank screen.

---

## 5. "Today's Workout" View

**Route:** `/` (defaults to today; a date picker rewinds to backfill past days).

**Layout**
- Header: date, session duration timer, running calorie total, session volume.
- Category chips (from `categories`, user order). Selecting one or more filters the exercise list below.
- Under each chip: that user's curated exercises from `user_category_exercises`, each as a collapsed card showing **last session's performance** ("Last: 3×8 @ 60 kg") — the single most valuable cue for progressive overload.

**Quick-log interaction**
- Tap card → expands inline (no navigation, no modal).
- Strength: prefilled grid seeded from last session's sets; edit `reps`/`weight`, tap ✓ per set → set persists immediately (optimistic write) and the rest timer starts.
- Cardio: duration (stopwatch or manual), intensity segmented control, distance/incline when applicable.
- Card collapses to a completed summary; the exercise stays reorderable.
- "Finish workout" stamps `ended_at` and triggers the session calorie recompute.

**State:** writes are per-set/per-entry, not per-session, so a mid-workout crash or phone lock loses nothing.

---

## 6. Historical Tracking and Visualization

### Retrieval
- `GET /sessions?from=&to=` — calendar/list view, one row per session with aggregate volume, duration, calories.
- `GET /sessions/{id}` — full nested detail.
- `GET /exercises/{id}/history` — every set of that exercise over time; the backing query for per-exercise charts. Index on `workout_sessions(user_id, date)` and `workout_entries(exercise_id)`.
- Pre-aggregate weekly rollups (`weekly_stats` materialized table or view) once the log exceeds a few thousand sessions; premature otherwise.

### Derived metrics
- **Volume** = Σ(`reps` × `weight_kg`) over non-warmup sets.
- **Estimated 1RM** (Epley) = `weight × (1 + reps/30)`; charted as the best set per session — the cleanest single strength-progress line.
- **PR** = max `weight_kg` at any rep count, and max e1RM.

### Charts
| Chart | Form | Data |
|---|---|---|
| Strength progress per exercise | Line, dual series | e1RM and top-set weight over time |
| Volume per exercise | Bar | weekly Σ volume |
| Muscle group balance | Stacked bar or radar | volume share by `primary_muscle_group`, last 4 weeks — exposes neglected groups |
| Cardio duration | Bar | minutes/week, stacked by exercise |
| Cardio pace/distance | Line | avg speed or distance per session |
| Calories | Bar + line | daily burn with 7-day rolling mean |
| Body weight | Line | `body_metrics.weight_kg`, overlaid on calorie chart |
| Consistency | Heatmap | sessions per day, calendar grid |
| PR table | Table | per exercise: best weight, best e1RM, date, delta vs 90 days ago |

Range selector (4w / 12w / 1y / all) applied uniformly.

---

## 7. Calorie Calculation

### Core formula (MET-based, both modalities)
```
kcal = MET × 3.5 × weight_kg / 200 × duration_minutes
```
*(equivalently `MET × weight_kg × hours`; the 3.5 ml/kg/min form is written out so the assumption is auditable)*

**Inputs required:** `met_value` for the exercise at the logged intensity · user's `weight_kg` resolved as-of the workout date · active duration in minutes.

### Cardio
- Duration is measured directly (`cardio_details.duration_seconds`).
- MET is selected by intensity tier off the exercise's baseline: `light ×0.7`, `moderate ×1.0`, `vigorous ×1.4`, `max ×1.7` — or, preferably, a per-exercise lookup table keyed by (exercise, intensity), since MET is highly non-linear in speed.
- Reference MET anchors: walking 3.5 · jogging 7.0 · running 10 kph 9.8 · cycling moderate 8.0 · rowing vigorous 8.5 · elliptical 5.0 · stair climber 9.0 · jump rope 12.3.
- When `distance_m` and duration are both present, derive speed and pick the MET row for that speed band in preference to the user's subjective intensity label.

### Strength
Active time is not directly logged, so derive it rather than charging the user for rest at working intensity:
```
active_seconds  = Σ over sets (reps × 3 s)          # ~3 s per rep, concentric+eccentric
rest_seconds    = Σ rest_seconds (or sets × default_rest)
kcal = MET_active × 3.5 × weight_kg/200 × (active_seconds/60)
     + MET_rest   × 3.5 × weight_kg/200 × (rest_seconds/60)
```
- `MET_active`: 5.0 general resistance training, 6.0 when RPE ≥ 8 or compound barbell lifts; `MET_rest` = 1.5 (standing recovery).
- This splits the session honestly instead of applying one MET to wall-clock time, which overestimates by roughly 40–60% for typical rest ratios.

### Optional refinement — heart rate (Keytel et al.)
Used only when `avg_heart_rate` is present; more accurate than MET for individual variation.
```
male:   kcal/min = (-55.0969 + 0.6309×HR + 0.1988×weight_kg + 0.2017×age) / 4.184
female: kcal/min = (-20.4022 + 0.4472×HR − 0.1263×weight_kg + 0.074×age)  / 4.184
```
**Inputs:** avg HR, weight, age, sex, duration.

### Net calories (display layer)
BMR via Mifflin–St Jeor:
```
male:   BMR = 10×weight_kg + 6.25×height_cm − 5×age + 5
female: BMR = 10×weight_kg + 6.25×height_cm − 5×age − 161
net_kcal = gross_kcal − (BMR/1440 × duration_minutes)
```
Show gross by default, net as a toggle — subtracting BMR is what makes the number comparable to a food-log deficit.

### Storage policy
Persist the computed `calories_burned` on `workout_entries` at write time (a point-in-time estimate using that day's body weight), rather than recomputing on read. Keep a `calc_version` column so a future formula change can be re-run deliberately and traceably instead of silently altering the user's history.

---

## API Surface (minimum)

```
POST   /auth/login                       GET  /profile              PATCH /profile
GET    /body-metrics                     POST /body-metrics
GET    /exercises?type=&category=        POST /exercises            PATCH /exercises/:id
GET    /categories                       POST /categories           PATCH /categories/:id
GET    /categories/:id/my-exercises      PUT  /categories/:id/my-exercises   # full-list replace, carries order
GET    /today?date=                      # categories + curated exercises + last-performance, one round trip
POST   /sessions                         GET  /sessions/:id         PATCH /sessions/:id
POST   /sessions/:id/entries             PATCH /entries/:id         DELETE /entries/:id
POST   /entries/:id/sets                 PATCH /sets/:id            DELETE /sets/:id
PUT    /entries/:id/cardio
GET    /stats/exercise/:id?from=&to=     GET  /stats/weekly?from=&to=        GET /stats/prs
```

## Build Order
1. Schema + migrations + exercise/category seed data.
2. Profile & body metrics (calorie inputs must exist before calories).
3. Exercise CRUD + category tagging.
4. Session/entry/set logging API.
5. Category customization page.
6. Today's Workout view (the daily-driver screen).
7. Calorie engine as an isolated, unit-tested module.
8. History list + detail.
9. Charts.

# Gym Tracker

Full-stack strength & cardio log. React + TypeScript on the front, Express + MongoDB Atlas
on the back, one shared calculation engine so a number shown mid-set is the same number
the database stores.

```bash
npm install
cp .env.example .env         # fill in MONGODB_URI and JWT_SECRET
npm run dev                  # API on :4000, web on :5173 (proxied, LAN-visible)
npm run build && npm start   # production: API serves the built SPA on :4000
node scripts/smoke.mjs       # 15-check end-to-end API test against a running server
node scripts/make-icons.mjs  # regenerate the PNG app icons
```

## Using it on your phone

Both servers bind to the LAN, so with your phone on the same wifi:

- **Dev:** open `http://<your-machine-ip>:5173` (Vite prints the Network URL on start).
- **Best experience:** `npm run build && npm start`, then open `http://<your-machine-ip>:4000`
  — one origin, no proxy, and the service worker is active.

Then **Add to Home Screen**. It installs as a standalone app: own icon, no browser chrome,
and the shell is cached so it opens instantly and survives gym wifi. Workout data always
goes to the network — a cached set count would be worse than an error.

Note that `secure` cookies are off outside production, which is what makes plain-http LAN
access work. Over the public internet, run behind HTTPS with `NODE_ENV=production`.

## Why it is shaped this way

The app is built around **one question you ask mid-set**: *what did I lift last time?*
Everything else is arranged behind that.

- **Routines, not a category switchboard.** You think "it's push day", tap it, and every
  exercise is queued with the sets you actually did last time. Four starter routines exist
  from the moment you sign up, so day one is not a blank page.
- **Two taps per set.** Last session's numbers show as ghost text; hitting ✓ on an untouched
  set adopts them. Type only when something changed.
- **The rest timer is global.** It sits above the tab bar and keeps counting while you
  scroll — a countdown you can scroll away from is one you stop trusting. Beeps and
  vibrates when it ends.
- **Plate calculator on barbell lifts.** Loading the wrong weight because you did the
  arithmetic in your head between sets is a real failure mode.
- **PRs are detected, not looked up.** Beat a previous estimated 1RM and the set says so
  immediately; the finish screen lists every record you broke.
- **Works with no signal.** Every change is written to `localStorage` first and pushed to
  the server 800ms later. Lose reception mid-set and logging carries on; the queue flushes
  the moment you reconnect (on the `online` event, or a 15s retry). Reopening the app
  prefers the device copy when it belongs to the running workout.
- **The screen stays awake** for the whole session, so you are not unlocking your phone
  between every set.
- **The active workout lives on the server too.** A dead phone costs you nothing — sign in
  anywhere and the workout is still running.
- **Bodyweight lifts count your body.** A pull-up at 108kg logs 108kg per rep, not zero;
  the weight field means *added* weight, and the load is resolved at the body weight of
  that session.
- **Timed holds are timed.** A plank records seconds, not reps, and contributes energy
  expenditure without inventing rep-volume or a fake 1RM.
- **± steppers on the weight field** — one tap for the next plate beats opening a keyboard
  mid-set. Reps steppers appear from tablet width, where there is room for both.
- **Double progression.** Clear every working set at 8+ reps and the next session offers
  the next plate: *"You hit 3×8 at 60kg — try 62.5kg"*, one tap to apply to all pending sets.
- **Swap an exercise** without losing its place when the machine is taken; the set count
  survives, the numbers don't (they belonged to a different movement).
- **Undo** for a deleted set or exercise, ten levels deep.
- **RPE** per set, once it's done, and a free-text note per exercise.
- **Log a past workout** you forgot, straight into history — works mid-session, since it
  never touches the active-workout slot.
- **Save any past session as a routine**, targets taken from the median reps you actually
  did rather than the last (often drop-off) set.
- **Export** everything as CSV (one row per set) or JSON (with routines and custom lifts).
- **Warm-ups are first-class.** Tap the set number to mark one. They count toward energy
  expenditure (you did move) but never toward volume or PRs.
- **Mobile-first, and specifically phone-first.** Anything you touch mid-set is at least
  44px. Bottom tab bar on a phone, top nav on a desktop.

## Device handling

Four breakpoints, each with a reason rather than a round number:

| Width | Layout |
|---|---|
| ≤ 359px | Tighter set grid and padding so the ✓ button never leaves the card |
| 360–599px | Phone default: bottom tabs, single column, floating bars edge to edge |
| 600–899px | Tablet: two-column cards, four-across stats, roomier set grid, floating bars centred |
| ≥ 900px | Desktop: top nav, wide grids, bars docked bottom-right |

Plus a short-viewport rule for a phone in landscape, which unsticks the header so the
workout screen is not all chrome.

The details that actually decide whether it is usable in a gym:

- **All inputs are 16px.** Below that, iOS Safari zooms the page on focus — which on the
  workout screen means the layout jumps on every single set.
- **`viewport-fit=cover`** so `env(safe-area-inset-*)` returns real numbers; without it the
  tab bar sits under the home indicator on a notched phone. Insets are honoured on the
  left and right too, for landscape.
- **`interactive-widget=resizes-content`**, and every fixed bottom bar hides while the
  on-screen keyboard is up — otherwise the tab bar covers the input you are typing into.
- **`touch-action: manipulation`** kills the 300ms double-tap-zoom delay on buttons.
- **`100dvh`, not `100vh`**, on full-height screens, so the mobile URL bar cannot cut off
  the bottom of the sign-in card.
- The rest timer and the resume bar **stack instead of overlapping** when both are up.
- `-webkit-text-size-adjust: 100%` stops iOS inflating text in landscape; tap highlight is
  suppressed.

## Screens

| Screen | What it is for |
|---|---|
| **Auth** | Real accounts: email + bcrypt password, JWT in an httpOnly cookie, 30 days |
| **Onboarding** | Three steps, asked once, each explaining why it needs the number |
| **Home** | Streak, week-vs-target, start-a-routine, recent PRs, last workouts, weigh-in nudge |
| **Workout** | Live logging — set grid, rest timer, plate math, PR flash, finish summary |
| **Routines** | Build and edit training days with target sets × reps |
| **History** | Every completed session, expandable to per-set detail with e1RM |
| **Progress** | e1RM / top-set / volume trend per lift, weekly volume, muscle balance, energy split, consistency grid, body-weight trend, PR table |
| **Profile** | Dated weigh-ins, BMR, units, goal, weekly target, account deletion |

## API

All routes require the session cookie except signup and login.

```
POST   /api/auth/signup | /login | /logout      GET /api/auth/me
PATCH  /api/me                                  POST /api/me/weight
DELETE /api/me/weight/:date                     POST /api/me/delete-account
GET    /api/exercises                           POST /api/exercises   PATCH /api/exercises/:id
GET    /api/routines    POST /api/routines      PATCH/DELETE /api/routines/:id
GET    /api/sessions/active                     POST /api/sessions
GET    /api/sessions/previous?ids=a,b,c         GET  /api/sessions?limit=&skip=
PATCH  /api/sessions/:id                        POST /api/sessions/:id/finish
POST   /api/sessions/:id/beacon                 DELETE /api/sessions/:id
GET    /api/stats/overview                      GET  /api/stats/exercise/:id
```

Aggregation happens on the server — the client receives series, never a full history dump.

## Data model (MongoDB)

- **users** — credentials, body metrics, units, goal, `weighIns[]` (a *time series*, so a
  session keeps the weight it was performed at), favourites per category
- **exercises** — the 71-item catalog seeded on boot (`owner: null`, shared) plus
  user-created ones; never hard-deleted, only archived. Muscles are split into
  `primaryMuscles` / `secondaryMuscles`, which is what makes hard-set attribution
  meaningful (1.0 per primary, 0.5 per secondary). Each carries a `howToUrl`
- **routines** — per user, ordered exercises with target sets/reps
- **sessions** — `status: active | completed`, snapshot `bodyWeightKg`, entries → sets /
  cardio, cached `totals`, and a `calcVersion` so a formula change can be re-run
  deliberately instead of silently rewriting history

Indexes on `sessions {user, date}`, `{user, status}`, and `exercises {owner, slug}`.

## Calorie model — `shared/engine.js`

`kcal = MET × 3.5 × bodyWeightKg / 200 × minutes`

- **Strength** splits work time from rest: `reps × 3s` at the exercise MET (5–6), rest
  seconds at MET 1.5. One MET across wall-clock time overstates burn by roughly 40–60%.
- **Cardio** scales the MET by effort, but when distance and duration are both logged it
  derives real speed and uses a Compendium-style band instead — MET is strongly non-linear
  in speed.
- **e1RM** is Epley; **volume** is `reps × weight` over working sets only.
- **BMR** is Mifflin–St Jeor, shown on Profile and used for net-calorie figures.

The same file runs in Node and in the browser, so the live figure during a workout and the
stored total cannot drift apart.

## Charts

Series colours (`#2a78d6`/`#eb6834` light, `#3987e5`/`#d95926` dark) are held apart from the
violet brand chrome — `--accent` is UI, `--series-*` is data ink — and were validated for
lightness band, chroma, colourblind separation and contrast against the surfaces they
actually render on. One y-axis, no legend on single-series charts, solid hairline grid,
selective direct labels, hover tooltips, and a **table view** on every chart so no value is
reachable by tooltip alone. Part-to-whole is a split bar, not a two-slice donut.

## Theming

Light and dark are both designed, not one inverted. Tokens live in `src/styles/theme.css`
under `:root` (dark), `:root[data-theme='light']`, and a `prefers-color-scheme: light` block
for anyone who never touches the toggle. `index.html` applies the stored choice before first
paint.

## Troubleshooting

**`[db] Atlas refused this IP` / a wall of `http proxy error: ECONNREFUSED`**

Atlas allows connections only from IPs on its Network Access list, and your home IP
changes when your ISP reassigns it. "Add Current IP Address" entries can also be added as
*temporary access*, which expires after 6 hours.

1. Find your current public IP: `curl https://api.ipify.org`
2. Atlas → your project → **Network Access** → **Add IP Address** → paste it, and do not
   tick the temporary-access box.
3. Give it ~30 seconds to propagate. The API retries every 15s on its own, so there is no
   need to restart it.

A free M0 cluster also pauses after ~60 days idle and produces the same "could not connect
to any servers" message — check the cluster is not paused before chasing the allowlist.

The proxy errors are a symptom, not the cause: they only mean Vite could not reach the API
on :4000. Look at the `[api]` lines above them for the real reason.

## Performance

- **`/api/stats/overview` no longer recomputes anything it already knows.** Totals are
  cached on each session at write time, so the common path never reads the `entries`
  array. Three narrow queries: cached totals for every session, full entries only for the
  28-day muscle-balance window, and a sets-only projection for all-time PRs.
- **Compound index `{user, 'entries.exercise', date}`** behind `/sessions/previous`, which
  runs on every workout screen.
- **gzip** on all responses — the stylesheet goes 42.6 kB → 8.5 kB.
- **`immutable, max-age=1y`** on fingerprinted `/assets`; `no-cache` on `index.html` and
  `sw.js` so a deploy is picked up immediately.

## Security notes

- Passwords are bcrypt (cost 12); login returns the same error whichever half was wrong.
- **Rate limited**: 10 login attempts per 15 min per IP+email (keyed on both so nobody can
  lock you out of your own account), 5 signups/hour per IP, 5 reset requests per 15 min.
  In-memory — behind multiple instances this needs Redis.
- **Password reset** issues a SHA-256-hashed, one-hour, single-use token. `/auth/forgot`
  always returns 200 so it cannot be used to discover which emails have accounts. Reset
  links are emailed over SMTP; outside production the link is also returned in the
  response (and logged) so the flow works without an inbox. Never in production.
- `.env` holds live credentials and is gitignored — **note that `.env.example` currently
  contains a real `JWT_SECRET`**; that file is meant to be committed, so put a placeholder
  back before pushing anywhere.
- The JWT lives in an httpOnly, sameSite=lax cookie, so an XSS bug cannot lift the session.
  `secure` is set when `NODE_ENV=production`.
- Every query is scoped by `user`; one account cannot read another's sessions, routines or
  custom exercises.
- `.env` is gitignored. **Rotate the Atlas password before this goes anywhere real** — the
  current one was shared in plain text.
- Set a real `JWT_SECRET`; the placeholder in `.env.example` is not one.

## Layout

```
server/          Express API — models.js, auth.js, db.js, routes/*.routes.js
shared/          engine.js (calorie/1RM/plate maths) + catalog.js — used by BOTH sides
src/lib/         api client, types, formatting & unit conversion
src/state/       app (auth + catalog), workout (active session + autosave), theme
src/components/  Icon set, SVG charts, exercise picker sheet, rest timer, plate math
src/pages/       Auth, Onboarding, Home, Workout, Routines, History, Progress, Profile
scripts/smoke.mjs  15-check end-to-end API test
```

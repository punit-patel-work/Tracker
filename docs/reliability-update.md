# Workout reliability update — November 2, 2026

## What changed

| Finding | Result |
|---|---|
| Calories appeared before training | Planned strength sets and cardio start at zero. Only completed entries contribute. Checking or undoing completion updates the estimate. |
| Calorie calculation was unclear | Active workouts, history and the finish summary show strength/rest and cardio separately, the formula, recorded body weight and assumptions. These are activity estimates, not sensor measurements. |
| Finished workouts could not be edited | Edit from History or the finish summary. Correct the date, duration, exercises and sets; totals recalculate while the original body-weight snapshot stays intact. |
| Mongoose deprecation warnings | Update operations use `returnDocument: 'after'`. |
| Vulnerable dependencies | Updated Vite, its React plugin, Nodemailer and affected transitive packages; lockfile retained. |
| Account state could leak across sign-out | Workout providers and device backups are keyed by account. Late requests cannot restore the previous account's workout, catalog or profile. |
| Password-reset tokens left old sessions usable | Reset atomically changes the password, consumes the reset token and increments the session version. Previous login cookies are rejected. Production logs no longer expose reset/verification links. |
| Catalog initialization could destroy old references | Removed automatic history rewrites and deletion/remapping of old catalog entries. Removed exercises are archived with their IDs preserved. Catalog writes run only when the catalog revision changes. |
| Cardio speed calculations depended on obsolete names | The current general treadmill, upright bike and rower have explicit energy-model metadata. Specific pace/wattage entries keep their catalog model. |
| Saves and Finish could overwrite each other | Client writes are serialized; revision checks and MongoDB optimistic concurrency reject stale writes. Finishing waits for the latest save. A partial unique index allows one active workout per account. |
| History stopped after 200 records | Paginated history and server search cover the full account history. Failed requests show a retry action. |
| API input and ownership checks were incomplete | Bounded numeric/text/list inputs, real dates, valid IDs and ownership checks protect workout/routine/exercise operations. Spreadsheet exports neutralize formula-like text. |
| Dates could change at UTC midnight | Browser time zone is supplied to the API; workout dates, weigh-ins and progress use that calendar date. |
| Repeated progress requests scanned history | Bounded 60-second overview cache checks a database signature before reuse. Startup no longer recalculates all saved workouts. |
| Finishing was easy to misinterpret | A review shows completed and unchecked work before finishing; planned rows explain that they count only when checked. Compact sticky metrics leave more space for the workout. |
| Editor changes could be lost on close | Dirty editor dismissal asks before discarding; dialogs trap keyboard focus, support Escape and restore focus. |
| Cold offline reopening failed | A seven-day account/catalog cache and full account-scoped workout backup support reopening a previously loaded account. The production worker precaches the entry JS/CSS on its first install. APIs are never served from its cache. |

## Running the update

Use Node 22.13+ within the 22.x release line, or Node 24+. Install from the lockfile with `npm ci` on a fresh checkout. On this workspace the updated dependencies are already installed.

1. Back up the database before deploying schema/index changes.
2. For an existing database, `node scripts/check-active-workouts.mjs` reports duplicate active sessions without changing them. If duplicates exist, review and preserve the recorded work before resolving them; this update never deletes them to force the index to build.
3. Restart both processes with `npm run dev`, then refresh the browser. For production, run `npm run build`, deploy client and API together, and restart the server.
4. Refresh older open tabs. Session writes now require the revision returned by the API; an old tab receives a conflict rather than silently overwriting newer work.

The startup unique index intentionally fails if legacy duplicate active sessions remain. After resolving them, restart the API. Catalog metadata lives in `app_metadata`; future catalog changes must bump the revision in `server/db.js`.

Historical totals are not silently rewritten. Editing and saving a completed workout recalculates it with calculation version 3. A running workout pauses after 120 minutes. Resume within the following 60 minutes to continue from the paused time. Otherwise it closes at the pause point; unsynced changes to an already-ended workout can be exported from the conflict notice.

Offline reopening requires a prior successful online visit and, for the application shell itself, an installed production service worker on HTTPS or localhost. History searches, new workouts and finishing still require the API. Local account/workout data is stored on that device; successful sign-out clears its cached account and that account's active backup, with a warning for unsynced work.

## Verification

- `npm test`: engine/date/API tests, disposable-MongoDB integration tests, React/jsdom interaction tests and service-worker lifecycle tests.
- `npm run build`: TypeScript and production bundling.
- `npm audit`: zero reported vulnerabilities on November 2, 2026.
- A fixture with over 3,000 workouts measured approximately 140 ms for a cold progress request and 8 ms for a cached request on this machine. This is a local regression benchmark, not a production latency guarantee; a cold request still reads history.

The integration suite creates and removes its own MongoDB instance. It does not load `.env`, use your configured database or send SMTP mail. Its first run may download a MongoDB binary. The optional `scripts/smoke.mjs` targets a running API, creates/deletes a test account and can send mail; it was not run against your account/server.

Visual layout and actual installed-PWA reopening still need a browser/device pass. Automated DOM and worker tests passed; native browser automation was unavailable in this session. Production SMTP delivery was not tested.

## Production configuration

Use HTTPS, `NODE_ENV=production`, a fixed public `APP_URL`, a unique random `JWT_SECRET` and SMTP credentials in the deployment's secret store. `.env.example` contains placeholders only. Existing credentials were not changed. The existing in-memory authentication limiter remains per process; a multi-instance deployment needs a shared limiter store.

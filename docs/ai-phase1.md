# Phase 1 training assistant

Implemented in tracker2; verified November 5, 2026.

## Where to use it

- Training: open /ai or choose AI coach. Routines also has a Build with AI button.
- Administration: /admin#ai contains availability, a USD monthly allowance, usage by feature, recent requests, and an alternative-list editor.
- Existing routine and workout exercise controls expose catalog alternatives and the full manual exercise browser.

## Included

The three-step questionnaire covers goals, schedule, experience, previous training, breaks, optional gender/age/weight/height, equipment, priorities, exclusions and movement preferences. It saves separately from the profile, so changing a planning request does not rewrite weigh-ins or historic bodyweight.

Routine creation uses GPT-6.1 Sol. Weekly reviews and workout explanations use GPT-6 Luna. These model IDs were verified against the configured account. Native server-side fetch calls the Responses API; no additional production package is required.

Routine context contains compatible catalog records and up to 120 completed workouts over 12 weeks, with actual completed sets, reps, kg, difficulty, warm-ups, notes and recorded bodyweight. There is no aggressive tiny exercise shortlist. Matching recent load evidence is checked against the same exercise; missing evidence, a long break, or an implausible increase leaves the load blank. This conservative validation is not a clinical safety guarantee.

Results use strict JSON schemas and local validation. Unavailable/repeated exercise IDs, invalid targets, fabricated insight evidence IDs and incomplete responses cannot become usable drafts. No automatic retry or premium-model fallback silently increases spending.

Generated days can be renamed, targets edited, alternatives chosen, and saved individually into normal routines. Saving a day is idempotent; later changes belong in the normal Routines editor. Seconds, cardio minutes, rest and kg survive saving and workout start. Prefilled workout values remain incomplete and do not add calories.

Weekly reviews cover the last seven local calendar dates and compare the preceding seven. Server code computes the displayed totals. Explanation requests use a selected completed workout, the real exercise definitions and the existing calorie engine description.

## Alternatives

Each shared catalog record gets a reusable alternative list at the version-gated catalog initialization. Explicit movement families currently supply relationships for **157 of 530** catalog records. Other records intentionally have empty lists until an administrator reviews them. No GPT calls are used for replacements.

Runtime filters remove archived exercises, unavailable equipment, duplicate routine exercises and the user's exclusions. Related movements are not identical; replacement clears the previous load. Administrators can curate shared lists, and their edits survive catalog refreshes. Unknown custom movements use manual selection rather than fuzzy name matching.

Static holds such as planks were corrected to use duration-based logging. The catalog revision preserves administrator-customized records and existing exercise IDs.

## Backend / data flow

Endpoints are mounted under /api/ai in both server/index.js and api/index.js:

- GET /bootstrap: account preferences and the latest eight saved suggestions.
- PUT /preferences: validate and save planning preferences without calling GPT.
- GET /alternatives/:id: filtered maintained alternatives, no GPT.
- POST /routine-draft: consent + validated preferences -> history/catalog context -> GPT -> validated draft.
- POST /weekly-review: consent -> server totals -> GPT -> validated review.
- POST /workout-explanation: consent + owned completed workout -> validated explanation.
- POST /drafts/:id/save: owned draft + edited day -> normal routine, idempotently.
- GET/PATCH /admin: administrator-only usage/configuration.
- GET/PUT /admin/alternatives/:id: administrator-maintained shared alternatives.

AiPreferences, AiDraft, AiUsage, AiBudget, AiSettings, AiLock and AiAlternative are MongoDB collections. Draft keys include task, model, prompt version and actual supplied context, so changes in relevant data invalidate cached results. Draft lookup always includes user ID. Draft context is retained for the result's provenance and validation; AI settings/usage views do not expose private prompt contents.

Edited preview targets are restored from account-scoped sessionStorage in the same browser tab. They are cleared on sign-out. Generated suggestions themselves are saved server-side. Profile JSON export includes AI preferences and suggestions. Account deletion removes its private AI preferences, drafts, usage and lock records while preserving aggregate billing totals.

## Configuration and budget

The server reads OPENAI_API_KEY from .env locally or the hosting environment in deployment. Never use a VITE_ prefix, commit the key, or put it in the UI.

Optional model variables:
- OPENAI_ROUTINE_MODEL=gpt-6.1-sol
- OPENAI_INSIGHT_MODEL=gpt-6-luna

Only models with a maintained price configuration in server/ai/service.js are accepted. The initial application allowance is US$5 per UTC calendar month, editable in Admin -> AI assistance. The model settings do not require different API keys.

An atomic MongoDB reservation checks used + reserved + maximum estimated request cost before a call. One in-flight request per account and 40 paid attempts per rolling 24 hours prevent accidental loops. The reservation includes a deliberately conservative UTF-8 input estimate and maximum output allowance. Separate users cannot reserve the same remaining balance. Lock ownership prevents a late request from clearing a successor's lock.

Accounting currently overestimates ordinary input at the cache-write rate; provider invoices are authoritative. Requests without trustworthy usage information conservatively retain their estimated charge. A process crash can leave a reservation until the UTC month resets; inspect provider billing before increasing the allowance to compensate. There is no automatic recharge configuration in the application.

Output allowances are 8,000 tokens for routines and 2,600 for insights, including reasoning. Routine reasoning is low; insight reasoning is none. Timeout is 110 seconds upstream / 125 seconds client-side. The request-size safeguard allows up to 1,000,000 UTF-8 bytes including a protocol buffer; bytes are deliberately a conservative token upper bound. This supports the complete Full Gym catalog alongside detailed history. Larger requests are rejected before any provider call, without dropping workouts. Sol reservations and usage accounting include long-context pricing when the input estimate or actual input exceeds 272,000 tokens.

## Privacy / limits

Consent is required before each generation action. The payload omits email, username, password hashes, tokens and unrelated account records. Profile details and relevant training notes are shared with OpenAI for the requested feature. Responses requests set store:false; this is not a promise of zero provider retention.

Training recommendations are editable drafts for general adult fitness, not injury diagnosis or rehabilitation. Nutrition planning, live chat, voice, video analysis and autonomous workout edits are outside this phase.

## Verification

- npm test: 77 passing tests (14 unit, 35 integration, 28 UI).
- npm run build: production TypeScript/Vite build passes.
- Integration tests use a disposable MongoDB and mocked provider, never the real database or API key.
- Tests cover authentication, consent, account isolation, exact exercise references, target persistence, idempotent saves, cache invalidation, refusals, truncation, network failures, evidence references, alternatives, admin controls, duplicate calls and concurrent budget reservations.
- Browser checks use the synthetic preview only: desktop/mobile questionnaire, routine preview, save action, admin usage, dark mode and overflow checks.
- Three real API requests used only synthetic training data in a disposable database. All passed structured and semantic validation. Conservative estimated total: US$0.096543875. Routine: 27,968 input / 2,611 output tokens; review: 913 / 268; explanation: 910 / 304.
- npm run test:ai:live is explicitly paid and opt-in. Ordinary npm test never spends API credit.
- Optional browser check: install playwright under ignored .tmp/ai-browser, then node scripts/ai-browser-check.mjs. It uses installed Chrome and the isolated preview.

Screenshots:
- ai-phase1-desktop.png
- ai-phase1-mobile.png
- ai-phase1-routine.png
- ai-phase1-admin.png
- ai-phase1-admin-dark.png

## Existing merge recovery

The checkout arrived with 37 conflicted files from the incoming V3.0.3 changes. Conflict blocks were resolved toward those established workout, security and admin fixes, retaining surrounding content. Before editing, originals were backed up in ignored .merge-backups/before-ai-phase1.zip. No commit or deployment is part of this implementation.

## Official API references

- [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Reasoning and output limits](https://developers.openai.com/api/docs/guides/reasoning)
- [Data controls](https://developers.openai.com/api/docs/guides/your-data)

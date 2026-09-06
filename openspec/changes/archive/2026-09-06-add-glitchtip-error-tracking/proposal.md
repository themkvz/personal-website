## Why

The site ships to production with no error reporting. A server-side render failure surfaces only as a 500 in container logs nobody reads, and a client-side exception is invisible entirely — the only signal is a visitor bouncing off a broken page. A self-hosted GlitchTip instance (`glitchtip.themkvz.com`, GlitchTip 6.0) is already running and has a project provisioned; nothing is reporting into it.

GlitchTip is Sentry-API compatible, so this is a wiring job against the official `@sentry/react-router` SDK rather than a bespoke integration.

## What Changes

- Add `@sentry/react-router` and initialise it on **both** sides: browser (`entry.client.tsx`) and Node server (a root `instrument.server.mjs` imported first in `entry.server.tsx`).
- Report **unhandled server errors** through React Router's `handleError` export, skipping errors on aborted requests.
- Report **unhandled client errors** through a single path — React Router's `HydratedRouter` `onError` hook — skipping 404 route error responses. The root `ErrorBoundary` is deliberately left alone; see design.md for why a second reporting path double-reports.
- Enable **performance tracing** on both sides via React Router's Instrumentation API (`instrumentations` export server-side, `HydratedRouter instrumentations` prop client-side) so loaders, actions, middleware, and navigations produce transactions.
- Disable **session tracking** on both sides — GlitchTip does not implement the Sentry sessions API, so the default `BrowserSession` integration and the Node `httpIntegration` session aggregation would emit envelopes GlitchTip discards.
- Send a **`Content-Security-Policy-Report-Only`** header on document responses, with `report-uri` pointing at the GlitchTip security endpoint. Report-only, so no existing behaviour can break; violations become a GlitchTip feed to tighten against before any future enforcing policy.
- Introduce a **per-request CSP nonce** applied to the inline theme-init script and to React Router's `<Scripts>` / `<ScrollRestoration>` inline scripts, so the report-only policy can name a real `script-src` instead of `'unsafe-inline'`.
- Add one new public environment variable, `VITE_GLITCHTIP_DSN`. The CSP security endpoint and the GlitchTip ingest origin are **derived** from the DSN rather than configured separately, so the two cannot drift.
- Add `VITE_GLITCHTIP_DSN` to `.env.example`, to the Dockerfile build args and its `test -n` guard, and to the README deploy procedure.

Non-goals for this change:

- **Source map upload.** Browser stack traces will show minified frames. Deferred; it needs a build-time GlitchTip auth token and Docker build-secret plumbing, and server-side traces are already readable.
- **An enforcing CSP.** Report-only only. Flipping to enforcing is a separate change, taken once the report feed is clean.
- **Session replay, profiling, cron/uptime monitors, GlitchTip alert rules.**

## Capabilities

### New Capabilities
- `observability`: how the application reports unhandled server and client errors and performance transactions to a Sentry-compatible backend, which errors are deliberately not reported, and how browser CSP violations are collected.

### Modified Capabilities
- `configuration`: adds `VITE_GLITCHTIP_DSN` to the declared variable contract, and establishes that a derived value (the CSP report endpoint) must not be declared as a second variable.
- `deployment`: `VITE_GLITCHTIP_DSN` becomes a required build argument and a required runtime variable, extending the reproducible-build and runtime-environment requirements.

## Impact

- **Dependencies:** `+@sentry/react-router` (peer-compatible with the pinned `react-router@8.3.1`; requires Node ≥ 20, image runs `node:24-alpine`).
- **Code:** `src/entry.client.tsx`, `src/entry.server.tsx`, `src/root.tsx`, `src/env.shared.ts`, `src/env.client.ts`, new `instrument.server.mjs`, new `src/lib/glitchtip/` (DSN-derived endpoint + CSP policy builder).
- **Config:** `.env.example`, `Dockerfile` (build arg + guard), `README.md` deploy section.
- **Runtime:** every document response gains a CSP report-only header and a per-request nonce; the client bundle grows by the Sentry browser SDK.
- **External:** the site begins sending error, transaction, and CSP-report traffic to `glitchtip.themkvz.com`.

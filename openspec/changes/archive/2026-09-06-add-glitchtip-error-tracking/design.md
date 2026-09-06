## Context

See `proposal.md` — Why. Constraints that shape the approach:

- **Pinned versions.** `react-router@8.3.1`, React 19, Node 24 in the runtime image, Bun as the package manager. `@sentry/react-router@10.73` declares `react-router: 7.x || ^8.x`, `@react-router/node: 7.x || ^8.x`, `node: >=20` — compatible on all three. Its server tracing hook (`createSentryServerInstrumentation`) needs React Router ≥ 7.15; 8.3.1 satisfies that.
- **GlitchTip is Sentry-API compatible but not feature-complete.** It ingests errors, transactions, and CSP reports. It does **not** implement the sessions API — the browser SDK's default `BrowserSession` integration and `@sentry/node`'s `trackIncomingRequestsAsSessions` would send envelopes it discards.
- **Existing third-party pattern.** OpenPanel lives in `src/lib/openpanel/` split into `.client`/`.server` modules, configured through validated env (`src/env.client.ts`, `src/env.server.ts`, schema shared in `src/env.shared.ts`). This change follows that shape rather than inventing a second one.
- **`bun run verify:bundle`** fails the build if `OP_CLIENT_SECRET` or the string `env.server` appears in the client bundle. Any module shared by both sides must not reach for `~/env.server`.
- **The site has no CSP today**, and `src/root.tsx` emits an inline pre-hydration theme script that must keep running before first paint.
- **Biome runs `organizeImports`**, so import order is not something a comment can protect. It does leave bare side-effect imports in place as barriers — `src/root.tsx` already relies on that for `import "./app.css"`.

## Goals / Non-Goals

**Goals:**

- One configuration value (`VITE_GLITCHTIP_DSN`) drives error ingest, transaction ingest, the CSP report destination, and the CSP `connect-src` allowance.
- Error and CSP wiring adds no failure mode of its own: a dead GlitchTip must not turn a 500 into a hang.
- The report-only CSP is honest from day one — the report feed should be signal about third parties and future tightening, not a wall of violations from the site's own scripts.

**Non-Goals:**

- Perfect OpenTelemetry auto-instrumentation coverage. Spans come from React Router's Instrumentation API; a few pre-init HTTP spans may be missed (see Decisions).
- Deciding the final enforcing policy. This change picks a *starting* policy; the report feed decides the rest.
- Any GlitchTip-side configuration (alert rules, retention, teams).

## Decisions

### Use `@sentry/react-router`, not `@sentry/react` + `@sentry/node`

The framework package supplies exactly the four seams React Router framework mode exposes — `handleError`, the server `instrumentations` export, the `HydratedRouter` `instrumentations`/`onError` props, and `reactRouterTracingIntegration` — and wraps `@sentry/node`/`@sentry/browser` underneath. Wiring the two base SDKs by hand would mean reimplementing those seams.

*Alternative rejected:* the `@sentry/react` + `@sentry/node` pair. Smaller conceptual surface, but every framework hook becomes hand-rolled, and route-level transaction naming has to be reconstructed.

*Alternative rejected:* GlitchTip's own SDK. There isn't one; GlitchTip's documentation points at the Sentry SDKs.

### `instrumentations` is React Router's own seam, not a Sentry concept

React Router 8 stabilised `unstable_instrumentations` to `instrumentations` (types `ServerInstrumentation` / `ClientInstrumentation`) as its first-party observability hook — an array of read-only wrapper objects around the request handler, router operations, middleware, and route handlers. It is typed in the pinned `react-router@8.3.1` at `lib/server-runtime/build.d.ts:62` and `lib/dom-export/hydrated-router.d.ts:71`, and documented at <https://reactrouter.com/how-to/instrumentation>.

`Sentry.createSentryServerInstrumentation()` and `Sentry.createSentryClientInstrumentation()` are factories returning one of those objects. The integration surface is therefore two lines — an `export const instrumentations = [...]` and a prop — not a subsystem. Wiring tracing any other way would mean patching the request handler by hand, which is what this API exists to avoid.

### Exactly one reporting path per side

Both `createSentryServerInstrumentation()` and `createSentryClientInstrumentation()` default `captureErrors` to **`true`**, reporting at the request-handler, loader, action and middleware seams with no filtering of their own. Left at the default, each would duplicate the side's real reporting path *and* bypass its guards — on the server, the `request.signal.aborted` check that the spec requires. Both get `{ captureErrors: false }`; they are for tracing only.

Node's defaults contain no `dedupeIntegration`, so server duplication would be guaranteed rather than probabilistic.

That leaves one path per side:

- **Server:** `handleError`, which owns the aborted-request and 404 guards.
- **Client:** `sentryOnError` on `HydratedRouter`'s `onError`. It is the broadest option available (render errors included, which the instrumentation's `captureErrors` does not cover) and React Router guarantees it runs once per error, unaffected by re-renders. A third candidate — a `captureException` call inside `root.tsx`'s `ErrorBoundary` — is deliberately *not* added; the browser's default `dedupeIntegration` only compares against the immediately preceding event, so relying on it to swallow the duplicate would be relying on ordering.

`sentryOnError` cannot be passed bare, though: a 404 route error response reaching the client during a navigation is an error in React Router's model, so it would be reported. Both sides share one `isNotFound` guard (`src/lib/glitchtip/errors.ts`).

### Initialise the server SDK from `src/instrument.server.ts`, imported first in `entry.server.tsx`

Sentry documents two loaders: a root `instrument.server.mjs` pulled in via `NODE_OPTIONS='--import ...'`, or the same file imported at the top of `entry.server.tsx`. Take the import.

The `--import` route would require the file to survive into the runtime image (which currently copies only `build/`, `node_modules/`, and `package.json`), a `NODE_OPTIONS` prefix on the Docker `CMD`, and plain JS reading `process.env` directly — bypassing the validated `env.server` module. The import route keeps the file in `src/`, in TypeScript, reading the same validated env as everything else, and changes nothing about the image or the start command.

The cost is real and bounded: `Sentry.init` runs when the server bundle reaches `entry.server`, not before the process loads `react-router`, so OpenTelemetry's HTTP auto-instrumentation attaches late and may miss spans from modules already resolved. Since request/loader/action/middleware spans come from React Router's own Instrumentation API rather than from OTel's HTTP hooks, this costs coverage we were not depending on. Mark it with a `ponytail:` comment naming `--import` as the upgrade path if span gaps ever show up.

Biome's `organizeImports` will not hoist other imports above a bare side-effect import, so `import "./instrument.server";` holds its position without a lint suppression.

### Derive the security endpoint and ingest origin from the DSN

The DSN `https://<key>@<host>/<projectId>` contains every part of the security endpoint `https://<host>/api/<projectId>/security/?glitchtip_key=<key>` and of the `connect-src` origin. Declaring the endpoint as a second variable creates two values that must agree, with no mechanism to notice when they don't — a repointed DSN with a stale report URI fails silently.

A pure `src/lib/glitchtip/dsn.ts` parses the DSN once into `{ origin, projectId, publicKey, securityEndpoint }`. Pure means: no `~/env.server` import, so it can be shared by the client bundle without tripping `verify:bundle`. The parse doubles as the env validator — `VITE_GLITCHTIP_DSN` is declared in `src/env.shared.ts` as a string with a `v.check()` that runs the parser, so a malformed DSN fails at startup through the existing `onValidationError`, which reports names only and never the value.

*Alternative rejected:* a second `VITE_GLITCHTIP_SECURITY_ENDPOINT`. Explicit, but two sources of truth for one fact.

### Disable sessions explicitly on both sides

GlitchTip discards session envelopes, and both SDKs enable session tracking by default.

- Client: `integrations: (defaults) => defaults.filter((i) => i.name !== "BrowserSession")`, keeping every other default and adding `reactRouterTracingIntegration()`.
- Server: pass `httpIntegration({ trackIncomingRequestsAsSessions: false })` explicitly; supplying an instance of a default integration replaces the default one.

The v10 SDK has no top-level `autoSessionTracking` flag — GlitchTip's documentation still shows one, which predates Sentry v8's move to integration-based session handling. Following that documentation literally would silently do nothing.

### Suppress 404s and aborted requests at both boundaries

Server `handleError`: skip when `request.signal.aborted` (the client left; not a failure) and when the error is a route error response with status 404. Log everything else to the console *and* report it, so container logs stay useful on their own.

Client: the same guard wraps `sentryOnError` on `HydratedRouter`'s `onError`, per the single-path decision above. `src/root.tsx` is not touched.

Without the 404 suppression, every bot scanning for `/wp-admin` becomes an issue in the feed.

### Per-request nonce, plumbed through a React context

The report-only policy is only worth having if its `script-src` is honest. `'unsafe-inline'` would make every inline-script report meaningless; `'self'` alone would report the site's own theme script and React Router's hydration scripts on every page load. Neither feed is usable, so the nonce goes in now, while it is report-only and a mistake is invisible.

React Router does not carry a nonce for you, but it accepts one: `<Scripts nonce>` and `<ScrollRestoration nonce>` are typed (`ScriptsProps.nonce`), and `renderToPipeableStream` takes a `nonce` option for the bootstrap script.

Shape:

- `entry.server.tsx` generates the nonce per request (`crypto.randomUUID()`, global in Node 24), passes it to `renderToPipeableStream`, wraps `<ServerRouter>` in a `NonceContext` provider, and sets the header on `responseHeaders`.
- `src/context/nonce.ts` holds a plain React context defaulting to `""`.
- `src/root.tsx`'s `Layout` reads it and applies it to the inline theme script, `<Scripts>`, and `<ScrollRestoration>`.

*Alternative rejected:* a React Router middleware writing to `userContext`-style request context. `Layout` renders outside loader data during error renders, so it cannot depend on a root loader having run — a React context provided in `entry.server` is available in every render path.

Because only `entry.server.tsx` sets the header, resource routes (`feed.xml`, `sitemap.xml`) and `.data` requests never receive one, which is what the spec asks for. No extra guard needed.

### Starting policy

```
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
form-action 'self';
script-src 'self' 'nonce-<n>';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self' data:;
connect-src 'self' <op-api-origin> <glitchtip-origin>;
report-uri <security-endpoint>;
```

- `style-src 'unsafe-inline'` is deliberate, not deferred: React and `motion` set inline `style` attributes on animated elements, which `style-src` governs. Omitting it would bury real findings under known noise.
- `'strict-dynamic'` is left out of the first policy. It would neutralise the `'self'` source, and the point of the first report window is to learn what actually loads.
- `report-uri` only. It is deprecated in favour of `Reporting-Endpoints` + `report-to`, but it is what GlitchTip's security endpoint is shaped for and what today's browsers still act on for CSP.
- `connect-src` takes the OpenPanel API origin and the GlitchTip origin — both are origins derived from existing config, not new literals.

`src/lib/csp.ts` builds the string; the origins come from `envPublic.VITE_OP_API_URL` and the parsed DSN.

### Reporting is off outside production builds

`Sentry.init` gets `enabled: env.NODE_ENV === "production"` on the server and `enabled: import.meta.env.PROD` on the client. Local errors stay in the console; the production feed stays clean. The DSN is still *required* in every environment, matching how `VITE_OP_*` already behave — a missing DSN should fail the deploy, not quietly disable error tracking.

The CSP header is not gated on production. Catching a violation on the dev server is the cheapest place to catch one.

## Risks / Trade-offs

- **The report-only CSP produces a flood of third-party reports** → It is report-only, so nothing breaks while the feed is noisy. Review the first window and tighten `connect-src`/`img-src` from real data before proposing an enforcing policy.
- **A missed nonce leaves an inline script reporting on every page view** → Verify by loading a page and confirming zero self-generated reports before considering the change done; the check is a page load plus a look at the GlitchTip feed.
- **Late `Sentry.init` misses early OTel HTTP spans** → Accepted; React Router's Instrumentation API supplies the spans that matter. `ponytail:` comment records `NODE_OPTIONS='--import'` as the upgrade path.
- **Minified client stack traces** → Known and accepted (source maps are out of scope). Server frames are readable, and client issues still carry message, URL, and breadcrumbs. Revisit if browser issues prove unactionable.
- **Client bundle grows by the Sentry browser SDK** → Real cost on a site whose value is partly its lightness. Mitigated by skipping replay, feedback, and profiling integrations; measure the delta after the build and record it.
- **Transaction volume on a self-hosted instance** → Start `tracesSampleRate` low (0.1) rather than 1.0. It is a constant in the SDK config, changeable in one place.
- **`@sentry/react-router` is still labelled beta** → It is the only first-party option for framework mode, and the surface used here (init, `handleError`, two `instrumentations` hooks) is small. Errors would still be captured if the tracing hooks regressed.

## Migration Plan

1. Ship behind no flag — there is nothing to migrate, only new headers and new outbound traffic.
2. Deploy requires the new build arg and runtime variable together; a deploy missing `VITE_GLITCHTIP_DSN` fails at build (the `test -n` guard) or at startup (env validation), never silently.
3. Rollback is reverting the commit and rebuilding. No data migration, no stored state.

## Open Questions

- Whether `'strict-dynamic'` belongs in the eventual enforcing policy — answerable only from the first report window, and it changes neither the specs nor the task breakdown.
- The long-run `tracesSampleRate`. 0.1 is a starting point to be tuned against what the self-hosted instance comfortably ingests.

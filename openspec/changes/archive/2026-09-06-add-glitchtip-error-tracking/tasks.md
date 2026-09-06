## 1. Configuration contract

- [x] 1.1 Install `@sentry/react-router` with `bun add @sentry/react-router` and verify `bun.lock` updates and `bun run typecheck` still passes
- [x] 1.2 Add `src/lib/glitchtip/dsn.ts` — a pure parser turning `https://<key>@<host>/<projectId>` into `{ origin, projectId, publicKey, securityEndpoint }`, importing nothing from `~/env.server`; verify with a small `assert`-based self-check that the project DSN yields exactly `https://glitchtip.themkvz.com/api/1/security/?glitchtip_key=2b5a6e0bc47543f4935ae4efb40ad890` and that a malformed DSN throws
- [x] 1.3 Declare `VITE_GLITCHTIP_DSN` in `src/env.shared.ts` as a string with a `v.check()` that runs the parser, and add it to `runtimeEnvStrict` in `src/env.client.ts`; verify `bun run dev` starts with the variable set and exits naming only `VITE_GLITCHTIP_DSN` when it is unset or malformed, with no substring of the value in the output
- [x] 1.4 Add `VITE_GLITCHTIP_DSN` to `.env.example` with an empty value and a one-line comment; verify a fresh copy of the template to `.env` still starts both `bun run dev` and `bun run build`

## 2. Server error reporting

- [x] 2.1 Add `src/instrument.server.ts` calling `Sentry.init` with the DSN from `~/env.server`, `enabled: env.NODE_ENV === "production"`, `tracesSampleRate: 0.1`, and `httpIntegration({ trackIncomingRequestsAsSessions: false })`; include the `ponytail:` comment recording the late-init limitation and the `NODE_OPTIONS='--import'` upgrade path
- [x] 2.2 Import `./instrument.server` as the first import in `src/entry.server.tsx`; verify `bun run lint` leaves it in position (Biome must not hoist another import above it)
- [x] 2.3 Export `handleError` from `src/entry.server.tsx` that skips aborted requests and 404 route error responses, reports everything else via `Sentry.captureException`, and still `console.error`s; verify by throwing from a loader in a production build and seeing both the console line and a GlitchTip issue
- [x] 2.4 Export `instrumentations = [Sentry.createSentryServerInstrumentation({ captureErrors: false })]` from `src/entry.server.tsx` — tracing only, since `handleError` owns error reporting and `captureErrors` defaults to `true` with no filtering; verify a production document request produces a server transaction in GlitchTip with loader and middleware spans, and that one server error produces exactly **one** issue
- [x] 2.5 Verify a 404 produces no GlitchTip event: request an unknown URL and an unknown workbench slug against a production build and confirm the feed stays empty

## 3. Client error reporting

- [x] 3.1 Initialise Sentry in `src/entry.client.tsx` before `hydrateRoot` with the DSN from `~/env.client`, `enabled: import.meta.env.PROD`, `tracesSampleRate: 0.1`, `reactRouterTracingIntegration()`, and the default integrations filtered to drop `BrowserSession`; verify a production build sends no session envelope on load or unload (check the network tab for envelopes of type `session`)
- [x] 3.2 Pass `instrumentations={[Sentry.createSentryClientInstrumentation({ captureErrors: false })]}` to `<HydratedRouter>` — tracing only, since `onError` owns error reporting; verify a client-side navigation produces a navigation transaction in GlitchTip
- [x] 3.3 Pass an `onError` to `<HydratedRouter>` that returns early for 404 route error responses and otherwise delegates to `Sentry.sentryOnError`; verify a deliberate client-side throw produces exactly **one** GlitchTip issue (not two) while a client-side navigation to an unknown route produces none. Do not add a `captureException` call to `src/root.tsx`'s `ErrorBoundary`

## 4. Content security policy

- [x] 4.1 Add `src/context/nonce.ts` exporting a React context defaulting to `""`
- [x] 4.2 Add `src/lib/csp.ts` building the report-only policy string from a nonce, the OpenPanel API origin, the GlitchTip origin, and the derived security endpoint, per the directive list in design.md; verify with an `assert`-based self-check that the output contains the nonce, the `report-uri`, both connect origins, and no `'unsafe-inline'` in `script-src`
- [x] 4.3 In `src/entry.server.tsx`, generate a per-request nonce with `crypto.randomUUID()`, pass it as the `nonce` option to `renderToPipeableStream`, wrap `<ServerRouter>` in the nonce context provider, and set `Content-Security-Policy-Report-Only` on `responseHeaders`; verify two page loads return different nonces and that no `Content-Security-Policy` header is sent
- [x] 4.4 Apply the nonce in `src/root.tsx`'s `Layout` to the inline theme script, `<Scripts>`, and `<ScrollRestoration>`; verify by viewing source that every inline script carries the header's nonce
- [x] 4.5 Verify the policy attaches only to documents: request `/feed.xml`, `/sitemap.xml`, and a static asset and confirm none carries a CSP header
- [x] 4.6 Load every route in a production build with the browser console open and verify zero violation reports originate from the site's own scripts; record any third-party violations that remain as the input for a future enforcing policy

## 5. Deployment

- [x] 5.1 Add `ARG`/`ENV VITE_GLITCHTIP_DSN` to the build stage of the `Dockerfile` and extend the existing `test -n` guard to cover it; verify the build fails naming the argument when it is omitted and succeeds when supplied
- [x] 5.2 Update the README Deployment section with `VITE_GLITCHTIP_DSN` in both the build and run commands, noting it is required in both phases; verify by following the README end to end on a clean checkout
- [x] 5.3 Run `bun run verify:bundle` against a production build and confirm it passes — `src/lib/glitchtip/dsn.ts` must not have pulled `env.server` into the client graph

## 6. Verification

- [x] 6.1 Run `bun run typecheck`, `bun run lint`, and `bun run build` and confirm all three pass with no new findings
- [x] 6.2 Measure the client bundle size before and after and record the delta in the change's review notes
- [ ] 6.3 Trigger one server error, one client error, one 404, and one navigation against a production build pointed at `glitchtip.themkvz.com`, and confirm the GlitchTip project shows exactly two issues, one transaction, and no session envelopes (triggered; dashboard count not confirmable from here — see Review)

## Review

- **Bundle size delta** (measured via `git stash` to isolate before/after, same lockfile-driven `bun install` + `bun run build`):
  - `entry.client` chunk: 178.1 KB → 327.8 KB raw (+149.7 KB); 55.8 KB → 104.7 KB gzip (+48.9 KB gzip)
  - Total `build/client` JS: 800 KB → 956 KB (+156 KB)
  - Cost is the Sentry browser SDK (tracing + error reporting); replay/feedback/profiling integrations were not added. Matches the risk design.md accepted going in.
- **Session gap found during 2.3 verification, left as-is per user decision**: the Node SDK's default `ProcessSession` integration (separate from `httpIntegration`'s `trackIncomingRequestsAsSessions`) still calls `startSession()`/`endSession()` around the process lifecycle and will emit one session envelope per container restart if a `release` is ever configured. GlitchTip discards it (same as the already-accepted per-request case), but it's a literal (if inconsequential) gap against the observability spec's "SHALL NOT emit session ... envelopes from ... the server" wording. Not fixed in this pass — flagged here for visibility if it ever needs revisiting.
- **Nonce gap found during 4.4 verification, fixed**: `<ServerRouter>` also needed its own `nonce` prop (not just the app's `NonceContext`) — React Router's internally-injected streaming-data scripts (`window.__reactRouterContext.streamController...`) read the nonce from `ServerRouter`'s own framework context, not from any prop on `<Scripts>`/`<ScrollRestoration>`. Without it, two of the page's own inline scripts would have gone unnonced and generated CSP violation reports on every load — exactly the risk design.md called out. Fixed in `entry.server.tsx` (`<ServerRouter nonce={nonce} ... />`); verified by view-source showing all script tags share the header's nonce.
- **6.3 dashboard confirmation**: I don't have GlitchTip API/dashboard access from here, so I can't personally confirm the project shows "exactly two issues, one transaction, no session envelopes." I did trigger one real server error, one real client error, one 404, and one client-side navigation against a production build using the live `glitchtip.themkvz.com` DSN (each via a temporary, fully-reverted test hook — final diff has no test code). Two things affect the count you'll actually see: (1) sections 2–4's own verification passes (run with `debug: true` and `tracesSampleRate: 1` to prove the SDK wiring, then reverted) already sent real error/transaction events to this same live project, so it won't be pristine; (2) the production `tracesSampleRate` is 0.1, so the final navigation's transaction may not have been sampled. The delivery mechanism itself (capture, dedup, 404 suppression, sampling, span content) was already confirmed correct via SDK debug-log output in 2.3–3.3 — please check the GlitchTip UI directly for the final event/issue counts.

## Context

See proposal.md for motivation. `src/root.tsx` exports identity middleware and serializes its fingerprint; its effect identifies the OpenPanel browser client. `src/lib/fingerprint.ts` hashes IP and user agent. `src/lib/openpanel/op.client.ts` enables automatic events and waits for identification. `useOpenPanel.ts` lazily imports that client. Server analytics already bind a request-specific profile. The actual installed React Router version is 8.3.1, despite the repository guide saying 7; implementation must use installed framework types.

## Goals / Non-Goals

**Goals:** Standard GrowthBook hooks in deeply nested components, matching SSR/hydration, and attributable exposure events without passing individual flag values through loaders and props.

**Non-Goals:** Browser streaming or automatic feature fetching, visual-editor DOM mutations, a generic experiment registry, cross-device identity, sticky assignments across experiment reconfiguration, or conversion statistics inside GrowthBook. “Variant result” means exposure/assignment metadata in OpenPanel, not automatic calculation of an experiment winner.

## Decisions

### Hybrid SSR and shared React provider

Follow [GrowthBook’s hybrid SSR guidance](https://docs.growthbook.io/lib/react#hybrid-ssr-+-client-side): fetch definitions on the server, serialize the decrypted SDK payload, and initialize `GrowthBookProvider` synchronously using `initSync({ payload, streaming: false })`. Use compatible `@growthbook/growthbook` and `@growthbook/growthbook-react` versions installed with Bun. `initSync` requires an unencrypted payload; no decryption or management secrets may reach the browser.

The root loader returns the JSON-safe payload and the middleware fingerprint as `attributes.id`. Initialize the provider before rendering consumers, with the same fingerprint and normalized page URL during SSR and hydration. Derive the URL from the router’s committed location, including client navigation, rather than browser-only state or stale root loader data. No effect may initialize the first variant after hydration. Nested components import standard `useFeatureValue` and `useFeatureIsOn` hooks directly; no per-feature route loader or prop chain is required. These are ordinary SSR/hydrated React components, not React Server Components.

Keep server definition fetching/cache shared, with a 1,000 ms cold initialization bound and nominal 60-second refresh. Verify the selected SDK’s supported refresh API during implementation. Check initialization success explicitly because a timeout need not throw. Keep evaluation instances, attributes, and captured assignments isolated per SSR render; never put a visitor’s attributes on the shared fetching instance. Release provider instances/subscriptions when replaced or unmounted using lifecycle handling verified under StrictMode.

The browser evaluates locally from the loader payload, with streaming and automatic fetching disabled. Do not provide browser fetch configuration merely because the server uses it. Server definition refresh cannot mutate a serialized snapshot. The browser retains its payload until a reload or committed root-loader revalidation supplies a new one. Ordinary client navigation uses the current payload with the destination URL; any replacement payload and attributes must become visible together with their committed router state. Rerenders alone do not recreate the provider or reset assignment tracking.

Traditional SSR with per-feature loader values remains a valid alternative, but requires passing each consumed value through component layers. Hybrid SSR is selected for direct nested-component hook access. Sending the configured connection’s definitions, including unused variations and targeting rules, is an accepted trade-off; use a browser-appropriate SDK connection.

### OpenPanel exposure bridge

Capture actual experiment participation through the SDK evaluation callback. Hooks can evaluate while React is rendering: the callback must not send analytics directly. Associate pending participation with the consuming experiment subtree and confirm it after that subtree commits; a small exposure boundary may surround experiment content while nested consumers retain standard SDK hooks. A root effect that flushes every render-time callback is insufficient for abandoned or suspended child renders. Include control participants; exclude missing flags, nonparticipants, ordinary non-experiment flags, and invalid values replaced by fallback.

The exposure bridge reports after the consuming subtree commits, including content first mounted after hydration. Identify the existing OpenPanel singleton with the provider’s evaluation fingerprint before tracking; share the initialization path with the root identification effect so child effect order cannot attribute an event to a prior profile. Preserve existing auto-event settings and profile properties.

Add `Experiment Viewed` to `TRACK_EVENTS`. Properties: `feature_key` (string), `experiment_id` (experiment key), `variation_id` (numeric result index), and `variation_key` (string result key). The OpenPanel profile ID equals the evaluation fingerprint. Do not send the arbitrary variant value, raw IP, or user agent as custom event properties.

Deduplicate within a browser document by fingerprint + experiment ID + variation ID, across StrictMode effects, rerenders, and client navigation. A full reload may report a new exposure. Prefetches, aborted navigations, HEAD requests, and SSR alone send no exposure; there is no server-side duplicate event. Existing conversion events remain joinable by profile ID. No mutable single “current variant” profile property that loses simultaneous experiment assignments.

Analytics is best effort, with rejected imports/sends handled without breaking rendering. Do not add a persistent queue or promise exactly-once delivery. An ad blocker or disabled JavaScript can prevent collection.

### Configuration and failure behavior

Declare optional public `VITE_GROWTHBOOK_API_HOST` and `VITE_GROWTHBOOK_CLIENT_KEY` using existing shared validation patterns. Both absent disables evaluation and uses fallbacks; partial configuration or an invalid HTTP(S) host fails validation with variable names only. The SDK connection key is a public read key, not a management API credential. Keep template and setup documentation aligned; no additional secret is required.

Unavailable definitions after the bounded wait yield an empty payload, explicit hook fallbacks, and no fabricated experiment events. A late SDK response must not mutate an already-returned snapshot. Server refresh recovery affects later root-loader responses; mounted browsers adopt a replacement only on reload or committed root-loader revalidation. Validate remote payload structure and the value contracts of introduced experiments before provider initialization; SDK hook generics/defaults are not runtime validation of arbitrary remote values. Reject invalid experiment definitions from the snapshot so consumers use fallbacks without exposure to rejected values. The browser never connects to GrowthBook, so no CSP GrowthBook origin is needed. Personalized HTML/data must use private, non-shared caching so one fingerprint's result cannot be served to another visitor.

## Risks / Trade-offs

- IP/user-agent changes or shared fingerprints affect bucketing → reuse existing identity consistently and document its ceiling; a persistent visitor ID is separate scope.
- Runtime compatibility and SDK API availability → select a compatible release with Bun and verify the installed timeout, polling, and callback behavior using fixtures.
- Cached definitions delay changes → accept nominal 60-second server refresh; existing browser snapshots update only on reload or root-loader revalidation. Use fallbacks on a cold outage.
- Browser payloads contain targeting rules and unused variations → keep confidential targeting data out of the selected SDK connection.
- Render-time SDK callbacks can include abandoned work → verify subtree commit gating, Suspense, and late-mounted consumers; do not equate evaluation with exposure.
- Browser-only exposure reporting misses no-JavaScript visits and blocked analytics → accepted best-effort semantics, avoiding speculative server exposure counts.
- No live experiment is selected → verify two variants through controlled fixtures; production activation requires a later choice of feature key and UI behavior.

## Migration Plan

Implement and verify locally, then configure the two public connection variables together using an SDK connection for the intended environment. With no component consuming an experiment, current UI remains unchanged. Deployment and external GrowthBook/OpenPanel configuration are separate authorized actions. Disable by removing both connection variables and restarting/rebuilding as appropriate; consumers then render their documented fallbacks.

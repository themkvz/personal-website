## 1. SDK and configuration

- [ ] 1.1 Add compatible `@growthbook/growthbook` and `@growthbook/growthbook-react` releases with Bun; verify installed APIs support payload extraction, synchronous provider initialization, hooks, tracking callbacks, bounded server initialization, and cached refresh. Keep the lockfile package-manager generated.
- [ ] 1.2 Declare the optional public API host/client-key pair in existing environment validation and update `.env.example`; verify disabled, complete, partial, and malformed configurations, including value-free error output. Document that management PAT configuration is separate from the app’s SDK connection.

## 2. Server payload and provider

- [ ] 2.1 Implement server definition loading with a 1,000 ms cold initialization bound, SDK caching, nominal 60-second refresh, and recovery; verify cold timeout, cached outage, and recovery using a controlled payload source.
- [ ] 2.2 Return the decrypted JSON-safe feature payload and existing fingerprint from the root loader after identity middleware; verify payload validation, concurrent visitor isolation, and exclusion of management/decryption secrets. Validate introduced experiment value contracts before provider initialization so rejected definitions yield fallbacks without exposure.
- [ ] 2.3 Initialize a shared React provider synchronously for SSR and hydration, with streaming and automatic browser fetching disabled. Verify identical payload, fingerprint, and normalized page URL on the initial render; verify provider stability on rerenders, request isolation, cleanup, StrictMode, and atomic adoption of replacement bootstrap data on committed root-loader revalidation.
- [ ] 2.4 Apply private caching to personalized document and data responses; verify response headers prevent shared-cache reuse across fingerprints while preserving existing response headers.

## 3. Nested consumption and analytics

- [ ] 3.1 Demonstrate standard `useFeatureValue` / `useFeatureIsOn` hooks in deeply nested components without per-feature loaders or intermediate flag props. Verify control/treatment, missing and invalid values, nonparticipants, late-mounted consumers, and destination URL targeting on client navigation with controlled fixtures, without adding a production experiment.
- [ ] 3.2 Add `Experiment Viewed` to the existing event catalog and bridge SDK participation to the OpenPanel singleton after the consuming subtree commits. Verify exact property types, control inclusion, and identification before exposure while preserving existing root identification and automatic event behavior. Keep standard consumption hooks; use a small experiment exposure boundary where commit confirmation is needed, and verify render-time callbacks never send directly or leak abandoned/Suspense evaluations through a root flush.
- [ ] 3.3 Deduplicate by fingerprint/experiment/variation for the browser document and contain analytics failures; verify StrictMode replay, rerenders, client navigation, provider replacement, full reload, multiple experiments, late-mounted content, and rejected sends against a captured analytics transport.

## 4. Verification and usage documentation

- [ ] 4.1 Leave a focused runnable Bun check for bootstrap/assignment isolation, fallback behavior, and exposure payload/deduplication, without adding a test framework; document its exact invocation in AGENTS.md and run it successfully.
- [ ] 4.2 Verify nested hook fixtures in a real browser with slow loading, JavaScript disabled, client navigation, prefetch, abandoned and suspended renders, late-mounted content, and a late server definition update. Confirm no hydration swap/warning, no browser GrowthBook fetch or stream, no speculative exposure, and snapshot refresh only on reload or committed root-loader revalidation. Capture OpenPanel requests locally to prove variant events and subsequent clicks share the assignment profile ID.
- [ ] 4.3 Run `bun run lint`, `bun run typecheck`, `bun run build`, and `bun run verify:bundle`; inspect client output and loader payloads for server-only imports and credentials while allowing the React SDK and configured connection’s definitions. Report any pre-existing failures separately.
- [ ] 4.4 Document SDK connection setup, root provider bootstrap, a nested standard-hook example, experiment exposure boundary usage, event fields/deduplication, snapshot refresh semantics, browser-visible targeting rules, fingerprint stability, and disable/rollback steps. Verify examples against fixtures and ensure no external dashboard changes or deployment are required for local completion.

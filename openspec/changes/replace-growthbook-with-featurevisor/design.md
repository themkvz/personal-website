# Design

## Context

See `proposal.md` for motivation. Relevant current state:
- `src/root.tsx` runs `identityMiddleware`, calls `getFeaturePayload()` from `src/lib/growthbook/payload.server.ts`, returns `{ fingerprint, features }`, and wraps the app (and `ErrorBoundary`) in `<ExperimentProvider payload={features} fingerprint={fingerprint}>`.
- `src/lib/growthbook/provider.tsx` creates a `GrowthBook` instance per render pass (`useMemo`), buckets by `attributes: { id: fingerprint }`, and uses GrowthBook's `trackingCallback` to identify the visitor (`exp_<key>`) and emit `TRACK_EVENTS.EXPERIMENT_VIEWED` to OpenPanel.
- `src/lib/growthbook/useExperiments.ts` exports `EXPERIMENTS` (`FOOTER_BADGE`), `useExperimentIsOn`, and `useExperimentValue`, consumed by `src/components/layout/footer.tsx`.
- `src/constants.ts` (`Home.integrations`) lists `"GrowthBook"` under `"DURING THE RENDER"`.
- `src/env.server.ts`, `.env.example`, `package.json` (`verify:bundle`), and `AGENTS.md` declare or reference `GROWTHBOOK_API_HOST` and `GROWTHBOOK_CLIENT_KEY`.
- Project skills live under `.agents/skills/` (for example, `react-doctor`, `react-router-framework-mode`, `seo-audit`, `workbench-artifact`).

## Goals / Non-Goals

**Goals:**
- Define features, attributes, and test specs in Git using Featurevisor's declarative YAML format and validate/compile them via the Featurevisor CLI (`lint`, `test`, `build`).
- Install the official Featurevisor AI agent skill (`featurevisor/featurevisor`) into the repository's skill directory so coding agents can manage flags and tests using `/featurevisor`.
- Evaluate flags and variations synchronously in memory during SSR and hydration using `@featurevisor/sdk` and `@featurevisor/react`, keyed by the existing visitor `fingerprint`.
- Preserve the existing `EXPERIMENTS` catalog, `useExperimentIsOn` / `useExperimentValue` ergonomics, and OpenPanel `Experiment Viewed` event schema (`feature_key`, `experiment_id`, `variation_id`, `variation_key`) with document-lifetime deduplication.
- Update the Home integrations copy (`src/constants.ts`) from `GrowthBook` to `Featurevisor` without exposing file paths or implementation identifiers.

**Non-Goals:**
- Hosting a separate CDN or external server for datafiles; the compiled datafile is bundled directly with the application.
- Adding new production experiments beyond migrating `footer-badge`.
- Changing visitor fingerprint generation (`src/lib/fingerprint.ts`) or OpenPanel client initialization (`src/lib/openpanel/`).

## Decisions

### 1. Repository layout and bundled datafile build

Keep Featurevisor definitions in a dedicated top-level `featurevisor/` directory (or configured source paths in `featurevisor.config.js` / `featurevisor.config.ts`) so they stay cleanly separated from `content/` (which is reserved for MDX collections loaded by `src/content/`):

```text
featurevisor.config.js
featurevisor/
├── attributes/
│   └── id.yml
├── features/
│   └── footer-badge.yml
└── tests/
    └── footer-badge.spec.yml
src/lib/featurevisor/
├── datafile.json          # Compiled output from `featurevisor build`
├── provider.tsx           # FeaturevisorProvider + OpenPanel exposure bridge
└── useExperiments.ts      # Typed EXPERIMENTS catalog and hooks
```

- **Why a bundled JSON datafile (`src/lib/featurevisor/datafile.json`) over runtime HTTP fetch**: In a single-repo SSR app on Bun, importing the compiled `datafile.json` directly into `src/lib/featurevisor/provider.tsx` means both server rendering and browser hydration read the exact same immutable datafile with `0 ms` latency. The root loader (`src/root.tsx`) only needs to return `{ fingerprint }`—no `features` payload has to be fetched or serialized a second time in loader data.
- **Alternative considered**: Fetching `datafile.json` over HTTP in the root loader and passing it through `loaderData`. Rejected because the datafile is already compiled at build time in the same repository; double-serializing it in the root loader adds payload bloat with no benefit.
- **Build & verification scripts**: Add `flags:lint` (`featurevisor lint`), `flags:test` (`featurevisor test`), and `flags:build` (`featurevisor build`) scripts to `package.json`, and run datafile build/check as part of standard validation so definitions and `datafile.json` cannot drift.

### 2. Featurevisor AI agent skill installation

Install the official skill from `featurevisor/featurevisor` using:
```bash
npx skills add featurevisor/featurevisor
```
configured for the project's agent skills directory (`.agents/skills/featurevisor/`).
- **Rationale**: Gives AI coding agents the authoritative Featurevisor v2 YAML schema, CLI flags, and testing patterns when creating or modifying experiments in the repo.

### 3. Request-isolated `createInstance` and React provider (`src/lib/featurevisor/provider.tsx`)

In `ExperimentProvider({ fingerprint, children })`, instantiate Featurevisor synchronously inside `useMemo(() => createInstance({ datafile, context: { id: fingerprint } }), [fingerprint])` and pass the instance to `<FeaturevisorProvider instance={f}>`.

- **Why `context: { id: fingerprint }` on the instance**: Every `useFlag` / `useVariation` call inside `@featurevisor/react` inherits the instance's initial context (`{ id: fingerprint }`), so deeply nested components like `Footer` do not need to read `fingerprint` themselves.
- **Request isolation**: A fresh `createInstance` is created inside `useMemo` per render tree (scoped to the SSR request on the server, and stable across rerenders for the document lifetime in the browser), preventing cross-request state leakage.

### 4. OpenPanel exposure bridge and commit-safe deduplication

GrowthBook relied on a render-time `trackingCallback`, which had a known drawback documented in `src/lib/growthbook/provider.tsx`: a render React later abandoned could still trigger the callback.

With Featurevisor, we evaluate synchronously via `@featurevisor/react` (`useFlag(key)` / `useVariation(key)`) or `instance.evaluateFlag` / `instance.evaluateVariation` inside `useExperimentIsOn` and `useExperimentValue`, and trigger OpenPanel exposure reporting from a **`useEffect` after commit**:

1. During render, the hook evaluates the flag (`isEnabled`) and variation (`evaluateVariation` / `getVariation`) synchronously from the Featurevisor instance so SSR and initial hydration return the exact same value.
2. When the evaluation represents an allocated experiment variation (e.g. `reason === "allocated"` or an active variation ruleset with a resolved `variationValue` and `variation` index), a `useEffect` in the hook (which only runs in the browser after React commits the component subtree) checks a document-scoped deduplication `Set<string>` keyed by `${fingerprint}:${experimentId}:${variationId}`.
3. On the first committed exposure for that key in the current document, it calls:
   - `void identifyVisitor(fingerprint, { [`exp_${experimentId}`]: variationKey })`
   - `void track(TRACK_EVENTS.EXPERIMENT_VIEWED, { feature_key, experiment_id, variation_id, variation_key }).catch(() => undefined)`
4. Non-experiment flags, disabled features (`enabled: false`), or unallocated visitors render their fallback and never emit an `Experiment Viewed` event.

- **Why commit-time `useEffect` in the hook over SDK `afterEvaluation` module**: An SDK-level `afterEvaluation` module fires during React's render phase (just like GrowthBook's `trackingCallback`), which can fire on uncommitted or speculative renders. Running the OpenPanel dispatch in `useEffect` inside `useExperimentIsOn` / `useExperimentValue` guarantees the consuming component actually committed to the DOM while keeping deduplication scoped to the browser document.

### 5. Homepage "HOW THIS SITE WORKS" copy update

Update `Home.integrations` in `src/constants.ts`:
- Change `name: "GrowthBook"` to `name: "Featurevisor"`.
- Keep `phase: "DURING THE RENDER"`.
- Update `role` and `consequence` to reflect Git-compiled feature flags and experiment assignment resolved on the server before the document is sent, while strictly obeying the `site-pages` spec rule: **no file paths, directory names, module names, package names, or configuration keys in the visible copy**.

## Risks / Trade-offs

- **Edited YAML definitions without rebuilding `datafile.json`** → Wire `flags:build` into `bun run build` and `flags:lint && flags:test` into verification checks so stale datafiles are caught automatically.
- **Variation index (`variation_id`) mapping** → Featurevisor variations are identified by string values (`"control"`, `"treatment"`), whereas OpenPanel's `Experiment Viewed` contract expects both numeric `variation_id` and string `variation_key`. Mitigation: define the ordered variations list in `EXPERIMENTS` (or derive the index from the datafile feature's `variations` array) so `control` maps deterministically to `0` and `treatment` to `1`.
- **Bundle size and server env leakage** → Remove `GROWTHBOOK_CLIENT_KEY` from `verify:bundle` in `package.json` (keeping `OP_CLIENT_SECRET|FINGERPRINT_SECRET|env\.server`) and verify `@featurevisor/core` (CLI-only) remains in `devDependencies` while only `@featurevisor/sdk` and `@featurevisor/react` are imported by runtime code.

## Migration Plan

1. Install Featurevisor packages (`@featurevisor/sdk`, `@featurevisor/react` in `dependencies`; `@featurevisor/core`, `@featurevisor/types` in `devDependencies`), remove `@growthbook/growthbook` and `@growthbook/growthbook-react`, and install the `featurevisor/featurevisor` AI agent skill.
2. Scaffold `featurevisor.config.js` and `featurevisor/{attributes,features,tests}/` with the `id` attribute and `footer-badge` feature (`control` / `treatment` variations, disabled or default-off in production to match current behavior, plus declarative test specs), then compile `src/lib/featurevisor/datafile.json`.
3. Create `src/lib/featurevisor/provider.tsx` and `src/lib/featurevisor/useExperiments.ts`, update `src/root.tsx` and `src/components/layout/footer.tsx`, and delete `src/lib/growthbook/`.
4. Remove `GROWTHBOOK_API_HOST` and `GROWTHBOOK_CLIENT_KEY` from `src/env.server.ts`, `.env.example`, `package.json`, and `AGENTS.md`, and update `src/constants.ts` (`Home.integrations`).
5. Run Featurevisor lint/test/build, unit tests for evaluation/isolation/deduplication, `bun run lint`, `bun run typecheck`, `bun run build`, and `bun run verify:bundle`.

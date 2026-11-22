# Proposal

## Why

GrowthBook requires an external API host, SDK client key, and a 1,000 ms server-side network fetch on cold requests, which conflicts with the repository's Git-native, zero-external-database model. Replacing GrowthBook with Featurevisor moves feature flags, rollout rules, test specs, and A/B experiments into version-controlled files compiled into a local datafile, eliminating runtime network latency and external service credentials while preserving deterministic server/hydration rendering and OpenPanel exposure attribution.

## What Changes

- **BREAKING**: Remove `@growthbook/growthbook`, `@growthbook/growthbook-react`, `src/lib/growthbook/`, and the `GROWTHBOOK_API_HOST` / `GROWTHBOOK_CLIENT_KEY` environment variables from `src/env.server.ts`, `.env.example`, `package.json`, and `AGENTS.md`.
- Add Featurevisor (`@featurevisor/core`, `@featurevisor/sdk`, `@featurevisor/react`, `@featurevisor/types`) and configure a repository-local Featurevisor project (`featurevisor.config.ts` / declarative YAML definitions for attributes, features, and test specs) that compiles into a committed/build-time JSON datafile (`lint`, `test`, `build`).
- Install the official Featurevisor AI agent skill (`npx skills add featurevisor/featurevisor`) so coding agents can author, lint, test, and debug Featurevisor definitions in the repository.
- Replace the asynchronous server feature fetch (`getFeaturePayload`) and GrowthBook React provider with a synchronous Featurevisor provider and typed consumption hooks (`src/lib/featurevisor/`) backed by the compiled datafile and the visitor's existing HMAC `fingerprint`.
- Bridge Featurevisor evaluation to OpenPanel on the client so active experiment exposures still identify the visitor profile (`exp_<experiment>`) and emit deduplicated `Experiment Viewed` events after render.
- Update the Home page "HOW THIS SITE WORKS" integrations copy (`src/constants.ts`) to present `Featurevisor` instead of `GrowthBook`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `experimentation`: Replace remote GrowthBook payload fetching, 1,000 ms network timeout recovery, and `GROWTHBOOK_*` connection configuration requirements with repository-compiled Featurevisor datafile evaluation, declarative rule/test validation, deterministic fingerprint bucketing, and OpenPanel exposure tracking.
- `site-pages`: Update the Home integrations panel requirement (`Home integrations panel names the services the site runs on`) to cover `Featurevisor` instead of `GrowthBook`.

## Impact

- **Dependencies**: Remove `@growthbook/growthbook` and `@growthbook/growthbook-react`; add `@featurevisor/core`, `@featurevisor/sdk`, `@featurevisor/react`, and `@featurevisor/types` via Bun.
- **Agent tooling**: Install `featurevisor/featurevisor` skill under `.agents/skills/` via `npx skills add featurevisor/featurevisor`.
- **Feature definitions & scripts**: Add Featurevisor config, attribute/feature/test definitions (starting with `footer-badge`), compiled datafile module, and `package.json` scripts for linting, testing, and building the datafile.
- **Application code**: Replace `src/lib/growthbook/` with `src/lib/featurevisor/`, simplify `src/root.tsx` loader and `ExperimentProvider` wiring, update `src/components/layout/footer.tsx` imports, update `src/constants.ts` Home integration copy, and remove `GROWTHBOOK_*` from `src/env.server.ts`, `.env.example`, `package.json` (`verify:bundle`), and `AGENTS.md`.

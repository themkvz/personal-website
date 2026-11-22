# Tasks

## 1. Dependencies, AI Agent Skill, and Featurevisor Project Setup

- [x] 1.1 Remove `@growthbook/growthbook` and `@growthbook/growthbook-react` and install `@featurevisor/sdk` and `@featurevisor/react` in `dependencies` plus `@featurevisor/core` and `@featurevisor/types` in `devDependencies` using Bun; verify `package.json` and `bun.lock` contain no `@growthbook/*` packages.
- [x] 1.2 Install the official Featurevisor AI agent skill from https://github.com/featurevisor/featurevisor#using-featurevisor-with-ai-agents via `npx skills add featurevisor/featurevisor` into the repository's `.agents/skills/` directory; verify the skill's `SKILL.md` file exists under `.agents/skills/`.
- [x] 1.3 Create `featurevisor.config.js` and declarative definitions under `featurevisor/` (`attributes/id.yml`, `features/footer-badge.yml` with `control` and `treatment` variations, and `tests/footer-badge.spec.yml`), and add `flags:lint`, `flags:test`, and `flags:build` scripts to `package.json` targeting `src/lib/featurevisor/datafile.json`; verify `bun run flags:lint`, `bun run flags:test`, and `bun run flags:build` succeed offline and generate `src/lib/featurevisor/datafile.json`.

## 2. Featurevisor Provider, Experiment Hooks, and OpenPanel Bridge

- [x] 2.1 Implement `src/lib/featurevisor/provider.tsx` and `src/lib/featurevisor/useExperiments.ts` (`EXPERIMENTS`, `useExperimentIsOn`, `useExperimentValue`) backed by the compiled `datafile.json`, request-isolated `createInstance({ datafile, context: { id: fingerprint } })`, and commit-time OpenPanel exposure reporting (`identifyVisitor` with `exp_<experiment>` and `TRACK_EVENTS.EXPERIMENT_VIEWED` deduplicated per document lifetime); verify unit tests in `src/lib/featurevisor/featurevisor.test.ts` pass via `bun test src/lib/featurevisor/featurevisor.test.ts` covering deterministic bucketing, visitor isolation, disabled/fallback behavior, and exposure deduplication.
- [x] 2.2 Wire `src/root.tsx` (`loader`, `App`, and `ErrorBoundary`) and `src/components/layout/footer.tsx` to `src/lib/featurevisor/provider` and `src/lib/featurevisor/useExperiments`, remove `getFeaturePayload()` from the root loader, and delete `src/lib/growthbook/`; verify `rg "growthbook" src/` returns zero matches.

## 3. Environment Configuration, Homepage Copy, and Documentation

- [x] 3.1 Remove `GROWTHBOOK_API_HOST` and `GROWTHBOOK_CLIENT_KEY` from `src/env.server.ts`, `.env.example`, and the `verify:bundle` script in `package.json`; verify server environment validation succeeds without `GROWTHBOOK_*` variables set.
- [x] 3.2 Update the `"DURING THE RENDER"` entry in `Home.integrations` (`src/constants.ts`) from `"GrowthBook"` to `"Featurevisor"` with copy describing repository-defined feature flags and server-resolved experiment assignment without naming any file path, directory, module, package, or configuration key; verify `rg -i "growthbook" src/constants.ts` returns zero matches and the copy satisfies the `site-pages` spec constraints.
- [x] 3.3 Update `AGENTS.md` (Files and Structure, Server env vars, and Tests sections) to replace `src/lib/growthbook/` and `GROWTHBOOK_*` references with `src/lib/featurevisor/`, the Featurevisor CLI scripts, and the `bun test src/lib/featurevisor/featurevisor.test.ts` command; verify `rg -i "growthbook" AGENTS.md .env.example package.json` returns zero matches.

## 4. End-to-End Verification

- [x] 4.1 Run `bun run flags:lint`, `bun run flags:test`, `bun run flags:build`, `bun test`, `bun run lint`, `bun run typecheck`, `bun run build`, and `bun run verify:bundle`; verify all commands exit with code 0 and the built client bundle contains no server-only secrets.

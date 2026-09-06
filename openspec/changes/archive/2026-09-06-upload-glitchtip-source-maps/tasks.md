> **Rescoped during implementation.** `proposal.md` and `design.md` describe an
> automated build-time upload (the `@sentry/react-router` Vite plugin plus a
> `sentryOnBuildEnd` hook, driven by a `SENTRY_AUTH_TOKEN` BuildKit secret in the
> Docker build). That path was not adopted. What shipped is the manual,
> out-of-band workflow the archived `specs/observability/spec.md` delta
> describes: the build can emit hidden maps on demand, and a maintainer uploads
> them with `@glitchtip/cli` using their own local credentials. The plan
> documents are left as written, as the record of what was considered; the tasks
> below are the record of what was done.

## 1. Shared reporting options (DRY cleanup)

- [x] 1.1 Add `src/lib/glitchtip/options.ts` exporting `TRACES_SAMPLE_RATE` and `withoutSessions(sessionIntegrationName, ...extra)` per `design.md`. Verified it imports nothing from `~/env.server` or any Node built-in — the same client-bundle-safety constraint `dsn.ts` documents; its only import is `type { Integration }` from `@sentry/core`.
- [x] 1.2 Rewrite `src/instrument.server.ts` and `src/entry.client.tsx` to consume both exports, keeping `dsn` and `enabled` explicit at each site along with their existing explanatory comments, and collapse the redundant `import * as Sentry` + named-import pair in each file. Verified `bun run typecheck` and `bun run lint` pass and the two `Sentry.init` calls contain no duplicated literal.
- [x] 1.3 Verify the behavior is unchanged: `bun run build` succeeds, and the session filter is still present on each side — `"ProcessSession"` in `build/server/index.js`, `BrowserSession` in `build/client/assets/entry.client-*.js`.

## 2. On-demand source map generation

- [x] 2.1 Set `build.sourcemap` in `vite.config.ts` to `"hidden"` when `process.env.SOURCEMAPS` is set and `false` otherwise, with a comment naming the manual `glitchtip-cli sourcemaps inject` + `upload` follow-up. `hidden` emits the `.map` files without a `sourceMappingURL` comment in the bundles, per `design.md`.
- [x] 2.2 Add the `build:sourcemaps` script (`SOURCEMAPS=1 react-router build`) to `package.json`, leaving `build` untouched as the deploy path.
- [x] 2.3 Add `@glitchtip/cli` as a devDependency — the tool that performs the inject and upload steps. It reads its own local login/config; nothing passes it a credential from this project.
- [x] 2.4 Add `.sentryclirc` to `.gitignore` and `.dockerignore` so a maintainer's local CLI credentials can neither be committed nor reach the image build context.

## 3. Verification

- [x] 3.1 Normal build stays map-free: `bun run build` exits 0 and `find build -name '*.map'` returns nothing. The single `sourceMappingURL` string in `build/client/assets` is a literal inside Sentry's own replay bundle's map parser, not an emitted comment.
- [x] 3.2 Source-map build emits maps: `bun run build:sourcemaps` exits 0 and produces 31 `.map` files (29 client, 2 server).
- [x] 3.3 No new runtime credential: `src/env.client.ts`, `src/env.shared.ts`, and `src/env.server.ts` declare no `SENTRY_*` or upload token, and the Dockerfile and running container are unchanged by this change.
- [x] 3.4 `bunx openspec validate --specs --strict` passes (7/7) after the observability delta is synced into `openspec/specs/observability/spec.md`.

## 4. Not done (dropped with the rescope)

- [ ] 4.1 Confirm the GlitchTip instance is ≥ 4.2 (ideally ≥ 6) and that `GET /api/0/organizations/<org>/chunk-upload/` returns an upload-capability payload. Not needed for the manual path, which the CLI negotiates itself at upload time.
- [ ] 4.2 `sentryReactRouter(...)` in the Vite plugin list and the `sentryOnBuildEnd` hook in `react-router.config.ts`, gated on `SENTRY_AUTH_TOKEN`. Not added — no automated upload.
- [ ] 4.3 Dockerfile `# syntax=docker/dockerfile:1`, `SENTRY_URL`/`SENTRY_ORG`/`SENTRY_PROJECT` build args, and `RUN --mount=type=secret,id=sentry_auth_token`. Not added — no credential enters the image build.
- [ ] 4.4 `.env.example`, README, and `AGENTS.md` entries for a build-time-only credential tier. Not added — no such credential exists; the workflow is documented in `design.md` and in the `vite.config.ts` comment.
- [ ] 4.5 End-to-end proof that a deployed error resolves to a path under `src/`. Not performed — it depends on a maintainer running the manual upload against a live instance, which is out-of-band by design.

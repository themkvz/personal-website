## 1. Verify the assumption before building anything

- [ ] 1.1 Confirm the GlitchTip instance is ≥ 4.2 (ideally ≥ 6) — check its version in the UI footer or `GET /api/0/` — and verify `GET /api/0/organizations/<org>/chunk-upload/` returns an upload-capability payload rather than 404 when called with the auth token. If either fails, stop: the approach in `design.md` does not apply and the change needs replanning.
- [ ] 1.2 Create a GlitchTip auth token with project write/release scope, and confirm `SENTRY_URL`, `SENTRY_ORG`, `SENTRY_PROJECT` resolve to the real instance, org slug, and project slug. Verify by listing the project through the API with that token.

## 2. Shared reporting options (DRY cleanup)

- [x] 2.1 Add `src/lib/glitchtip/options.ts` exporting `TRACES_SAMPLE_RATE` and `withoutSessions(sessionIntegrationName, ...extra)` per `design.md`. Verify it imports nothing from `~/env.server` or any Node built-in — the same client-bundle-safety constraint `dsn.ts` documents.
- [x] 2.2 Rewrite `src/instrument.server.ts` and `src/entry.client.tsx` to consume both exports, keeping `dsn` and `enabled` explicit at each site along with their existing explanatory comments, and collapse the redundant `import * as Sentry` + named-import pair in each file. Verify `bun run typecheck` and `bun run lint` pass and the two `Sentry.init` calls contain no duplicated literal.
- [x] 2.3 Verify the behavior is unchanged: `bun run build` succeeds, and `grep -c '"ProcessSession"\|"BrowserSession"' build/server/index.js build/client/assets/entry.client-*.js` still shows the filter present on each side.

## 3. Source map generation and upload

- [ ] 3.1 Add `const uploadSourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN)` to `vite.config.ts`; set `build.sourcemap` to `"hidden"` when true and leave it off otherwise. Verify `SENTRY_AUTH_TOKEN= bun run build` produces no `.map` under `build/`, and a build with a dummy token does.
- [ ] 3.2 Add `sentryReactRouter({ org, project, authToken, url, sourcemaps: { filesToDeleteAfterUpload: [...] } }, config)` to the plugin list, conditionally on `uploadSourceMaps`, reading all four values from `process.env`. Note this requires the `defineConfig((config) => ({...}))` callback form — the current config is a plain object. Verify the client build still emits identical asset hashes for unchanged modules.
- [ ] 3.3 Add the `buildEnd` hook to `react-router.config.ts` calling `await sentryOnBuildEnd({ viteConfig, reactRouterConfig, buildManifest })`, gated on the same `SENTRY_AUTH_TOKEN` check. Verify `bun run typecheck` passes.
- [ ] 3.4 Run a real build against the GlitchTip instance with credentials set. Verify the build log reports artifact bundles uploaded for both the client and server outputs, and the bundles appear in the GlitchTip project's source-maps/artifacts view.
- [ ] 3.5 Verify no map survives: `find build -name '*.map'` returns nothing, and `grep -rl sourceMappingURL build/client/assets` returns nothing.
- [ ] 3.6 Verify a credential-free build still works: with `SENTRY_AUTH_TOKEN` unset, `bun run build` exits 0, prints that upload was skipped, and `bun start` serves the site.

## 4. Docker build

- [ ] 4.1 Add `# syntax=docker/dockerfile:1` as the Dockerfile's first line and add `SENTRY_URL`, `SENTRY_ORG`, `SENTRY_PROJECT` as build args in the `build` stage. Verify the existing build still succeeds unchanged.
- [ ] 4.2 Change the build stage's `RUN bun run build` to `RUN --mount=type=secret,id=sentry_auth_token,env=SENTRY_AUTH_TOKEN bun run build`, and extend the existing `RUN test -n "$VITE_..."` guard to assert the secret and the three new args are non-empty. Verify a build omitting `--secret` fails with a message naming the credential.
- [ ] 4.3 Build the image end to end with `--secret id=sentry_auth_token,env=SENTRY_AUTH_TOKEN`. Verify it succeeds and the upload lands in GlitchTip.
- [ ] 4.4 Verify the token did not leak: `docker history --no-trunc <image>` shows no token value, and `docker run --rm --entrypoint sh <image> -c 'grep -r "<token-prefix>" / 2>/dev/null; find /app/build -name "*.map"'` finds neither the value nor any map.
- [ ] 4.5 Verify the runtime is unaffected: start the container with only the documented run-time variables (no `SENTRY_*`) and confirm it serves and passes its healthcheck.

## 5. End-to-end proof

- [ ] 5.1 Deploy or run the built image, trigger a deliberate server-side error from a loader, and verify the GlitchTip event's top frames name a path under `src/` with a plausible line and function — not `build/server/index.js`.
- [ ] 5.2 Trigger a client-side error after hydration and verify the same for the browser event — an authoring path under `src/`, not a hashed asset with a single-line offset. Remove both deliberate errors afterward.
- [ ] 5.3 Verify no source map is reachable from the deployed site: request a served asset's URL with `.map` appended and confirm it is not served.

## 6. Documentation

- [ ] 6.1 Add the four `SENTRY_*` entries to `.env.example` under a clearly marked build-time-only section stating they must never be set on the running container, and note why they keep Sentry's canonical names while the DSN does not. Verify no real values are present.
- [ ] 6.2 Update the README Deployment section: add the three new build args and the `--secret` flag to the build command inline, add the build-time-only rows to the variable table with a phase column, and state that they do not belong in `docker run`. Verify by following the README's commands verbatim on a clean checkout.
- [ ] 6.3 Add a one-line note to `AGENTS.md` that production builds upload source maps and that `.map` files must never be committed or shipped. Verify `.gitignore` already excludes `build/`.
- [ ] 6.4 Run `openspec validate upload-glitchtip-source-maps --strict` and confirm it passes.

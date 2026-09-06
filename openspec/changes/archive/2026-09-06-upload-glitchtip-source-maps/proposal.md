## Why

Every event GlitchTip receives points at bundled output, not source. Client frames are minified (`build/client/assets/entry.client-DnQhIPei.js:1:4821`); server frames name a line in the single 3172-line `build/server/index.js`. Neither is actionable without hand-mapping, which defeats the point of the tracking added in `1005e73`. The build emits no source maps at all today (`ls build/client/assets/*.map` → none, no `sourceMappingURL` in either bundle), so there is nothing for GlitchTip to resolve against.

## What Changes

- Generate hidden source maps for both the client and server builds, and upload them to GlitchTip at build time via `@sentry/react-router`'s Vite plugin plus its `sentryOnBuildEnd` hook — the same debug-ID artifact-bundle path GlitchTip 4.2+ serves at `/api/0/organizations/{org}/chunk-upload/` and `artifactbundle/assemble/`.
- Delete every `.map` after upload so no source map is served publicly or shipped in the image.
- Introduce build-time-only credentials (`SENTRY_AUTH_TOKEN`, `SENTRY_URL`, `SENTRY_ORG`, `SENTRY_PROJECT`) that are **not** part of the runtime env contract and never reach a bundle. The token enters the Docker build as a BuildKit secret mount, not a `--build-arg`, so it does not persist in image history.
- Skip upload — without failing the build — when `SENTRY_AUTH_TOKEN` is absent, so `bun run build` still works locally. The Docker build stage requires it, matching the existing hard-fail-on-missing-build-arg pattern.
- Dedupe the two `Sentry.init` calls: the shared sample rate and the "drop the session integration" idiom move to `src/lib/glitchtip/options.ts`, which stays client-bundle-safe like its `dsn.ts` sibling.
- Deliberately **not** added: release naming, `environment`, `dist`, or a release-creation step. Debug IDs make release correlation unnecessary for stack-trace resolution, and `enabled` already gates events to production builds.

## Capabilities

### New Capabilities

None. This makes an existing capability's stack traces usable rather than introducing a new behavior area.

### Modified Capabilities

- `observability`: adds a requirement that reported stack traces resolve to original source, on both server and client. The existing "unhandled server errors are reported" and "unhandled client errors are reported" requirements say frames are carried; they do not say the frames are readable.
- `configuration`: adds a build-time-only credential tier. Today the spec classifies every variable as public (`VITE_`) or server-secret, both validated at server startup. The upload token is neither — it is consumed by the build and must never be present at run time or in any artifact.
- `deployment`: the image build gains a secret mount and a source-map upload step; the published image and the served client output must contain no `.map` files.

## Impact

- `vite.config.ts` — wrap the plugin list with `sentryReactRouter`, enable `build.sourcemap: "hidden"`.
- `react-router.config.ts` — add the `buildEnd` hook calling `sentryOnBuildEnd`.
- `src/instrument.server.ts`, `src/entry.client.tsx` — consume the shared init options.
- `src/lib/glitchtip/options.ts` — new, ~15 lines.
- `Dockerfile` — `# syntax=docker/dockerfile:1`, `RUN --mount=type=secret,id=sentry_auth_token`, plus `SENTRY_URL`/`SENTRY_ORG`/`SENTRY_PROJECT` build args.
- `.env.example`, `README.md`, `AGENTS.md` — document the build-time-only tier and the new build command.
- No new dependency: `@sentry/react-router@^10.73.0` already ships the Vite plugin and `@sentry/cli`.
- Build time increases by the upload round-trip. Client bundle size and runtime behavior are unchanged (`hidden` emits no `sourceMappingURL` comment).

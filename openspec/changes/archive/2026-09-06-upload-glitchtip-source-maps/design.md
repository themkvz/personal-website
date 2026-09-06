## Context

See `proposal.md — Why`. Two constraints shape everything below.

**GlitchTip is Sentry-API-compatible for this path, and only recently.** Its API exposes `POST /api/0/organizations/{org}/chunk-upload/` and `GET /api/0/organizations/{org}/artifactbundle/assemble/` — the two endpoints `@sentry/cli` drives for debug-ID artifact bundles. GlitchTip 4.2 added artifact-bundle support and explicitly dropped the older requirement that a release be set for lookups; GlitchTip 6 fixed redirect-following for Sentry upload tooling. **This design requires GlitchTip ≥ 4.2, preferably ≥ 6.** Against an older instance the upload will fail and, per the spec, take the build down with it.

**The reporting code is already correct; only the maps are missing.** `src/instrument.server.ts` and `src/entry.client.tsx` initialize properly, `handleError` filters aborts and 404s, `~/lib/glitchtip/dsn.ts` derives the CSP endpoint from the one DSN. Nothing here reopens those decisions. `dsn.ts` carries a standing constraint — "never import `~/env.server` here, this must stay safe for the client bundle" — that the new shared-options module inherits.

The Docker build is invoked by hand (no CI workflows exist), so build-time inputs are whatever the operator types.

## Goals / Non-Goals

**Goals:**
- One upload mechanism covering both the client and server builds.
- Zero new runtime configuration; nothing about this reaches the running container.
- Local `bun run build` unaffected when no credentials are present.

**Non-Goals:**
- Release, version, or deploy tracking in GlitchTip. Debug IDs make it unnecessary for stack-trace resolution, and adding it means keeping a build-time and a run-time value in sync — exactly the divergence the `configuration` spec's "Derived values are not declared as variables" requirement exists to prevent.
- Changing which errors are reported or suppressed.
- Serving source maps publicly, or a `hidden`-less `sourcemap: true` that would leak them.
- Turning the report-only CSP into an enforcing one.

## Decisions

### Debug-ID artifact bundles, not release-scoped artifacts

Sentry supports two upload models: legacy release-scoped artifacts (match by release + URL) and debug-ID artifact bundles (match by an id injected into both the bundle and its map). Debug IDs win: the correlation key travels inside the artifacts themselves, so nothing at run time needs to know a release name, and two concurrently deployed builds cannot shadow each other's maps. This is also the only model that works without release management, which is the Non-Goal above.

*Alternative rejected:* release-scoped artifacts. Requires `SENTRY_RELEASE` at build time and a matching `release` in both `Sentry.init` calls — a third value to keep in sync across two files and the Dockerfile, to buy nothing this change needs.

### `sentryReactRouter` (Vite plugin) + `sentryOnBuildEnd`, not `glitchtip-cli` or raw `sentry-cli`

`@sentry/react-router@^10.73.0` is already a dependency and ships both halves. The Vite plugin injects debug IDs and uploads client assets; the `buildEnd` hook in `react-router.config.ts` handles the server build, which Vite's plugin lifecycle alone does not reach because React Router drives that build separately. Wiring a standalone CLI would mean reproducing that two-phase knowledge in shell.

*Alternative rejected:* `glitchtip-cli sourcemaps inject && upload` as a `postbuild` script. A new tool to install in the build image, and it would have to be pointed at two output trees with the right `--dist`/path rewriting to make server frames resolve. The framework SDK already encodes that.

### Self-hosted coordinates via `SENTRY_URL` / `SENTRY_ORG` / `SENTRY_PROJECT`; token via `SENTRY_AUTH_TOKEN`

These are the names both `@sentry/cli` and `glitchtip-cli` read natively, so nothing needs to be threaded through plugin options by hand. `SENTRY_URL` points at the GlitchTip instance. Keeping the standard names also means the plugin's own telemetry auto-disables, since Sentry's tooling suppresses it against a self-hosted URL.

Note the naming asymmetry: the runtime DSN is `VITE_GLITCHTIP_DSN` (this project's name, browser-visible) while the build credentials keep Sentry's canonical names (tool-owned, build-only). That is deliberate — renaming them would force explicit plugin options for no gain — and the `.env.example` comments should say so.

### Upload is gated on `SENTRY_AUTH_TOKEN`, in exactly one place

A single `const uploadSourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN)` decides three things together: whether `build.sourcemap` is `"hidden"` or off, whether `sentryReactRouter` is in the plugin list, and whether `sentryOnBuildEnd` runs. It lives in `vite.config.ts` and `react-router.config.ts` reads the same env var — two files, one condition, because the two configs cannot import each other cleanly without a third module for one boolean.

Generating maps only when uploading is the point: if the token is absent, no `.map` is ever written, so there is nothing to leak and nothing to clean up. `filesToDeleteAfterUpload` then covers the configured path, giving two independent reasons no map survives into `build/`.

*Alternative rejected:* always generate maps, always delete after. Leaves a window where a failed or interrupted build leaves maps in `build/client/assets/`, which `Dockerfile`'s `COPY --from=build /app/build ./build` would then ship.

### `sourcemap: "hidden"`, not `true`

`hidden` emits the `.map` files but no `//# sourceMappingURL` comment in the bundles. The maps are uploaded and deleted; the comment, had it survived, would point browsers and scrapers at URLs that 404 — noise at best, and a live map at worst if a deploy ever forgot the deletion.

### BuildKit secret mount, not a build argument

`ARG`/`ENV` values persist in image layer metadata and are readable with `docker history`. The existing `VITE_*` build args are fine there — they are public by design and end up in the client bundle anyway. The upload token is not: it grants write access to the GlitchTip project. It gets `RUN --mount=type=secret,id=sentry_auth_token`, which exposes the value only to that one `RUN` and never writes it to a layer. This requires `# syntax=docker/dockerfile:1` at the top of the Dockerfile and `--secret id=sentry_auth_token,env=SENTRY_AUTH_TOKEN` on the build command.

The existing `RUN test -n "$VITE_..."` guard line extends to assert the mounted secret is non-empty, keeping the "fail loudly on a missing build input" pattern in one place.

*Alternative rejected:* `--build-arg SENTRY_AUTH_TOKEN`. Consistent with the neighbouring lines, and wrong — it would put a write-scoped credential into image history.

### Shared init options: two small named exports, not one options factory

`src/lib/glitchtip/options.ts` exports the genuinely common parts and nothing more:

- `TRACES_SAMPLE_RATE` — the one value that must not drift between the two sides.
- `withoutSessions(sessionIntegrationName, ...extra)` — returns the `integrations` callback that drops the backend-unsupported session integration and appends the side-specific ones. The two sides pass `"ProcessSession"` / `httpIntegration(...)` and `"BrowserSession"` / `reactRouterTracingIntegration()` respectively.

`dsn` and `enabled` stay explicit at each call site: they are different values derived from different modules (`~/env.server` vs `~/env.client`, `env.NODE_ENV` vs `import.meta.env.PROD`), and the existing comments at each site explain precisely that asymmetry. Folding them into a factory would mean passing both through as arguments — the same two lines, one indirection deeper.

*Alternative rejected:* a single `glitchtipInit({ dsn, enabled, ... })` wrapper around `Sentry.init`. Every caller would pass every varying value anyway, so it saves no lines and hides which options are actually set. This module is a small deduplication with a real drift risk behind it (the sample rate), not a seam.

While in these files, collapse `entry.client.tsx`'s and `instrument.server.ts`'s redundant double import — `import * as Sentry` plus a named `import { httpIntegration }` from the same module.

## Risks / Trade-offs

- **GlitchTip instance predates 4.2, or has artifact bundles disabled** → Upload fails and takes the build with it, by design (`observability` spec). Verify the instance version before implementing; check the GlitchTip project's settings page for uploaded artifact bundles after the first build. This is the one assumption that invalidates the whole approach, so it is task 1.
- **Server frames resolve less cleanly than client frames.** The server bundle is not minified today, so its frames already carry real function names; the win there is file/line accuracy. If `sentryOnBuildEnd` proves not to cover the server build against GlitchTip, the fallback is `NODE_OPTIONS=--enable-source-maps` with the server `.map` kept in the image — cheaper but ships maps, so only if needed.
- **Build gets slower and depends on the GlitchTip instance being up.** A previously hermetic `docker build` now makes a network call to a self-hosted service. Accepted: the alternative is unusable stack traces. If the instance's availability becomes the binding constraint, the gate can be widened from "token present" to an explicit opt-out flag.
- **A forgotten `--secret` flag fails the build rather than silently skipping upload.** Intended, but it will bite the first time someone builds from a fresh shell. The README build command must show the flag inline, not as a footnote.
- **`filesToDeleteAfterUpload` glob is easy to get wrong** and a wrong glob deletes nothing silently. The verification task greps the built output for `.map` rather than trusting the option.
- **`instrument.server.ts`'s existing `ponytail:` note about `Sentry.init` load ordering is untouched** and still stands. Source-map resolution does not depend on init timing, so it is genuinely out of scope here — but it remains open debt.

## Migration Plan

No data, no schema, no runtime behavior change — the deploy is a normal image build and replace. Rollback is redeploying the previous image; already-uploaded artifact bundles are inert if nothing references their debug IDs.

The one ordering constraint: the first build that uploads must succeed before the resulting image is promoted, since a failed upload now fails the build rather than producing a degraded image.

## Context

See `proposal.md` — Why. Facts verified against the current tree that shape the approach:

- `@react-router/serve` already reads `PORT` (`node_modules/@react-router/serve/dist/cli.js:78`) and falls back to 3000. It also installs its own `SIGTERM`/`SIGINT` handlers and passes `process.env.NODE_ENV` to the request handler as the app mode. Nothing in the app needs to change for the port and mode requirements — the image just has to not get in the way.
- `react-router build` copies `public/` into `build/client`, and `serve` serves static assets from there. The final stage therefore does not need `public/`; the current Dockerfile is already right about this.
- Vite reads `VITE_`-prefixed variables directly from `process.env` at build time (`node_modules/vite/dist/node/chunks/config.js:9401`), not only from `.env` files. A build `ARG` promoted to `ENV` in the build stage is enough to inline them; no `.env` file needs to exist.
- `src/env.client.ts` validates `import.meta.env` in the browser, so a missing `VITE_*` at build time produces a runtime crash for visitors, not a build failure. Failing the build has to be done explicitly.

## Goals / Non-Goals

**Goals:**

- One Dockerfile, buildable by hand and by any future CI, with no dependency on developer-local files.
- Runtime stage carries the smallest surface that still runs the app.
- Every requirement in `specs/deployment/spec.md` verifiable with `docker build`, `docker run`, and `docker image ls` — no test harness.

**Non-Goals:**

- Registry, CI workflow, and host-side deploy (deferred per the proposal).
- Distroless or `FROM scratch`. Bun is not distributed that way and the healthcheck needs a shell.
- Changing `src/env.client.ts` / `src/env.server.ts`. Their contracts stay; only the delivery of values changes.

## Decisions

**Alpine runtime, Debian build stage.** `oven/bun:1-alpine` installs the production `node_modules` (~90 MB base vs ~450 MB), `oven/bun:1` for `deps`/`build` where image size is discarded anyway. Considered: alpine everywhere (build tooling on musl is the flakier half, and saves nothing in the published image); slim everywhere (keeps ~60 MB of Debian for no benefit). The app is pure JS/TS with no native addons in the production dependency tree, so musl carries no known compatibility cost here — confirmed by running the Bun-installed tree under both Bun and Node on Alpine.

**Node runs the server, not Bun.** The final stage is `node:24-alpine`, not `oven/bun:1-alpine`. React Router's stock Node entry (`src/entry.server.tsx`) imports `renderToPipeableStream` from `react-dom/server`. `react-dom`'s `./server` export map has a `"bun"` condition (`server.bun.js`) that only exposes the web-streams API (`renderToReadableStream`) — no `renderToPipeableStream`. Bun always resolves that condition when it is the active runtime; `bun --conditions=node` does not override it (tested — the `"bun"` condition still wins). So running the built server with `bun run start` crashes on boot on Linux with `SyntaxError: Export named 'renderToPipeableStream' not found`. This reproduces identically with the *pre-existing* Dockerfile and in a vanilla `oven/bun:1` container with the repo bind-mounted — it is not caused by anything else in this change, and it does not reproduce on macOS Bun (a platform-specific quirk, not investigated further since Node is the intended target either way). `react-router-serve` and the Node entry are Node-targeted by design; making Bun the server runtime would mean rewriting `entry.server.tsx` around `renderToReadableStream` plus a hand-rolled `Bun.serve` — real architecture work with no measured benefit, out of scope here. The production `node_modules` installed by Bun on Alpine is pure JS and runs unmodified under Node — verified directly (3.1).

**Build args, not a copied `.env`.** `ARG VITE_OP_CLIENT_ID` / `ARG VITE_OP_API_URL` promoted to `ENV` in the build stage, plus a one-line `RUN test -n "$VITE_OP_CLIENT_ID" && test -n "$VITE_OP_API_URL"` guard so a missing value fails the build instead of shipping a bundle that throws in the visitor's browser. Considered: reading `.env` in the build (the status quo — silently couples the image to one developer's machine and drags `OP_CLIENT_SECRET` into a build layer); a runtime-injected client config endpoint (a real feature, unrequested, and far more code than two `ARG`s).

**`.dockerignore` as the secret boundary.** `.env*` excluded from the build context, alongside the planning/tooling directories (`openspec`, `.claude`, `.github`, `.agents`, `.gemini`, `.idea`, `design`, `.DS_Store`). This is what actually keeps the secret out, independent of what any stage copies.

**Drop `docker-entrypoint.sh`, use `CMD`.** The script is `exec bun run start` behind `set -e`; `CMD` invokes `node ./node_modules/.bin/react-router-serve ./build/server/index.js` directly as PID 1 — one fewer file, no `chmod +x` to get wrong, and no wrapper process between Docker and the serve CLI. This closes the signal-propagation question the Bun-runtime version left open: the CLI's own `SIGTERM` handler receives the signal directly, with no `bun run` in between to swallow it. Verified with a stopwatch on `docker stop`: ~0.15s, confirming propagation works and no fallback is needed.

**Healthcheck hits `/robots.txt`.** A static file served from `build/client` — it proves the HTTP server is listening and serving without paying for an SSR render every 30s. Uses busybox `wget` (present in alpine, no package to install) against `127.0.0.1:${PORT:-3000}`. Considered: adding a `/health` route (new app code for something a static file already answers); `curl` (not in the base image).

**Non-root via the image's own `node` user.** `node:*-alpine` images ship a `node` user at uid 1000; `USER node` is the whole change. The app writes nothing to disk at runtime, so no ownership fixing is needed beyond having `/app` readable.

## Risks / Trade-offs

- **musl breaks a dependency at runtime that Debian tolerated** → The production tree is pure JS today; the deploy verification is "run the container and load a page", which catches it immediately. Fallback is `node:24-slim`, a one-word change.
- **Bun-installed `node_modules` executed by Node instead of Bun** → Mitigated by the production tree being pure JS with no native addons; caught immediately by the 3.1 boot-and-serve check if it ever weren't.
- **Build args are visible in image history** → Both are public client identifiers (they ship in the client bundle by design). `OP_CLIENT_SECRET` stays runtime-only and never becomes a build arg.
- **`.dockerignore` excluding `.env` changes local behavior** → Anyone currently relying on `docker build` picking up their `.env` gets a hard failure from the guard rather than a subtly wrong image. That is the intended trade.
- **`get-port` picks a different port if 3000 is taken** → Inside a fresh container it never is; the healthcheck and `EXPOSE` both assume the requested port, which is the correct assumption in a container.

## Migration Plan

Build-and-run is the whole deploy; there is no state to migrate. Rollback is redeploying the previous image tag. The one operator-visible change is that `docker build` now requires two `--build-arg` values — covered by the README rewrite.

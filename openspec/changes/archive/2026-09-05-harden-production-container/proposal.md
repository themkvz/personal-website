## Why

The production image is built from `oven/bun:1` (Debian, ~450 MB before app code), runs as `root`, has no healthcheck, hardcodes port 3000, and picks up build-time client env by accidentally copying the developer's `.env` into the build stage — a build on a clean checkout or CI machine would silently produce an image whose client bundle fails env validation at render. The deploy story is a two-line README snippet that does not mention which variables are build-time and which are runtime.

## What Changes

- Switch the runtime stage to Alpine and to Node: `node:24-alpine` runs the built server (the stock React Router Node entry uses `renderToPipeableStream`, which Bun's `react-dom/server` export map doesn't provide on Linux); `oven/bun:1-alpine` still installs the production dependency tree since that step needs Bun. Keep the full `oven/bun:1` image for the build stage (build tooling stays where it is cheap).
- Run the container as the image's non-root `node` user, and run the serve CLI directly as PID 1 instead of through `bun run`.
- Make the client-side env explicit: `VITE_OP_CLIENT_ID` and `VITE_OP_API_URL` become declared build args, so an image build no longer depends on a `.env` file being present in the build context.
- Add `.env`, `.env.*`, `openspec`, `tasks`, `design`, `.claude`, `.github`, `.agents`, `.gemini`, `.idea`, `.DS_Store` to `.dockerignore` — stop shipping the developer's secrets and planning artifacts into the build context.
- Honour `PORT` (default 3000) instead of assuming 3000, and set `NODE_ENV=production` in the runtime stage.
- Add a `HEALTHCHECK` that probes the running server.
- Delete `docker-entrypoint.sh` — a two-line `exec bun run start` wrapper that `CMD` covers.
- Rewrite the README Deployment section: the build-arg/runtime-env split, the required env vars, and the run command.

## Capabilities

### New Capabilities
- `deployment`: The contract the production container image must satisfy — how it is built, what env it needs at build time versus run time, what user it runs as, what port it binds, and how a supervisor determines it is healthy.

### Modified Capabilities

<!-- None. No user-facing site behavior changes. -->

## Impact

- `Dockerfile` — restructured stages, new runtime base, build args, non-root user, healthcheck.
- `.dockerignore` — expanded.
- `docker-entrypoint.sh` — deleted.
- `README.md` — Deployment section rewritten.
- No application source changes. `src/env.client.ts` and `src/env.server.ts` keep their current contracts; the change only makes sure the values reach them.
- Out of scope (explicitly deferred): CI build/push workflow, registry, and any host-side deploy step.

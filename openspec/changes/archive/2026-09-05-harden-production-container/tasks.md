## 1. Build context

- [x] 1.1 Record the current baseline for comparison: `docker build -t themkvz:before .` then `docker image ls themkvz:before` — note the size, and keep the tag until task 4.2
- [x] 1.2 Extend `.dockerignore` with `.env`, `.env.*`, `openspec`, `design`, `.claude`, `.github`, `.agents`, `.gemini`, `.idea`, `.DS_Store`; verify with `docker build --no-cache --progress=plain .` that the transferred context shrinks and no `.env` appears in it

## 2. Dockerfile

- [x] 2.1 Declare `ARG VITE_OP_CLIENT_ID` / `ARG VITE_OP_API_URL` in the build stage, promote both to `ENV`, and add a `RUN test -n "$VITE_OP_CLIENT_ID" && test -n "$VITE_OP_API_URL"` guard ahead of `bun run build`; verify a build with no `--build-arg` fails at that line naming the missing value
- [x] 2.2 Retarget `prod-deps` to `oven/bun:1-alpine` (still needs Bun to run `bun install`) and the final stage to `node:24-alpine` (the app is served by Node, not Bun — see design.md revision), leaving `deps` and `build` on `oven/bun:1`; verify `docker build` still succeeds end to end
- [x] 2.3 Set `ENV NODE_ENV=production` and `ENV PORT=3000` in the final stage, and add `USER node` after the `COPY` instructions; verify `docker run --rm <img> id -u` reports 1000
- [x] 2.4 Replace `ENTRYPOINT ["./docker-entrypoint.sh"]` with `CMD ["node", "./node_modules/.bin/react-router-serve", "./build/server/index.js"]` (direct exec, PID 1 — see 2.2 revision below), stop copying the script, and delete `docker-entrypoint.sh` from the repo; verify the container still serves after the change
- [x] 2.5 Add `HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- "http://127.0.0.1:${PORT}/robots.txt" || exit 1`; verify `docker ps` reports `healthy` within the start period
- [x] 2.6 Verify the final image runs Node, not Bun: `docker run --rm <img> node -v`

## 3. Runtime verification

- [x] 3.1 Run the image with `--env-file .env` and confirm the home page, an artifact page, `/robots.txt`, and `/sitemap.xml` all return 200
- [x] 3.2 Confirm the client bundle carries the build-arg values — load a page and check the OpenPanel client initialises without the env-validation error from `src/env.client.ts`
- [x] 3.3 Start the container without `OP_CLIENT_SECRET` and verify the process exits with the server env-validation error rather than serving
- [x] 3.4 Start the container with `-e PORT=8080 -p 8080:8080` and verify it serves on 8080 and the healthcheck still reports `healthy`
- [x] 3.5 Time `docker stop <container>` — direct PID 1 exec means the serve CLI's own `SIGTERM` handler receives the signal without a `bun run` wrapper in between; measured ~0.15s, confirming no fallback is needed

## 4. Documentation and cleanup

- [x] 4.1 Rewrite the README Deployment section: build command with both `--build-arg` values, run command with the runtime env vars, and an explicit note on which variables are build-time versus run-time; verify by following it verbatim on a clean clone
- [x] 4.2 Compare `docker image ls` for the new image against the `themkvz:before` baseline, record the reduction in the change's completion notes, then delete the baseline tag

## Completion Notes

- Image size: `themkvz:before` (unmodified Dockerfile, Debian runtime) — 673MB disk usage / 140MB content size. `themkvz:after` (this change, `node:24-alpine` runtime) — 559MB disk usage / 105MB content size. ~25% reduction in content size.
- Runtime moved from Bun to Node for the final stage: the stock React Router Node entry (`src/entry.server.tsx`) calls `renderToPipeableStream`, which `react-dom`'s `"bun"` export condition doesn't provide on Linux (confirmed pre-existing, reproduces on the unmodified Dockerfile and in a vanilla `oven/bun:1` container — not introduced by this change). `prod-deps` still installs via Bun (needed for `bun install`); the final stage runs that same pure-JS tree under `node:24-alpine`. See `design.md` for full rationale.
- `CMD` execs the serve CLI directly as PID 1 instead of through `bun run`; `docker stop` measured at ~0.15s, confirming signal propagation with no fallback needed.

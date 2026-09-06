## 1. Baseline

- [x] 1.1 Record the pre-change baseline so later checks have something to compare against: run `bun run build`, then confirm `grep -rl "OP_CLIENT_SECRET" build/client/` finds nothing and `cat build/server/assets/op.client-*.js` is the `var op = void 0` stub. Confirm `bun run typecheck` is clean at baseline (0 errors), so it can be trusted as a signal later.

## 2. Shared public-variable schema

- [x] 2.1 Create `src/env.shared.ts` exporting a `publicEnvSchema` dictionary holding `VITE_OP_CLIENT_ID` and `VITE_OP_API_URL` as valibot schemas, with no `createEnv` call and no reference to `process.env` or `import.meta.env`. Verify the file imports cleanly with `bun -e 'import("./src/env.shared.ts").then(m => console.log(Object.keys(m.publicEnvSchema)))'`, printing both keys.

## 3. Server env module

- [x] 3.1 Rewrite `src/env.server.ts` per design.md decision 1: add `clientPrefix: "VITE_"` and `client: {}`, keep `OP_CLIENT_SECRET` and `NODE_ENV` in `server`, and spread `publicEnvSchema` into a `shared` block. Verify `bun run build` still succeeds.
- [x] 3.2 Add an `onValidationError` handler that throws with the failing variable names taken from each issue's `path`, and no `input` value. Verify by booting the built server with a deliberately invalid secret and confirming the output names the variable and contains no substring of the supplied value:
      `OP_CLIENT_SECRET="" VITE_OP_CLIENT_ID=x VITE_OP_API_URL=https://x node ./node_modules/.bin/react-router-serve ./build/server/index.js`
- [x] 3.3 Prove the prefix guard is live: temporarily rename `OP_CLIENT_SECRET` to `VITE_OP_CLIENT_SECRET` in the `server` block, run `bun run typecheck`, and confirm an error containing `should not prefixed with VITE_` appears for that key specifically. Revert the rename, and confirm `bun run typecheck` returns to 0 errors.

## 4. Client env module

- [x] 4.1 Rewrite `src/env.client.ts` to spread `publicEnvSchema` into `client` and to use an explicit per-key `runtimeEnv` mapping (`VITE_OP_CLIENT_ID: import.meta.env.VITE_OP_CLIENT_ID`, same for the API URL) instead of the whole `import.meta.env` object. Add the same name-only `onValidationError`.
- [x] 4.2 Verify the inlining narrowed: run `bun run build`, then confirm `build/client/assets/op.client-*.js` no longer contains the `BASE_URL`/`MODE`/`SSR` literal object, and that both `VITE_OP_*` values are still present.
- [x] 4.3 Verify no undeclared variable is shipped: rebuild with an extra `VITE_UNUSED_CANARY=leaked-canary-value` set in the environment, then confirm `grep -rl "leaked-canary-value\|VITE_UNUSED_CANARY" build/client/` finds nothing. Rebuild without it afterwards.

## 5. Bundle check

- [x] 5.1 Add a `verify:bundle` script to `package.json` that fails when `build/client/` contains the identifier `OP_CLIENT_SECRET` or `env.server`, per design.md decision 5. Verify it exits 0 on the current build, and exits non-zero when pointed at a directory seeded with a file containing `OP_CLIENT_SECRET`.

## 6. Variable contract and hygiene

- [x] 6.1 Add a committed `.env.example` listing `OP_CLIENT_SECRET`, `VITE_OP_CLIENT_ID`, and `VITE_OP_API_URL` with empty values, and confirm it is not matched by `.gitignore` (`git check-ignore -v .env.example` exits non-zero) while `.env` still is.
- [x] 6.2 Verify the template is sufficient and value-free: `cp .env.example /tmp/env-probe && grep -vE '^\s*(#|$)' /tmp/env-probe` shows every key with an empty value and no credential; and every key declared across `src/env.server.ts` and `src/env.client.ts` (excluding `NODE_ENV`, which defaults) appears in it.
- [x] 6.3 Run `chmod 600 .env` and delete the commented-out SMTP block from it. Verify with `ls -l .env` showing `-rw-------`.
- [x] 6.4 Point the README's Deployment section at `.env.example` as the canonical variable list, leaving the existing build-time/run-time table intact. Verify the table's variable names still match `.env.example` exactly.

## 7. End-to-end verification

- [x] 7.1 Clean rebuild and full check: `rm -rf build && bun run build && bun run verify:bundle && bun run lint`. Confirm the build succeeds, the bundle check passes, and Biome reports no new findings against the baseline from 1.1.
- [x] 7.2 Confirm fail-fast still holds after the refactor: start the built server with `OP_CLIENT_SECRET` unset and verify the process exits non-zero during startup — before binding a port — with the variable named and no value disclosed.
- [x] 7.3 Confirm the happy path is unchanged: start the built server with all three variables set, request `/`, and verify a 200 with rendered HTML; then load the page in a browser and confirm the OpenPanel client chunk still initialises without a console error.

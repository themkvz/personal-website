## Why

The site's env layer works today — a fresh `bun run build` produces a client bundle with no trace of `OP_CLIENT_SECRET`, and the production server refuses to boot without it (verified: `react-router-serve` exits with a valibot issue naming `OP_CLIENT_SECRET`). But the safety comes from convention, not from enforcement, and three gaps turn a future one-character mistake into a leaked secret or a leaked log line:

1. `src/env.server.ts` declares `server` vars without `clientPrefix`, which switches **off** `@t3-oss/env-core`'s compile-time guard that rejects a `VITE_`-prefixed key in the `server` block. Two public vars (`VITE_OP_CLIENT_ID`, `VITE_OP_API_URL`) already sit there; a genuinely secret var misnamed `VITE_*` would be accepted silently and then inlined into the browser bundle.
2. `src/env.client.ts` passes the whole `import.meta.env` object as `runtimeEnv`. Vite replaces that expression with a literal containing **every** `VITE_`-prefixed variable present at build time, declared in the schema or not — confirmed in `build/client/assets/op.client-*.js`. The schema bounds what is *read*, not what is *shipped*.
3. t3-env's default validation error prints the raw valibot issues, including each failing variable's `input` value. Today `OP_CLIENT_SECRET` is `v.string()`, so a present-but-wrong secret never fails — but the moment anyone adds a length or format constraint, a bad secret gets echoed to stdout and into the container's logs.

There is also no `.env.example`, so the required variable set lives only in the README table and two TypeScript files that can drift apart.

## What Changes

- Turn on t3-env's client-prefix guard in `src/env.server.ts`: declare `clientPrefix: "VITE_"`, move the two public `VITE_OP_*` vars from `server` to `shared`, and leave `OP_CLIENT_SECRET` as the only true `server` var. A secret misnamed `VITE_*` then fails `bun run typecheck`.
- Add an `onValidationError` handler to both env modules that reports only the failing variable **names**, never their values.
- Replace `runtimeEnv: import.meta.env` in `src/env.client.ts` with an explicit per-key mapping, so only declared public vars are inlined.
- Add a committed `.env.example` listing every required key with empty values, as the single source of truth for the variable set.
- Add a build-time check that greps `build/client/` for the server secret's value and fails the build if it appears.
- Tighten local `.env` file permissions to `600` and drop the dead commented-out SMTP block.

No behavior visible to a site visitor changes. No dependency is added or removed.

## Capabilities

### New Capabilities
- `configuration`: how environment variables are declared, validated, and partitioned between the server bundle and the browser bundle — including which failure modes must be loud, which values may cross to the client, and what must never appear in logs or in the client bundle.

### Modified Capabilities
<!-- None. The `deployment` spec's runtime-environment contract already holds and was verified unchanged. -->

## Impact

- **Code**: `src/env.server.ts`, `src/env.client.ts`.
- **Repo**: new `.env.example`; `.gitignore` already excludes `.env` and git history is clean of it (verified).
- **Build**: one added `package.json` script for the client-bundle secret check; `bun run typecheck` becomes the enforcement point for the prefix rule.
- **Docs**: README's deployment table stays accurate; `.env.example` becomes the canonical list it points at.
- **Not affected**: `Dockerfile`, `react-router.config.ts`, the `.server`/`.client` module split (verified working — the server build stubs `op.client.ts` to `var op = void 0`), and the existing `deployment` spec.

## Context

See `proposal.md — Why` for motivation. What follows is the state verified in this repo, since the design turns on details that are easy to assume wrong.

- `react-router.config.ts` sets `ssr: true`; `@react-router/dev` 8.3.1 on Vite 8.
- The env layer is two modules that rely on React Router's filename conventions to stay apart:
  - `src/env.server.ts` — `createEnv({ server: {...}, runtimeEnv: process.env })`, excluded from the client graph by the `.server` suffix.
  - `src/env.client.ts` — `createEnv({ clientPrefix: "VITE_", client: {...}, runtimeEnv: import.meta.env })`, **stubbed out** on the server by the `.client` suffix.
- The split is load-bearing and it works. Confirmed against a fresh `bun run build`:
  - `build/server/assets/op.client-*.js` is literally `var op = void 0; export { op }` — the `.client` stub.
  - `grep -rl OP_CLIENT_SECRET build/client/` → no match; the secret's value → no match.
  - Booting `react-router-serve ./build/server/index.js` with `OP_CLIENT_SECRET` unset exits during module load, before the listener opens, naming the variable.
- Two consequences of the split shape everything below:
  1. A single shared `env.ts` is not available. It would have to read `process.env` (breaks the client build) or `import.meta.env` (never carries non-`VITE_` secrets, since Vite's `envPrefix` filters them). The two-module split stays.
  2. Because the modules are separate, `@t3-oss/env-core`'s cross-checks between `server` and `client` blocks are only as strong as what each module declares on its own — and `env.server.ts` currently declares no `clientPrefix`, which is what disables the guard.

Verified behavior of `@t3-oss/env-core@0.13.11` (read from `node_modules`, not assumed):

- The "must not be prefixed" guard on the `server` block is a **conditional type** keyed on `TPrefix`. With `clientPrefix` absent, `TPrefix` is `undefined` and the guard is inert. It surfaces only through `tsc`, never at runtime.
- `finalSchemaShape` on the server is `{...server, ...shared, ...client}` — a `shared` block validates on the server against `runtimeEnv`, and `client: {}` is accepted alongside `server` (required by the option types once `clientPrefix` is set).
- The default `onValidationError` is `console.error("❌ Invalid environment variables:", issues)`. Standard Schema issues carry `input` — the rejected value. A present-but-invalid secret is printed verbatim.
- All of the above was exercised in a scratch probe: the proposed shape validates, and a custom `onValidationError` reduces the output to `Invalid environment variables: OP_CLIENT_SECRET`.

Vite inlining, confirmed in `build/client/assets/op.client-*.js`: a bare `import.meta.env` is replaced with the full literal `{BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_OP_API_URL:"…",VITE_OP_CLIENT_ID:"…"}`. Every `VITE_`-prefixed variable present at build time lands in that object whether or not a schema declares it.

## Goals / Non-Goals

**Goals:**
- Make the misclassification of a secret a `tsc` error rather than a runtime discovery.
- Bound the client bundle's env payload to declared variables.
- Keep verification cheap enough to run on every build with no secret material available.

**Non-Goals:**
- Runtime-injected client config (the `window.ENV` / root-loader pattern). Both public values are stable per deployment and already correctly baked at build time; adding runtime injection would trade a working build-time guarantee for a hydration surface.
- Collapsing to a single env module — ruled out in Context.
- Any change to `Dockerfile`, the `deployment` spec, or the README's variable table, all of which were verified accurate.
- Chasing the lib-resolution errors (`Cannot find name 'Record'`, `Property 'map' does not exist on …`) that some editors' TypeScript language server reports across `src/`. They are an LSP-only artifact: the project's own `react-router typegen && tsc` exits 0 with zero errors. Unrelated to env either way.

## Decisions

### 1. Restore the prefix guard by giving `env.server.ts` a `clientPrefix`

```
clientPrefix: "VITE_"
server:  { OP_CLIENT_SECRET, NODE_ENV }
shared:  { ...publicEnvSchema }
client:  {}
```

`clientPrefix` is what arms the conditional type; `client: {}` is required to satisfy the option union once the prefix is present. The two `VITE_OP_*` variables move to `shared`, which is the block t3-env intends for values read on both sides — and which still validates against `process.env` on the server.

*Alternative considered:* leave them in `server` and add only `clientPrefix`. Rejected — it is a type error by construction, which is precisely the guard working as intended.

*Alternative considered:* move them to `client: {...}`. Works (the server shape includes `_client`), but reads as "browser-only", which they are not.

### 2. One declaration for public variables, shared by both modules

A plain `src/env.shared.ts` exporting the schema dictionary only — no `createEnv` call, no `process.env`, no `import.meta.env`. It carries neither suffix, so both the `.server` and `.client` modules may import it without dragging either runtime into the other's graph.

This is what makes the spec's "declared once, read from both sides" requirement true rather than aspirational; today the same two variables are typed independently in two files that nothing forces to agree.

### 3. Explicit `runtimeEnv` mapping in `env.client.ts`

```
runtimeEnv: {
  VITE_OP_CLIENT_ID: import.meta.env.VITE_OP_CLIENT_ID,
  VITE_OP_API_URL: import.meta.env.VITE_OP_API_URL,
}
```

Vite replaces each `import.meta.env.VITE_X` member expression individually, so only these two values reach the bundle. This is the mapping t3-env documents for bundler-inlined environments; passing the whole object is the loose form that happens to work.

### 4. `onValidationError` that reports names, not values

Both modules get a handler that maps issues to their `path` and throws with names only. Applied to the client module too: a validation throw there surfaces in the browser console, which users and extensions can read.

The value in the message is the only thing removed. The variable name and the constraint that failed remain, so the message stays actionable.

### 5. Bundle check that needs no secret

`grep -rl "OP_CLIENT_SECRET\|env.server" build/client/` must find nothing.

Checking for the secret's *value* would be stronger, but the value is deliberately absent at build time — the Dockerfile passes only the two `VITE_` build args — so such a check could never run where it matters. Matching on the *identifier* needs no secret material, runs on every build including CI, and catches the failure mode that actually exists: `env.server.ts` being pulled into a client chunk by a stray import. That is defense-in-depth behind decisions 1–3, not the primary guarantee.

*Alternative considered:* scan for every non-`VITE_` value in the environment. Rejected — noisy, and false positives on short or common values would train people to ignore it.

### 6. Hygiene

`.env` is mode `644` (world-readable) and carries a commented-out SMTP block for a contact form that does not exist in `src/`. Set `600`; delete the dead block. `.env` is correctly gitignored and, verified against `git log --all --diff-filter=A`, has never been committed.

## Risks / Trade-offs

- **The new guard is compile-time only — it fires only when a violation is actually present.** Deleting `clientPrefix` and `client: {}` still typechecks clean on correct code, so "it passes without them" is not evidence they are redundant. → Verify by temporarily misnaming a variable and confirming the specific error text: `"VITE_OP_CLIENT_SECRET should not prefixed with VITE_."` `bun run typecheck` is clean at baseline (0 errors), so the exit code is a reliable signal here.

- **`shared` variables must be present in `process.env` at server runtime, not just at build time.** This is already the case and the README documents it, but moving them from `server` to `shared` must not read as "build-time only". → The `deployment` spec's runtime-environment contract is unchanged and still authoritative; do not edit it.

- **`envPublic` is `undefined` during SSR** — `.client` modules are stubbed on the server. Nothing renders it today (`op.client.ts` is reached only through a dynamic import inside a `useCallback`), but any component that imports `envPublic` and reads it during render will crash SSR with a null-property error that points nowhere near the cause. → Out of scope to enforce mechanically; noted here and in the spec's classification requirement so the next reader knows the boundary is real.

- **The identifier grep is a heuristic.** A minifier that renames the string, or a leak through a differently-named module, slips past it. → Accepted; it costs one line and the real guarantees are the `.server` suffix and the type guard.

- **`bun run dev` works because Bun auto-loads `.env` into `process.env`; Vite does not.** Running the dev server under plain Node would fail env validation for reasons that look like a code bug. → The repo is Bun-only by convention (`bun.lock`, `@types/bun`, README); `.env.example` makes the required set explicit either way.

## Migration Plan

No data, no schema, no deploy-order constraint. The change is source-only and takes effect at the next build. Rollback is `git revert`; the previous env modules read the same variables from the same sources.

The one operational note: `.env.example` is added, `.env` is not touched apart from permissions and the dead comment block. No running deployment needs new variables.

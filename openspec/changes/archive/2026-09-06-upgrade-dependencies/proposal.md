## Why

The dependency tree has drifted behind upstream: `react-router` is a full major behind (7.12 → 8.3.1), and every other direct dependency has a newer stable release. Staying current keeps the site on supported versions, and three upstream moves in particular now let us *remove* code and dependencies rather than add them — `cn` replaces the `clsx` + `tailwind-merge` pair, and Vite 8's native `resolve.tsconfigPaths` replaces the `vite-tsconfig-paths` plugin.

## What Changes

- **BREAKING (build/tooling only)** — React Router 7.12 → 8.3.1 across `react-router`, `@react-router/dev`, `@react-router/node`, `@react-router/serve`, `@react-router/fs-routes`. The `future.v8_middleware` flag is removed (middleware is always on in v8), packages become ESM-only, and `splitRouteModules` defaults to `true`.
- Replace `clsx` + `tailwind-merge` with the `cn` package (shadcn-ui/cn). `src/lib/utils.ts` collapses to a re-export; all 32 `cn()` call sites are untouched.
- **BREAKING (source)** — `lucide-react` 0.563 → 1.41. Lucide v1 removed all brand icons; `LinkedinIcon` in `src/components/atoms/social-icons.tsx` becomes a local inline SVG (Simple Icons no longer ships LinkedIn either — see design.md).
- Vite 7 → 8 (Rolldown/Oxc build engine). Enable `resolve.tsconfigPaths` and **remove** the `vite-tsconfig-paths` dependency.
- TypeScript 5.9 → 7.0 (the native Go port). Affects `bun run typecheck` only.
- `motion` 12 → 13, `@base-ui/react` 1.2 → 1.8, `@biomejs/biome` 2.3 → 2.5, `tailwindcss`/`@tailwindcss/vite` 4.1 → 4.3, `shadcn` 3 → 4, `react-doctor` 0.0.18 → 0.9, `lint-staged` 16 → 17, plus patch/minor bumps for React 19.2.8, `zustand`, `isbot`, `@openpanel/*`, `@fontsource-variable/*`, `@icons-pack/react-simple-icons`, `@t3-oss/env-core`.
- `@types/node` 22 → **^24**, pinned to the deployed runtime (`node:24-alpine`) rather than latest (26).
- Pin the react-router package group to exact versions consistently — today `@react-router/fs-routes` floats on `^7.13.0` while its siblings are pinned to `7.12.0`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This change is dependency and build-tooling maintenance: no requirement in `content-model`, `deployment`, `design-system`, `seo`, or `site-pages` describes a package version, the `cn` implementation, or the bundler. Rendered pages, routes, content contract, SEO output, and the container's runtime contract are all unchanged. `.openspec.yaml` sets `skip_specs: true`.

## Impact

**Dependencies**
- Removed: `clsx`, `tailwind-merge`, `vite-tsconfig-paths`
- Added: `cn`
- Major upgrades: `react-router` (+4 sibling packages), `lucide-react`, `motion`, `vite`, `typescript`, `shadcn`, `react-doctor`, `lint-staged`

**Code**
- `react-router.config.ts` — drop `future.v8_middleware`
- `vite.config.ts` — add `resolve.tsconfigPaths: true`, drop the `tsconfigPaths()` plugin
- `src/lib/utils.ts` — `export { cn } from "cn"`
- `src/components/atoms/social-icons.tsx` — `LinkedinIcon` → `SiLinkedin`
- `src/entry.server.tsx` — the stale "If you have middleware enabled" comment and the `AppLoadContext` type on `_loadContext`
- `biome.json` — `$schema` version string

**Unaffected (verified)**
- No `react-router-dom` imports anywhere in `src/`
- No `meta({ data })` usage — all six `meta` exports already use `loaderData`
- No custom server / `getLoadContext` — deployment uses `react-router-serve`
- Node ≥ 22.22.0 already satisfied: Docker runs `node:24-alpine`, local Node is 24.16
- `@emotion/is-prop-valid` (dropped by motion 13) was never a dependency
- `src/app.css` uses no `~/` path aliases, so Vite's `resolve.tsconfigPaths` CSS caveat does not apply

**Risk**
Two upgrades carry real uncertainty and are being taken fix-forward by explicit decision: Vite 8 swaps esbuild/Rollup for Oxc/Rolldown (`@mdx-js/rollup` under Rolldown is the untested surface), and TypeScript 7 is a from-scratch native compiler that must accept the generated `.react-router/types` and `valibot`'s inference.

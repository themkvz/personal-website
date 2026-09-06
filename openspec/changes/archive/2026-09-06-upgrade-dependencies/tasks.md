## 1. Baseline

- [x] 1.1 Confirm the working tree is clean (`git status`) and record the current green baseline by running `bun run typecheck`, `bun run lint`, and `bun run build` — all three must pass before any version changes, so later failures are attributable to this change
- [x] 1.2 Start `bun run dev` and capture the reference behavior to compare against: home, `/about`, `/workbench`, one workbench artifact page, `/tools`, and a 404 route; exercise the theme toggle through light/dark/system

## 2. Wave 1 — dependency bumps with no build-config surface

- [x] 2.1 Bump React and its types with `bun add react@^19.2.8 react-dom@^19.2.8` and `bun add -d @types/react@^19.2.18 @types/react-dom@^19.2.7`, then verify `bun run typecheck` passes (this also clears React Router 8's `react >= 19.2.7` peer floor for wave 4)
- [x] 2.2 Bump the remaining runtime dependencies with `bun add @base-ui/react@^1.8.0 @fontsource-variable/inter@^5.3.0 @fontsource-variable/jetbrains-mono@^5.3.0 @icons-pack/react-simple-icons@^13.15.1 @openpanel/sdk@^1.3.1 @openpanel/web@^1.4.1 @t3-oss/env-core@^0.13.11 isbot@^5.2.2 zustand@^5.0.15` and verify `bun run typecheck` and `bun run build` pass
- [x] 2.3 Bump `motion` with `bun add motion@^13.2.0` and verify `src/components/identity/decrypted-text.tsx` still typechecks — motion 13's only breaking change is dropping the optional `@emotion/is-prop-valid` dependency, which this repo never declared
- [x] 2.4 Replace the removed Lucide brand icon: in `src/components/atoms/social-icons.tsx`, drop `LinkedinIcon` from the `lucide-react` import and add `SiLinkedin` to the existing `@icons-pack/react-simple-icons` import on line 1, updating the JSX usage; verify with `bun run typecheck`
- [x] 2.5 Bump `lucide-react` with `bun add lucide-react@^1.41.0` and verify `bun run typecheck` passes with no missing-export errors — the other 17 icons in use (`CheckIcon`, `ChevronRightIcon`, `CircleIcon`, `BookOpenIcon`, `MailIcon`, `Search`, `GlobeIcon`, `User2Icon`, `ListTree`, `Monitor`, `Moon`, `Sun`, `ArrowUpRight`, `GitBranch`, `Layers`, `SquarePen`, `ShieldCheck`) are all non-brand
- [x] 2.6 Bump the dev toolchain with `bun add -d @biomejs/biome@^2.5.12 @tailwindcss/vite@^4.3.3 tailwindcss@^4.3.3 @types/bun@^1.4.1 @types/node@^24 lint-staged@^17.5.0 shadcn@^4.21.0 react-doctor@^0.9.13` — note `@types/node` is pinned to `^24` to match the `node:24-alpine` runtime, not to latest
- [x] 2.7 Update the Biome schema pin in `biome.json` from `https://biomejs.dev/schemas/2.3.15/schema.json` to `2.5.12`, then verify `bun run lint` passes and reports no unknown-rule or schema errors
- [x] 2.8 Verify wave 1 end to end: `bun run typecheck`, `bun run lint`, `bun run build` all pass, and in `bun run dev` the LinkedIn icon renders in the footer/social row, the theme-toggle dropdown opens and switches modes, and the identity card's decrypted-text animation still runs

## 3. Wave 2 — replace clsx + tailwind-merge with cn

- [x] 3.1 Install the replacement and remove the pair: `bun add cn` then `bun remove clsx tailwind-merge`, and verify `package.json` no longer lists `clsx` or `tailwind-merge` as direct dependencies
- [x] 3.2 Replace the body of `src/lib/utils.ts` with `export { cn } from "cn";`, keeping the module path so all 32 importers and `components.json`'s `"utils": "~/lib/utils"` alias stay valid; verify `bun run typecheck` passes
- [x] 3.3 Verify no `clsx` or `tailwind-merge` imports remain in source: `grep -rn "clsx\|tailwind-merge" src/` returns nothing
- [x] 3.4 Verify class merging is unchanged in `bun run dev` on the components with the most conditional classes — `Nav` active link states, `theme-toggle`, `ArtifactCard`, `StateFilter` selected/unselected chips, and `Tag`; confirm `bun run build` still passes

## 4. Wave 3 — React Router 7 → 8

- [x] 4.1 Bump the whole router group to exact `8.3.1` in one command — `bun add react-router@8.3.1 @react-router/node@8.3.1 @react-router/serve@8.3.1 @react-router/fs-routes@8.3.1` and `bun add -d @react-router/dev@8.3.1` — then verify `package.json` pins all five exactly, closing the drift where `@react-router/fs-routes` floated on `^7.13.0`
- [x] 4.2 Remove the `future: { v8_middleware: true }` block from `react-router.config.ts` (the flag no longer exists in v8; middleware is always enabled) and verify `bun run typecheck` reports no unknown-config-property error
- [x] 4.3 Verify `src/middlewares/identity.ts` and `src/context/user.ts` need no change — `context.set(userContext, …)` is already the `RouterContextProvider` API that v8 makes unconditional; confirm via `bun run typecheck`
- [x] 4.4 Clean up `src/entry.server.tsx`: drop the now-stale `// If you have middleware enabled:` comment block, and confirm the `AppLoadContext` import still resolves under v8 — if it no longer exists, type `_loadContext` as `RouterContextProvider` from `react-router`; verify with `bun run typecheck`
- [x] 4.5 Verify no v8 removals are hit anywhere in source: `grep -rn "react-router-dom" src/` and `grep -rn "hasErrorBoundary\|MiddlewareEnabled\|interface Future" src/` both return nothing, and all six `meta` exports still destructure `loaderData` rather than the removed `data` argument
- [x] 4.6 Verify wave 3 end to end: `bun run typecheck`, `bun run lint`, `bun run build` pass, then in `bun run dev` confirm SSR hydration is clean (no hydration warnings in the console), client-side navigation works between all routes, loader data renders on `/workbench/:slug`, and the `$.tsx` 404 boundary still renders
- [x] 4.7 Verify the production path with `bun run build && bun start` and load `/` and `/robots.txt` — this exercises `@react-router/serve` 8, which now runs Express 5 internally and is what the container's `HEALTHCHECK` hits

## 5. Wave 4 — Vite 8 and TypeScript 7

- [x] 5.1 Bump Vite with `bun add -d vite@^8.2.2` and verify `bun run build` completes — this is the Rolldown/Oxc engine swap, and `@mdx-js/rollup` is the untested surface; treat any MDX transform failure as the thing to fix forward, not to revert
- [x] 5.2 Switch to Vite's native tsconfig path resolution: add `resolve: { tsconfigPaths: true }` to `vite.config.ts`, remove the `tsconfigPaths()` plugin and its import, then `bun remove vite-tsconfig-paths`; verify `bun run build` resolves every `~/…` import and that the dev server logs no `vite-tsconfig-paths` detection warning
- [x] 5.3 Verify the MDX content layer specifically under Rolldown: `bun run build` succeeds and, in `bun run dev`, a `content/workbench/` artifact page and a `content/tools/` card both render with frontmatter-derived fields intact (this is what `remark-frontmatter` + `remark-mdx-frontmatter` feed into `src/content/index.ts`)
- [x] 5.4 Bump TypeScript with `bun add -d typescript@^7.0.2` and run `bun run typecheck` — this runs `react-router typegen && tsc` against the native compiler, so the generated `.react-router/types` and `valibot`'s inference in `src/content/schema.ts` and `src/env.server.ts` are the things to watch; resolve any errors rather than pinning back
- [x] 5.5 Verify wave 4 end to end: `bun run typecheck`, `bun run lint`, `bun run build`, and `bun start` all pass, and the dev walkthrough from task 1.2 shows no visual or behavioral difference from the baseline

## 6. Final verification

- [x] 6.1 Verify the dependency count went down: `package.json` no longer lists `clsx`, `tailwind-merge`, or `vite-tsconfig-paths`, and lists `cn`
- [x] 6.2 Verify nothing is left behind: `bun outdated` shows only `@types/node` (intentionally pinned to `^24`) as behind latest
- [x] 6.3 Verify a clean install reproduces the tree: `rm -rf node_modules && bun install --frozen-lockfile` succeeds against the committed `bun.lock`
- [x] 6.4 Verify the container still builds and serves: `docker build --build-arg VITE_OP_CLIENT_ID=… --build-arg VITE_OP_API_URL=… -t themkvz .` succeeds and the running image passes its `HEALTHCHECK` on `/robots.txt`
- [x] 6.5 Run `bun run doctor` (react-doctor 0.9) and record any new findings — do not act on them in this change; they are input for a separate one

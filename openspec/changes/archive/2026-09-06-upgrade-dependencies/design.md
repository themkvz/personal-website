## Context

See `proposal.md` — Why. Constraints that shape the approach:

- **`bun` is the package manager** (user preference and `bun.lock` is committed). Version bumps go through `bun add` / `bun update`, never hand-edited into `package.json`.
- **The only automated verification available is `bun run typecheck`, `bun run lint`, and `bun run build`.** There is no test suite and no CI workflow (`.github/workflows/` is empty). Correctness for anything visual — theme toggle, dropdown menu, motion, icons — has to be confirmed by running `bun run dev` and looking.
- **The react-router package group must move as a unit.** `@react-router/dev@8.3.1` peer-requires `react-router@^8.3.1`, and `react-router@8` peer-requires `react@>=19.2.7` (the repo is on 19.2.4). React must move first or in the same step.
- **Two majors are being taken fix-forward by explicit user decision**: Vite 8 and TypeScript 7. Neither has a documented rollback in this change.

## Goals / Non-Goals

**Goals:**
- Every direct dependency lands on its latest stable, except `@types/node` which is pinned to the deployed runtime.
- Each upgrade wave is independently verifiable, so a failure is attributable to a known set of packages instead of a 30-package diff.
- The dependency count goes *down*: three packages removed, one added.

**Non-Goals:**
- No `bun.lock` hand-editing, no `resolutions`/`overrides` entries, and no aliasing `clsx` → `cn` for transitive consumers.
- No behavior, styling, or content changes. Any visual difference after this change is a regression, not an improvement.
- No adoption of newly-available features (React Router RSC, Vite's `future` flags, Rolldown-specific options, Lucide context providers). Configuration changes are limited to what the upgrades *require*.
- No Dockerfile runtime bump. `node:24-alpine` already satisfies React Router 8's `>=22.22.0`.

## Decisions

### Upgrade in four waves, verifying between each

Order: (1) everything that touches neither build config nor the class-merge path, (2) the `cn` migration, (3) React Router 8, (4) Vite 8 and TypeScript 7.

Wave 1 carries the `lucide-react` and `motion` majors despite their version numbers: both are contained source-level edits (one icon import, one unused optional dependency) with no configuration surface, so they cost nothing to verify alongside the patch bumps.

Rationale: a single `bun update --latest` would leave ~30 simultaneous version changes and a build error with no obvious owner. Waves are ordered by increasing blast radius, and each ends at a green `typecheck` + `lint` + `build`. Wave 3 depends on wave 1 having already moved React to 19.2.8 (React Router 8's peer floor is 19.2.7).

The `cn` migration sits at wave 2 deliberately: it is the one change touching a file imported by 32 components, and isolating it means a styling regression is unambiguously attributable to class-merge behavior rather than to a bundler swap.

Alternative considered: one big-bang upgrade. Faster when it works; the debugging cost when it doesn't is what this ordering buys down.

### `src/lib/utils.ts` becomes a re-export, not a deleted module

```ts
export { cn } from "cn";
```

Rationale: `cn` is a documented drop-in for `clsx` + `tailwind-merge` with the same API, and the project's current `cn` is unconfigured (no `extendTailwindMerge`), so there is no custom-class configuration to port. Keeping `~/lib/utils` as the import path leaves all 32 call sites and `components.json`'s `"utils": "~/lib/utils"` alias untouched — the shadcn CLI still resolves correctly for future component adds.

Alternative considered: rewrite every import to `from "cn"` and delete `src/lib/utils.ts`. That is a 32-file diff to remove one line of indirection, and it breaks the shadcn alias contract.

Alternative considered: `npx shadcn@latest migrate cn`. Rejected — the repo uses `bun`, and the manual edit is one line.

### `clsx` stays in the tree transitively; that is accepted

`class-variance-authority@0.7.1` depends on `clsx@^2.1.1`, so removing `clsx` from `package.json` does not remove it from `node_modules`. The `cn` README suggests aliasing `clsx` → `cn` to collapse the duplicate.

Decision: don't alias. The bundle cost is one small library, and a package-manager alias is a non-obvious trap for the next person who reads `package.json`. Revisit if `cva` drops the dependency upstream.

### `LinkedinIcon` becomes a local inline SVG

**Revised during implementation.** The original decision — move to `SiLinkedin` from `@icons-pack/react-simple-icons` — does not work: verified against the installed package, Simple Icons 13.15.1 ships no LinkedIn entry either (zero matches for `linked` across its exports). Lucide v1 removed brand icons and Simple Icons dropped LinkedIn independently, so no brand-icon library in this project provides it.

Resolution: a ~12-line local `LinkedinIcon` in `src/components/atoms/social-icons.tsx` carrying the exact path data the site already rendered, so `/about` is byte-identical to the pre-upgrade baseline. `aria-hidden="true"` is set as a static default (the icon is always decorative beside its text label) because Biome's `noSvgWithoutTitle` cannot see the value through the caller's prop spread.

`SiGithub` and `SiTelegram` are unaffected and stay as they are.

Note: the other 17 Lucide icons in use (`CheckIcon`, `ChevronRightIcon`, `CircleIcon`, `BookOpenIcon`, `MailIcon`, `Search`, `GlobeIcon`, `User2Icon`, `ListTree`, `Monitor`, `Moon`, `Sun`, `ArrowUpRight`, `GitBranch`, `Layers`, `SquarePen`, `ShieldCheck`) are all non-brand and survive v1. Lucide v1 also sets `aria-hidden` by default, which is correct for every use here — each icon is either decorative or paired with a label.

### `resolve.tsconfigPaths: true` replaces the `vite-tsconfig-paths` plugin

Vite 8 resolves `tsconfig.json` `paths` natively and emits a warning when it detects the plugin. The repo's single alias (`~/* → ./src/*`) is exactly what the native option covers.

The documented caveat — `paths` only applies to files matched by the tsconfig's `include`, and a bare `"src"` include misses non-JS extensions — does not bite here: `tsconfig.json` includes `"**/*"`, and `src/app.css` uses no `~/` imports (only `@import "tailwindcss"`, `"tw-animate-css"`, `"shadcn/tailwind.css"`).

### `@types/node` pinned to `^24`, tracking the runtime rather than latest

The Dockerfile runs `node:24-alpine`. `@types/node@26` would let `typecheck` accept APIs that Node 24 does not ship, turning a compile-time guarantee into a runtime error. Types follow the deployment target, not npm's `latest` tag.

### React Router package versions get one consistent pinning style

Today `@react-router/fs-routes` is `^7.13.0` while `react-router`, `@react-router/node`, `@react-router/serve`, and `@react-router/dev` are pinned exact at `7.12.0` — which is why `bun outdated` shows `fs-routes` already drifted to 7.13.0 while its siblings sat still. Pin all five exact at `8.3.1` so the group can never split again.

## Risks / Trade-offs

- **`@mdx-js/rollup` under Rolldown (Vite 8)** → The MDX content layer is the whole site; if the plugin's Rollup hooks are not honored by Rolldown, every page under `content/` fails to build. Mitigation: Vite 8 is the last wave, so this failure surfaces against an otherwise-green tree. `bun run build` plus loading a workbench artifact and a tool page in `dev` is the check. Fix-forward per user decision — the escape hatch, if needed, is `@mdx-js/rollup`'s own Rolldown-compatible release or Vite's `esbuild` fallback path, not reverting to Vite 7.

- **TypeScript 7 rejecting generated route types or `valibot` inference** → `bun run typecheck` runs `react-router typegen && tsc`; the native compiler is a faithful port but not bit-identical. `@react-router/dev@8.3.1` peer-accepts `typescript@^5 || ^6 || ^7`, which is the strongest available signal that the combination is supported. `valibot@1.4.2` only declares `typescript >= 5`. Fix-forward: resolve real type errors rather than reverting.

- **Vite 8's default browser target changed** → Output may target newer syntax than 7 did. No `build.target` is set in `vite.config.ts`, so the new default applies. Accepted: this is a personal site with no stated legacy-browser floor.

- **`splitRouteModules` now defaults to `true`** → Route modules are chunked more aggressively. This is a loading-waterfall change, not a behavior change, and it is React Router 8's intended default. Not overriding it.

- **`cn` produces a different merge result than `tailwind-merge` for some class pair** → Would show up as wrong styling, not as a build error, and there are no tests to catch it. Mitigation: wave 2 is isolated, and the visual check after it covers the components with the most conditional classes — `Nav`/`theme-toggle` (active states), `ArtifactCard`, `StateFilter`, `Tag`.

- **`shadcn` 3 → 4 and `react-doctor` 0.0.18 → 0.9** → Both are dev-only CLIs invoked by hand (`bun run doctor`) and neither is on the build path. A breakage here costs a workflow, not the site.

- **`lint-staged` 17 requires Node `>=22.22.1`** → Local Node is 24.16 and the pre-commit hook only ever runs locally. No impact on the container.

- **Sequential waves cost more wall-clock than one upgrade** → Accepted deliberately; see the ordering decision above.

## Migration Plan

Deploy is the existing Docker build — no migration, no data, no rollback procedure beyond `git revert` of the change commit plus `bun install` to restore `bun.lock`. The lockfile is committed, so the previous dependency tree is exactly reproducible.

## Implementation Notes

Three things diverged from the plan; all were resolved in-session.

1. **`@openpanel/sdk` 1.3.1 exposed a latent bug.** `identifyUser(fingerprint, { fingerprint })` passed the fingerprint as the payload itself, but the helper only read `payload.properties` — so the fingerprint had never reached OpenPanel. SDK 1.0.4's looser `IIdentifyPayload` accepted the stray key; 1.3.1 rejects it. Fixed per user decision by retyping the helper's second argument as `IdentifyPayload["properties"]`, leaving the call site unchanged. OpenPanel profiles now genuinely carry a `fingerprint` property.

2. **TypeScript 7 removed `baseUrl`.** `tsconfig.json` set `"baseUrl": "."` alongside `"paths": { "~/*": ["./src/*"] }`. Since the paths values are already tsconfig-relative, deleting `baseUrl` was sufficient; both `tsc` and Vite's native `resolve.tsconfigPaths` resolve `~/…` without it.

3. **TypeScript 7 breaks classic editor/LSP integration.** The `typescript` 7 package ships only `tsc.js` plus a native-binary resolver — no `tsserver.js`, and the `lib.*.d.ts` files live in `@typescript/typescript-<platform>` instead of `typescript/lib/`. `bun run typecheck` works correctly, but any tool that expects the old layout reports spurious errors (`Cannot find name 'Record'`). TS 7 speaks LSP rather than the tsserver protocol; editors need dedicated TS 7 support. This affects editing only, not the build, the typecheck, or the deployed site.

### Verification result

Rendered-DOM diffing of every route against a pre-upgrade baseline (production build, SSR HTML, hashes and per-render ids normalized) reduces the entire upgrade's visible delta to three items:

- `aria-expanded="false"` added to the theme-toggle button — Base UI 1.8, on every page
- `git-branch` and `book-open` glyphs redrawn — lucide v1, `/about` only
- the cosmetic `lucide lucide-linkedin` class dropped from the LinkedIn icon; its geometry is unchanged

The `cn` migration was byte-identical across all routes, including cva-composed lane chips where `gap-1.5` is correctly overridden by `gap-2` — confirming real Tailwind conflict resolution, not concatenation. React Router 8's changes were confined entirely to its hydration bootstrap; the rendered DOM was untouched. Hydration, client-side navigation, and the theme toggle were verified in a real browser with no console errors or hydration warnings.

Vite 8/Rolldown emits a new `INEFFECTIVE_DYNAMIC_IMPORT` warning (x5) for `src/content/index.ts`, which globs `/content/workbench/*.mdx` both eagerly (for frontmatter) and lazily (for bodies). Pre-existing pattern, build succeeds, left alone as out of scope.

# AGENTS.md

This file guides agentic coding assistants working in this repo.
Keep changes minimal, match existing patterns, and prefer clarity.

## Project Snapshot
- App: Personal workbench site, React Router 7 framework mode (SSR)
- Runtime: Bun, TypeScript (strict), React 19
- Styling: Tailwind CSS 4, shadcn/ui patterns on Base UI, tokens in `DESIGN.md`
- Content: MDX files under `content/`, no database or CMS
- Lint/format: Biome (2-space indent, double quotes)

## Commands

### Dev / Build
- `bun run dev`              Start dev server (http://localhost:5173)
- `bun run build`            Production build
- `bun start`                Run production server from build output
- `bun run doctor`           React Doctor diagnostics for codebase health

### Typecheck / Lint / Format
- `bun run typecheck`        React Router typegen + TypeScript
- `bun run lint`             Biome lint + format checks
- `bun run lint:fix`         Biome auto-fix
- `bun run format`           Biome format only

### Content
- Add, edit, or delete a file under `content/{workbench,experience,tools}/` and rebuild — no other step is required.
- Frontmatter is validated by `valibot` (`src/content/schema.ts`); a malformed file fails the build.

### Tests
- No test runner is configured in `package.json`.
- There is no single-test command available yet.
- If you add tests, document a per-test command here.
- Example to add later: `bun run test -- <pattern>` (adjust to runner).

### Hooks
- Husky + lint-staged runs `biome check --fix` on staged files.

## Repo Conventions

### Imports
- Use `import type` for type-only imports.
- Prefer path alias `~/` for app code (configured in `tsconfig.json`).
- Group third-party imports first, then local imports.
- Biome organizes imports automatically; avoid manual reordering.
- Avoid default exports in shared utilities unless required by framework.

### Formatting
- 2-space indent, double quotes, trailing commas where Biome applies.
- Let Biome handle formatting; do not hand-style code blocks.
- Keep JSX and Tailwind class strings readable; wrap long lists.
- Keep files stable; avoid reformatting unrelated sections.

### Types
- TypeScript `strict: true` is on; no `any` unless justified.
- Use `valibot` schemas in `src/content/schema.ts` for content frontmatter, and in `src/env.server.ts`/`src/env.client.ts` for env vars.
- Prefer `v.InferOutput<typeof schema>` for content payload types.
- Prefer type-safe helpers over casting; avoid `as` unless needed.

### Naming
- Components: `PascalCase` (files use kebab-case, e.g. `artifact-card.tsx`).
- Hooks: `useX` naming.
- Functions: `camelCase`; constants in `UPPER_SNAKE` only when truly constant.
- Route modules live in `src/routes/` and use `export function loader`.
- Favor descriptive booleans (`isLoading`, `hasError`) over negations.

### React Router (Framework Mode)
- Use loaders for data; there are no actions since the site has no forms.
- Use `Route.ComponentProps` and `Route.LoaderArgs` for typing.
- `root.tsx` owns app layout, error boundary, and the theme-init script; per-route `meta` (via `src/lib/meta.ts`) owns metadata.
- Keep route modules focused; move shared UI to `src/components/`.

### Error Handling
- Fail early in loaders; throw `data(null, { status: 404 })` for a genuine miss.
- In dev, the root error boundary may show stack traces (`import.meta.env.DEV`).
- Avoid throwing raw errors to the client; sanitize messages.

### Content Layer
- Frontmatter schemas live in `src/content/schema.ts`; the derived index lives in `src/content/index.ts`.
- Never read `content/` files directly in a component — pages import from `~/content` and pass data down.
- No component below `layout/` may import from `~/content` or React Router's data hooks.

### Styling
- Tailwind utility classes with `cn` from `src/lib/utils.ts`.
- Design tokens and type roles are documented in `DESIGN.md`; add a token there in the same commit it's added to `src/app.css`.
- Components in `src/components/ui/` follow shadcn/ui style patterns; edit them only to retheme.
- Avoid inline styles; keep CSS in `src/app.css` when necessary.
- Prefer composition over large class strings when readable.

### Files and Structure
- `src/routes/`             Route modules, loaders, and pages
- `src/components/ui/`      Vendored shadcn/Base UI primitives
- `src/components/atoms/`   Base design-system components
- `src/components/composites/` Multi-part components
- `src/components/layout/`  Site chrome and page scaffolding
- `src/components/identity/` Retained `IdentityCard`, `DecryptedText`
- `src/content/`            Content schemas and the derived index
- `content/`                MDX content files
- `src/lib/`                Utilities, analytics, meta helpers
- `src/lib/growthbook/`     Server feature snapshot and the React provider

## Tooling Rules

### Biome
- Enforces double quotes and 2-space indent.
- Unused imports are warnings; remove unused code when touched.
- Run `bun run lint:fix` before committing when possible.

### TypeScript
- `verbatimModuleSyntax` is enabled; keep import/export syntax precise.
- `moduleResolution: bundler`; use ESM imports (`type: module`).
- Prefer `satisfies` for config objects when useful.

## Environment

### Server env vars (see `src/env.server.ts`)
- `NODE_ENV`, `OP_CLIENT_SECRET`, `VITE_OP_CLIENT_ID`, `VITE_OP_API_URL` (OpenPanel credentials) are required.
- `VITE_GLITCHTIP_DSN` (GlitchTip error tracking) is required at build time and run time. The CSP report endpoint is derived from it — do not add a second variable.
- `GROWTHBOOK_API_HOST` and `GROWTHBOOK_CLIENT_KEY` (GrowthBook SDK connection) are optional — set both or neither. Server-only: the browser evaluates the payload the root loader serializes and never calls GrowthBook. Unset, every `useFeatureValue` / `useFeatureIsOn` returns its fallback.
- Do not commit secrets; keep `.env` out of git.
- Use local `.env` or `.env.local` for development only.

## Agent Behavior (Local Rules)

### CLAUDE.md highlights
- For non-trivial work, plan before changes and verify results.
- Prefer minimal, elegant fixes; avoid hacky patches.
- Run relevant checks and show evidence when possible.
- Keep changes tightly scoped to the request.

## Cursor / Copilot Rules

- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot rules found in `.github/copilot-instructions.md`.

## Tips for Agents

- If you add tests, also update this file with per-test commands.
- Keep changes scoped; avoid reformatting untouched files.
- When adding a token, type role, or component, update `DESIGN.md` in the same commit.
- When adding new deps, update `package.json` scripts if needed.

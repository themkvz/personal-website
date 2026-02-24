# AGENTS.md

This file guides agentic coding assistants working in this repo.
Keep changes minimal, match existing patterns, and prefer clarity.

## Project Snapshot
- App: Personal website, React Router 7 framework mode (SSR)
- Runtime: Bun, TypeScript (strict), React 19
- Styling: Tailwind CSS 4, shadcn/ui patterns on Base UI
- DB: SQLite via Drizzle ORM
- Lint/format: Biome (2-space indent, double quotes)

## Commands

### Dev / Build
- `bun run dev`              Start dev server (http://localhost:5173)
- `bun run build`            Production build
- `bun start`                Run production server from build output

### Typecheck / Lint / Format
- `bun run typecheck`        React Router typegen + TypeScript
- `bun run lint`             Biome lint + format checks
- `bun run lint:fix`         Biome auto-fix
- `bun run format`           Biome format only

### Database
- `bun run db:push`          Push Drizzle schema to SQLite
- `bun run db:seed`          Seed DB
- `bun run db:studio`        Open Drizzle Studio

### Tests
- No test runner is configured in `package.json`.
- There is no single-test command available yet.
- If you add tests, document a per-test command here.

### Hooks
- Husky + lint-staged runs `biome check --fix` on staged files.

## Repo Conventions

### Imports
- Use `import type` for type-only imports.
- Prefer path alias `~/` for app code (configured in `tsconfig.json`).
- Group third-party imports first, then local imports.
- Biome organizes imports automatically; avoid manual reordering.

### Formatting
- 2-space indent, double quotes, trailing commas where Biome applies.
- Let Biome handle formatting; do not hand-style code blocks.
- Keep JSX and Tailwind class strings readable; wrap long lists.

### Types
- TypeScript `strict: true` is on; no `any` unless justified.
- Use `zod` schemas in `src/schemas/` for form data.
- Prefer `z.infer<typeof schema>` for form payload types.
- Keep server and client types in `src/types.ts` when shared.

### Naming
- Components: `PascalCase` (files use kebab-case, e.g. `experience-timeline.tsx`).
- Hooks: `useX` naming.
- Functions: `camelCase`; constants in `UPPER_SNAKE` only when truly constant.
- Route modules live in `src/routes/` and use `export function loader/action`.

### React Router (Framework Mode)
- Use loaders for data and actions for mutations.
- Use `Route.ComponentProps` and `Route.LoaderArgs` for typing.
- `root.tsx` owns app layout, meta, and error boundary.

### Forms
- Use `useRemixForm` with `zodResolver`.
- Validate on server with `getValidatedFormData` and return typed data.
- Include anti-spam inputs (`website`, `_timestamp`) for public forms.

### Error Handling
- Fail early in actions/loaders; return typed `{ error }` or `{ success }`.
- Use `try/catch` around DB writes and return a user-friendly message.
- In dev, error boundaries may show stack traces (`import.meta.env.DEV`).

### Data Layer (Drizzle)
- Schema lives in `src/db/schema.ts`.
- Prefer `db.select().from(table)` and `db.insert().values()`.
- Use `sql``...`` for raw updates when needed.

### Styling
- Tailwind utility classes with `cn` from `src/lib/utils.ts`.
- Components in `src/components/ui/` follow shadcn/ui style patterns.
- Avoid inline styles; keep CSS in `src/app.css` when necessary.

### Files and Structure
- `src/routes/`         Route modules, loaders, actions, and pages
- `src/components/`     Shared UI and layout
- `src/schemas/`        Zod schemas shared by server/client
- `src/lib/`            Utilities, analytics, anti-spam, mail
- `src/db/`             DB schema and client

## Tooling Rules

### Biome
- Enforces double quotes and 2-space indent.
- Unused imports are warnings; remove unused code when touched.

### TypeScript
- `verbatimModuleSyntax` is enabled; keep import/export syntax precise.
- `moduleResolution: bundler`; use ESM imports (`type: module`).

## Environment

### Server env vars (see `src/env.server.ts`)
- SMTP settings and OpenPanel credentials are required in production.
- Do not commit secrets; keep `.env` out of git.

## Agent Behavior (Local Rules)

### CLAUDE.md highlights
- For non-trivial work, plan before changes and verify results.
- Prefer minimal, elegant fixes; avoid hacky patches.
- Run relevant checks and show evidence when possible.

## Cursor / Copilot Rules

- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot rules found in `.github/copilot-instructions.md`.

## Tips for Agents

- If you add tests, also update this file with per-test commands.
- Keep changes scoped; avoid reformatting untouched files.
- When modifying public forms, keep anti-spam inputs intact.

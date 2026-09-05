# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimat Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Commands

```bash
bun run dev          # Start dev server (http://localhost:5173)
bun run build        # Production build
bun start            # Run production server
bun run typecheck    # TypeScript type checking
bun run lint         # Check with Biome linter
bun run lint:fix     # Auto-fix lint issues
bun run format       # Format with Biome
bun run doctor       # React Doctor diagnostics
```

Pre-commit hook (Husky + lint-staged) runs Biome on staged files automatically.

## Architecture

A personal workbench — notes, decisions, investigations, references, and small tools — built with **React Router 7** in framework mode (SSR enabled), **React 19**, and **TypeScript**. See `DESIGN.md` for the design system (tokens, type scale, layout, component inventory).

### Stack

- **Routing:** React Router 7 with file-based routes (`@react-router/fs-routes`)
- **Styling:** Tailwind CSS 4, tokens defined in `src/app.css` and documented in `DESIGN.md`
- **Components:** shadcn/ui pattern built on Base UI primitives, layered under `src/components/`
- **Content:** MDX files under `content/`, no database or CMS — see Content Layer below
- **Validation:** `valibot` for content frontmatter and env vars
- **State:** Zustand for client-side theme state, `localStorage` for persistence
- **Linter/Formatter:** Biome (double quotes, 2-space indent)
- **Icons:** Lucide React

### Key Directories

- `src/` — Main application directory (set via `react-router.config.ts`)
- `src/routes/` — File-based route modules (loaders, actions, components)
- `src/components/ui/` — Vendored shadcn/Base UI primitives (retheme only)
- `src/components/atoms/` — Base design-system components (`Rule`, `Tag`, `Link`, …)
- `src/components/composites/` — Multi-part components (`ArtifactCard`, `StateFilter`, …)
- `src/components/layout/` — Site chrome: `Nav`, `Footer`, `Container`, `Section`, `Prose`, `NotFound`
- `src/components/identity/` — Retained `IdentityCard`, `DecryptedText`
- `src/content/` — Content schemas (`schema.ts`) and the derived index (`index.ts`)
- `content/` — MDX content files (`workbench/`, `experience/`, `tools/`)
- `src/store/` — Zustand stores
- `src/constants.ts` — Navigation, social links, and design-bound page copy

Dependency direction between component layers is one-way: `layout → composites → atoms → ui → lib`.

### Path Alias

`~/*` maps to `./src/*` (configured in tsconfig.json).

### Content Layer

All time-varying site content — workbench artifacts, the experience timeline, tool cards — is authored as MDX files in `content/`, each with typed YAML frontmatter validated by `valibot` (`src/content/schema.ts`) at module load. `src/content/index.ts` derives a single index per collection from `import.meta.glob`; adding, editing, or deleting a file is the only publishing step. Artifacts marked `draft: true` are indexed only in development. See `content-model` in `openspec/specs/` (once archived) or `openspec/changes/redesign-workbench-site/specs/content-model/spec.md` for the full contract.

### Data Flow

Route modules use React Router's **loaders** for data; there are no mutating actions since the site has no forms. Content comes from the modules in `src/content/`, imported directly — not fetched.

### Theme System

Three modes (light/dark/system) persisted in `localStorage`, applied before first paint by an inline script in `root.tsx`, managed client-side via the Zustand store in `src/store/theme.ts`.
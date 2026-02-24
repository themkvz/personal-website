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
bun run db:push      # Push Drizzle schema changes to SQLite
bun run db:seed      # Seed database
bun run db:studio    # Open Drizzle Studio
```

Pre-commit hook (Husky + lint-staged) runs Biome on staged files automatically.

## Architecture

Full-stack personal website built with **React Router 7** in framework mode (SSR enabled), **React 19**, and **TypeScript**.

### Stack

- **Routing:** React Router 7 with file-based routes (`@react-router/fs-routes`)
- **Styling:** Tailwind CSS 4 with oklch color variables for light/dark/system themes
- **Components:** shadcn/ui pattern built on Base UI primitives
- **Forms:** React Hook Form + `remix-hook-form` + shadcn Field components + Zod validation
- **Database:** SQLite via Drizzle ORM (`data/sqlite.db`)
- **State:** Zustand for client-side theme state, cookies for persistence
- **Linter/Formatter:** Biome (double quotes, 2-space indent)
- **Icons:** Lucide React

### Key Directories

- `src/` — Main application directory (set via `react-router.config.ts`)
- `src/routes/` — File-based route modules (loaders, actions, components)
- `src/components/ui/` — shadcn/ui components
- `src/components/layout/` — Header, footer, theme toggle
- `src/db/` — Drizzle schema and DB initialization
- `src/store/` — Zustand stores
- `src/schemas/` — Zod validation schemas (shared between client and server)
- `src/lib/anti-spam.ts` — Anti-spam helper (honeypot + CSRF timestamp)
- `src/constants.tsx` — Navigation links, social links, tech stack data

### Path Alias

`~/*` maps to `./src/*` (configured in tsconfig.json).

### Data Flow

Route modules use React Router's **loaders** (server-side data fetching) and **actions** (form mutations). The root loader reads theme from cookies. The bookmarks page demonstrates the full loader/action pattern with optimistic UI via `useFetcher`.

### Forms

Forms use **React Hook Form** integrated with React Router via `remix-hook-form`:

- **Client:** `useRemixForm` hook with `zodResolver` for client-side validation. Uses `Controller` + shadcn `Field`/`FieldLabel`/`FieldError`/`FieldGroup` components for rendering. Submit via `useFetcher` (passed into `useRemixForm({ fetcher })`).
- **Server:** `getValidatedFormData(request, resolver)` in the action validates and extracts typed data using the same Zod schema.
- **Schemas:** Defined in `src/schemas/` and shared between client and server.
- **Anti-spam:** `isSpam(request)` from `~/lib/anti-spam` checks a honeypot field (`website`) and a CSRF timestamp (`_timestamp`, rejects submissions under 2 seconds). Called at the top of form actions before validation. The corresponding hidden inputs are rendered in the form markup.

### Theme System

Three modes (light/dark/system) persisted in cookies, read server-side in `root.tsx` loader, managed client-side via Zustand store in `src/store/theme.ts`.

### Database Schema

Two tables in `src/db/schema.ts`: `bookmarks` (title, url, description, upvotes) and `contacts` (name, email, message). Both have auto-increment IDs and ISO timestamp `createdAt`.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm start            # Run production server
npm run typecheck    # TypeScript type checking
npm run lint         # Check with Biome linter
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format with Biome
npm run db:push      # Push Drizzle schema changes to SQLite
npm run db:seed      # Seed database
npm run db:studio    # Open Drizzle Studio
```

Pre-commit hook (Husky + lint-staged) runs Biome on staged files automatically.

## Architecture

Full-stack personal website built with **React Router 7** in framework mode (SSR enabled), **React 19**, and **TypeScript**.

### Stack

- **Routing:** React Router 7 with file-based routes (`@react-router/fs-routes`)
- **Styling:** Tailwind CSS 4 with oklch color variables for light/dark/system themes
- **Components:** shadcn/ui pattern built on Base UI primitives
- **Database:** SQLite via Drizzle ORM (`data/sqlite.db`)
- **State:** Zustand for client-side theme state, cookies for persistence
- **Linter/Formatter:** Biome (double quotes, 2-space indent)
- **Icons:** Lucide React

### Key Directories

- `src/app/` — Main application directory (set via `react-router.config.ts`)
- `src/app/routes/` — File-based route modules (loaders, actions, components)
- `src/app/components/ui/` — shadcn/ui components
- `src/app/components/layout/` — Header, footer, theme toggle
- `src/app/db/` — Drizzle schema and DB initialization
- `src/app/store/` — Zustand stores
- `src/app/constants.tsx` — Navigation links, social links, tech stack data

### Path Alias

`~/*` maps to `./src/app/*` (configured in tsconfig.json).

### Data Flow

Route modules use React Router's **loaders** (server-side data fetching) and **actions** (form mutations). The root loader reads theme from cookies. The bookmarks page demonstrates the full loader/action pattern with optimistic UI via `useFetcher`.

### Theme System

Three modes (light/dark/system) persisted in cookies, read server-side in `root.tsx` loader, managed client-side via Zustand store in `src/app/store/theme.ts`.

### Database Schema

Two tables in `src/app/db/schema.ts`: `bookmarks` (title, url, description, upvotes) and `contacts` (name, email, message). Both have auto-increment IDs and ISO timestamp `createdAt`.

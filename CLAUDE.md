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
- **Forms:** React Hook Form + `remix-hook-form` + shadcn Field components + Zod validation
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
- `src/app/schemas/` — Zod validation schemas (shared between client and server)
- `src/app/lib/anti-spam.ts` — Anti-spam helper (honeypot + CSRF timestamp)
- `src/app/constants.tsx` — Navigation links, social links, tech stack data

### Path Alias

`~/*` maps to `./src/app/*` (configured in tsconfig.json).

### Data Flow

Route modules use React Router's **loaders** (server-side data fetching) and **actions** (form mutations). The root loader reads theme from cookies. The bookmarks page demonstrates the full loader/action pattern with optimistic UI via `useFetcher`.

### Forms

Forms use **React Hook Form** integrated with React Router via `remix-hook-form`:

- **Client:** `useRemixForm` hook with `zodResolver` for client-side validation. Uses `Controller` + shadcn `Field`/`FieldLabel`/`FieldError`/`FieldGroup` components for rendering. Submit via `useFetcher` (passed into `useRemixForm({ fetcher })`).
- **Server:** `getValidatedFormData(request, resolver)` in the action validates and extracts typed data using the same Zod schema.
- **Schemas:** Defined in `src/app/schemas/` and shared between client and server.
- **Anti-spam:** `isSpam(request)` from `~/lib/anti-spam` checks a honeypot field (`website`) and a CSRF timestamp (`_timestamp`, rejects submissions under 2 seconds). Called at the top of form actions before validation. The corresponding hidden inputs are rendered in the form markup.

### Theme System

Three modes (light/dark/system) persisted in cookies, read server-side in `root.tsx` loader, managed client-side via Zustand store in `src/app/store/theme.ts`.

### Database Schema

Two tables in `src/app/db/schema.ts`: `bookmarks` (title, url, description, upvotes) and `contacts` (name, email, message). Both have auto-increment IDs and ISO timestamp `createdAt`.

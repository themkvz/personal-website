## Why

The current site is a conventional developer portfolio (hero, skills grid, highlights, timeline, bookmarks with voting, contact form) that states competence rather than showing it. `design/idea.md` and the finished Pencil design in `design/design-2.pen` replace it with a different product: a personal workbench — a durable, editorial record of notes, decisions, investigations, references, and small tools. The design is complete (foundations, atoms, components, compositions, global chrome, and Home light/dark, Workbench, Tools, About, 404), so the implementation can start from a settled visual and structural source of truth.

## What Changes

- **BREAKING** — Site identity, information architecture, and every route are replaced. Navigation becomes `Index / Tools / Workbench / About`.
- **BREAKING** — All persistence is removed: SQLite/Drizzle, the `bookmarks` / `bookmark_votes` / `contacts` tables, the seed script, and the `db:*` scripts. Content moves into MDX files in the repo.
- **BREAKING** — The bookmarks page (with upvoting) and the server-side contact form (with nodemailer email delivery and anti-spam) are removed. Contact becomes direct email and résumé links on About. Visitor fingerprinting is *retained* — it feeds OpenPanel identity, not voting, and no longer touches a datastore.
- The retired URLs are redirected, not dropped: `/contact` → `/about` and `/bookmarks` → `/workbench`, both permanent (301), so indexed links and the old sitemap entries keep resolving.
- New MDX content layer: `content/` holds workbench artifacts, the experience timeline, and tool cards, each file exporting typed frontmatter. A single artifact index is derived from those files at build time. An artifact marked `draft` stays out of the index, the sitemap, and the feed in production. Page copy that only changes with the design (practice columns, profile facts, nav, social links) stays in `src/constants.ts`.
- New Workbench page: intro, four-lane guide (`BUILDING / INVESTIGATING / DECIDING / KEEPING`), and a filed artifact index. Each artifact gets a permanent URL at `/workbench/<slug>` rendered by an artifact page that has no dedicated design frame — its composition is fixed in `design.md` from the existing atoms and composites.
- New RSS feed at `/feed.xml`, generated from the same artifact index as the sitemap.
- New Home page composed from the content layer: hero statement, profile panel, workbench preview (one featured note plus three lane notes), and a tools preview. Light and dark both designed.
- New Tools page: designed index with placeholder tool cards (URL Inspector, Timestamp, Text Formatter). Individual tool implementations are out of scope for this change.
- Rewritten About page: hero, practice summary, three practice columns, experience timeline, and contact/elsewhere block.
- Rewritten 404: typographic recovery page replacing the current Three.js/WebGL scene. One shared not-found view serves both the catch-all route and an unknown artifact slug, and the root error boundary carries the same chrome for unexpected errors.
- New design system layer: the Pencil token set (semantic colors with light/dark pairs, five lane colors plus soft variants, JetBrains Mono display/mono + Inter body, a 10-step space scale, radius scale, 1280px container, 12-column grid, 680px measure) becomes the Tailwind 4 theme.
- Component library restructured: `ui/` keeps the vendored shadcn/Base UI primitives; the design's atoms and composites move into `atoms/`, `composites/`, `layout/`, and `identity/` — one component per file, composition over configuration, anything used twice extracted.
- Validation library swapped: `zod` is replaced by `valibot`, including the two `@t3-oss/env-core` env schemas.
- New `DESIGN.md` at the repository root documents the token set, type scale, layout system, component inventory, and composition rules transcribed from `design/design-2.pen`.
- Deployment follows the persistence removal: `Dockerfile` and `docker-entrypoint.sh` lose the Drizzle push, seed, `src/db` copy, and the `data` volume; the container starts the server directly.
- Repository docs catch up: `README.md` (React Router template boilerplate), `CLAUDE.md`, and `AGENTS.md` are rewritten to describe the content layer, the component layers, and the remaining scripts instead of the database and forms.
- Retained logic: the theme system (`localStorage` plus the pre-hydration script in `root.tsx`, Zustand store, `light/dark/system` — there is no cookie) — unchanged and treated as critical; the OpenPanel analytics identity chain (`identity` middleware → `getFingerprint` → `getClientInfo` → `userContext`); `<IdentityCard />` and `<DecryptedText />`; `sitemap.xml` generation; and the shadcn/Base UI primitives the new atoms build on.

## Capabilities

### New Capabilities
- `content-model`: The MDX-backed artifact model — file layout, required frontmatter, lanes, the derived artifact index and its ordering, and how repeated site text is authored.
- `design-system`: Design tokens, typography, theme modes, and the shared global chrome (nav, footer, rules, layout containers) that every page composes from.
- `site-pages`: The behavior of the five surfaces — Home, Workbench and artifact detail pages, Tools, About, and 404 — including navigation, filtering, and empty/missing states.
- `seo`: Per-page metadata, canonical URLs, Open Graph and Twitter cards, structured data, `sitemap.xml`, `robots.txt`, the RSS feed, redirects for retired URLs, and the HTTP status contract for missing routes.

### Modified Capabilities
<!-- None. openspec/specs contains no active specs. -->

## Impact

- **Removed:** `src/db/`, `src/schemas/`, `src/types.ts` (Drizzle-inferred types), `src/lib/anti-spam.ts`, `src/lib/mail.ts`, `src/components/emails/`, `src/components/bookmarks/`, `src/routes/bookmarks.tsx`, `src/routes/contact.tsx`, `scripts/seed.ts`, `drizzle.config.ts`, `data/` (including `.gitkeep`), the DB entries in `.gitignore` and `.dockerignore`, and the portfolio components (`hero`, `skills`, `skill-icons`, `highlights`, `experience-timeline`, `spotlight-card`, `count-up`, `section-heading`, `social-icons` once its links are folded into the new About).
- **Explicitly retained:** `src/middlewares/identity.ts`, `src/context/user.ts`, `src/lib/fingerprint.ts`, `src/lib/client-info.ts` (the OpenPanel identity chain), `src/store/theme.ts` + `src/lib/theme.ts`, `src/components/identity-card.tsx`, `src/components/decrypted-text.tsx` — all moved into the new folder structure and restyled onto the new tokens, with behaviour unchanged.
- **Dependencies removed:** `drizzle-orm`, `drizzle-kit`, `nodemailer`, `@react-email/components`, `three`, `react-hook-form`, `remix-hook-form`, `@hookform/resolvers` (no forms remain), and `zod`.
- **Dependencies added:** `valibot` (frontmatter and env validation) and `@mdx-js/rollup` with `remark-frontmatter` / `remark-mdx-frontmatter` for the content layer, plus `@types/mdx` (dev) so `.mdx` imports typecheck.
- **Dependencies retained:** `motion` (`DecryptedText`), `@uidotdev/usehooks` (`IdentityCard`), `@icons-pack/react-simple-icons` (brand marks), `lucide-react`, `nuqs` (Workbench lane filter), `class-variance-authority`, `@base-ui/react`.
- **Changed:** `src/root.tsx` (chrome, error boundary; site-wide `meta`, canonical `link`, and Person JSON-LD move out to the per-route helper), `src/app.css` (full token rewrite), `src/constants.ts`, `src/components/*` (restructured), `src/env.server.ts` and `src/env.client.ts` (valibot, SMTP vars dropped), `src/lib/openpanel/events.ts` (bookmark and contact events pruned), `vite.config.ts` (MDX plugin; `bun:sqlite` external removed), `package.json` scripts, `Dockerfile`, `docker-entrypoint.sh`, `README.md`, `CLAUDE.md`, `AGENTS.md`.
- **Added assets:** a 1200×630 site-wide Open Graph image and the résumé PDF in `public/`. Both are inputs the user supplies; see `design.md — Open Questions`. `public/robots.txt` already exists with the right content and is kept as a static file.
- **Unchanged:** theme store and `localStorage` handling, OpenPanel wiring and its identity middleware, Biome/Husky tooling, React Router 7 framework-mode setup, `public/robots.txt`.
- **Content:** all existing bookmark and contact rows in `data/sqlite.db` are dropped; nothing is migrated.

## Context

See `proposal.md — Why`. Three inputs constrain the approach:

- **The design is finished and authoritative.** `design/design-2.pen` holds registered tokens (semantic colour pairs, five lane colours plus soft variants, `space-1..10`, `radius-*`, `container-max 1280`, `grid-columns 12`, `grid-gutter 24`, `measure 680`, `bp-sm/md/lg/xl`), a ten-role type scale, twenty reusable components (`Button`, `Tag`, `Link`, `Input`, `SearchTrigger`, `CodeChip`, `Rule`, `Surface`, `MetaStamp`, `Overline`, `ArtifactCard`, `LogEntry`, `SectionHeader`, `StateFilter`, `IconButton`, `Breadcrumb`, `Kbd`, `Nav`, `Footer`, `ToolCard`), and five page frames. Its own annotations already name Tailwind v4 targets (`max-w-7xl`, `gap-6`, `max-w-[680px]`, `--breakpoint-*`), so the token layer transcribes rather than reinvents. `design/idea.md` is the earlier brief; where the two disagree (it describes a `Shipped` section and a `Log` feed that the design's nav does not carry), the design wins.
- **The existing app keeps its shell, loses its body.** React Router 7 framework mode with SSR, Tailwind 4, Biome, Husky, and the cookie + Zustand theme system all stay. So does the OpenPanel identity chain (`identityMiddleware` → `getFingerprint` → `getClientInfo` → `userContext`), which is analytics, not persistence — its only datastore use was bookmark voting, and that is what goes. Everything else below the shell — the SQLite/Drizzle layer, bookmarks, the emailed contact form, the Three.js 404, and the portfolio components — is deleted rather than migrated. Two pieces of the old UI are kept by explicit request: `IdentityCard` and `DecryptedText`.
- **Content is files.** No datastore of any kind, per `specs/content-model`.

## Goals / Non-Goals

**Goals:**

- One token layer in CSS that every component reads, so the design and the code cannot drift silently.
- One content index that Home, Workbench, artifact pages, and the sitemap all read, so adding an `.mdx` file is the only publishing step.
- Fail the build, not the page, on malformed content.

**Non-Goals:**

- Implementing the three tools. Cards are placeholders; each tool is its own later change.
- A `Shipped` section, a `Log` feed, search, or ⌘K. The `SearchTrigger` and `Kbd` atoms exist in the design and are built, but wired to nothing yet.
- Preserving any existing database row.
- Component-level unit tests. Verification is typecheck, lint, build, and a route walk.

## Decisions

### Content pipeline: `@mdx-js/rollup` with two globs

Add `@mdx-js/rollup` to the Vite plugin list (before `reactRouter()`), plus `remark-frontmatter` and `remark-mdx-frontmatter` so YAML frontmatter compiles to a named `frontmatter` export. Content lives at `content/workbench/*.mdx`, `content/experience/*.mdx`, `content/tools/*.mdx`.

`src/content/index.ts` builds the index from two globs over the same files:

- `import.meta.glob("...", { eager: true, import: "frontmatter" })` — frontmatter only, eager, so the index is available synchronously to every loader and to the sitemap.
- `import.meta.glob("...")` — lazy module factories, so an artifact's compiled body is only fetched when its page is opened.

Slugs come from the filename, so uniqueness is a filesystem property rather than a validation rule.

*Why over the alternatives:* raw Markdown plus `gray-matter` needs a runtime parser and a separate renderer and cannot embed a component in a note. Content-collection libraries (Content Collections, Velite) add a build step and a config file to solve a problem two `import.meta.glob` calls already solve. A route-per-MDX-file scheme via `flatRoutes` would scatter content into `src/routes/` and give no index to derive Home and the sitemap from.

*Trade-off:* eager frontmatter means every artifact's metadata is in the initial bundle. At this site's volume that is a few kilobytes; bodies stay lazy, which is where the weight is.

### Validation on Valibot, replacing Zod everywhere

`valibot` replaces `zod` across the project. `src/content/schema.ts` defines the artifact and experience frontmatter schemas; `src/content/index.ts` parses every frontmatter object as it builds the index and throws with the offending filename and field on failure. Because the index module is imported during SSR of the first route, a bad file fails `bun run build`.

The swap also covers `src/env.server.ts` and `src/env.client.ts`. `@t3-oss/env-core` v0.13 accepts any Standard Schema validator, so the migration is field-for-field (`z.string()` → `v.string()`, `z.enum([...])` → `v.picklist([...])`, `.default(x)` → `v.optional(v.string(), x)`) with no change to `createEnv`'s shape. The SMTP and `SEND_CONTACT_TO` variables are dropped from the server schema in the same edit, since the contact form is gone; only `NODE_ENV`, `OP_CLIENT_SECRET`, `VITE_OP_CLIENT_ID`, and `VITE_OP_API_URL` remain.

*Why over the alternatives:* requested directly. Valibot's modular pipeline tree-shakes to a fraction of Zod's bundle, which matters because the env schema is imported on the client. Alternative considered: TypeScript types alone, rejected because frontmatter is untyped YAML at runtime and a typo would render a blank field rather than fail the build.

### Tokens as Tailwind 4 `@theme` in `src/app.css`

Rewrite `src/app.css`: the Pencil variable set becomes `@theme` custom properties, with light values on `:root` and dark values under `.dark`, matching the class the existing pre-hydration script already sets. Lane colours become `--color-building`, `--color-building-soft`, and so on for all five lanes. The ten type roles become utility classes (`.t-display-xl` … `.t-code`) rather than per-component Tailwind chains, because each role fixes family, size, weight, line height, and letter spacing together and the design maps HTML elements onto them directly.

*Why over the alternatives:* a TypeScript token object plus inline styles loses Tailwind's variants and forces every component to thread theme state. Per-component utility chains would restate the type scale in twenty places and drift on the first edit.

### Component architecture: layered folders, one component per file

`src/components/` is restructured so a node in the design maps to exactly one file, and the layer a file sits in says what it is allowed to depend on:

```
src/components/
  ui/          vendored shadcn/Base UI primitives — button, input, separator,
               dropdown-menu, field. Regenerable; edited only to retheme.
  atoms/       the design's 10 base components — rule, surface, overline,
               meta-stamp, tag, code-chip, kbd, link, icon-button, search-trigger.
  composites/  the design's 7 composites — section-header, artifact-card,
               log-entry, tool-card, state-filter, breadcrumb, lane-guide.
  layout/      site chrome and page scaffolding — nav, footer, container,
               section, prose, theme-toggle.
  identity/    identity-card, decrypted-text.
```

Dependency direction is one-way: `layout` → `composites` → `atoms` → `ui` → `lib`. A file never imports from its own layer's sibling unless that sibling is a lower-layer re-export, and nothing below `layout` imports from `~/content` or from `react-router`'s data hooks.

Composition rules, applied to every new component:

- **One component per file**, kebab-case filename matching the exported PascalCase name. No barrel files — direct imports keep HMR and tree-shaking honest.
- **Compose, don't configure.** A composite with more than one slot ships as namespaced parts (`ArtifactCard.Root`, `.Lane`, `.Title`, `.Summary`, `.Topics`, `.Action`) rather than a props object describing its contents. Pages assemble parts; components never grow a `variant`-shaped escape hatch for a layout the design does not have.
- **Universal by default.** Every component accepts `className` and spreads the rest of its props onto its root element, merging with `cn()`. No component reads route data, loader data, or the content index — pages fetch and pass down. That is what makes an atom reusable across Home, Workbench, and About without a second variant.
- **Variants via `class-variance-authority`** (already a dependency), enumerated from the design's own states — `button/primary|secondary|ghost|accent|destructive`, `tag/building|investigating|deciding|shipped|keeping` — never as booleans that can combine into undesigned states.
- **Polymorphism through Base UI's `render` prop** where an atom must become an anchor or a `Link`, instead of duplicating the atom per element type.
- **Twice means extract.** Any markup or logic that appears in two places moves out on the second occurrence: shared markup becomes a component in the layer below, shared logic becomes a helper in `src/lib/`. Date formatting, lane→token mapping, and slug→href construction are helpers from the start, because the design already uses each in three places.

`IdentityCard` and `DecryptedText` move to `identity/` and are restyled onto the new tokens (mono display role, `--foreground` / `--muted-foreground`, the lane-free neutral ramp). Their behaviour, props, and animation are untouched — this is a retheme, not a rewrite. `IdentityCard` lands in Home's profile panel, where the design already calls for the name-plus-contact block.

Keep `lucide-react`. The design system frame specifies Tabler but annotates the canvas preview as Lucide with the same outlined style at the same 24px grid and 1.5–2px stroke; Lucide is already installed and the visual difference at 16/20px is not material. Revisit only if a specific glyph is missing.

### `DESIGN.md` is the code-side source of truth

`DESIGN.md` at the repository root — written alongside this plan — documents the token set, the ten type roles, the layout system, theming, the component inventory with its composition rules, the lane taxonomy, and the accessibility floor, transcribed from `design/design-2.pen`. Sections describing code this change introduces are marked _(planned)_ and lose the marker as they land. `design-2.pen` stays authoritative for visual design; `DESIGN.md` plus `src/app.css` are authoritative for code. Any token or role added in one must be added to the other in the same commit.

*Why:* the transcription from Pencil to CSS is manual and one-directional, so without a written record the tokens drift the first time someone adds a colour. A prose document also gives the composition rules a home that a CSS file cannot.

### Routing

Flat file routes under `src/routes/`: `_index.tsx` (Home), `workbench._index.tsx`, `workbench.$slug.tsx`, `tools._index.tsx`, `about.tsx`, `$.tsx` (404), `sitemap[.]xml.ts`, `robots[.]txt.ts`. `workbench.$slug.tsx` looks the slug up in the index and throws `data(null, { status: 404 })` on a miss so the 404 is a real 404. The lane filter on Workbench is a `?lane=` search param read through the already-installed `nuqs`, with the unfiltered URL as canonical.

### SEO helper over per-route duplication

A single `src/lib/meta.ts` builds title, description, canonical, and Open Graph tags from a small per-route input, and emits the JSON-LD blocks (`WebSite` + `Person` on Home, `Article` on artifact pages). The existing `sitemap[.]xml.ts` is rewritten to enumerate the static routes plus every artifact from the content index with its `updatedAt ?? publishedAt` as `lastmod`.

## Risks / Trade-offs

- **Every route and component is replaced at once; there is no incremental cutover.** → The change is a single branch verified by `bun run typecheck`, `bun run lint`, `bun run build`, and a manual walk of all six routes in both themes before merge. `main` is the rollback.
- **The design was drawn at 1440px only; no responsive frames exist.** → Responsive behaviour is derived from the design's own breakpoint annotations (`base` one column, `md` 12 columns with 32px gutter, `lg` 280px rail plus content, `xl` centred `max-w-7xl`). Where a layout is ambiguous below `md`, it stacks. Flagged for review with the user at the small breakpoints.
- **Token transcription from Pencil is manual and can drift from the `.pen` file.** → Tokens are transcribed once into `app.css` in a single commit with the variable dump as the reference; `DESIGN.md` records the result, and the pairing (`.pen` for design, `DESIGN.md` + `app.css` for code) is stated there.
- **Restyling `IdentityCard` risks breaking its measurement logic**, which reads `getBoundingClientRect` against the rendered glyph widths. → The retheme changes colour and type-role classes only; the container, ref structure, and `ResizeObserver` are left alone and the hover highlight is checked at each breakpoint.
- **Valibot's `@t3-oss/env-core` integration is Standard-Schema-based and less travelled than the Zod path.** → The env swap is done and verified first, before the content schemas depend on valibot, so a failure surfaces on a two-file change rather than mid-rewrite.
- **MDX bodies are compiled into the client bundle, so a note with heavy embedded components costs more than a plain page.** → Bodies are lazily globbed and split per route; revisit only if an artifact grows past a rendered page of prose.
- **Deleting the DB destroys existing bookmark and contact rows.** → Confirmed with the user: nothing is migrated. `data/sqlite.db` is deleted in the same commit that removes the schema, and the file's last state remains in git history if the repo tracked it.
- **Removing `nodemailer` and the contact form means an inbound message is now a `mailto:` the visitor's client must handle.** → Accepted; the About page also exposes GitHub and LinkedIn as alternative routes to contact.

## Open Questions

- Which lane and which artifact should be `featured` on Home at launch, and what the three seed artifacts are. Deferred: it is content, authored during apply, and does not affect the approach.
- Whether the `SearchTrigger` / `Kbd` atoms get a working ⌘K palette. Deferred to its own change; they render inert here.
- Whether `DecryptedText` gets a second use beyond `IdentityCard` (the 404 status line is the obvious candidate). Deferred: presentation only, decided while building the page.

## 1. Strip the old site

- [ ] 1.1 Delete the persistence layer: `src/db/`, `src/schemas/`, `scripts/seed.ts`, `drizzle.config.ts`, `data/sqlite.db`; verify `grep -rn "drizzle\|bun:sqlite\|bookmarkVotes" src scripts` returns nothing
- [ ] 1.2 Delete the removed features: `src/routes/bookmarks.tsx`, `src/routes/contact.tsx`, `src/components/bookmarks/`, `src/components/emails/`, `src/lib/anti-spam.ts`, `src/lib/mail.ts`; verify no remaining import references them
- [ ] 1.3 Delete the portfolio components — `hero`, `skills`, `skill-icons`, `highlights`, `experience-timeline`, `spotlight-card`, `count-up`, `section-heading` — while explicitly keeping `identity-card.tsx`, `decrypted-text.tsx`, `src/middlewares/identity.ts`, `src/context/user.ts`, `src/lib/fingerprint.ts`, `src/lib/client-info.ts`, `src/lib/theme.ts`, and `src/store/theme.ts`; verify `grep -rn "identityMiddleware\|getFingerprint\|useThemeStore" src` still resolves and `bun run typecheck` reports only errors from routes still to be rewritten
- [ ] 1.4 Remove `drizzle-orm`, `drizzle-kit`, `nodemailer`, `@react-email/components`, `three`, `react-hook-form`, `remix-hook-form`, `@hookform/resolvers` from `package.json`, drop the `db:*` scripts, drop the `bun:sqlite` SSR external from `vite.config.ts`, and run `bun install`; verify `motion`, `@uidotdev/usehooks`, `@icons-pack/react-simple-icons`, and `nuqs` are still installed and `bun run lint` passes

## 2. Validation swap: Zod to Valibot

- [ ] 2.1 Add `valibot`, migrate `src/env.server.ts` and `src/env.client.ts` to valibot schemas (`v.string()`, `v.picklist()`, `v.optional(schema, default)`), and drop the now-unused `SMTP_*` and `SEND_CONTACT_TO` variables; verify the app boots with only `NODE_ENV`, `OP_CLIENT_SECRET`, `VITE_OP_CLIENT_ID`, `VITE_OP_API_URL` set, and fails loudly when one is missing
- [ ] 2.2 Remove `zod` from `package.json` and run `bun install`; verify `grep -rn "\"zod\"\|from \"zod\"" src package.json` returns nothing and `bun run typecheck` passes

## 3. Design system foundation

- [ ] 3.1 Rewrite `src/app.css` with the Pencil token set as Tailwind 4 `@theme` custom properties — the 19 semantic roles on `:root` and `.dark`, five lane colours plus soft variants, sidebar and chart roles, `space-1..10`, `radius-*`, container/grid/measure/breakpoint values; verify every variable in the `.pen` dump has a counterpart and `bun run build` emits them
- [ ] 3.2 Add the ten type-role utility classes (`.t-display-xl` … `.t-code`) with the family, size, weight, line height, and letter spacing from the design, plus the element→role mapping for `h1`–`h4`, `body`, `small`, and `time`; verify a scratch page renders each role at the specified metrics
- [ ] 3.3 Add the shadow tokens and the dark-mode elevation rule (surface step plus hairline, no drop shadow); verify raised surfaces show no shadow in dark mode
- [ ] 3.4 Verify the retained theme system still applies `light`/`dark`/`system` before first paint against the new tokens — load each mode, toggle at runtime, reload, and confirm no flash, no undefined colour, and that the stored preference survives

## 4. Component architecture

- [ ] 4.1 Create the layered folders `src/components/{ui,atoms,composites,layout,identity}/` and move the retained `identity-card.tsx` and `decrypted-text.tsx` into `identity/`; verify imports resolve and `bun run typecheck` passes
- [ ] 4.2 Retheme the vendored `src/components/ui/` primitives (`button`, `input`, `separator`, `dropdown-menu`, `field`) onto the new tokens and delete the unused ones; verify each renders correctly in both modes with focus and disabled states matching the design
- [ ] 4.3 Build the 10 atoms — `rule`, `surface`, `overline`, `meta-stamp`, `tag`, `code-chip`, `kbd`, `link`, `icon-button`, `search-trigger` — one per file, each accepting `className` and spreading props, variants via `class-variance-authority` enumerated from the design's states; verify each matches its design frame in both modes and that `SearchTrigger` renders inert
- [ ] 4.4 Build the 7 composites — `section-header`, `artifact-card`, `log-entry`, `tool-card`, `state-filter`, `breadcrumb`, `lane-guide` — as namespaced compound parts rather than props-configured blocks; verify each against its design frame and that none imports loader data or the content index
- [ ] 4.5 Extract the shared helpers the design uses in three or more places — date formatting, lane→token mapping, slug→href construction — into `src/lib/`; verify no lane colour string or date format literal appears in more than one component
- [ ] 4.6 Build `src/components/layout/` — `nav`, `footer`, `container`, `section`, `prose`, `theme-toggle` — with `Index / Tools / Workbench / About` as real `href` anchors and an `aria-current` marker on the active section; verify every destination is reachable with JavaScript disabled
- [ ] 4.7 Retheme `IdentityCard` onto the new tokens and type roles without touching its refs, `ResizeObserver`, or measurement logic; verify the hover highlight still tracks each segment correctly at every breakpoint in both modes
- [ ] 4.8 Update `src/constants.ts` to the new navigation, social links, and site metadata; verify nothing still references the removed bookmarks/contact routes
- [ ] 4.9 Verify the layer contract holds: `layout` → `composites` → `atoms` → `ui` → `lib`, no barrel files, no upward imports — check with a grep over each folder's imports

## 5. Content layer

- [ ] 5.1 Add `@mdx-js/rollup`, `remark-frontmatter`, `remark-mdx-frontmatter` and wire the MDX plugin ahead of `reactRouter()` in `vite.config.ts`; verify a throwaway `.mdx` file imports and renders
- [ ] 5.2 Define `src/content/schema.ts` with the valibot artifact and experience frontmatter schemas (`title`, `lane`, `summary`, `publishedAt`, optional `updatedAt`/`topics`/`featured`); verify a file with a bad `lane` and a file with a missing field each fail parsing with the field named
- [ ] 5.3 Build `src/content/index.ts` — eager frontmatter glob plus lazy body glob, slug from filename, validation at module load, index sorted by `publishedAt` desc then slug asc; verify the build fails on a malformed fixture and succeeds once it is corrected
- [ ] 5.4 Author the seed content: the workbench artifacts shown in the design (one per lane plus the featured note), the three experience entries, and the three tool cards; verify all appear in the derived index in the expected order
- [ ] 5.5 Add lane-filter and lane-grouping helpers over the index and verify each returns exactly the matching entries in index order

## 6. Pages

- [ ] 6.1 Rewrite `src/routes/_index.tsx` as the designed Home — hero statement, profile panel including the rethemed `IdentityCard`, workbench preview (featured plus three distinct lanes, drawn from the index), tools preview; verify a single `h1`, that every artifact link resolves, and that light and dark both match their design frames
- [ ] 6.2 Build `src/routes/workbench._index.tsx` — introduction, four-lane guide, artifact index rows with lane/title/summary/topics; verify every indexed artifact appears exactly once
- [ ] 6.3 Add the `?lane=` filter via `nuqs` with a shareable, reloadable URL and an empty state that returns 200; verify each lane filters correctly and an empty lane shows the empty state with a way back
- [ ] 6.4 Build `src/routes/workbench.$slug.tsx` rendering title as `h1`, lane, dates, topics, and the lazily loaded MDX body, throwing a 404 response on an unknown slug; verify a known slug returns 200 with full content and an unknown slug returns 404
- [ ] 6.5 Build `src/routes/tools._index.tsx` with the intro and the tool-card grid, placeholder cards marked forthcoming and non-navigating; verify activating a placeholder card does nothing and produces no error
- [ ] 6.6 Rewrite `src/routes/about.tsx` — hero, practice summary, three practice columns, content-driven experience timeline, contact block with `mailto:`, résumé, GitHub, LinkedIn; verify no form is present and the timeline renders from `content/experience`
- [ ] 6.7 Rewrite `src/routes/$.tsx` as the designed typographic 404 with recovery links, returning a 404 status; verify the status code and that each recovery link returns 200
- [ ] 6.8 Update `src/root.tsx` for the new chrome, fonts, and error boundary while leaving `identityMiddleware` and the theme init script in place; verify every route renders nav and footer including the 404, and that OpenPanel still receives an identify call per request

## 7. SEO

- [ ] 7.1 Build `src/lib/meta.ts` producing title, description, absolute canonical, and Open Graph tags from a per-route input; verify all six routes emit unique, non-empty titles and descriptions
- [ ] 7.2 Wire per-route metadata, deriving artifact titles and descriptions from frontmatter and setting the Workbench canonical to the unfiltered URL; verify a filtered Workbench view canonicalises to `/workbench`
- [ ] 7.3 Emit `WebSite` + `Person` JSON-LD on Home and `Article` JSON-LD on artifact pages; verify each block parses as valid JSON-LD and asserts only values visible on the page
- [ ] 7.4 Rewrite `src/routes/sitemap[.]xml.ts` to enumerate the static routes plus every artifact with `updatedAt ?? publishedAt` as `lastmod`, and add `robots[.]txt.ts` declaring the absolute sitemap URL; verify a newly added artifact appears in the sitemap and that no filtered or query-string URL is listed

## 8. Verification

- [ ] 8.1 Run `bun run typecheck`, `bun run lint`, and `bun run build`; verify all three pass with no errors
- [ ] 8.2 Reconcile `DESIGN.md` against the shipped `src/app.css` and `src/components/` tree; verify every documented token, type role, and component exists and nothing shipped is undocumented
- [ ] 8.3 Walk all six routes plus one artifact page in light and dark at the `base`, `md`, `lg`, and `xl` breakpoints; verify no horizontal overflow, no collapsed layout, and body text never exceeding the 680px measure
- [ ] 8.4 Tab through every page and check focus order, visible focus indicators, and WCAG AA contrast on text and controls in both modes; fix any failure found
- [ ] 8.5 Fetch each route's HTML with JavaScript disabled and verify headings, body copy, artifact titles and summaries, and internal links are all present in the server-rendered markup
- [ ] 8.6 Verify the status contract end to end: known routes and artifacts return 200, an unknown route and an unknown slug return 404, and every internal link on every page resolves to a 200

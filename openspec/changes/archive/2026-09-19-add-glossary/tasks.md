## 1. Content layer

- [x] 1.1 Add `glossarySchema` to `src/content/schema.ts` (`term`, `summary` required; `aka: string[]`, `related: string[]`, `updatedAt` ISO date, `draft` default false optional) and export `GlossaryFrontmatter`; verify `bun run typecheck` passes
- [x] 1.2 Add `terms` and `termBodies` to `src/content/index.ts` following the `artifacts`/`bodies` pattern: glob `/content/glossary/*.mdx`, parse frontmatter, slug from filename, drop drafts when `import.meta.env.PROD`, sort by `term` with `localeCompare(..., undefined, { sensitivity: "base" })` then slug; verify a temporary term file appears in `terms` in dev and a deliberately broken one fails the build naming file and field
- [x] 1.3 Add the `related` validation pass after `terms` derives: every `related` slug must exist in the published set or throw `Invalid frontmatter in <path>: field "related" — unknown term "<slug>"`; verify by pointing a term at a nonexistent slug and confirming the build fails, then at a `draft: true` term with `NODE_ENV=production bun run build` and confirming it fails
- [x] 1.4 Add `content/templates/glossary.mdx` and `content/docs/glossary.md` (frontmatter table, body guidance of 80–200 words, the "term slug must equal the artifact topic to cross-link" rule, ordering, drafts); verify the template parses under the schema when `draft: true` is removed

## 2. Constants and hrefs

- [x] 2.1 Add `glossaryHref(slug)` beside `artifactHref` in `src/lib/workbench-href.ts`; verify typecheck passes
- [x] 2.2 Add a `Glossary` copy block to `src/constants.ts` (eyebrow, title, lede, index eyebrow/title, empty-state copy, "Back to the glossary" and "Used in" / "Related terms" labels) in noun-phrase voice; add `{ to: "/glossary", label: "Glossary" }` after Workbench in `Nav.links` and `Nav.footerLinks`; add `/glossary` to `PUBLIC_PAGES` with the lede as its note; verify lint and typecheck pass

## 3. Routes

- [x] 3.1 Add `src/components/composites/term-row.tsx` mirroring `ArtifactRow`: term name linking to `glossaryHref`, aliases as muted inline text, summary, arrow; verify it renders in both themes with no undefined colours
- [x] 3.2 Add `src/routes/glossary._index.tsx`: `pageMeta` with title `Glossary — Ihor Mukovoz`, description from the lede, path `/glossary`; hero (eyebrow, `h1`, lede); `SectionHeader` with padded count; `TermRow` list or the empty state; one `JsonLd` `DefinedTermSet` with `hasDefinedTerm` entries carrying `name`, `description`, absolute `url`; verify `curl -s http://localhost:5173/glossary` returns 200 and contains every seeded term name and summary
- [x] 3.3 Add `src/routes/glossary.$slug.tsx` mirroring `workbench.$slug.tsx`: loader finds by slug or throws 404 `data`; `meta` titles `<term> — Glossary` with the summary as description and `noIndex` on the 404 branch; `Breadcrumb` (Glossary), `h1` term, aliases line, summary lede, `Rule`, `Prose` body under `Suspense`, `Rule`, closing block with related-term links (resolved to names), artifact links from `artifacts.filter((a) => a.topics?.includes(slug))`, and the back link; `JsonLd` `DefinedTerm` (`name`, `description`, `url`, `inDefinedTermSet`, `alternateName` when `aka`) and `BreadcrumbList`; verify `curl -s` on a seeded term returns 200 with the body text and an unknown slug returns 404 with the not-found page
- [x] 3.4 Verify the closing block omits the "Related terms" and "Used in" lists when empty, renders them when a term has `related` and when an artifact's `topics` contains its slug, and that every rendered link resolves to a 200

## 4. Discovery surfaces

- [x] 4.1 Add a `terms.map(...)` block to `src/routes/sitemap[.]xml.ts` emitting each term URL with `<lastmod>` only when `updatedAt` is set; verify `curl -s http://localhost:5173/sitemap.xml` lists `/glossary` (from `PUBLIC_PAGES`) and every term, and no term entry carries a fabricated `lastmod`
- [x] 4.2 Add a `Glossary` section to `src/routes/llms[.]txt.ts` between Workbench and Tools, each entry `link(term, glossaryHref(slug), summary)`; verify the served file still opens with one H1 and a blockquote and every Glossary link is absolute
- [x] 4.3 Verify `MARKDOWN_TEST_ORIGIN=http://localhost:5173 bun test src/lib/markdown.server.test.ts` still passes and that `curl -H 'Accept: text/markdown' http://localhost:5173/glossary/<slug>` returns Markdown containing the term and body

## 5. Seed content

- [x] 5.1 Author the topic-matched batch (slugs equal to existing artifact topics): `react`, `typescript`, `react-router`, `state-management`, `error-handling`, `result-type`, `code-review`, `code-smells`, `abstractions`, `regex`, `performance`, `migration`, `frontend-architecture`, `cross-platform`, `oop`, `self-hosting`, `homelab`, `devtools`, `ai-agents`; verify each term page lists at least one artifact under "Used in"
- [x] 5.2 Author the site-vocabulary batch: `legacy-modernization`, `feature-flag`, `experiment`, `content-security-policy`, `source-map`, `mdx`, `server-side-rendering`, `hydration`, `react-server-components`, `bff`, `idempotent`, `url-state`, `technical-debt`; verify each has `summary` under 160 characters and a body of 80–200 words
- [x] 5.3 Add `aka` where a term has a common alias (`bff` → Backend for Frontend, `csp`, `ssr`, `rsc`, `mdx`) and `related` between natural neighbours (`react` ↔ `react-router` ↔ `url-state`, `result-type` ↔ `error-handling`, `feature-flag` ↔ `experiment`, `ssr` ↔ `hydration` ↔ `rsc`); verify the build passes the `related` check and every related link resolves
- [x] 5.4 Review every term against the site copy voice (noun phrases in chrome; plain, ownership-stating first person only inside bodies where warranted) and check for typos and mixed-language strings; verify `bun run lint` passes on the content directory

## 6. Documentation and verification

- [x] 6.1 Update the Content Layer sections of `CLAUDE.md` and `AGENTS.md` and the `content/` bullet under Key Directories to name `glossary/`; verify the "content directory contains only" list matches the delta spec
- [x] 6.2 Verify the header at 768px and the mobile nav render five links without wrapping or clipping in both themes; if the header cannot hold five, remove the link from `Nav.links` only, keep it in `footerLinks`, and update the `glossary` delta spec's chrome requirement to say footer and public pages
- [x] 6.3 Verify structured data on `/glossary` and one term page with a JSON-LD validator (Schema.org validator or Google Rich Results test): `DefinedTermSet`, `DefinedTerm`, and `BreadcrumbList` parse with no errors and assert only visible content
- [x] 6.4 Verify every page's `head` contains exactly one canonical, that `/glossary` and each term canonical point at themselves, and that titles across `/`, `/workbench`, `/tools`, `/about`, `/glossary`, and every term page are pairwise distinct
- [x] 6.5 Run `bun run typecheck`, `bun run lint`, `bun run build`, `bun run verify:bundle`, and `bun test src/lib/markdown.server.test.ts`; confirm all pass, then fetch every URL in `sitemap.xml` and `llms.txt` against `bun start` and confirm each returns 200

## Context

See `proposal.md` — Why. Design-relevant current state:

- The content layer is one pattern applied three times: `import.meta.glob` over `content/<collection>/*.mdx` with `import: "frontmatter"`, a `valibot` schema in `src/content/schema.ts`, `parseFrontmatter()` failing the build on the first bad field, slug from filename, and a second glob for bodies. Artifacts (`workbench`) are the full version: lazy bodies, `draft` filtered by `import.meta.env.PROD`, deterministic sort.
- `src/routes/workbench.$slug.tsx` is the reference detail page: loader finds by slug or throws `data(null, { status: 404 })`, `meta` uses `pageMeta()`, the body renders inside `Prose` under `Suspense`, `JsonLd` emits `Article` and `BreadcrumbList`, and `Breadcrumb`, `MetaStamp`, `CodeChip`, `Rule`, `Link` are the atoms it composes.
- `PUBLIC_PAGES` in `src/constants.ts` feeds both `sitemap[.]xml.ts` and `llms[.]txt.ts`; both also iterate `artifacts` directly.
- Artifacts carry free-form `topics` (lowercase kebab, e.g. `react`, `state-management`, `error-handling`). Nothing filters on them yet.
- Markdown content negotiation lives in `src/entry.server.tsx` and applies to every HTML route.
- Chrome copy is impersonal noun phrases (`tasks/lessons.md`), and the site's design system is fixed in `DESIGN.md` — no new tokens or component families.
- No test runner beyond `bun test` on `src/lib/markdown.server.test.ts`. Verification is typecheck, lint, build, and fetching pages from the running server.

## Goals / Non-Goals

**Goals:**

- A fourth content collection that is indistinguishable in shape from the first three, so authoring a term is authoring a file.
- Every term page is a leaf with its own metadata and structured data, internally linked from the index, from chrome, from related terms, and from artifacts — the internal-link graph is what carries the SEO weight.
- Cross-links that cannot dangle: a bad `related` slug is a build failure, not a 404 discovered by a crawler.

**Non-Goals:**

- Automatic term linking inside artifact bodies (scanning prose for term names). Authors link explicitly with normal Markdown links.
- A `terms` field on artifacts. The artifact→term edge reuses `topics`; adding a parallel field would make two lists that drift.
- Letter navigation, grouping, or search on the index. Thirty to sixty entries scan fine as one list at the reading measure.

## Decisions

### One MDX file per term, same collection pattern

`content/glossary/<slug>.mdx`, `glossarySchema` in `schema.ts`, `terms` and `termBodies` exported from `src/content/index.ts`, built exactly as `artifacts`/`bodies` are — including lazy bodies, since only one body renders per request.

*Alternative considered:* a single `glossary.yaml` or a TypeScript array of `{ term, definition }`, which is all the reference site has. Rejected — per-term pages need a long-form body, and the site's rule is "every time-varying page is an MDX file". A second authoring format for one collection would be the exception that needs explaining.

### Frontmatter: `term`, `summary`, `aka?`, `related?`, `updatedAt?`, `draft?`

- `term` not `title`: a glossary entry is a name, and `term` reads correctly in JSON-LD (`DefinedTerm.name`).
- `summary` keeps the artifact vocabulary — one sentence, lede plus meta description plus index line plus `llms.txt` note. Same word, same job.
- `aka` is a string list rendered under the `h1` and included in the index entry so alias queries land on the same page.
- No `publishedAt`. A definition has no publication date worth showing, and an honest sitemap carries no `lastmod` rather than a fake one. `updatedAt` is optional for the rare rewrite.
- No `topics`, `lane`, `kind`, `featured`. None has a consumer.

### Artifact → term edge is `artifact.topics.includes(term.slug)`

On the term page: `artifacts.filter((a) => a.topics?.includes(term.slug))`. One line, no schema change, and it rewards the existing convention of kebab-case topics. Seed terms are chosen so their slugs coincide with topics already in use (`react`, `state-management`, `error-handling`, `code-review`, `result-type`, `regex`, `abstractions`, …), so the links appear on day one.

*Alternative considered:* a `terms: []` field on artifacts. Rejected — see Non-Goals. *Consequence:* a topic that is not a term links nowhere, which is today's behaviour; a term whose slug matches no topic simply lists no artifacts.

### `related` is validated at index build time

After both indexes derive, a pass checks every `related` slug against the set of published term slugs and throws with the file and slug otherwise. This runs at module load, where `parseFrontmatter` already fails builds, so it is the same failure surface. The check uses the *published* set: in production a term related only to a draft fails the build, which is correct — a link to a 404 would otherwise ship.

### Index page shows every definition

`/glossary` renders term, aliases, and summary per entry, each entry's term linking to `/glossary/<slug>`. This makes the index a useful page on its own (and a long, keyword-dense one), rather than a bare list of links. Layout reuses the `ArtifactRow` rhythm — a `divide-y` list at full width — but with a smaller grid: name column, definition, arrow. A new `TermRow` composite mirrors `ArtifactRow` rather than parameterising it; two small components beat one with a mode switch.

### Structured data

- Index: one `DefinedTermSet` with `name`, `url`, and `hasDefinedTerm: DefinedTerm[]` (each `name`, `description`, `url`).
- Term page: one `DefinedTerm` (`name`, `description`, `url`, `inDefinedTermSet: <index url>`, `alternateName` when `aka` is set) and one `BreadcrumbList` (Glossary → term). Both via the existing `JsonLd` component.

No `@id` graph linking — the site's other pages do not use one, and the term→set edge is expressed by `inDefinedTermSet` directly.

### Routing and chrome

- `src/routes/glossary._index.tsx` and `src/routes/glossary.$slug.tsx`, mirroring the workbench pair.
- `glossaryHref(slug)` added beside `artifactHref` in `src/lib/workbench-href.ts` — renamed to `src/lib/hrefs.ts` only if the rename is trivial in the same pass; otherwise left where it is. Three call sites (index, term page, sitemap/llms) justify the helper, as with artifacts.
- `Nav.links` and `Nav.footerLinks` gain `{ to: "/glossary", label: "Glossary" }` after Workbench. `PUBLIC_PAGES` gains `/glossary` with the index lede as its note. A `Glossary` block in `constants.ts` holds eyebrow, title, lede, empty-state, and CTA strings — noun phrases, no first person.
- `sitemap[.]xml.ts` and `llms[.]txt.ts` each gain one `terms.map(...)` block; `feed[.]xml.ts` is untouched.

### Seed content: ~30 terms, matched to existing topics first

The initial batch is written in the apply phase from a fixed list (in `tasks.md`) so the collection is a glossary on day one. Priority order: slugs that already appear as artifact topics, then the terms the About and Home copy uses (frontend architecture, legacy modernization, cross-platform), then common definitional queries in the site's domain (idempotent, hydration, SSR, RSC, CSP, source maps, feature flag, …). Bodies are 80–200 words: the definition, the nuance the one-liner hides, and when it matters in practice. Each term with a natural neighbour gets `related`.

*Alternative considered:* ship the mechanism with five terms and grow it. Rejected — five pages is not a glossary, and the internal-link benefit only appears once artifacts' topics have matching terms.

## Risks / Trade-offs

- [Thin pages] A term page with an 80-word body is close to the "thin content" line for search engines → every page carries a definition, a body, aliases, and at least one outbound internal link; the index page and chrome links make each a well-connected node rather than an orphan. Terms without anything worth saying beyond the one-liner are not added.
- [Duplicate content between index and term page] The summary appears on both → the term page adds the body, aliases, and cross-links; the index is the canonical home for the *set*, the term page for the *term*, and each has its own canonical URL.
- [Topic/term slug drift] An author tags an artifact `react-router` when the term is `react-router-framework-mode` → the term lists nothing. Mitigation is documentation (`content/docs/glossary.md` states the rule) and choosing term slugs to match existing topics. No validation, since a topic is legitimately allowed to have no term.
- [Nav grows to five links] The mobile nav and footer are designed around four → verified visually in both themes during apply; if the header breaks at narrow widths the Glossary link stays in the footer and `PUBLIC_PAGES` only, and the proposal's "primary navigation" claim is scaled back in the spec.
- [Build-time `related` check runs on every module load in dev] Negligible for tens of terms; a set lookup per slug.

## Migration Plan

Additive only. Deploy as one release: new routes, new content, chrome links. Rollback is reverting the commit; no URL that exists today changes. If the glossary is later retired, its URLs would need 301s to the index under the site's "retired page redirects" rule.

## Open Questions

- Whether `kind`-style eyebrows or a per-term "used in N artifacts" count belong on the index. Cosmetic; can be added without touching the schema.

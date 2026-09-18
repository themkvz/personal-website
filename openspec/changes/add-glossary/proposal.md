## Why

The site's only indexable long-form surface is the workbench, and each artifact targets one narrow subject. A glossary of the terms the workbench already uses — frontend architecture, React, TypeScript, the web platform, delivery practice — adds a set of small, self-contained pages that each answer one definitional query, link into the artifacts that use the term, and give the workbench a stable place to link back to. Doing it as one page per term (rather than one long page with anchors, as sergiodxa.com/glossary does) lets each definition carry its own title, description, canonical URL, and structured data, so each term can rank on its own.

## What Changes

- Add a `glossary` content collection: one MDX file per term under `content/glossary/`, typed frontmatter validated with `valibot` at module load, slug from filename, drafts hidden in production — the same contract the workbench already follows.
- Add `/glossary`: an alphabetical index that shows every term with its one-line definition (so the index page is a complete glossary in itself, like the reference site) and links each term to its own page.
- Add `/glossary/<slug>`: a term page with the term as `h1`, the one-line definition as lede, the longer MDX body, aliases, links to related terms, and links to the workbench artifacts whose `topics` include the term's slug. Unknown slugs return 404 through the existing not-found page.
- Emit `DefinedTermSet` structured data on the index and `DefinedTerm` plus `BreadcrumbList` on each term page.
- Add every published term page to `sitemap.xml`, add a Glossary section to `llms.txt`, add `/glossary` to `PUBLIC_PAGES`, and link Glossary from the primary navigation and the footer so term pages receive internal links from every page.
- Seed the collection with an initial batch of roughly thirty terms drawn from the topics the existing artifacts already tag, so day one has enough pages to be a glossary rather than a placeholder.

Non-goals: no letter-group headings or in-page search on the index (revisit past ~80 terms); no per-term RSS items; no MDX component provider; no change to the workbench artifact schema — the artifact→term link reuses the existing `topics` field.

## Capabilities

### New Capabilities
- `glossary`: the contract for the glossary index page and the per-term pages — what each renders, ordering, alias and related-term handling, artifact cross-links, structured data, and status codes.

### Modified Capabilities
- `content-model`: a new glossary collection with its own frontmatter contract, validated and drafted under the same rules as artifacts; the "content directory contains only `workbench/`, `experience/`, `tools/`" scenario gains `glossary/`.
- `seo`: the sitemap requirement covers glossary term pages with an honest `lastmod`; the structured data requirement names `DefinedTermSet` and `DefinedTerm`.
- `discovery-files`: the agent index file (`llms.txt`) indexes every published glossary term.

## Impact

- **New content**: `content/glossary/*.mdx` (initial batch), `content/templates/glossary.mdx`, `content/docs/glossary.md`.
- **New route modules**: `src/routes/glossary._index.tsx`, `src/routes/glossary.$slug.tsx`.
- **Modified**: `src/content/schema.ts` (glossary schema), `src/content/index.ts` (glossary index and bodies), `src/constants.ts` (`Nav.links`, `Nav.footerLinks`, `PUBLIC_PAGES`, a `Glossary` copy block), `src/routes/sitemap[.]xml.ts`, `src/routes/llms[.]txt.ts`, `src/lib/workbench-href.ts` or a sibling for `glossaryHref`, `CLAUDE.md` / `AGENTS.md` content-layer notes.
- **No new dependencies.** Markdown content negotiation in `src/entry.server.tsx` is global, so term pages serve Markdown to agents with no extra work. No change to the theme, analytics, or experiment layers.

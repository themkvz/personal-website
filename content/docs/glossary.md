# Glossary terms

One MDX file per term: the site's definitional pages.

- **Location:** `content/glossary/<slug>.mdx`
- **Slug:** the filename without `.mdx`. It is the URL: `/glossary/<slug>`.
- **Schema:** `glossarySchema` in `src/content/schema.ts`
- **Index:** `terms` in `src/content/index.ts`
- **Template:** `content/templates/glossary.mdx`

## Frontmatter

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `term` | yes | string | Page `<h1>`, index entry, and `DefinedTerm.name`. The body does not repeat it as an `#` heading. |
| `summary` | yes | string | One sentence. Rendered as the lede, and reused as the meta description, the index-row copy, and the `llms.txt` note. Keep it under 160 characters. |
| `aka` | no | string[] | Alternative names, rendered under the `h1` and included in the index entry so alias queries land on this page. |
| `related` | no | string[] | Slugs of other terms. Every slug must match a published term or the build fails naming the file and the unresolved slug. |
| `updatedAt` | no | ISO date | Renders in the sitemap as `lastmod`. No `publishedAt` — a definition has no publication date worth showing. |
| `draft` | no | boolean (default `false`) | Indexed in dev, dropped from production builds. |

## Behaviour

- **Ordering:** alphabetical by `term`, case-insensitive and locale-aware, ties broken by slug ascending. Every surface (index, sitemap, `llms.txt`) reads that one order.
- **Cross-links to artifacts:** a term page lists every published workbench artifact whose `topics` includes the term's own slug. There is no separate field — choose a term slug that equals an existing artifact topic to make the link appear. A topic with no matching term links nowhere; a term whose slug matches no topic simply lists no artifacts.
- **Drafts:** `draft: true` is filtered out when `import.meta.env.PROD` — no index entry, no sitemap entry, no `llms.txt` entry, and the URL 404s. Visible in `bun run dev`.
- **Validation:** frontmatter is parsed at module load, and `related` is checked against the published set right after. A missing field, a bad date, or an unresolved `related` slug throws and takes the build down with it. There is no silent fallback.

## Body

Rendered inside `Prose`, lazily, under `<Suspense>`.

- Start headings at `##`. The `#` level is the frontmatter `term`.
- Styled elements: links, inline `code`, `ul`/`ol`, `blockquote`. Everything else inherits body type.
- 80–200 words: the definition, the nuance the one-liner hides, and when it matters in practice. A term with nothing to add beyond the one-liner does not need a page.

## Publishing

1. Copy `content/templates/glossary.mdx` to `content/glossary/<slug>.mdx`. The slug is permanent — it is the URL, and it is what an artifact's `topics` must match to link here.
2. Write with `draft: true`. Check it in `bun run dev` at `/glossary/<slug>`; drafts render in dev and 404 in production.
3. Flip `draft` to `false`.
4. On a later substantive edit, add `updatedAt`. Fixing a typo is not a substantive edit.

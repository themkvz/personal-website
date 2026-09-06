# Workbench artifacts

Notes, investigations, decisions, and reference lists. One MDX file per artifact.

- **Location:** `content/workbench/<slug>.mdx`
- **Slug:** the filename without `.mdx`. It is the URL: `/workbench/<slug>`.
- **Schema:** `artifactSchema` in `src/content/schema.ts`
- **Index:** `artifacts` in `src/content/index.ts`
- **Template:** `content/templates/workbench.mdx`

## Frontmatter

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | string | Page `<h1>`, card title, `<title>` tag. Do not repeat it as an `#` heading in the body. |
| `lane` | yes | `building` \| `investigating` \| `deciding` \| `keeping` | Anything else fails the build. See `src/lib/lanes.ts`. |
| `summary` | yes | string | One sentence. Used as the meta description, the card copy, and the RSS `<description>`. |
| `publishedAt` | yes | ISO date `YYYY-MM-DD` | Sort key. Unquoted is fine — YAML 1.2 keeps it a string. |
| `updatedAt` | no | ISO date | Renders as `· UPDATED <date>` next to the publish stamp and as `dateModified` in JSON-LD / `lastmod` in the sitemap. |
| `topics` | no | string[] | Lowercase kebab tags. Shown as chips on the detail page, the index row, and the home hero. |
| `kind` | no | string | An eyebrow label, uppercase by convention (`FIELD NOTE / FRONTEND`). **Only rendered in the home page hero slot** — invisible everywhere else. |
| `featured` | no | boolean (default `false`) | Candidate for the home hero. |
| `draft` | no | boolean (default `false`) | Indexed in dev, dropped from production builds. |

## Lanes

| Lane | Label | For |
| --- | --- | --- |
| `building` | BUILDING | Things taking shape |
| `investigating` | INVESTIGATING | Questions worth exploring |
| `deciding` | DECIDING | Choices worth remembering |
| `keeping` | KEEPING | References worth saving |

## Behaviour

- **Ordering:** `publishedAt` descending, ties broken by slug ascending. Every surface (index, lane filter, home preview, `/feed.xml`, `/sitemap.xml`) reads that one order.
- **Featured:** the home hero picks the *newest* artifact with `featured: true`. Marking several is harmless; only the newest wins. Marking none hides the hero block.
- **Home secondary row:** for each lane other than the hero's, the first artifact in index order.
- **Drafts:** `draft: true` is filtered out when `import.meta.env.PROD` — no list entry, no sitemap, no feed, and the URL 404s. Visible in `bun run dev`.
- **Validation:** frontmatter is parsed at module load. A missing field, a bad lane, or a non-ISO date throws `Invalid frontmatter in <path>: field "<field>" — <message>` and takes the build/server down with it. There is no silent fallback.

## Body

Rendered inside `Prose` (`src/components/layout/prose.tsx`), lazily, under `<Suspense>`.

- Start headings at `##`. The `#` level is the frontmatter `title`.
- Styled elements: links, inline `code`, `ul`/`ol`, `blockquote`. Everything else inherits body type.
- No MDX component provider is registered — plain markdown only. To use a component, `import` it explicitly in the file.

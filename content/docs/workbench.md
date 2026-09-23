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
| `title` | yes | string | Page `<h1>`, card title, `<title>` tag. Sentence case. The body does not repeat it as an `#` heading. |
| `lane` | yes | `building` \| `investigating` \| `deciding` \| `keeping` | Anything else fails the build. See `src/lib/lanes.ts` and [Choosing a lane](#choosing-a-lane). |
| `summary` | yes | string | One sentence. Rendered as the visible lede under the title, and reused as the meta description, the index-row copy, and the RSS `<description>`. |
| `publishedAt` | yes | ISO date `YYYY-MM-DD` | Sort key. Unquoted is fine — YAML 1.2 keeps it a string. |
| `updatedAt` | no | ISO date | Renders as `· UPDATED <date>` beside the publish stamp, plus `dateModified` in JSON-LD and `lastmod` in the sitemap. |
| `topics` | no | string[] | Lowercase kebab tags, two to four. Chips on the detail page, the index row, and the home hero. On the detail page and index row, a topic that matches a published glossary term's slug links to `/glossary/<slug>`; any other topic is plain text. No page filters by them yet. |
| `kind` | no | string | Eyebrow label, uppercase by convention (`FIELD NOTE / FRONTEND`). **Only rendered in the home hero slot** — invisible everywhere else, so it earns its place only on an artifact you expect to feature. |
| `featured` | no | boolean (default `false`) | Candidate for the home hero. |
| `draft` | no | boolean (default `false`) | Indexed in dev, dropped from production builds. |
| `related` | no | string[] | Other artifact slugs, in display order, for the "Related notes" block. Each must be a published artifact, not this one, and listed once. See [Related notes](#behaviour). |

## Behaviour

- **Ordering:** `publishedAt` descending, ties broken by slug ascending. Every surface (index, lane filter, home preview, `/feed.xml`, `/sitemap.xml`) reads that one order.
- **Featured:** the home hero picks the *newest* artifact with `featured: true`. Marking several is harmless; only the newest wins. Marking none hides the hero **and its secondary row**.
- **Home secondary row:** for each lane other than the hero's, the first artifact in index order.
- **Lane filter:** `/workbench?l=<lane>`, built by `laneHref` in `src/lib/workbench-href.ts`. An unrecognised value falls back to the full index.
- **Drafts:** `draft: true` is filtered out when `import.meta.env.PROD` — no list entry, no sitemap, no feed, and the URL 404s. Visible in `bun run dev`.
- **Related notes:** the detail page ends with the artifacts named in `related`. Without `related`, it picks up to three others: most shared topics first, then the same lane, each in index order. With nothing to relate, the block is omitted. Logic in `src/content/related.ts`.
- **Validation:** frontmatter is parsed at module load. A missing field, a bad lane, a non-ISO date, or a `related` slug that is unknown, a draft (in production), the artifact itself, or repeated throws `Invalid frontmatter in <path>: field "<field>" — <message>` and takes the build down with it. There is no silent fallback.
- **No search index.** `SearchTrigger` is disabled and its usage is commented out in `src/routes/workbench._index.tsx`. Readers arrive through the lane filter and the index, so the `title` plus `summary` pair is the whole discovery surface — write them to be scanned.

## Body

Rendered inside `Prose` (`src/components/layout/prose.tsx`), lazily, under `<Suspense>`.

- Start headings at `##`. The `#` level is the frontmatter `title`.
- Styled elements: links, inline `code`, `ul`/`ol`, `blockquote`. Everything else inherits body type.
- No MDX component provider is registered — plain markdown only. To use a component, `import` it explicitly in the file.
- Images go in `public/` and are referenced by absolute path (`/dottt.webp`). There is no content-relative asset pipeline.
- Two to six hundred words. Longer than that is usually two artifacts, or one artifact and a `keeping` list.

### References and copyright

Artifacts in any lane that use external sources or third-party material must end with `## References and copyright`, after the main text's takeaway.

- List the sources used, with a descriptive link and the author or organisation when known. Keep useful inline links in the main text too.
- Credit any quoted or reused text, code, images, or other material to its source and copyright holder. Include the original copyright notice and license or permission details when provided; do not invent ownership or license terms.
- If no external sources or third-party material were used, omit the section entirely. Do not add a no-source notice or an empty heading.
- Omit copyright notices for the artifact's original writing (such as “Original writing © 2025 Ihor Mukovoz.”). Copyright attribution in this section is for quoted or reused third-party material only.
- Replace all template placeholders before publishing.

## Choosing a lane

The lane is a claim about **what kind of knowledge the artifact carries**, not about its subject or its format. The same React migration can produce one artifact in each lane. Pick by asking what state the thinking is in.

| Lane | Write it when | Summary promises |
| --- | --- | --- |
| `building` | Something exists and runs, even roughly. | What was built, and what it does. |
| `investigating` | The question is open and you are still inside it. | The question. |
| `deciding` | The choice is made and already applied. | The rule adopted, in one line. |
| `keeping` | You want to find this material again. | What the collection is for. |

An artifact moves lane by being rewritten as a new file, not by editing `lane` in place — the old URL is the one people have.

### building — work in progress

Active software, prototypes, tools, technical experiments.

Body shape: **what it is** → **how it works**, spending the words on the one mechanism worth explaining → **what is still unresolved**. Link the thing itself if it is reachable.

Nothing running yet means the artifact belongs in `investigating`. A finished build whose interesting content is the choice behind it belongs in `deciding`.

### investigating — open questions

Questions and technologies still being understood.

Body shape: **the question, stated plainly** → **what has been tried, and what it showed** → **what would settle it**.

Ending unresolved is the point of the lane, not a defect in the artifact. When the question does resolve, write the answer as a `deciding` artifact and link back to this one; leave this one standing.

### deciding — decisions, and why

Architecture decisions, rejected alternatives, constraints, reasoning.

Body shape: **the forces** — what made this a real choice → **the rule adopted**, stated so it can be applied to the next case → **the consequence**, including what it costs.

Name the option you rejected. A decision record without a discarded alternative is a description of the code, which the code already provides. `when-url-state-should-replace-local-state.mdx` is the model here.

### keeping — references to reuse

Tools, articles, libraries, references worth remembering.

Body shape: **a paragraph framing why this set is grouped** → **the list**, where each entry says why it is worth returning to, not just what it is.

A bare list of links is a bookmark folder. The annotation is the artifact.

## Publishing

1. Copy `content/templates/workbench.mdx` to `content/workbench/<slug>.mdx`. The slug is permanent — it is the URL.
2. Write with `draft: true`. Check it in `bun run dev` at `/workbench/<slug>`; drafts render in dev and 404 in production.
3. Set `publishedAt` to the day you publish, not the day you started.
4. Flip `draft` to `false`.
5. On a later substantive edit, add `updatedAt`. Fixing a typo is not a substantive edit.

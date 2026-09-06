# Experience entries

The About page timeline. One MDX file per role.

- **Location:** `content/experience/<slug>.mdx`
- **Slug:** the filename without `.mdx`. Internal only — it is a React key, never shown or linked.
- **Schema:** `experienceSchema` in `src/content/schema.ts`
- **Index:** `experience` / `experienceBodies` in `src/content/index.ts`
- **Rendered by:** `src/routes/about.tsx`
- **Template:** `content/templates/experience.mdx`

## Frontmatter

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `organisation` | yes | string | Row heading. Written as-is. |
| `role` | yes | string | Uppercased at render time — write it in normal case. |
| `startDate` | yes | ISO date `YYYY-MM-DD` | Only the year is displayed; use `-01-01` when the month does not matter. |
| `endDate` | no | ISO date | Omit for the current role. |
| `location` | no | string | `City, Country`. Renders as a small meta line under the role summary; omitted entirely when absent. |
| `url` | no | string | Turns the row's arrow into an external link (`target="_blank"`, `rel="noreferrer"`). Without it the arrow slot stays empty. |

## Behaviour

- **Ordering:** `startDate` descending. Nothing else influences position.
- **Period label:** years only — `2022 — 2024`. A missing `endDate` renders `2024 — NOW`.
- **Eager import:** unlike workbench artifacts, experience bodies are imported eagerly (not lazily). Keep them short.
- **Validation:** same rule as artifacts — a missing required field or a non-ISO date throws at module load and fails the build.

## Body

The role summary. Two or three lines of plain prose, rendered as small muted body text in the timeline's third column, above the `location` line.

No `Prose` wrapper and no heading structure — headings, lists, and code will render unstyled and out of place. Keep it to paragraphs.

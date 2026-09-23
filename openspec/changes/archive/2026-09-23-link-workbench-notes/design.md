## Context

See proposal.md for motivation. The glossary (`add-glossary`) has already landed, so the term index the chips link to exists today and nothing needs to be sequenced.

Current shape the design builds on:

- `src/content/index.ts` parses artifact frontmatter from `import.meta.glob`, filters drafts when `import.meta.env.PROD`, and sorts into `artifacts` (index order: `publishedAt` desc, then slug). The glossary already runs a module-load `related` check against its published set and throws `Invalid frontmatter in <file>: field "related" — …`.
- `src/routes/workbench.$slug.tsx` renders topics as `CodeChip` spans next to the back link. `src/components/composites/artifact-row.tsx` renders the same chips on the Workbench index.
- Tests use `bun:test` (`src/lib/*.test.ts`). Anything that touches `import.meta.glob` can't be imported under `bun test`, so testable logic has to live outside `src/content/index.ts`.

## Goals / Non-Goals

**Goals:**
- Resolution and fallback selection live in one pure module that is unit-tested without Vite.
- Build-time validation uses the same error format as the glossary's `related` check.
- Related links are in the SSR HTML.

**Non-Goals:**
- No shared "linked chip" abstraction across the glossary and workbench pages beyond the one topic-chip component.
- No caching or precomputation of the fallback. There are ten artifacts, and the computation runs per request in the loader.

## Decisions

### 1. Pure module `src/content/related.ts`

It exports two functions that take the artifact list as an argument:

- `assertRelated(artifacts)` throws on the first unknown slug, self-reference, or repeated slug, naming `/content/workbench/<slug>.mdx`, the field `related`, and the offending slug.
- `relatedArtifacts(artifact, artifacts)` returns the declared list in declared order. Otherwise it returns the fallback: other artifacts that share at least one topic, sorted by shared-topic count descending with a stable sort, so ties stay in index order. It then fills from same-lane artifacts in index order, skipping any already chosen, and caps the result at `RELATED_FALLBACK_LIMIT = 3`.

`index.ts` calls `assertRelated(artifacts)` right after it builds the published list, as the glossary does.

*Alternative:* inline both functions in `index.ts` like the glossary check. Rejected because `index.ts` can't be imported under `bun test`, and the fallback ranking is the risky logic that needs a test.

### 2. Validate against the published list, not all files

`assertRelated` runs on `artifacts`, which is already draft-filtered in production. A `related` entry that names a draft therefore fails the production build as "unknown" but works in `bun run dev`, which is what the draft-scenario spec requires. Drafts are skipped as sources in production because they aren't in the list, so a draft may point at anything that exists in dev.

*Alternative:* validate against `allArtifacts` and check `draft` separately. That's more code and gives the same outcome.

### 3. Resolve in the loader

`loader` returns `{ artifact, related }`, where `related` is mapped to `{ slug, title, lane, summary }`. The data is serialisable and server-rendered, and the component stays presentational.

### 4. `TopicChips` composite owns the glossary lookup

`src/components/composites/topic-chips.tsx` takes `topics: string[]`. For each topic it renders a `CodeChip`, wrapped in a router `Link` to `glossaryHref(topic)` when `termSlugs.has(topic)`. `termSlugs` is the existing glossary `publishedSlugs` set, renamed and exported from `~/content`. Both the artifact page and `ArtifactRow` use the composite, which removes the duplicated `topics.map`.

In `ArtifactRow` the chip anchors are siblings of the title anchor, not nested inside it, so the row's title link is unaffected (spec scenario).

*Alternative:* pass a set of linkable slugs down as a prop. Rejected because both callers would build it the same way.

### 5. Related-notes markup

The block goes after the topics/back-link row, separated by a `Rule`. It has a `t-label` heading taken from `Workbench.relatedLabel` ("Related notes") and a `<ul>` of entries. Each entry shows the lane `Tag`, a `Link` with the title, and the summary in `t-body-sm text-muted-foreground`. When `related` is empty, the block and its preceding `Rule` aren't rendered. `ArtifactRow` isn't reused because its four-column grid doesn't fit the reading measure.

### 6. Initial `related` values

Every note gets two or three hand-picked slugs. The draft `regexes-are-hard-review` may list published notes, but no published note lists the draft, or the production build fails.

## Risks / Trade-offs

- [Renaming or deleting a note breaks every `related` that points at it] → Intended. The build fails and names the file and slug.
- [Hand-picked `related` goes stale as notes are added] → The fallback covers new notes that declare nothing. Revisiting old notes is an editorial task, not a code task.
- [Topic slugs and glossary slugs are the same namespace only by convention] → A mismatch renders plain text rather than a broken link, which the spec allows.

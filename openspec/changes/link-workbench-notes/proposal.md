## Why

No workbench note links to another. Each artifact page ends with a lane crumb, topic chips that are plain text, and a link back to the index, so a crawler that lands on a note finds one way onward and a reader finds none. The glossary change adds term → artifact links, but nothing links artifact → artifact, and the topic chips on a note still lead nowhere. An internal link graph is the one ranking lever that costs no new content, and it also makes the notes read as a body of work rather than ten islands.

## What Changes

- Artifact frontmatter gains an optional `related` list of artifact slugs. Every slug MUST resolve to a published artifact or the build fails, mirroring the glossary's `related` rule, so a cross-link can never rot.
- Artifact pages gain a "Related notes" block after the body: the artifacts named in `related`, in the order declared. When `related` is empty or absent, the block falls back to up to three other published artifacts that share a topic, ranked by number of shared topics then index order, then same-lane artifacts in index order. A note with nothing to relate renders no block.
- Topic chips on artifact pages and index rows become links to the glossary term of the same slug when one is published, and stay plain text otherwise. This is the artifact → term half of the link the glossary already provides in the other direction.
- The initial `related` fields are authored for the ten existing notes so the graph exists on day one rather than depending on the fallback alone.

Non-goals: no change to the glossary, the home page, the sitemap, or the feed; no tag or topic index pages; no in-body link insertion (authors link inside prose by hand, as today).

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `content-model`: the artifact frontmatter contract gains `related` with a build-time resolution rule.
- `site-pages`: the artifact page renders a related-notes block; topic chips on artifact pages and Workbench index rows link to matching glossary terms.

## Impact

- **Modified**: `src/content/schema.ts` (`related`), `src/content/index.ts` (resolution pass and the fallback selection), `src/routes/workbench.$slug.tsx` (related block, linked chips), `src/components/composites/artifact-row.tsx` (linked chips), `src/constants.ts` (block label), `content/templates/workbench.mdx` and `content/docs/workbench.md` (document the field), every file under `content/workbench/` (initial `related` values).
- **No new dependencies.**
- **Sequencing**: depends on `add-glossary` for the term index that chips link to; the `related` field and the related-notes block do not, so those parts can land first with chips as a follow-up if the glossary is delayed.

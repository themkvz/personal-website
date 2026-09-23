## 1. Content model

- [x] 1.1 Add optional `related: string[]` to `artifactSchema` in `src/content/schema.ts`; verify `bun run typecheck` passes
- [x] 1.2 Create `src/content/related.ts` with `assertRelated(artifacts)` (unknown, self, duplicate → error naming file, `related`, slug) and `relatedArtifacts(artifact, artifacts)` (declared order, else shared-topic count desc → same lane, index order, cap 3, never self); verify with `src/content/related.test.ts` covering every content-model and site-pages related scenario, `bun test` green
- [x] 1.3 Call `assertRelated(artifacts)` in `src/content/index.ts` after the published list is built, and export the glossary published-slug set as `termSlugs`; verify a bogus `related` slug makes the built server bundle throw the expected message on load (like every other frontmatter check, it runs at module load, not during `vite build`), then revert it

## 2. Pages

- [x] 2.1 Add `src/components/composites/topic-chips.tsx` (chip links to `glossaryHref` when `termSlugs` has the topic, plain `CodeChip` otherwise) and use it in `ArtifactRow` and the artifact page; verify on `/workbench` and an artifact page that `typescript` is an anchor and a topic without a term (e.g. `product`) is not
- [x] 2.2 Add `Workbench.relatedLabel: "Related notes"` to `src/constants.ts`; resolve `related` in the `workbench.$slug.tsx` loader and render the related-notes block (lane tag, title link, summary) after the topics row, omitted when empty; verify with `curl` that related links are in the SSR HTML

## 3. Authoring

- [x] 3.1 Document `related` in `content/docs/workbench.md` (frontmatter table, draft rule) and the `topics` → glossary chip link, and add a commented `related:` example to `content/templates/workbench.mdx`; verify by reading the rendered docs table
- [x] 3.2 Add initial `related` to every file in `content/workbench/`, with no published note naming the draft `regexes-are-hard-review`; verify `bun run build` (production, drafts excluded) succeeds

## 4. Verification

- [x] 4.1 Run `bun run lint`, `bun run typecheck`, `bun test`, `bun run build`; all pass

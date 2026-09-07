## 1. Copy

- [x] 1.1 Add `integrationsEyebrow`, `integrationsHeading`, and `integrationsLead` to the `Home` block in `src/constants.ts`; verify the wording follows the site copy voice used by the neighbouring `workbench*` / `tools*` keys (plain noun phrases, no first person).
- [x] 1.2 Add an `Integration` type (`label`, `name`, `description`, `surface`) and a `Home.integrations` array with exactly four entries — GrowthBook, OpenPanel, MDX, GlitchTip — typed with `satisfies Integration[]` in the style of `About.practiceColumns`; verify `bun run typecheck` passes.
- [x] 1.3 Confirm each entry's `surface` names a path that actually exists (`src/lib/growthbook`, `src/lib/openpanel/events.ts`, `content/`, `src/lib/glitchtip`) and each `description` states that service's role in this app; verify by opening each named path.

## 2. Section

- [x] 2.1 Render a fourth `Section` in `src/routes/_index.tsx` after the tools section, default tone with `className="border-t border-border"`, wrapping a `Container`; verify in the dev server that it is the last block before the footer and that the muted tools band above it is still visually separate.
- [x] 2.2 Add the section header using `SectionHeader.Root` / `Top` / `Eyebrow` / `Title` / `Rule` plus the lead paragraph, matching the workbench and tools sections' markup; verify the rendered heading is an `h2`.
- [x] 2.3 Map `Home.integrations` onto `ToolCard` parts — `Category` = `label`, `Title` = `name`, `Description` = `description`, `Meta` = a `CodeChip` holding `surface` — in a `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` grid keyed by `name`; verify all four cards render with identical structure.
- [x] 2.4 Confirm the route adds no import from `~/lib/growthbook`, `~/lib/openpanel`, or `~/lib/glitchtip` for this section and calls no `track()`; verify by grepping the diff for those identifiers.

## 3. Verification

- [x] 3.1 Verify the inertness scenario: run the dev server with the GrowthBook and OpenPanel environment variables unset and confirm the panel renders identical content, with no request to those services in the network tab and no analytics event.
- [x] 3.2 Verify heading structure on Home: exactly one `h1`, one added `h2`, and four added `h3`s — check via the browser accessibility tree or `document.querySelectorAll`.
- [x] 3.3 Verify server rendering: fetch `/` with JavaScript disabled (or `curl` the document) and confirm all four integration names, descriptions, and surface chips are present in the HTML.
- [x] 3.4 Verify both themes at 375px, 1024px, and 1440px: no undefined colours, no description wrapping past three lines, no horizontal overflow; if a card is cramped at 1024px, fall back to `lg:grid-cols-2` per design.md.
- [x] 3.5 Run `bun run lint`, `bun run typecheck`, and `bun run build`; fix failures introduced by this change and report any pre-existing failures separately.

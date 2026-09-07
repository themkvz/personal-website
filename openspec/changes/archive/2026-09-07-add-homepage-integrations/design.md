## Context

See proposal.md — Why. Relevant current state:

- `src/routes/_index.tsx` renders three sections: hero (`Section` default tone), workbench preview (`Section` + `border-t border-border`), tools preview (`Section tone="muted"` + `border-t border-border`). The new section lands after the tools section.
- All four integrations are already wired, so every claim the copy makes can be checked against shipped behaviour: server-resolved GrowthBook payload in the root loader, OpenPanel events keyed to the visitor fingerprint, MDX compiled from `content/` into a derived index, GlitchTip reporting from both runtimes with source-map resolution. Those facts inform the copy; none of those paths appear in it.
- `src/constants.ts` already holds design-bound page copy per the `content-model` requirement "Design-bound copy stays in source".
- The tools preview directly above already renders a three-card grid via `ToolCard`, so a second card grid immediately below it would read as the same band twice.

## Goals / Non-Goals

**Goals:**
- One added section, composed only from primitives already in `src/components/`.
- Copy separated from layout, so wording changes never touch the route.
- Visually distinct from the muted tools band directly above it.

**Non-Goals:**
- Any runtime read from GrowthBook, OpenPanel, or GlitchTip (settled: descriptive only).
- New atoms or composites; the section is `Section`, `Container`, `SectionHeader`, and `Overline` over plain markup.
- Any reference to source files, modules, packages, or configuration in the visible copy.
- Reproducing a `design/design-2.pen` frame.
- Adding this section to any other route.

## Decisions

**Hairline rows, not a card grid.** DESIGN.md §1 Principle 2 is explicit: hairlines separate, and cards are not how page content is grouped. A card grid here would also put four boxes directly beneath the tools preview's three, reading as one repeated band rather than a new idea. Each integration is a row separated by a `border-b border-border` hairline, the same device the workbench preview's secondary column already uses on this page. Alternative considered: reusing `ToolCard`; rejected on both counts above.

**Row anatomy: a rail and an explanation column.** `lg:grid-cols-[260px_1fr]`, collapsing to one column below `lg`. The rail holds the lifecycle moment as an `Overline` and the service name as an `h3` set in `t-display-sm` — the mono role the scale reserves for card headings and timeline names, and the same override `About.practiceColumns` already uses. The explanation column holds two paragraphs at the reading measure: the role in `t-body` on `--foreground`, the consequence in `t-body-sm` on `--muted-foreground`. Mono names give the section a texture distinct from the Inter card titles above it.

**Order by lifecycle, not alphabet or importance.** The four entries are sequenced by when a page actually meets them — content build, render, visitor action, failure — and each entry's eyebrow names that moment ("BEFORE THE REQUEST", "DURING THE RENDER", "AFTER THE CLICK", "WHEN IT BREAKS"). This is the section's one structural device, and it encodes something true rather than decorating the list. Alternative considered: `01 / 02 / 03` numbering as used on About; rejected because the ordinal adds no information the phase label does not already carry.

**No colour beyond the neutrals.** DESIGN.md §2.3 makes the five work-state hues a taxonomy — a colour means a work state. Tinting a lifecycle phase with one would break that meaning, and it would give the page a third consecutive coloured band. The section is graphite only.

**Copy in `src/constants.ts` under `Home`, not `content/`.** The list is design-bound page copy that changes only when the app's own stack changes — not time-varying content with a publication lifecycle. Adding an MDX collection for four fixed entries would mean a new schema, a new glob, and a new index for data that is effectively constant. Shape: `Home.integrationsEyebrow`, `Home.integrationsHeading`, `Home.integrationsLead`, and `Home.integrations` (a `readonly` array of `{ phase, name, role, consequence }`), matching how `About.practiceColumns` is already typed.

**Section tone: default with `border-t border-border`.** The tools section above is `tone="muted"`; repeating muted would merge the two bands into one. Default tone plus the top rule restores the same alternation the workbench section uses.

**No `track()` on the section.** Nothing in it navigates, and adding an exposure or click event would make a descriptive panel depend on the analytics singleton it describes — the exact coupling the spec's inertness scenario forbids.

## Risks / Trade-offs

- **The list drifts as the stack changes** (a service is dropped, another added) → the entries are a single typed array in `src/constants.ts`; adding or removing one is a one-line edit with no layout change, and the type keeps the four fields required.
- **The rail leaves visible empty space beside short rows** → intended; §1 Principle 5 asks for density with air, and filling it would mean adding decoration the section does not need.
- **Four hairline rows under a section rule make the band rule-heavy** → the rows carry generous vertical padding (`py-8`) so the rules read as separation rather than as a table.

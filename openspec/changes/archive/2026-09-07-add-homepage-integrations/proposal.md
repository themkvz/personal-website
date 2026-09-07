## Why

The Home page shows what the site owner writes (workbench) and builds (tools), but nothing about how the site itself is put together. The app already runs four third-party integrations — GrowthBook, OpenPanel, MDX, and GlitchTip — and they are invisible to a reader. A closing section naming each one, what it does here, and where it is wired turns the site into its own worked example.

## What Changes

- Add a fourth Home section, rendered after the tools preview, that presents the four integrations the app runs: GrowthBook (feature flags and experiments), OpenPanel (analytics and experiment exposure), MDX (the content layer), GlitchTip (error and performance reporting).
- Each entry states the service name, its role in this app, and the concrete surface it touches (root loader payload, event catalog, `content/` MDX files, server and client error reporting).
- Compose the section from existing primitives only — `Section`, `Container`, `SectionHeader`, `ToolCard`, `CodeChip`, `Overline`, `Link`. No new component files, no new dependencies.
- Copy lives in `src/constants.ts` under `Home`, alongside the existing design-bound page copy, not in `content/`.
- The section is descriptive: it does not read live flag values, fire analytics on render, or call any integration at render time.
- Layout follows the section rhythm already established on Home; it is not derived from `design/design-2.pen`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-pages`: the Home requirement gains a fourth section in its mandated order — an integrations panel after the tools preview — with its own content and heading-level constraints.

## Impact

- Touches `src/routes/_index.tsx` (one added section) and `src/constants.ts` (one added copy block).
- No new dependencies, no loader or action changes, no route changes, no content files.
- No runtime coupling to GrowthBook, OpenPanel, or GlitchTip: the section renders identically whether or not those services are configured or reachable.
- The section adds four `h3` headings under one `h2`; the existing single-`h1` guarantee on Home is unaffected.

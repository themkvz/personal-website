# DESIGN.md

The design system for **themkvz.com** — a personal workbench, not a portfolio.

This document is the **code-side** source of truth: tokens, type roles, layout, component inventory, and the composition rules that keep them coherent. `design/design-2.pen` is the **visual** source of truth. When they disagree about how something looks, the `.pen` file wins; when they disagree about what exists in code, this file and `src/app.css` win.

Adding a token, a type role, or a component means updating this file in the same commit. A value that lives only in a component is a bug.

> **Status:** the system is specified and the redesign is planned in `openspec/changes/redesign-workbench-site/`. Sections marked _(planned)_ describe code that this change introduces.

---

## 1. Principles

Five rules, in priority order. When two conflict, the earlier one wins.

1. **Evidence over claim.** The site shows what was built, investigated, decided, and kept. Nothing in the visual language exists to assert competence — it exists to make work legible.
2. **Hairlines separate; surfaces are for floating UI only.** A `1px` rule is the default divider. Cards, panels, and boxes are *not* how page content is grouped. Reach for `Surface` only when something genuinely floats: a popover, a menu, a dialog.
3. **Colour is allocated, not decorative.** The palette is one neutral ramp plus one accent. The five work-state hues are a taxonomy — a colour means a state, and using one for emphasis breaks the meaning.
4. **Typography does the structural work.** Hierarchy comes from the ten type roles and from space, not from weight soup, borders, or background fills.
5. **Density with air.** Dense, scannable information sits inside generous section rhythm. The reading measure is never exceeded.

Concretely, this system avoids: gradient backgrounds, glass, drop shadows used for grouping, animated logo grids, decorative 3D, hero-with-job-title, and scroll effects that hide crawlable content.

---

## 2. Colour

### 2.1 Primitives

Primitives are raw ramps. **Never reference a primitive from a component** — use a semantic role.

**Graphite** — 12 steps, cool and slightly blue. The whole neutral surface and text range.

| Step | Hex | Step | Hex |
|---|---|---|---|
| `50` | `#F6F7F7` | `600` | `#636669` |
| `100` | `#EDEEEE` | `700` | `#4D5054` |
| `200` | `#DFE1E1` | `800` | `#34363A` |
| `300` | `#C6C9CA` | `850` | `#26282B` |
| `400` | `#A4A7A9` | `900` | `#1C1E21` |
| `500` | `#828588` | `950` | `#141517` |

**Signal Cobalt** — 9 steps. The single accent, held back for signal and active work.

| Step | Hex | Step | Hex |
|---|---|---|---|
| `50` | `#F0F4FF` | `500` | `#4A6CC9` |
| `100` | `#DAE5FB` | `600` | `#2F4EA6` |
| `200` | `#BFCFF4` | `700` | `#243E84` |
| `300` | `#9AB3EA` | `800` | `#1A2E63` |
| `400` | `#7291DD` | | |

### 2.2 Semantic roles

19 roles, each defined in both modes. These are what components consume.

| Token | Light | Dark |
|---|---|---|
| `--background` | `#FAFAF9` | `#141517` |
| `--foreground` | `#17181B` | `#E9EAEC` |
| `--card` | `#FFFFFF` | `#1B1D20` |
| `--card-foreground` | `#17181B` | `#E9EAEC` |
| `--popover` | `#FFFFFF` | `#202226` |
| `--popover-foreground` | `#17181B` | `#E9EAEC` |
| `--primary` | `#17181B` | `#E9EAEC` |
| `--primary-foreground` | `#FAFAF9` | `#141517` |
| `--secondary` | `#EFF0F1` | `#282A2E` |
| `--secondary-foreground` | `#3A3D42` | `#D6D8DB` |
| `--muted` | `#F2F3F3` | `#222428` |
| `--muted-foreground` | `#666A6E` | `#94989E` |
| `--accent` | `#E7EDFB` | `#22293E` |
| `--accent-foreground` | `#2746A0` | `#A8C0F4` |
| `--destructive` | `#C73A2E` | `#CE4436` |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--border` | `#E3E4E5` | `#2C2E32` |
| `--input` | `#C8CACD` | `#3E4147` |
| `--ring` | `#3A5FC0` | `#7FA3F0` |

The shadcn sidebar roles (`--sidebar-background`, `-foreground`, `-primary`, `-accent`, `-border`, `-ring`) inherit from the same neutrals and cobalt; they exist for compatibility with vendored primitives and are unused by the site's own chrome.

### 2.3 Work-state taxonomy

Five states. Each has a foreground hue and a soft background, in both modes. This is the site's information architecture expressed as colour — it is never used decoratively.

| State | Meaning | Light fg | Dark fg | Light soft | Dark soft |
|---|---|---|---|---|---|
| `building` | Active implementation | `#2746A0` | `#A8C0F4` | `#E7EDFB` | `#22293E` |
| `investigating` | Open exploration | `#0F6C5B` | `#7FDCC9` | `#E2F2EE` | `#1C3430` |
| `deciding` | Trade-offs in play | `#6A4C93` | `#A795D9` | `#ECE6F5` | `#282139` |
| `shipped` | Evidence in production | `#217A46` | `#54B98B` | `#E3F1E9` | `#1C3226` |
| `keeping` | Worth remembering | `#565A5E` | `#94989E` | `#ECEDEF` | `#26292D` |

`--chart-1..5` map onto this same taxonomy, so any future data visualisation inherits it rather than inventing a palette.

Only four of the five are navigable lanes in the Workbench (`building`, `investigating`, `deciding`, `keeping`). `shipped` is a state an artifact can reach; it is not a lane in the current navigation.

---

## 3. Typography

Two families, both from Google Fonts, both already self-hosted via `@fontsource-variable`:

- `--font-display` / `--font-mono` — **JetBrains Mono**
- `--font-body` — **Inter**

### 3.1 The ten roles

Ten roles, no more. Every piece of text on the site is exactly one of them.

| Role | Family | Size | Weight | Line height | Tracking | Used for |
|---|---|---|---|---|---|---|
| `t-display-xl` | JB Mono | 64 | 700 | 1.05 | — | Page display statement |
| `t-display-lg` | JB Mono | 44 | 700 | 1.10 | — | Secondary display, small-viewport step |
| `t-title-1` | Inter | 32 | 600 | 1.20 | — | Section titles |
| `t-title-2` | Inter | 24 | 600 | 1.30 | — | Subsection titles |
| `t-title-3` | Inter | 20 | 600 | 1.35 | — | Artifact and card titles |
| `t-body` | Inter | 16 | 400 | 1.70 | — | Running prose |
| `t-body-sm` | Inter | 14 | 400 | 1.60 | — | Secondary copy, dense rows, captions |
| `t-meta` | JB Mono | 12.5 | 500 | — | `+1.2` | Timestamps, status stamps, counts |
| `t-label` | JB Mono | 11 | 600 | — | `+1.6` | Overlines, nav, lane labels |
| `t-code` | JB Mono | 13 | 400 | 1.60 | — | Inline and block code |

### 3.2 Element mapping

Applied globally, so page content does not restate the scale:

| Element | Role |
|---|---|
| `h1` | `t-display-xl` |
| `h2` | `t-title-1` |
| `h3` | `t-title-2` |
| `h4` | `t-title-3` |
| `p`, body copy | `t-body` |
| `small` | `t-body-sm` |
| `time`, meta | `t-meta` |
| nav, label, overline | `t-label` |
| `code`, `pre` | `t-code` |

Below the `sm` breakpoint, display roles step down to **40px**. Nothing else in the scale changes responsively.

---

## 4. Space

Ten steps, registered as number variables. There is **no 2px step** — `1px` is reserved for hairlines.

| Token | px | Used for |
|---|---|---|
| `s-1` | 4 | Inline gaps, dot-to-text |
| `s-2` | 8 | Tag and chip padding |
| `s-3` | 12 | List row gaps |
| `s-4` | 16 | Control padding-Y, small stacks |
| `s-5` | 24 | Component stacks, artifact gaps |
| `s-6` | 32 | Block groups, card padding |
| `s-7` | 48 | Section internal rhythm |
| `s-8` | 64 | Page section padding |
| `s-9` | 96 | Full-bleed content gaps |
| `s-10` | 128 | Masthead and cover padding |

Gaps come from `s-2`, `s-3`, `s-5`, `s-6`. Nothing in between.

---

## 5. Radius and elevation

### 5.1 Radius

Base is `--radius: 6px`; Tailwind's steps derive from it (`sm` −2, `md` 0, `lg` +2, `xl` +4).

| Token | px | Used for |
|---|---|---|
| `r-0` | 0 | Page, cover, panels |
| `r-xs` | 2 | Buttons, tags, code chips |
| `r-sm` | 4 | Inputs, nested chips |
| `r-md` | 6 | Cards — sparingly |
| `r-lg` | 8 | Popovers, dialogs, menus |
| `r-full` | ∞ | Pill tags, status dots |

### 5.2 Elevation

| Token | Value | Used for |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgb(23 24 27 / 8%)` | Menus, chips |
| `--shadow-md` | `0 8px 24px rgb(23 24 27 / 12%)` | Popovers, dialogs |
| `--shadow-lg` | `0 24px 64px rgb(23 24 27 / 16%)` | Modal overlay — rare |

**In dark mode, shadows are removed.** Drop shadows stop registering on dark surfaces. Elevation becomes a one-step surface raise plus the hairline: `--card` sits on `--background`, `--popover` sits on `--card`. Nothing floats twice.

---

## 6. Layout

| Token | Value |
|---|---|
| `container-max` | `1280` (`max-w-7xl`, centred) |
| `grid-columns` | `12` |
| `grid-gutter` | `24` (`gap-6`) |
| `measure` | `680` (`max-w-[680px]`, ≈ 68ch) |

Columns stretch; gutters are fixed. **Body text never exceeds the measure at any width.**

### Breakpoints

| Name | Min | Behaviour |
|---|---|---|
| `bp-sm` | 640 | Below this: 1 column, gutter 24, display → 40px |
| `bp-md` | 768 | 12 columns, container fluid, gutter 32 |
| `bp-lg` | 1024 | 12 columns, 280px rail + content |
| `bp-xl` | 1280 | 12 columns, container `max-w-7xl`, centred |

Sections may run full-bleed; their content still sits on the container.

### Iconography

Lucide, on a 24px grid with a 1.5–2px stroke, tinted with `currentColor`. **16px** for controls, **20px** for nav and links. Brand marks (GitHub, LinkedIn, Telegram) come from `@icons-pack/react-simple-icons`.

> The `.pen` design system names Tabler and annotates its own canvas preview as Lucide, same outlined style. Lucide ships, because it is already a dependency and the difference at 16/20px is not material. Revisit only if a specific glyph is missing.

---

## 7. Theming

Three modes: `light`, `dark`, `system`.

- Light values sit on `:root`; dark values are redefined under `.dark`.
- The mode is persisted and applied by a synchronous script in `src/root.tsx` **before hydration**, so there is no flash.
- Client state lives in the Zustand store at `src/store/theme.ts`; helpers in `src/lib/theme.ts`.
- `system` follows the OS preference live, without a reload.

This system is load-bearing and predates the redesign. Retheme it; do not rewrite it.

---

## 8. Components _(planned)_

### 8.1 Layers

`src/components/` is layered, and the folder a file sits in says what it may import. The dependency direction is one-way:

```
layout  →  composites  →  atoms  →  ui  →  lib
```

```
src/components/
  ui/          Vendored shadcn/Base UI primitives — button, input, separator,
               dropdown-menu, field. Regenerable; edited only to retheme.
  atoms/       The 10 base components below.
  composites/  The 7 composites below.
  layout/      Site chrome and page scaffolding — nav, footer, container,
               section, prose, theme-toggle.
  identity/    identity-card, decrypted-text.
```

Nothing below `layout` imports from `~/content` or from React Router's data hooks. Pages fetch; components receive.

### 8.2 Inventory

**Atoms** (10)

| Component | Variants / states |
|---|---|
| `Button` | `primary`, `secondary`, `ghost`, `accent`, `destructive` · focus, disabled |
| `Link` | `foreground`, `accent` · focus |
| `Tag` | one per work state · dot + label |
| `Input` | default, focus, error, disabled |
| `SearchTrigger` | ⌘K affordance — **inert in the current build** |
| `Overline` | `t-label`, muted |
| `MetaStamp` | `t-meta`, muted |
| `CodeChip` | `t-code`, `r-xs` |
| `Rule` | 1px hairline separator |
| `Surface` | border-first container — floating UI only |

**Composites** (7)

| Component | Notes |
|---|---|
| `ArtifactCard` | Lane tag + title + summary + topics + action |
| `LogEntry` | Date + lane + line — the living stream |
| `ToolCard` | Name + description; forthcoming state is non-navigating |
| `SectionHeader` | Overline + title + optional action |
| `LaneGuide` | The four-lane explainer block |
| `StateFilter` | Lane filter control, URL-backed |
| `Breadcrumb` | Deep-page trail |

**Retained** — `IdentityCard` and `DecryptedText` move to `identity/` and are rethemed onto these tokens. Their behaviour, props, refs, and animation are untouched.

### 8.3 Composition rules

- **One component per file.** Kebab-case filename matching the exported PascalCase name. No barrel files — direct imports keep HMR and tree-shaking honest.
- **Compose, don't configure.** A composite with more than one slot ships as namespaced parts (`ArtifactCard.Root`, `.Lane`, `.Title`, `.Summary`, `.Topics`, `.Action`), not a props object describing its contents. Pages assemble parts.
- **Universal by default.** Every component accepts `className` and spreads its remaining props onto its root element, merged with `cn()`. No component reads route data, loader data, or the content index.
- **Variants via `class-variance-authority`**, enumerated from the design's own states — never booleans that can combine into undesigned states.
- **Polymorphism through Base UI's `render` prop** when an atom must become an anchor or a `Link`. Do not duplicate an atom per element type.
- **Twice means extract.** Markup or logic appearing in a second place moves out on that second occurrence: shared markup to the layer below, shared logic to `src/lib/`. Date formatting, lane→token mapping, and slug→href construction are helpers from the start.
- **No raw values.** No hex literal, no arbitrary `px` outside the space scale, no font metric restated. If a value is needed and no token covers it, add the token here first.

---

## 9. Content taxonomy

Artifacts are authored as MDX in `content/` and filed by **intent**, not by format. Four navigable lanes:

| Lane | What belongs here |
|---|---|
| `building` | Active software, prototypes, tools, technical experiments |
| `investigating` | Questions and technologies still being understood |
| `deciding` | Architecture decisions, rejected alternatives, constraints, reasoning |
| `keeping` | Tools, articles, libraries, references worth remembering |

Every published item provides at least one of: **evidence** (something built), **reasoning** (a decision and why), **discovery** (something learned), or **taste** (something worth keeping). Nothing is published to maintain a cadence.

---

## 10. Accessibility floor

Non-negotiable, and not subject to the simplification rules elsewhere in the repo:

- Text and controls meet **WCAG AA** contrast against their background **in both modes**.
- Every interactive element is keyboard reachable, in document order, with a **visible focus indicator** drawn from `--ring`.
- Navigation is real `<a href>`; every destination works with JavaScript disabled.
- Primary page content is present in the server-rendered HTML before any client JavaScript runs.
- Colour is never the only carrier of meaning — every lane tag pairs its hue with a text label.
- One `h1` per page; heading levels descend without gaps.
- Motion (`DecryptedText`) is decorative and must respect `prefers-reduced-motion`.

---

## 11. Changing the system

1. Make the change in `design/design-2.pen` first. It is the visual source of truth.
2. Transcribe tokens into `src/app.css` and document them here, in the same commit.
3. Add or change components in the layer their dependencies allow, following §8.3.
4. Check both modes and all four breakpoints before merging.

If a change needs a new token, a new type role, or a new work state, it is a design decision — settle it on the canvas, not in a component.

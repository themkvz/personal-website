## Purpose

Defines the visual and structural foundation every page composes from: the semantic token set with light and dark values, the type scale, the layout grid and measure, and the shared global chrome (navigation, footer, rules) that appears on every route.

## ADDED Requirements

### Requirement: Semantic token set

The system SHALL expose the design's semantic tokens as the single source of colour, spacing, radius, and font-family values. Every token that carries colour SHALL define both a light and a dark value. Components SHALL reference semantic tokens, never raw colour literals.

#### Scenario: Both modes defined
- **WHEN** any semantic colour token is resolved in light mode and in dark mode
- **THEN** both resolutions return a defined value
- **AND** no component falls back to an undefined or inherited colour

#### Scenario: Lane colours available
- **WHEN** content is rendered for one of the four lanes or for shipped work
- **THEN** a lane-specific foreground token and a matching soft background token are available in both modes

### Requirement: Type scale with ten roles

The system SHALL provide exactly the ten designed type roles — `display-xl`, `display-lg`, `title-1`, `title-2`, `title-3`, `body`, `body-sm`, `meta`, `label`, `code` — each with a fixed family, size, weight, line height, and letter spacing. Display, meta, label, and code roles use the monospace family; title and body roles use the body family.

#### Scenario: Heading elements map to roles
- **WHEN** an `h1`, `h2`, `h3`, or `h4` is rendered in page content without an explicit role class
- **THEN** it carries the corresponding default role (`display-xl`, `title-1`, `title-2`, `title-3`)

#### Scenario: Role class overrides the element default
- **WHEN** an element carries an explicit role class (for example the Home `h1` as `title-1`, or an artifact `h1` as `display-lg`)
- **THEN** the role class wins over the element default

#### Scenario: Display scales down on small screens
- **WHEN** the viewport is below the small breakpoint
- **THEN** display roles render at their reduced size and remain within the viewport without horizontal overflow

### Requirement: Layout grid and measure

Page content SHALL be laid out within a centred container capped at the design's maximum width, on a 12-column grid with a fixed gutter. Running body text SHALL be constrained to the reading measure and SHALL NOT exceed it at any viewport width.

#### Scenario: Measure enforced
- **WHEN** a paragraph of body text is rendered at any viewport width
- **THEN** its line length does not exceed the reading measure

#### Scenario: Layout collapses to one column
- **WHEN** the viewport is below the medium breakpoint
- **THEN** multi-column sections stack to a single column with no horizontal scrolling

### Requirement: Three theme modes

The system SHALL support `light`, `dark`, and `system` theme modes. The chosen mode SHALL persist across visits in browser `localStorage` and SHALL be applied before first paint by an inline script so no flash of the wrong theme occurs.

#### Scenario: Mode persists
- **WHEN** a visitor selects `dark` and returns in a later session
- **THEN** the site renders in dark mode

#### Scenario: System mode follows the OS
- **WHEN** the mode is `system` and the operating system preference changes
- **THEN** the site switches to the matching mode without a reload

#### Scenario: No flash on load
- **WHEN** a page is loaded with a stored mode that differs from the default
- **THEN** the first painted frame already uses the stored mode

#### Scenario: Elevation adapts to mode
- **WHEN** raised surfaces are rendered in dark mode
- **THEN** elevation is expressed as a surface step plus a hairline border rather than a drop shadow

### Requirement: Global chrome on every route

Every route SHALL render the same site navigation and footer. Navigation SHALL expose exactly `Index`, `Tools`, `Workbench`, and `About` as crawlable anchor links, and SHALL indicate the current section.

#### Scenario: Chrome present everywhere
- **WHEN** any route, including the 404 route, is rendered
- **THEN** the navigation and footer are present with the same four destinations

#### Scenario: Current section marked
- **WHEN** a visitor is on a route belonging to one of the four sections
- **THEN** that navigation item is visually and programmatically marked as current

#### Scenario: Navigation without JavaScript
- **WHEN** the page is rendered with JavaScript disabled
- **THEN** every navigation destination is reachable through a real `href`

### Requirement: Accessible interaction

Interactive elements SHALL be reachable and operable by keyboard, SHALL show a visible focus indicator, and SHALL meet WCAG AA contrast against their background in both modes.

#### Scenario: Keyboard traversal
- **WHEN** a visitor tabs through a page
- **THEN** every link, button, and control receives focus in document order with a visible indicator

#### Scenario: Contrast in both modes
- **WHEN** text or a control is measured against its background in light and in dark mode
- **THEN** the contrast ratio meets WCAG AA for its size

#### Scenario: Reduced motion respected
- **WHEN** the visitor's system reports `prefers-reduced-motion: reduce`
- **THEN** decorative motion (the decrypted-text effect and any hover animation) is skipped and the final state renders immediately

#### Scenario: Meaning not carried by colour alone
- **WHEN** a lane is indicated anywhere
- **THEN** its hue is accompanied by a visible text label

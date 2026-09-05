## Purpose

Defines the five public surfaces of the site — Home, Workbench and its artifact pages, Tools, About, and the not-found page — including what each must show, how they compose from the content index, and how they behave when content is absent or a URL is wrong.

## Requirements

### Requirement: Home presents direction, identity, and evidence

The Home page SHALL render, in order: a display statement with supporting prose; a profile panel giving name, role, and summary facts; a workbench preview showing one featured artifact and up to three further artifacts drawn from distinct lanes; and a tools preview. It SHALL contain exactly one `h1`. That `h1` SHALL be the name-and-role line in the profile panel, so it contains the site owner's professional identity as visible text; the display statement SHALL NOT be a heading element.

#### Scenario: Preview composed from the index
- **WHEN** the Home page renders its workbench preview
- **THEN** the featured artifact is the one marked `featured`, or the newest artifact if none is marked
- **AND** the secondary entries are, for each of the three lanes other than the featured artifact's lane, in the fixed lane order `building, investigating, deciding, keeping`, the newest artifact in that lane
- **AND** a lane with no artifact is skipped, so fewer than three secondary entries may render

#### Scenario: Single identifying heading
- **WHEN** the Home markup is inspected
- **THEN** there is exactly one `h1`, it contains the owner's name and role, and the display statement is a paragraph

#### Scenario: Every preview entry links to its artifact
- **WHEN** a visitor activates any artifact shown on Home
- **THEN** they navigate to that artifact's permanent URL

#### Scenario: Renders in both modes
- **WHEN** Home is rendered in light and in dark mode
- **THEN** both match their designs with no undefined colours or unreadable text

### Requirement: Workbench indexes artifacts by lane

The Workbench page SHALL render an introduction, a guide naming the four lanes with their descriptions, and an index of all artifacts. Each index row SHALL show the artifact's lane, title, summary, and topics, and SHALL link to the artifact.

#### Scenario: All artifacts listed
- **WHEN** the Workbench index renders
- **THEN** every artifact in the content index appears exactly once, in index order

#### Scenario: Filtering by lane
- **WHEN** a visitor selects a lane
- **THEN** only artifacts in that lane are listed
- **AND** the selection is reflected in the URL so the filtered view can be shared and reloaded

#### Scenario: Filter works without JavaScript
- **WHEN** the Workbench page is fetched with a lane parameter and JavaScript disabled
- **THEN** the server-rendered markup already lists only that lane
- **AND** each filter control is a real anchor whose `href` carries the lane parameter, with the active one marked current

#### Scenario: Unknown lane parameter
- **WHEN** the lane parameter is not one of the four lanes
- **THEN** the unfiltered index is shown with a 200 status

#### Scenario: Empty lane
- **WHEN** a lane selected by a visitor contains no artifacts
- **THEN** an explanatory empty state is shown with a way back to the unfiltered index
- **AND** the response status is 200

### Requirement: Artifact pages have permanent URLs

Every artifact SHALL be reachable at a stable URL derived from its slug. The page SHALL render, in order: a breadcrumb (`Workbench / <lane>`, the lane crumb linking to the filtered index), a meta row with the lane tag and the publication date plus the updated date when present, the artifact's title as its `h1`, the summary as a lede, the full body content at the reading measure, and the topics followed by a link back to the Workbench.

#### Scenario: Artifact renders
- **WHEN** a visitor opens an existing artifact URL
- **THEN** the page returns 200 and renders the breadcrumb, lane, dates, title, lede, body, and topics in that order

#### Scenario: Body is in the server response
- **WHEN** an artifact URL is fetched by a crawler or with JavaScript disabled
- **THEN** the full body text is present in the HTML response

#### Scenario: Slug is stable
- **WHEN** an artifact's `title` changes but its filename does not
- **THEN** its URL is unchanged

#### Scenario: Unknown artifact
- **WHEN** a visitor opens an artifact URL with no matching slug
- **THEN** the not-found page is rendered with a 404 status

### Requirement: Tools page presents the tool collection

The Tools page SHALL render an introduction and a grid of tool cards. Each card SHALL show the tool's name and a one-line description. A card for a tool that is not yet implemented SHALL be presented as forthcoming and SHALL NOT be an active link.

#### Scenario: Placeholder card is inert
- **WHEN** a tool card marked as not implemented is rendered
- **THEN** it is visually marked as forthcoming
- **AND** activating it does not navigate anywhere and does not produce an error

#### Scenario: Implemented tool links out
- **WHEN** a tool card is marked as implemented
- **THEN** it links to that tool's own URL

### Requirement: About presents background and contact

The About page SHALL render a hero statement, a practice summary with its three practice columns, an experience timeline, and a contact block. The contact block SHALL offer a direct email destination, a résumé link when a résumé file is published, and links to external profiles. It SHALL NOT collect visitor input and SHALL NOT render a link to a résumé that does not exist.

#### Scenario: Contact by direct email
- **WHEN** a visitor activates the email action
- **THEN** their mail client opens addressed to the site owner
- **AND** no form is submitted and no visitor data is stored

#### Scenario: Timeline from content
- **WHEN** the experience timeline renders
- **THEN** it lists every experience entry from the content layer, most recent first, each with its period, organisation, and role summary

### Requirement: Not-found page recovers the visitor

Any URL that matches no route, and any artifact URL with no matching slug, SHALL render the same not-found page with a 404 status. The page SHALL explain that the address is wrong and SHALL offer at least a link back to the index and a link into the workbench.

#### Scenario: Unknown route
- **WHEN** a visitor requests a URL that matches no route
- **THEN** the response status is 404 and the not-found page renders with full site navigation

#### Scenario: Unknown slug renders the same page
- **WHEN** a visitor requests an artifact URL with no matching slug
- **THEN** the response status is 404 and the not-found page renders identically to the unknown-route case, with full site navigation

#### Scenario: Recovery destinations work
- **WHEN** a visitor activates a recovery link on the not-found page
- **THEN** they reach the corresponding page with a 200 status

### Requirement: Unexpected errors keep the chrome

When a route throws anything other than a 404, the site SHALL render an error page that keeps the site navigation and footer, states the status, and offers the same recovery links as the not-found page.

#### Scenario: Server error
- **WHEN** a loader throws an unexpected error
- **THEN** the response carries a 5xx status and the rendered page shows the navigation, footer, an explanation, and recovery links

### Requirement: Retired URLs redirect

The addresses of the removed bookmarks and contact pages SHALL redirect permanently to their replacements: `/contact` to `/about` and `/bookmarks` to `/workbench`.

#### Scenario: Old link keeps resolving
- **WHEN** `/contact` or `/bookmarks` is requested
- **THEN** the response is a 301 to `/about` or `/workbench` respectively

### Requirement: Primary content is server-rendered

The primary content of every page SHALL be present in the server-rendered HTML response, before any client-side JavaScript executes.

#### Scenario: Content in the initial response
- **WHEN** any page's HTML response is fetched without executing JavaScript
- **THEN** its headings, body copy, artifact titles and summaries, and internal links are present in the markup

## Purpose

Defines the five public surfaces of the site — Home, Workbench and its artifact pages, Tools, About, and the not-found page — including what each must show, how they compose from the content index, and how they behave when content is absent or a URL is wrong.

## Requirements

### Requirement: Home presents direction, identity, and evidence

The Home page SHALL render, in order: a display statement with supporting prose; a profile panel giving name, role, and summary facts; a workbench preview showing one featured artifact and up to three further artifacts drawn from distinct lanes; a tools preview; and an integrations panel. It SHALL contain exactly one `h1`. That `h1` SHALL be the name-and-role line in the profile panel, so it contains the site owner's professional identity as visible text; the display statement SHALL NOT be a heading element.

#### Scenario: Preview composed from the index
- **WHEN** the Home page renders its workbench preview
- **THEN** the featured artifact is the newest artifact marked `featured`
- **AND** the secondary entries are, for each of the three lanes other than the featured artifact's lane, in the fixed lane order `building, investigating, deciding, keeping`, the newest artifact in that lane
- **AND** a lane with no artifact is skipped, so fewer than three secondary entries may render
- **AND** when no artifact is marked `featured` the workbench preview renders neither a featured artifact nor secondary entries

#### Scenario: Single identifying heading
- **WHEN** the Home markup is inspected
- **THEN** there is exactly one `h1`, it contains the owner's name and role, and the display statement is a paragraph

#### Scenario: Integrations panel closes the page
- **WHEN** the Home page renders
- **THEN** the integrations panel is the last section before the site footer, after the tools preview

#### Scenario: Every preview entry links to its artifact
- **WHEN** a visitor activates any artifact shown on Home
- **THEN** they navigate to that artifact's permanent URL

#### Scenario: Renders in both modes
- **WHEN** Home is rendered in light and in dark mode
- **THEN** both match their designs with no undefined colours or unreadable text

### Requirement: Home integrations panel names the services the site runs on

The Home integrations panel SHALL present the third-party services this application integrates with, as a worked example of the site's own construction. It SHALL cover GrowthBook, OpenPanel, MDX, and GlitchTip, and for each SHALL show the service name, the moment in a page's lifecycle at which it acts, the role it plays in this application, and the consequence of that role for someone reading the site. Entries SHALL be ordered by that lifecycle moment, from before the request through to failure, so the ordering carries meaning rather than being arbitrary.

The panel SHALL describe the integrations at the level of what they do, never at the level of how they are built: it SHALL NOT name a source file, directory, module, package, function, or configuration key. The panel SHALL be introduced by a section heading and a lead line, in the same section rhythm as the workbench and tools previews.

The panel SHALL be descriptive only. It SHALL NOT read a feature flag value, send an analytics event on render, report an error, or make any network request to the named services. Its rendered output SHALL be identical whether or not those services are configured, reachable, or enabled.

#### Scenario: All four integrations are presented
- **WHEN** the Home integrations panel renders
- **THEN** exactly one entry appears for each of GrowthBook, OpenPanel, MDX, and GlitchTip
- **AND** each entry shows the service name, its lifecycle moment, its role in this application, and the consequence of that role
- **AND** the entries appear in lifecycle order: content build, then render, then visitor action, then failure

#### Scenario: No implementation detail is exposed
- **WHEN** the rendered text of the integrations panel is inspected
- **THEN** it contains no file path, directory name, module name, package name, or configuration key
- **AND** each entry is legible to a reader who has never seen the repository

#### Scenario: Panel is inert with respect to the services
- **WHEN** the Home page is rendered with GrowthBook, OpenPanel, and GlitchTip all unconfigured
- **THEN** the integrations panel renders exactly the same content as when they are configured
- **AND** rendering the panel produces no request to any of those services and no analytics event

#### Scenario: Heading structure stays valid
- **WHEN** the Home markup is inspected
- **THEN** the integrations panel contributes one `h2` for the section and one `h3` per integration entry
- **AND** the page still contains exactly one `h1`

#### Scenario: Content is authored copy, not content-layer data
- **WHEN** an integration entry's wording is changed
- **THEN** the change is made in the design-bound copy in source
- **AND** no MDX content file is added, edited, or removed

#### Scenario: Renders in both modes
- **WHEN** the integrations panel is rendered in light and in dark mode
- **THEN** every entry is legible with no undefined colours, and the panel is distinguishable from the section above it

#### Scenario: Works without JavaScript
- **WHEN** the Home page is fetched with JavaScript disabled
- **THEN** the integrations panel and all four entries are present in the server-rendered markup
- **AND** any link in the panel is a real anchor that navigates

### Requirement: Workbench indexes artifacts by lane

The Workbench page SHALL render an introduction, a guide naming the four lanes with their descriptions, and an index of all artifacts. Each index row SHALL show the artifact's lane, title, summary, and topics, and SHALL link to the artifact. A topic that matches a published glossary term's slug SHALL be rendered as a link to that term's page; any other topic SHALL be rendered as plain text.

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

#### Scenario: Topic links to its glossary term
- **WHEN** an index row's artifact has a topic whose slug matches a published glossary term
- **THEN** that topic is an anchor to the term's page, and the row's title link is unaffected

#### Scenario: Topic without a term stays text
- **WHEN** an index row's artifact has a topic that matches no published glossary term
- **THEN** that topic is rendered as plain text with no anchor

### Requirement: Artifact pages have permanent URLs

Every artifact SHALL be reachable at a stable URL derived from its slug. The page SHALL render, in order: a breadcrumb (`Workbench / <lane>`, the lane crumb linking to the filtered index), a meta row with the lane tag and the publication date plus the updated date when present, the artifact's title as its `h1`, the summary as a lede, the full body content at the reading measure, the topics followed by a link back to the Workbench, and a related-notes block when there is anything to relate. A topic that matches a published glossary term's slug SHALL link to that term's page; any other topic SHALL be plain text.

The related-notes block SHALL list the artifacts named in the artifact's `related` field, in the declared order, each by title with its lane and summary, linking to the artifact. When `related` is absent or empty, the block SHALL instead list up to three other published artifacts chosen by: most shared topics first, then, if fewer than three share a topic, artifacts in the same lane, each group in index order, never including the artifact itself. When neither source yields an artifact, the block SHALL be omitted entirely rather than rendered with a heading and no entries.

#### Scenario: Artifact renders
- **WHEN** a visitor opens an existing artifact URL
- **THEN** the page returns 200 and renders the breadcrumb, lane, dates, title, lede, body, topics, and related notes in that order

#### Scenario: Body is in the server response
- **WHEN** an artifact URL is fetched by a crawler or with JavaScript disabled
- **THEN** the full body text and every related-note link are present in the HTML response

#### Scenario: Slug is stable
- **WHEN** an artifact's `title` changes but its filename does not
- **THEN** its URL is unchanged

#### Scenario: Unknown artifact
- **WHEN** a visitor opens an artifact URL with no matching slug
- **THEN** the not-found page is rendered with a 404 status

#### Scenario: Declared related notes
- **WHEN** an artifact declares `related` slugs
- **THEN** the related-notes block lists exactly those artifacts, in the declared order, and no fallback entries

#### Scenario: Fallback by shared topics
- **WHEN** an artifact declares no `related` and other published artifacts share one or more of its topics
- **THEN** the block lists up to three of them, the one sharing the most topics first, ties in index order

#### Scenario: Fallback fills from the lane
- **WHEN** an artifact declares no `related`, fewer than three artifacts share a topic, and other published artifacts are in the same lane
- **THEN** the block lists the shared-topic artifacts first and then same-lane artifacts in index order until it holds three or none remain

#### Scenario: Nothing to relate
- **WHEN** an artifact declares no `related`, shares no topic with any other published artifact, and is alone in its lane
- **THEN** no related-notes heading or list is rendered

#### Scenario: Drafts never appear
- **WHEN** the site is built for production
- **THEN** no draft artifact appears in any related-notes block

#### Scenario: Topic links on the artifact page
- **WHEN** an artifact has a topic whose slug matches a published glossary term
- **THEN** the topic chip is an anchor to that term's page, and topics without a matching term remain plain text

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

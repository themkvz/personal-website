## MODIFIED Requirements

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

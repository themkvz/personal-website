## Purpose

Defines the glossary: an alphabetical index of the technical terms the site uses, and one small page per term that defines it, names its aliases, links related terms, and links the workbench artifacts that use it — so each definition has its own address, metadata, and structured data.

## ADDED Requirements

### Requirement: Glossary index lists every term with its definition

The site SHALL serve a glossary index at `/glossary` that renders an introduction and every published term in alphabetical order by term name, case-insensitive and locale-aware. Each entry SHALL show the term name, its aliases when present, and its one-line definition, and SHALL link to the term's own page. The index SHALL be a complete glossary in itself: a reader who never opens a term page still sees every definition.

#### Scenario: All terms listed
- **WHEN** the glossary index renders
- **THEN** every published term in the content index appears exactly once, ordered alphabetically by term name

#### Scenario: Entry links to its page
- **WHEN** a visitor activates a term entry on the index
- **THEN** they navigate to that term's permanent URL

#### Scenario: Definition is visible on the index
- **WHEN** the index markup is inspected without executing JavaScript
- **THEN** each term's name and one-line definition are present in the server-rendered HTML

#### Scenario: Empty collection
- **WHEN** the content index holds no published terms
- **THEN** the index renders its introduction and an explanatory empty state with a 200 status

### Requirement: Term pages have permanent URLs

Every published term SHALL be reachable at `/glossary/<slug>`, where the slug is derived from its filename. The page SHALL render, in order: a breadcrumb (`Glossary`, linking to the index), the term name as its `h1`, the aliases as a secondary line when present, the one-line definition as a lede, the full body content at the reading measure, and a closing block with links to related terms and to workbench artifacts that use the term, followed by a link back to the index.

#### Scenario: Term renders
- **WHEN** a visitor opens an existing term URL
- **THEN** the page returns 200 and renders the breadcrumb, term name, aliases, definition, body, and closing links in that order

#### Scenario: Body is in the server response
- **WHEN** a term URL is fetched by a crawler or with JavaScript disabled
- **THEN** the full body text is present in the HTML response

#### Scenario: Slug is stable
- **WHEN** a term's name changes but its filename does not
- **THEN** its URL is unchanged

#### Scenario: Unknown term
- **WHEN** a visitor opens a term URL with no matching slug
- **THEN** the not-found page is rendered with a 404 status, identically to any other unknown route

### Requirement: Term pages cross-link to related terms and artifacts

A term page SHALL list, as links, every other published term named in its `related` field, and every published workbench artifact whose `topics` include the term's slug. A related slug that matches no published term SHALL fail the build, so a cross-link can never render as a dead anchor. When a term has neither related terms nor matching artifacts, the closing block SHALL omit those lists rather than render empty headings.

#### Scenario: Related terms link
- **WHEN** a term declares related slugs that match published terms
- **THEN** each appears as a link to that term's page, showing the related term's name

#### Scenario: Artifacts that use the term link
- **WHEN** a published artifact's `topics` contains the term's slug
- **THEN** the term page lists that artifact by title, linking to the artifact's URL

#### Scenario: Unknown related slug fails the build
- **WHEN** a term declares a `related` slug that matches no published term
- **THEN** the build fails with an error naming the term file and the unresolved slug

#### Scenario: Draft artifacts are not linked in production
- **WHEN** the only artifact tagged with a term's slug is a draft and the site is built for production
- **THEN** the term page renders no artifact list

#### Scenario: Nothing to link
- **WHEN** a term has no related terms and no artifact tags it
- **THEN** the closing block contains only the link back to the index

### Requirement: Glossary pages carry unique metadata and structured data

The index page and every term page SHALL emit a unique title, a meta description, and a self-pointing canonical URL under the site's existing metadata rules. The index SHALL emit `DefinedTermSet` structured data naming every listed term. Each term page SHALL emit `DefinedTerm` structured data with the term name, the one-line definition, and its membership of the site's term set, plus `BreadcrumbList` structured data. Structured data SHALL describe only content visible on the page.

#### Scenario: Term metadata derives from content
- **WHEN** a term page renders
- **THEN** its title is derived from the term name and its description from the one-line definition

#### Scenario: Structured data validates
- **WHEN** a glossary page's structured data is parsed
- **THEN** it is syntactically valid and carries the required properties for the declared type

#### Scenario: Term set lists every term
- **WHEN** the index's `DefinedTermSet` is inspected
- **THEN** it names exactly the terms rendered on the page, with each term's absolute URL

### Requirement: Glossary is reachable from site chrome

The primary navigation and the footer SHALL link to `/glossary`, and `/glossary` SHALL be counted among the site's public static pages wherever those are enumerated.

#### Scenario: Linked from every page
- **WHEN** any page's navigation and footer are inspected
- **THEN** each contains a link to `/glossary`

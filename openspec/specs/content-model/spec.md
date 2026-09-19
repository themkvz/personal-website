## Purpose

Defines how every piece of time-varying site text — workbench artifacts, the experience timeline, and tool cards — is authored as MDX files in the repository, and what the derived artifact index guarantees to the pages that read it.

## Requirements

### Requirement: Content lives in repository files

All updatable site content SHALL be authored as MDX files committed to the repository. The system SHALL NOT depend on a database, a CMS, or any runtime datastore to render any page.

#### Scenario: Content rendered without a datastore
- **WHEN** the site is built and served with no database available
- **THEN** every page renders its full content
- **AND** no request performs a database or network read to obtain content

#### Scenario: Content edited by committing a file
- **WHEN** an author adds, edits, or deletes a content file and rebuilds
- **THEN** the affected pages and the artifact index reflect the change
- **AND** no other step (migration, seed, admin action) is required

### Requirement: Artifact frontmatter contract

Every workbench artifact file SHALL declare frontmatter with `title`, `lane`, `summary`, and `publishedAt`. It MAY declare `updatedAt`, `topics`, `kind`, `featured`, and `draft`. `lane` MUST be one of `building`, `investigating`, `deciding`, `keeping`. `publishedAt` and `updatedAt` MUST be ISO-8601 dates. An artifact's slug SHALL be derived from its filename, so slug uniqueness is guaranteed by the filesystem.

#### Scenario: Valid artifact is indexed
- **WHEN** an artifact file declares all required fields with a valid `lane`
- **THEN** it appears in the artifact index with those values available to every page

#### Scenario: Invalid artifact fails the build
- **WHEN** an artifact file omits a required field, uses a `lane` outside the four allowed values, or supplies a non-ISO date
- **THEN** the build fails with an error naming the offending file and field
- **AND** the site is not published with that artifact silently missing or blank

#### Scenario: Slug derived from filename
- **WHEN** an artifact is authored at `content/workbench/<name>.mdx`
- **THEN** its slug is `<name>` and its URL is derived from that slug

### Requirement: Drafts are unpublished in production

An artifact with `draft: true` SHALL be excluded from the artifact index in production builds, and therefore from every list, the sitemap, and the feed, and its URL SHALL return 404. In development builds drafts SHALL be indexed and rendered so they can be previewed.

#### Scenario: Draft hidden in production
- **WHEN** the site is built for production with an artifact marked `draft: true`
- **THEN** it appears in no list, no sitemap entry, and no feed item
- **AND** requesting its URL returns 404

#### Scenario: Draft visible in development
- **WHEN** the site runs in development with the same artifact
- **THEN** it appears in the index and its page renders

### Requirement: Single derived artifact index

The system SHALL derive one index from all published artifact files. The index SHALL be ordered by `publishedAt` descending, with ties broken by slug ascending so ordering is deterministic. Every surface that lists artifacts (Home preview, Workbench index, lane groupings, sitemap, feed) SHALL read from this single index.

#### Scenario: Deterministic ordering
- **WHEN** the index is derived twice from an unchanged content directory
- **THEN** both derivations produce the same artifacts in the same order

#### Scenario: Newest artifact leads
- **WHEN** an artifact with a `publishedAt` later than every existing artifact is added
- **THEN** it appears first in the index and in every list derived from it

#### Scenario: Lane filtering is a view of the index
- **WHEN** artifacts are grouped or filtered by lane
- **THEN** the result contains exactly the index entries whose `lane` matches, in index order

#### Scenario: Featured artifact is unambiguous
- **WHEN** more than one artifact is marked `featured`
- **THEN** the first of them in index order is the featured artifact

### Requirement: Experience entries are content with a typed contract

Every experience entry file SHALL declare `organisation`, `role`, and `startDate`, and MAY declare `endDate`, `location`, and `url`. Dates MUST be ISO-8601. The file body is the role summary. An entry without `endDate` is ongoing. Entries SHALL be validated at build time under the same failure rule as artifacts.

#### Scenario: Timeline entry updated without touching components
- **WHEN** an author edits or adds an experience entry file
- **THEN** the About page timeline reflects it after a rebuild
- **AND** no page or component source file needs to change

#### Scenario: Timeline ordering
- **WHEN** experience entries are rendered
- **THEN** they appear most-recent-first by `startDate`, with an ongoing role shown as `<start year> — NOW`

#### Scenario: Invalid entry fails the build
- **WHEN** an experience file omits `organisation`, `role`, or `startDate`, or supplies a non-ISO date
- **THEN** the build fails with an error naming the file and field

### Requirement: Tool cards are content with a typed contract

Every tool card file SHALL declare `name`, `category`, and `description`, and MAY declare `href` and `featured`. A card with `href` is implemented and links there; a card without `href` is forthcoming. A card marked `featured` is visually emphasised on the Tools page. Cards SHALL be validated at build time under the same failure rule as artifacts and SHALL render in filename order.

#### Scenario: Forthcoming card
- **WHEN** a tool file has no `href`
- **THEN** the Tools page and the Home tools preview present it as forthcoming and non-navigating

#### Scenario: Implemented card
- **WHEN** a tool file declares `href`
- **THEN** its card links to that address

### Requirement: Glossary terms are content with a typed contract

Every glossary term file SHALL declare `term` and `summary`, and MAY declare `aka`, `related`, `updatedAt`, and `draft`. `term` is the display name; `summary` is the one-line definition reused as the index entry and the page's meta description; `aka` is a list of alternative names; `related` is a list of other term slugs; `updatedAt` MUST be an ISO-8601 date. The file body is the long-form explanation. A term's slug SHALL be derived from its filename. Terms SHALL be validated at build time under the same failure rule as artifacts, and drafts SHALL follow the same production exclusion rule as artifacts.

#### Scenario: Valid term is indexed
- **WHEN** a term file declares `term` and `summary`
- **THEN** it appears in the glossary index with those values available to every page that reads it

#### Scenario: Invalid term fails the build
- **WHEN** a term file omits `term` or `summary`, or supplies a non-ISO `updatedAt`
- **THEN** the build fails with an error naming the offending file and field

#### Scenario: Slug derived from filename
- **WHEN** a term is authored at `content/glossary/<name>.mdx`
- **THEN** its slug is `<name>` and its URL is derived from that slug

#### Scenario: Draft term hidden in production
- **WHEN** the site is built for production with a term marked `draft: true`
- **THEN** it appears in no index, no sitemap entry, and no agent index, and requesting its URL returns 404

### Requirement: Glossary index is derived once and ordered by name

The system SHALL derive one glossary index from all published term files, ordered alphabetically by `term`, case-insensitive and locale-aware, with ties broken by slug ascending. Every surface that lists terms (the glossary index page, the sitemap, the agent index) SHALL read from this single index.

#### Scenario: Deterministic ordering
- **WHEN** the index is derived twice from an unchanged content directory
- **THEN** both derivations produce the same terms in the same order

#### Scenario: Case does not affect position
- **WHEN** terms named `API`, `abstraction`, and `Bundle` are published
- **THEN** they are ordered `abstraction`, `API`, `Bundle`

### Requirement: Design-bound copy stays in source

Page copy that changes only with the design — the About practice summary and its three columns, the Home profile facts, navigation labels, and social links — SHALL live as typed literals in `src/constants.ts`, not in content files.

#### Scenario: No content file for structural copy
- **WHEN** the content directory is listed
- **THEN** it contains only `workbench/`, `experience/`, `tools/`, and `glossary/`

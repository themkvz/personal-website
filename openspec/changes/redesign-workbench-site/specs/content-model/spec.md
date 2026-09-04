## Purpose

Defines how every piece of updatable site text — workbench artifacts, the experience timeline, tool cards, and repeated page copy — is authored as Markdown/MDX files in the repository, and what the derived artifact index guarantees to the pages that read it.

## ADDED Requirements

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

Every workbench artifact file SHALL declare frontmatter with `title`, `lane`, `summary`, and `publishedAt`. It MAY declare `updatedAt`, `topics`, and `featured`. `lane` MUST be one of `building`, `investigating`, `deciding`, `keeping`. `publishedAt` and `updatedAt` MUST be ISO-8601 dates. An artifact's slug SHALL be derived from its filename, so slug uniqueness is guaranteed by the filesystem.

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

### Requirement: Single derived artifact index

The system SHALL derive one index from all artifact files. The index SHALL be ordered by `publishedAt` descending, with ties broken by slug ascending so ordering is deterministic. Every surface that lists artifacts (Home preview, Workbench index, lane groupings) SHALL read from this single index.

#### Scenario: Deterministic ordering
- **WHEN** the index is derived twice from an unchanged content directory
- **THEN** both derivations produce the same artifacts in the same order

#### Scenario: Newest artifact leads
- **WHEN** an artifact with a `publishedAt` later than every existing artifact is added
- **THEN** it appears first in the index and in every list derived from it

#### Scenario: Lane filtering is a view of the index
- **WHEN** artifacts are grouped or filtered by lane
- **THEN** the result contains exactly the index entries whose `lane` matches, in index order

### Requirement: Repeated page copy is authored as content

Recurring, time-varying page text — the experience timeline entries, tool cards, practice columns, and profile details — SHALL be authored as content files with typed frontmatter rather than embedded in component source.

#### Scenario: Timeline entry updated without touching components
- **WHEN** an author edits or adds an experience entry file
- **THEN** the About page timeline reflects it after a rebuild
- **AND** no page or component source file needs to change

#### Scenario: Timeline ordering
- **WHEN** experience entries are rendered
- **THEN** they appear most-recent-first by start date, with an ongoing role shown as `<year> — NOW`

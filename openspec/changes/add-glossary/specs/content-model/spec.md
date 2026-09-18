## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Design-bound copy stays in source

Page copy that changes only with the design — the About practice summary and its three columns, the Home profile facts, navigation labels, and social links — SHALL live as typed literals in `src/constants.ts`, not in content files.

#### Scenario: No content file for structural copy
- **WHEN** the content directory is listed
- **THEN** it contains only `workbench/`, `experience/`, `tools/`, and `glossary/`

## MODIFIED Requirements

### Requirement: Artifact frontmatter contract

Every workbench artifact file SHALL declare frontmatter with `title`, `lane`, `summary`, and `publishedAt`. It MAY declare `updatedAt`, `topics`, `kind`, `featured`, `draft`, and `related`. `lane` MUST be one of `building`, `investigating`, `deciding`, `keeping`. `publishedAt` and `updatedAt` MUST be ISO-8601 dates. `related` is an ordered list of other artifact slugs; every entry MUST resolve to a published artifact, MUST NOT be the artifact's own slug, and MUST NOT repeat. An artifact's slug SHALL be derived from its filename, so slug uniqueness is guaranteed by the filesystem.

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

#### Scenario: Related slugs resolve
- **WHEN** an artifact declares `related` slugs that each match a published artifact
- **THEN** the index exposes those artifacts, in the declared order, to the artifact's page

#### Scenario: Unknown related slug fails the build
- **WHEN** an artifact declares a `related` slug that matches no artifact file, or names itself, or lists a slug twice
- **THEN** the build fails with an error naming the artifact file, the field `related`, and the offending slug

#### Scenario: Related draft fails the production build
- **WHEN** an artifact declares a `related` slug whose artifact is marked `draft: true` and the site is built for production
- **THEN** the build fails with the same error rather than publishing a link to a page that returns 404

## MODIFIED Requirements

### Requirement: Agent index file

The site SHALL serve `/llms.txt` as `text/plain` with charset `utf-8`, formatted per the llms.txt convention: an H1 naming the site, a blockquote summarising it, and H2 sections whose bodies are markdown link lists of the form `- [name](absolute-url): notes`. It SHALL index the site's pages, every published workbench artifact, every published glossary term with its one-line definition as the note, and the site's machine-readable endpoints. Every URL it lists SHALL be absolute.

#### Scenario: File is served correctly
- **WHEN** `/llms.txt` is requested
- **THEN** the response status is 200 and its content type is `text/plain` with charset `utf-8`

#### Scenario: Structure matches the convention
- **WHEN** the file is parsed as markdown
- **THEN** its first non-empty line is a single H1, the next non-empty block is a blockquote, and every subsequent section header is an H2
- **AND** every list item under an H2 begins with a markdown hyperlink

#### Scenario: Index tracks published content
- **WHEN** an artifact is added to the content layer and the site is rebuilt
- **THEN** it appears in the workbench section of `llms.txt`
- **AND** artifacts that are drafts do not appear

#### Scenario: Glossary tracks published terms
- **WHEN** a term is added to the content layer and the site is rebuilt
- **THEN** it appears in a Glossary section of `llms.txt` with its one-line definition as the note
- **AND** terms that are drafts do not appear

#### Scenario: Links are absolute and resolve
- **WHEN** each URL in the file is fetched
- **THEN** it is an absolute URL on the site's production origin and returns a 200 response

#### Scenario: Machine endpoints are indexed
- **WHEN** the file's sections are inspected
- **THEN** they include the sitemap, the RSS feed, and the OpenAPI description

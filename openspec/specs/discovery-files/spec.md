## Purpose

Defines the site's public plain-text discovery surfaces — a security contact, a human credit file, and a curated index for agents — so that a researcher, a person, or a machine reading the site can each find the entry point meant for them at a conventional, stable address.

## Requirements

### Requirement: Security contact file

The site SHALL serve a security contact file at `/.well-known/security.txt` over HTTPS with content type `text/plain` and charset `utf-8`, conforming to RFC 9116. It SHALL contain exactly one `Contact` field naming a reachable method of reporting a vulnerability, exactly one `Expires` field carrying an RFC 3339 timestamp less than one year in the future, a `Canonical` field whose value is the file's own absolute HTTPS URL, and a `Preferred-Languages` field.

#### Scenario: File is served correctly
- **WHEN** `/.well-known/security.txt` is requested
- **THEN** the response status is 200
- **AND** its content type is `text/plain` with charset `utf-8`

#### Scenario: Required fields present exactly once
- **WHEN** the file's contents are parsed
- **THEN** `Contact` appears at least once and `Expires` appears exactly once
- **AND** every field name in the file is one defined by RFC 9116

#### Scenario: Expiry is never stale
- **WHEN** the file is fetched at any time the site is running
- **THEN** its `Expires` value is in the future and no more than one year ahead of the moment of the request

#### Scenario: Canonical matches the served address
- **WHEN** the file's `Canonical` value is compared to the address it was served from
- **THEN** they are the same absolute HTTPS URL

#### Scenario: Contact resolves to a real address
- **WHEN** the `Contact` value is inspected
- **THEN** it is the site's published public contact address, not a placeholder

### Requirement: Legacy security.txt address redirects

The site SHALL respond to `/security.txt` with a permanent redirect to `/.well-known/security.txt`, so that clients using the pre-RFC location are routed to the authoritative file rather than served a second, divergent copy.

#### Scenario: Legacy path redirects
- **WHEN** `/security.txt` is requested
- **THEN** the response is a 301 whose location is the absolute URL of `/.well-known/security.txt`

#### Scenario: Only one copy exists
- **WHEN** both addresses are fetched
- **THEN** exactly one of them returns file content, and it is the well-known path

### Requirement: Human credit file

The site SHALL serve `/humans.txt` as `text/plain` with charset `utf-8`, following the humans.txt convention: a team section naming the site's author with their role and contact, and a site section naming the last update and the technologies the site is built with. Every page SHALL advertise it with a `rel="author"` link in the document head.

#### Scenario: File is served correctly
- **WHEN** `/humans.txt` is requested
- **THEN** the response status is 200 and its content type is `text/plain` with charset `utf-8`

#### Scenario: Credits the author
- **WHEN** the file's contents are inspected
- **THEN** they name the site owner, their role, and a contact address

#### Scenario: Advertised from the head
- **WHEN** any page's `head` is inspected
- **THEN** it contains exactly one `rel="author"` link pointing at `/humans.txt`

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

### Requirement: Discovery files stay out of the sitemap

The plain-text discovery files SHALL NOT be listed in `sitemap.xml`, which enumerates indexable HTML pages only.

#### Scenario: Sitemap excludes text endpoints
- **WHEN** `sitemap.xml` is inspected
- **THEN** it contains no entry for `humans.txt`, `llms.txt`, `security.txt`, or `robots.txt`

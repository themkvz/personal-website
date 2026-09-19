## MODIFIED Requirements

### Requirement: Structured data

The site SHALL emit valid structured data: `WebSite` and `Person` on the home page, `Article` plus `BreadcrumbList` on artifact pages, the article including headline, publication date, and updated date when present, `DefinedTermSet` on the glossary index, and `DefinedTerm` plus `BreadcrumbList` on glossary term pages. Structured data SHALL describe only content that is actually visible on the page.

#### Scenario: Structured data validates
- **WHEN** any page's structured data is parsed
- **THEN** it is syntactically valid and its required properties for the declared type are present

#### Scenario: No fabricated claims
- **WHEN** structured data on a page is compared to that page's visible content
- **THEN** every value it asserts appears in, or is derived from, that visible content

### Requirement: Sitemap and robots

The site SHALL serve a `sitemap.xml` listing every public page including each artifact page and each glossary term page, and a `robots.txt` that permits crawling and references the sitemap. `robots.txt` SHALL be served as `text/plain` with charset `utf-8` and SHALL state its crawler policy explicitly: a default group permitting all user-agents, and named groups for the AI crawlers the site chooses to admit, so that the policy is a recorded decision rather than an absence of one.

#### Scenario: New artifact appears in the sitemap
- **WHEN** an artifact is added to the content layer and the site is rebuilt
- **THEN** its URL appears in `sitemap.xml` with its last-modified date

#### Scenario: New glossary term appears in the sitemap
- **WHEN** a term is added to the content layer and the site is rebuilt
- **THEN** its URL appears in `sitemap.xml`

#### Scenario: Last-modified is honest
- **WHEN** `sitemap.xml` is inspected
- **THEN** artifact entries carry `updatedAt`, or `publishedAt` when there is no update, as `lastmod`
- **AND** glossary term entries carry `updatedAt` as `lastmod` when present and no `lastmod` otherwise
- **AND** static route entries carry no `lastmod` rather than the generation time

#### Scenario: Sitemap excludes non-pages
- **WHEN** `sitemap.xml` is inspected
- **THEN** it contains no filtered-view URLs, no query strings, no redirecting URL, no draft, and no URL that returns a non-200 status

#### Scenario: Robots references the sitemap
- **WHEN** `robots.txt` is fetched
- **THEN** it permits crawling of public pages and declares the absolute sitemap URL

#### Scenario: AI crawlers are named and admitted
- **WHEN** `robots.txt` is inspected
- **THEN** it contains a default `User-agent: *` group that allows all paths
- **AND** it names the major AI crawler user-agents in their own groups, each allowing all paths
- **AND** no group disallows a public page

#### Scenario: Robots is served as text
- **WHEN** `robots.txt` is fetched
- **THEN** the response status is 200 and its content type is `text/plain` with charset `utf-8`

#### Scenario: One robots.txt, one source
- **WHEN** the deployed site is inspected
- **THEN** `robots.txt` has exactly one source of truth, and no static asset shadows or diverges from the served response

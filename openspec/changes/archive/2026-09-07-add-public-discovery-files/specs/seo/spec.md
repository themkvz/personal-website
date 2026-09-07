## MODIFIED Requirements

### Requirement: Sitemap and robots

The site SHALL serve a `sitemap.xml` listing every public page including each artifact page, and a `robots.txt` that permits crawling and references the sitemap. `robots.txt` SHALL be served as `text/plain` with charset `utf-8` and SHALL state its crawler policy explicitly: a default group permitting all user-agents, and named groups for the AI crawlers the site chooses to admit, so that the policy is a recorded decision rather than an absence of one.

#### Scenario: New artifact appears in the sitemap
- **WHEN** an artifact is added to the content layer and the site is rebuilt
- **THEN** its URL appears in `sitemap.xml` with its last-modified date

#### Scenario: Last-modified is honest
- **WHEN** `sitemap.xml` is inspected
- **THEN** artifact entries carry `updatedAt`, or `publishedAt` when there is no update, as `lastmod`
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

## ADDED Requirements

### Requirement: Web app manifest identity

The site SHALL serve a web app manifest whose `name` and `short_name` are non-empty and identify the site, and every page SHALL advertise it with a `rel="manifest"` link in the document head.

#### Scenario: Manifest names the site
- **WHEN** the web app manifest is fetched and parsed
- **THEN** its `name` and `short_name` are non-empty strings identifying the site
- **AND** `short_name` is short enough to render under a home-screen icon

#### Scenario: Manifest is advertised
- **WHEN** any page's `head` is inspected
- **THEN** it contains exactly one `rel="manifest"` link resolving to a 200 response

#### Scenario: Install prompt is named
- **WHEN** the site is added to a home screen or installed
- **THEN** the resulting entry carries the site's name rather than its URL or an empty label

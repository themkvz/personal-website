## Purpose

Defines the crawlability and metadata contract for the redesigned site so that its editorial presentation does not cost it semantic clarity: unique per-page metadata, canonical URLs, social previews, structured data, a complete sitemap, and correct HTTP status codes.

## Requirements

### Requirement: Unique per-page metadata

Every routable page SHALL emit a `title` and a meta description that are unique to that page and describe its actual content. No page SHALL fall back to a generic site-wide title.

#### Scenario: Titles are distinct
- **WHEN** the titles of all routable pages are collected
- **THEN** no two pages share a title

#### Scenario: Artifact metadata derives from content
- **WHEN** an artifact page renders
- **THEN** its title is derived from the artifact's `title` and its description from the artifact's `summary`

### Requirement: Canonical URLs

Every page SHALL declare exactly one canonical URL that is absolute, uses the site's production origin, and points at that page's own address.

#### Scenario: Canonical points at self
- **WHEN** any page is rendered
- **THEN** its canonical link is the absolute production URL of that same page

#### Scenario: Exactly one canonical
- **WHEN** any page's `head` is inspected
- **THEN** there is one `rel="canonical"` link, not a site-wide one alongside the page's own

#### Scenario: Query parameters excluded
- **WHEN** a filtered Workbench view is rendered with a lane parameter
- **THEN** its canonical URL is the unfiltered Workbench URL

### Requirement: Social preview metadata

Every page SHALL emit Open Graph metadata comprising at minimum type, site name, title, description, URL, and an image, plus a Twitter card type. The image SHALL be one absolute site-wide asset. Artifact pages SHALL declare the Open Graph type `article` together with the article's publication time and, when an update date exists, its modification time; every other page SHALL declare the type `website`.

#### Scenario: Preview metadata present
- **WHEN** any page's markup is inspected
- **THEN** the Open Graph type, site name, title, description, URL, and image, and the Twitter card type, are all present and non-empty

#### Scenario: Image resolves
- **WHEN** the Open Graph image URL is fetched
- **THEN** it returns 200 with an image content type

#### Scenario: Artifact page is typed as an article
- **WHEN** an artifact page's markup is inspected
- **THEN** its Open Graph type is `article`
- **AND** `article:published_time` equals the artifact's `publishedAt`
- **AND** `article:modified_time` is present and equals `updatedAt` when the artifact declares one, and is absent otherwise

#### Scenario: Non-article pages stay websites
- **WHEN** the home, Workbench index, Tools, About, or Glossary index page's markup is inspected
- **THEN** its Open Graph type is `website` and no `article:` property is present

### Requirement: Structured data

The site SHALL emit valid structured data: `WebSite` and `Person` on the home page, `Article` plus `BreadcrumbList` on artifact pages, `DefinedTermSet` on the glossary index, and `DefinedTerm` plus `BreadcrumbList` on glossary term pages. Structured data SHALL describe only content that is actually visible on the page.

The home page `Person` SHALL carry the owner's name, the site URL, the job title shown in the profile card, a `sameAs` list containing every public profile the page links to (at minimum GitHub and LinkedIn), the country shown in the profile, and a `knowsAbout` list of the practice areas the page names.

Each artifact `Article` SHALL carry the headline, the description, the publication date, the updated date when present, an `author` that is a `Person` with the owner's name and the site URL, a `mainEntityOfPage` equal to the artifact page's canonical URL, and an `image` equal to the page's Open Graph image.

#### Scenario: Structured data validates
- **WHEN** any page's structured data is parsed
- **THEN** it is syntactically valid and its required properties for the declared type are present

#### Scenario: No fabricated claims
- **WHEN** structured data on a page is compared to that page's visible content
- **THEN** every value it asserts appears in, or is derived from, that visible content

#### Scenario: Person is connected to its public profiles
- **WHEN** the home page `Person` is parsed
- **THEN** its `sameAs` contains the GitHub and LinkedIn URLs that the page's social links point to
- **AND** its `jobTitle`, `address.addressCountry`, and every `knowsAbout` entry match text rendered on the page

#### Scenario: Article is attributed and anchored
- **WHEN** an artifact page's `Article` is parsed
- **THEN** its `author.name` equals the owner's name, `mainEntityOfPage` equals the page's canonical URL, and `image` equals the page's `og:image`

#### Scenario: Structured data agrees with page metadata
- **WHEN** an artifact page's `Article` dates are compared to its `article:published_time` and `article:modified_time` properties
- **THEN** they are equal

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

### Requirement: RSS feed

The site SHALL serve an RSS 2.0 feed at `/feed.xml` listing every published artifact newest first, each with its title, absolute link, summary, and publication date. Every page SHALL advertise the feed with a `rel="alternate"` link.

#### Scenario: New artifact appears in the feed
- **WHEN** an artifact is added and the site is rebuilt
- **THEN** it is the first item in `feed.xml`

#### Scenario: Feed is discoverable
- **WHEN** any page's `head` is inspected
- **THEN** it contains an `alternate` link of type `application/rss+xml` pointing at the absolute feed URL

### Requirement: Correct status codes

The site SHALL return HTTP status codes that match the outcome: 200 for pages that render content, 301 for retired addresses with a replacement, 404 for addresses with no content.

#### Scenario: Missing page is a 404
- **WHEN** an unknown route or unknown artifact slug is requested
- **THEN** the response status is 404, not 200

#### Scenario: Retired page redirects
- **WHEN** `/bookmarks` or `/contact` is requested
- **THEN** the response is a 301 whose location resolves to a 200

#### Scenario: Crawlable internal links
- **WHEN** the internal links of any page are followed
- **THEN** each resolves to a 200 response

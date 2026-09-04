## Purpose

Defines the crawlability and metadata contract for the redesigned site so that its editorial presentation does not cost it semantic clarity: unique per-page metadata, canonical URLs, social previews, structured data, a complete sitemap, and correct HTTP status codes.

## ADDED Requirements

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

Every page SHALL emit Open Graph metadata comprising at minimum type, site name, title, description, URL, and an image, plus a Twitter card type. The image SHALL be one absolute site-wide asset.

#### Scenario: Preview metadata present
- **WHEN** any page's markup is inspected
- **THEN** the Open Graph type, site name, title, description, URL, and image, and the Twitter card type, are all present and non-empty

#### Scenario: Image resolves
- **WHEN** the Open Graph image URL is fetched
- **THEN** it returns 200 with an image content type

### Requirement: Structured data

The site SHALL emit valid structured data: `WebSite` and `Person` on the home page, and `Article` plus `BreadcrumbList` on artifact pages, the article including headline, publication date, and updated date when present. Structured data SHALL describe only content that is actually visible on the page.

#### Scenario: Structured data validates
- **WHEN** any page's structured data is parsed
- **THEN** it is syntactically valid and its required properties for the declared type are present

#### Scenario: No fabricated claims
- **WHEN** structured data on a page is compared to that page's visible content
- **THEN** every value it asserts appears in, or is derived from, that visible content

### Requirement: Sitemap and robots

The site SHALL serve a `sitemap.xml` listing every public page including each artifact page, and a `robots.txt` that permits crawling and references the sitemap.

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

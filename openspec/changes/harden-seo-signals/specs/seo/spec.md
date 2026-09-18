## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Search engine ownership verification

The site SHALL support proving ownership to Google Search Console and Bing Webmaster Tools through meta tags. When a verification token for a service is configured, every page SHALL emit that service's verification meta tag with the token as its content. When no token is configured, no tag for that service SHALL be emitted, and the site SHALL build and serve normally.

#### Scenario: Token configured
- **WHEN** a Google verification token is configured and any page is fetched
- **THEN** the response head contains one `google-site-verification` meta tag whose content equals the token

#### Scenario: Token absent
- **WHEN** no Bing verification token is configured and any page is fetched
- **THEN** the response head contains no `msvalidate.01` meta tag
- **AND** the build and the server start without error

#### Scenario: Tag is in the server response
- **WHEN** a verified page is fetched without executing JavaScript
- **THEN** the verification meta tag is present in the HTML response

## Why

The site's technical SEO layer is complete but its structured data is skeletal: the `Person` on the home page carries only a name and URL, `Article` on artifact pages names no author and no page entity, and every page, including articles, declares `og:type: website`. Search engines therefore see ten unattributed articles and an unconnected name. These are the cheapest remaining ranking signals and they gate everything else.

## What Changes

- Extend the home page `Person` structured data with the profile, social, and location values already published on the page: `jobTitle`, `sameAs` (GitHub, LinkedIn), `address.addressCountry`, and `knowsAbout` drawn from the practice areas.
- Extend artifact `Article` structured data with `author` (the site owner as a `Person`), `mainEntityOfPage` (the artifact's canonical URL), and `image` (the site-wide preview image), so each article resolves to an entity and a page.
- Page metadata gains an article variant: artifact pages emit `og:type: article`, `article:published_time`, and `article:modified_time` when an update date exists; all other pages keep `og:type: website`.

Non-goals: search console ownership verification (done through a DNS TXT record on the Domain property, so the site emits no verification tags), per-page Open Graph images, glossary structured data (owned by `add-glossary`), any content or copy change, backlink outreach, and the tools subdomain.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `seo`: the structured data requirement names the `Person` and `Article` properties the site commits to; and the social preview requirement distinguishes article pages from other pages.


## Impact

- **Modified**: `src/routes/_index.tsx` (`Person` properties), `src/routes/workbench.$slug.tsx` (`Article` properties, article meta), `src/lib/meta.ts` (article variant), `src/constants.ts` if any value needed by structured data is not already there.
- **No new dependencies.** No change to the content layer, theme, analytics, or experiment layers.
- **Sequencing**: `add-glossary` also modifies the `seo` structured data requirement. This delta is written against the glossary's version of that requirement so the two archive cleanly in either order, but archiving `add-glossary` first is the intended path.

## Why

The site's technical SEO layer is complete but its structured data is skeletal: the `Person` on the home page carries only a name and URL, `Article` on artifact pages names no author and no page entity, and every page, including articles, declares `og:type: website`. Search engines therefore see ten unattributed articles and an unconnected name. Nothing in the repository registers the site with a search console either, so keyword and indexing data — the only ground truth for the content work that follows — is not being collected. These are the cheapest remaining ranking signals and they gate everything else.

## What Changes

- Extend the home page `Person` structured data with the profile, social, and location values already published on the page: `jobTitle`, `sameAs` (GitHub, LinkedIn), `address.addressCountry`, and `knowsAbout` drawn from the practice areas.
- Extend artifact `Article` structured data with `author` (the site owner as a `Person`), `mainEntityOfPage` (the artifact's canonical URL), and `image` (the site-wide preview image), so each article resolves to an entity and a page.
- Page metadata gains an article variant: artifact pages emit `og:type: article`, `article:published_time`, and `article:modified_time` when an update date exists; all other pages keep `og:type: website`.
- Search engine ownership verification: the site emits a `google-site-verification` meta tag and a Bing `msvalidate.01` meta tag on every page when the corresponding token is configured, and emits nothing when it is not, so a fresh checkout without tokens still builds and serves. Registering the property and submitting the sitemap in each console is a one-time operator step outside the repository.

Non-goals: per-page Open Graph images, glossary structured data (owned by `add-glossary`), any content or copy change, backlink outreach, and the tools subdomain.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `seo`: the structured data requirement names the `Person` and `Article` properties the site commits to; the social preview requirement distinguishes article pages from other pages; a new requirement covers search engine verification tags.

The verification tokens are two optional public variables. They appear in page markup, so the existing `configuration` contract already classifies them (`VITE_` prefix, listed in the committed template); no requirement changes there.

## Impact

- **Modified**: `src/routes/_index.tsx` (`Person` properties), `src/routes/workbench.$slug.tsx` (`Article` properties, article meta), `src/lib/meta.ts` (article variant), `src/root.tsx` or `src/lib/meta.ts` (verification tags), `src/env.shared.ts` and `src/env.client.ts` (two optional public tokens), `.env.example`, `src/constants.ts` if any value needed by structured data is not already there.
- **No new dependencies.** No change to the content layer, theme, analytics, or experiment layers.
- **Sequencing**: `add-glossary` also modifies the `seo` structured data requirement. This delta is written against the glossary's version of that requirement so the two archive cleanly in either order, but archiving `add-glossary` first is the intended path.

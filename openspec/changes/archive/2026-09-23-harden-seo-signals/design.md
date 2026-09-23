## Context

See proposal.md for motivation; requirements are in `specs/seo/spec.md`.

- `src/lib/meta.ts` `pageMeta()` builds every page's meta descriptors and hard-codes `og:type: website`. The og image is always `${Site.baseUrl}/hero.webp` (no route passes `image`).
- React Router's `meta` export does not merge: the deepest matching route's descriptors replace its ancestors'. A tag declared in `root.tsx`'s `meta` never reaches a leaf page.
- Every value the new `Person` properties need already lives in `src/constants.ts` and is rendered on the home page: `Home.profileRole`, `Site.location`, `Home.profileTopics`, and `Nav.social`, which the footer renders.
- `add-glossary` is archived (`openspec/changes/archive/2026-09-19-add-glossary`), so the spec delta applies against the current `seo` spec.

## Goals / Non-Goals

**Goals:**
- Article Open Graph variant in the one shared meta helper, so no route builds `og:*` tags itself.
- `Person`, `Article`, and meta values that come from the same constants the page renders, so they can't drift from the visible text.

**Non-Goals:**
- A shared JSON-LD builder module. Two call sites don't justify one.
- Search console verification tags. Ownership is proven by a DNS TXT record on the Search Console Domain property; Bing imports from Search Console.

## Decisions

**1. `pageMeta` takes an optional `article: { publishedTime, modifiedTime? }`.**
When it is present, `og:type` is `article` and the `article:*` properties are appended. `modifiedTime` is emitted only when it is defined. Every other call site stays unchanged and keeps `website`.
*Alternative:* the artifact route appends its own descriptors after `pageMeta()`. Rejected: that leaves a stale `og:type: website` and puts the Open Graph logic in two places.

**2. `meta.ts` exports the absolute default og image URL.**
`Article.image` must equal `og:image`. Exporting the value `pageMeta` already computes is the only way to guarantee that. Recomputing `${Site.baseUrl}/hero.webp` in the route would duplicate the rule.

**3. `Person` and `Article` values come from existing constants.**
- `jobTitle` is `Home.profileRole`, the text in the profile card heading.
- `address` is `{ "@type": "PostalAddress", addressCountry: Site.location }`. The page renders "Ukraine", not an ISO code, and schema.org accepts country names as text.
- `knowsAbout` is `Home.profileTopics`, the practice-area chips on the home page.
- `sameAs` is the `http` hrefs in `Nav.social`. Filtering out `mailto:` keeps the list in sync with the footer without hard-coding the GitHub and LinkedIn URLs.
- `Article.author` is `{ "@type": "Person", name: Site.ownerName, url: Site.baseUrl }`.
- `Article.mainEntityOfPage` is `${Site.baseUrl}${artifactHref(slug)}`. The breadcrumb and the canonical tag already use that expression.
*Alternative:* the About page's practice areas for `knowsAbout`. Rejected: the spec requires every entry to be text on the home page.

## Risks / Trade-offs

- [`knowsAbout` entries are uppercase display strings ("WEB APPS")] → Accepted. Matching the rendered text is the spec's no-fabrication rule, and it counts for more than the casing.
- [`addressCountry` as the name "Ukraine" rather than "UA"] → Google accepts both forms, and the name matches the visible text.

## Migration Plan

Deploy; nothing is stored, and rollback is a plain revert. Afterwards, resubmit `/sitemap.xml` in Search Console and spot-check an artifact page in the Rich Results Test.

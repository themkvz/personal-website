## 1. Page metadata

- [x] 1.1 Add an optional `article: { publishedTime, modifiedTime? }` input to `pageMeta` in `src/lib/meta.ts`. When it is present, emit `og:type: article`, `article:published_time`, and `article:modified_time` (only when `modifiedTime` is defined). Export the absolute default og image URL. Verify with `src/lib/meta.test.ts` (`bun test`): article with and without a modified time, and a non-article page keeping `website` with no `article:*` properties.
- [x] 1.2 Pass `article` from `src/routes/workbench.$slug.tsx` `meta`, using the artifact's `publishedAt` and `updatedAt`. Verify with `bun run typecheck`.

## 2. Structured data

- [x] 2.1 Extend the home page `Person` in `src/routes/_index.tsx` with `jobTitle` (`Home.profileRole`), `sameAs` (the `http` hrefs in `Nav.social`), `address.addressCountry` (`Site.location`), and `knowsAbout` (`Home.profileTopics`). Verify by checking the SSR HTML of `/` for those values.
- [x] 2.2 Extend the artifact `Article` in `src/routes/workbench.$slug.tsx` with `author` (a `Person` with `Site.ownerName` and `Site.baseUrl`), `mainEntityOfPage` (the canonical URL), and `image` (the exported og image URL). Verify in the SSR HTML of an artifact page that `image` equals `og:image`, `mainEntityOfPage` equals the canonical URL, and the dates equal the `article:*` properties.

## 3. Verification

- [x] 3.1 Run `bun run lint`, `bun run typecheck`, `bun test`, and `bun run build` and confirm they pass.

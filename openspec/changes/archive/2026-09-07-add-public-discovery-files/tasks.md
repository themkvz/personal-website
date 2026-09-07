## 1. Shared foundations

- [x] 1.1 Add `src/lib/text-response.ts` exporting a `text(body: string)` helper returning a `Response` with `Content-Type: text/plain; charset=utf-8`; verify `bun run typecheck` passes
- [x] 1.2 Add `PUBLIC_PAGES` to `src/constants.ts` as the canonical list of indexable static routes (`/`, `/tools`, `/workbench`, `/about`); verify it type-checks and is exported
- [x] 1.3 Add the security-contact and author metadata the new files read (preferred languages `en`, and any author/stack fields not already on `Site`) to `src/constants.ts`, reusing `Site.publicEmail` and `Site.ownerName` rather than re-typing them; verify no value is duplicated across files

## 2. security.txt

- [x] 2.1 Add `src/routes/[.]well-known.security[.]txt.ts` returning `Contact`, `Expires` (request time + 6 months, RFC 3339), `Canonical`, and `Preferred-Languages` via the `text()` helper; verify `curl -i http://localhost:3000/.well-known/security.txt` returns 200 with `text/plain; charset=utf-8`
- [x] 2.2 Verify the served file parses clean against an RFC 9116 validator (e.g. securitytxt.org) with `Expires` in the future and `Canonical` equal to the served absolute URL
- [x] 2.3 Add `src/routes/security[.]txt.ts` returning a 301 to `${Site.baseUrl}/.well-known/security.txt`; verify `curl -i http://localhost:3000/security.txt` returns 301 with that `Location` and no body content

## 3. humans.txt

- [x] 3.1 Add `src/routes/humans[.]txt.ts` emitting `//* TEAM *//` (owner name, role, contact) and `//* SITE *//` (last update, stack) sections from constants; verify `curl -i http://localhost:3000/humans.txt` returns 200 with `text/plain; charset=utf-8` and names the owner and a contact address
- [x] 3.2 Add `{ rel: "author", href: "/humans.txt" }` to the `links` export in `src/root.tsx`; verify page source contains exactly one `rel="author"` link

## 4. llms.txt

- [x] 4.1 Add `src/routes/llms[.]txt.ts` emitting an H1, a blockquote summary, and H2 sections — Pages (from `PUBLIC_PAGES`), Workbench (every entry in `artifacts`, summary as the note), Tools, Machine-readable (sitemap, feed, `openapi.json`) — with every URL absolute on `Site.baseUrl`; verify `curl -i http://localhost:3000/llms.txt` returns 200 with `text/plain; charset=utf-8`
- [x] 4.2 Verify the emitted structure matches llmstxt.org: first non-empty line is a single `#` heading, next block is a `>` blockquote, all later headers are `##`, and every list item starts with `- [name](url)`
- [x] 4.3 Verify draft handling by confirming a `draft: true` artifact is absent from the production build's `llms.txt` and present in dev

## 5. robots.txt

- [x] 5.1 Add `src/routes/robots[.]txt.ts` emitting `User-agent: *` / `Allow: /`, named allow groups for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, CCBot, Bytespider, Meta-ExternalAgent, Applebot-Extended, and the absolute `Sitemap:` line; verify the route returns 200 with `text/plain; charset=utf-8`
- [x] 5.2 Delete `public/robots.txt`; verify with `bun run build && bun start` that `curl http://localhost:3000/robots.txt` serves the generated body, not the old three-line file
- [x] 5.3 Refactor `src/routes/sitemap[.]xml.ts` to read `PUBLIC_PAGES` and delete its local `STATIC_ROUTES`; verify `sitemap.xml` output is byte-identical to before the refactor

## 6. Web app manifest

- [x] 6.1 Set `name` and `short_name` in `public/site.webmanifest` to the site's name and a home-screen-length short form; verify the file parses as JSON and both fields are non-empty
- [x] 6.2 Add `{ rel: "manifest", href: "/site.webmanifest" }` to the `links` export in `src/root.tsx`; verify page source contains exactly one `rel="manifest"` link and that it resolves to a 200

## 7. Verification

- [x] 7.1 Confirm `sitemap.xml` lists no `.txt` endpoint and no `/security.txt`, and that every URL it does list still returns 200
- [x] 7.2 Fetch every URL listed in `llms.txt` against a production build and confirm each returns 200
- [x] 7.3 Confirm `src/lib/csp.ts` needs no change for the new `rel="author"` and `rel="manifest"` links, and that no CSP violation appears in the browser console on a production build
- [x] 7.4 Run `bun run typecheck`, `bun run lint`, and `bun run build` and confirm all pass with no new findings

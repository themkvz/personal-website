## Context

See `proposal.md` — Why. Design-relevant current state:

- Machine-readable endpoints are already React Router resource routes with a bare `loader` and no component: `src/routes/sitemap[.]xml.ts`, `feed[.]xml.ts`, `[.]well-known.api-catalog.ts`. `flatRoutes()` maps `[.]` to a literal dot, so `[.]well-known.security[.]txt.ts` resolves to `/.well-known/security.txt`.
- `public/` is served ahead of the route table, so a static file and a route at the same address cannot coexist — the static file wins.
- Site identity lives in one place: `Site` in `src/constants.ts` (`name`, `ownerName`, `baseUrl`, `publicEmail`).
- `sitemap[.]xml.ts` hardcodes `const STATIC_ROUTES = ["/", "/tools", "/workbench", "/about"]` — the same four paths `Nav.links` lists.
- The content layer (`src/content/index.ts`) already exports `artifacts` with drafts filtered out in production, and `tools`.
- There is no test runner. Verification is `typecheck`, `lint`, a production build, and fetching the endpoints from the running server.

## Goals / Non-Goals

**Goals:**

- One source of truth per file. Nothing in these files is typed twice or can drift from what the site actually publishes.
- No file that rots on a calendar. `Expires` and "last updated" are derived, not written down.
- Every new endpoint follows the resource-route shape already in the repo, so the fifth one looks like the first.

**Non-Goals:**

- Caching headers. The existing `sitemap.xml` and `feed.xml` routes set none; these match. Revisit only if traffic to them ever matters.
- A generic "static text endpoint" framework. Five loaders that each return a string is not a subsystem.
- Signing, key management, or a disclosure-policy document (see proposal Non-goals).

## Decisions

### Generated routes, not files in `public/`

All five files are resource routes.

- `security.txt` must carry a future `Expires`; a checked-in file guarantees a day when it silently goes stale.
- `llms.txt` indexes published artifacts; a checked-in copy diverges the moment content is added.
- `robots.txt` and `humans.txt` reference `Site.baseUrl`, `Site.ownerName`, `Site.publicEmail` — a static copy duplicates values that already exist in `constants.ts`.

*Alternative considered:* keep `humans.txt` static since it barely changes. Rejected — it would be the only one of the five in a different place, for the sake of saving a four-line loader, and it would re-type the owner's name and email.

*Consequence:* `public/robots.txt` must be **deleted** in the same change, not just superseded. Left in place it shadows the route and the new policy never ships. This is the one step in the change that is easy to forget and invisible in dev if you only check the route file.

### A shared `text()` response helper

`src/lib/text-response.ts` — one function returning a `Response` with `Content-Type: text/plain; charset=utf-8`.

Five call sites, and the charset is a normative requirement in four of the five spec scenarios. Getting it wrong in one file is exactly the kind of thing that passes review. Not an abstraction for future use; it has all its users on day one.

### `Expires` rolls forward per request

The `security.txt` loader computes `Expires` as request time plus six months, RFC 3339.

*Alternative considered:* a hardcoded date reviewed by hand. Rejected — the failure mode is a file that quietly expires and, per RFC 9116, should then be distrusted by the researcher who most needs it. A rolling window is weaker in spirit (the field exists partly to force periodic review) but strictly better in outcome for a one-person site.

*Trade-off accepted:* a cached copy of the file stays "valid" for up to six months after the site itself is abandoned. Six months rather than a year bounds that.

### `PUBLIC_PAGES` in `constants.ts`

Add `PUBLIC_PAGES` — the canonical list of indexable static routes — and have both `sitemap[.]xml.ts` and `llms[.]txt.ts` read it. Delete `STATIC_ROUTES` from the sitemap route.

*Alternative considered:* derive the list from `Nav.links`, which currently holds the same four paths. Rejected — that ties sitemap correctness to a navigation design decision. The first unlinked page (a landing page, a redirect target) would silently drop out of the sitemap. The lists match today by coincidence, not by rule.

### `llms.txt` is a curated index, not a content dump

H1, blockquote, then H2 sections: **Pages**, **Workbench** (every published artifact, with its summary as the note), **Tools**, **Machine-readable** (sitemap, feed, OpenAPI description).

No `llms-full.txt`. It is not part of the llmstxt.org spec, it would mean rendering every MDX body to text at request time, and the site is small enough that an agent following the index costs a handful of fetches.

Framing this correctly matters more than the file: no major crawler reads `llms.txt`, and the change should not be justified as an SEO win. It is a routing surface for agents that are already reading the site.

### `robots.txt` names AI crawlers as explicit allows

Default `User-agent: *` with `Allow: /`, then named groups — `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Bytespider`, `Meta-ExternalAgent`, `Applebot-Extended` — each allowing all paths, then `Sitemap:`.

Functionally identical to the current three-line file. The point is that the policy becomes a recorded decision with a name attached to it, so reversing it later is an edit rather than a research project. This is also the only lever in the change that AI crawlers actually honour.

## Risks / Trade-offs

- **`public/robots.txt` survives the change and shadows the route** → delete it as its own task, and verify by fetching `/robots.txt` from a production build (`bun run build && bun start`), not from `bun run dev`.
- **`security.txt` never expires in practice** → accepted, bounded to six months; see the decision above.
- **`llms.txt` gets read as an SEO deliverable and under-delivers** → the proposal and this document both state it is not a ranking signal. No SEO claim is made for it anywhere.
- **The `[.]` escaping is easy to get wrong and fails as a silent 404** → each new route gets fetched once in verification; a 404 is the expected symptom of a misnamed file.
- **Named-crawler groups in `robots.txt` go out of date as user-agents are renamed** → low cost: a stale allow in an allow-everything policy is inert, since the `*` group already covers it.
- **CSP** → `rel="manifest"` and `rel="author"` are same-origin links; nothing in `src/lib/csp.ts` needs to change. Confirm rather than assume during implementation.

## Migration Plan

Additive apart from one deletion. Deploy is a normal build; rollback is a revert. The only externally visible removal is `public/robots.txt`, replaced at the same address in the same commit, so there is no window where `/robots.txt` 404s.

# Tool cards

Cards for the small browser utilities, on `/tools` and in the home preview. One MDX file per tool.

- **Location:** `content/tools/<NN>-<slug>.mdx`
- **Slug:** the filename without `.mdx` (e.g. `01-url-inspector`). Internal only — used as a React key. The card links to `href`, not to the slug.
- **Schema:** `toolSchema` in `src/content/schema.ts`
- **Index:** `tools` in `src/content/index.ts`
- **Rendered by:** `src/routes/tools._index.tsx` and the tools section of `src/routes/_index.tsx`
- **Template:** `content/templates/tool.mdx`

## Frontmatter

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `name` | yes | string | Card title. |
| `category` | yes | string | Rendered verbatim into an overline — uppercase by convention (`WEB`, `TIME`, `TEXT`). The home preview prefixes it: `TOOL / WEB`. |
| `description` | yes | string | One sentence, sentence case. |
| `href` | no | string | Site-relative path (e.g. `/tools/url-inspector`) — it goes through a React Router `<Link to>`. Presence flips the card from forthcoming to live. |
| `featured` | no | boolean (default `false`) | Accent background on `/tools`. Ignored by the home preview. |

## Behaviour

- **Ordering:** filename sort, ascending. That is what the `NN-` prefix is for — renumber to reorder. There is no date or explicit order field.
- **Forthcoming vs live:** no `href` → a `FORTHCOMING` chip and no action link. With `href` → a `LOCAL` chip plus an `Open tool →` link.
- **The body is never rendered.** Only frontmatter is read from these files (`import: "frontmatter"`, with no bodies export). Leave the body empty; anything written there is dead weight.
- **Home preview renders every tool** into a `sm:grid-cols-3` grid. Beyond three tools the preview wraps onto a second row — intended or not, check the home page after adding a fourth.
- **Validation:** same rule as artifacts — a missing required field throws at module load and fails the build.

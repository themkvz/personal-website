---
name: workbench-artifact
description: Write, revise, or publish a workbench artifact — the MDX files under content/workbench/. Use when adding a note, investigation, decision record, or reference list to the workbench, picking its lane, or preparing a draft to publish.
---

# Workbench artifact

`content/docs/workbench.md` is the contract: the frontmatter field table, the body shape for each lane, and the publishing steps. Read it before writing frontmatter or body — this file is only the process around it.

## 1. Pick the lane first

The lane is a claim about what kind of knowledge the artifact carries, not about its subject. Decide it before writing a line, because it sets the body's shape.

| Lane | Choose it when |
| --- | --- |
| `building` | Something exists and runs, even roughly. |
| `investigating` | The question is open and still being worked. |
| `deciding` | The choice is made and already applied. |
| `keeping` | The material is worth finding again. |

One subject can yield an artifact in several lanes. When two lanes both fit, the artifact is two artifacts.

## 2. Draft it

Copy `content/templates/workbench.mdx` to `content/workbench/<slug>.mdx`. The filename is the URL and is permanent, so choose the slug as carefully as the title.

Keep `draft: true` while writing. Drafts render in `bun run dev` and 404 in production.

## 3. Writing rules and style

The result should read like a person writing about something they found interesting — not a summary, not a report, not marketing copy. A personal reflection.

### Language level: B1–B2 English

- Use simple, common words. If a shorter word says the same thing, use it. "Use" not "utilize." "Fix" not "remediate." "Try" not "endeavor."
- Keep sentences short. One idea per sentence. If a sentence has more than one comma, split it.
- No jargon unless the topic requires it. When a technical term is needed, use it once and move on — do not explain it in a parenthetical.
- Prefer active voice. "The agent reads the logs" not "the logs are read by the agent."
- Contractions are fine. "It's" not "it is" when the tone fits.

### Voice: personal, honest, grounded

- Write as someone who read or built something and is now thinking out loud about it. Not lecturing. Not selling. Just sharing what was interesting and what it made you think.
- First person is allowed but not required. Use "I" when it adds something — a real opinion, a personal experience. Avoid "I think" as filler before every sentence.
- Say what you actually noticed, not what sounds impressive. "The backup costs almost nothing" is better than "The economic model demonstrates remarkable cost efficiency."
- Name what surprised you. Name what you doubt. Both matter.
- Be direct about trade-offs and limits. If something is missing or weak, say so plainly. "This doesn't cover X" is fine.
- Avoid hedging words that add nothing: "arguably," "somewhat," "it could be said that." Either say it or don't.

### Structure and shape

- Start with context: what is this, where did you find it, why does it matter to you. One or two sentences. Link the source.
- The middle is what you noticed — the parts worth remembering, the parts that connect to your own work or thinking.
- Close the main text with your own take. What does this change? What is still missing? What would you do differently?
- Use headings to break sections, but keep them plain. "Key pieces," "What I noticed," "What's missing" — not clever, not cute.
- Bullet lists for facts and items. Prose for opinions and connections.
- Two to six hundred words total. Longer usually means two artifacts.

### What to avoid

- Corporate tone. No "leveraging synergies" or "driving value."
- Listicle filler. Every bullet should earn its place.
- Restating the source without adding anything. If you have nothing to add, it's a bookmark, not an artifact.
- Flowery openings. Start with the thing, not with "In today's rapidly evolving landscape..."
- Empty conclusions. "Time will tell" is not an insight. Say what you think will happen, or stop.

### Frontmatter voice

- **`title`**: short, specific, lowercase feel. "Notes on self-hosting with CLI agents" not "Comprehensive Guide to Self-Hosting Infrastructure."
- **`summary`**: one sentence, plain language. It should tell the reader what they will find if they click. Write it last, after the body settles.
- **`kind`** (if used): short label, uppercase. Only worth setting if the artifact might be featured on the home page.

### References and copyright

When an artifact uses external sources or third-party material, end it with `## References and copyright`, following `content/docs/workbench.md#references-and-copyright`. Complete the template's source and attribution placeholders before publishing. Otherwise, omit the section entirely, including any no-source notice.

Omit copyright notices for the artifact's original writing. Copyright attribution in this section is for quoted or reused third-party material only.

## 4. Verify before publishing

- `bun run build` — frontmatter is parsed at module load, so an invalid field fails the build with the file and field named. A clean build is the only proof the artifact is well-formed.
- `bun run dev`, then open `/workbench/<slug>` — confirm the lede, the headings, and the topic chips render as intended.

## 5. Publish

Set `publishedAt` to the day of publishing, flip `draft` to `false`, and rebuild. On a later substantive edit add `updatedAt`; a typo fix is not one.

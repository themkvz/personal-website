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

Voice: plain words, short sentences, concrete detail. State what happened and what it cost. Where UI copy or a summary can be a noun phrase, make it one rather than a first-person sentence.

## 3. Verify before publishing

- `bun run build` — frontmatter is parsed at module load, so an invalid field fails the build with the file and field named. A clean build is the only proof the artifact is well-formed.
- `bun run dev`, then open `/workbench/<slug>` — confirm the lede, the headings, and the topic chips render as intended.

## 4. Publish

Set `publishedAt` to the day of publishing, flip `draft` to `false`, and rebuild. On a later substantive edit add `updatedAt`; a typo fix is not one.

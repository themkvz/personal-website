# THEMКVZ — Personal Website Redesign Brief

## 1. Product idea

Personal website should not behave like traditional developer portfolio.

Primary concept:

**Personal digital workbench — living record of software I build, problems I investigate, decisions I make, things I keep, and work I have shipped.**

Site should present professional competence through evidence rather than claims.

Avoid conventional portfolio structure:

* Hero with job title + marketing statement
* My Skills
* My Projects
* Technology logo grid
* Experience counters
* Generic “passionate engineer” copy

Professional identity should emerge through current work, technical thinking, shipped systems, and accumulated notes.

---

# 2. Main goals

## Professional positioning

Site should communicate that Ihor Mukovoz works on:

* frontend and web engineering;
* TypeScript applications;
* software architecture;
* developer tooling;
* product engineering;
* experiments around AI and agent-native software.

These terms should exist naturally in visible content for search engines and visitors, but should not become visual “skills” sections.

## Creative identity

Site should feel like:

* digital workbench;
* technical journal;
* research notebook;
* changelog;
* personal software archive.

Not like SaaS landing page or résumé template.

## Living website

Regular small updates should be part of site.

Publishing should not require writing full articles.

Valid updates:

* new experiment;
* technical decision;
* short investigation;
* bookmark;
* project update;
* changed opinion;
* shipped feature;
* case fragment.

---

# 3. Homepage structure

## 01 — Introduction / Current Direction

Purpose:

Explain who Ihor is, what kind of work appears here, and current technical direction.

Must provide enough semantic content for SEO while avoiding generic portfolio language.

### Draft

**Ihor Mukovoz**

I design and build software for web, with most of my work around TypeScript, frontend architecture, product engineering, and developer tooling.

This site is my workbench: a place for systems I build, technical decisions, experiments, notes, and things worth keeping.

Right now I am particularly interested in software where humans are no longer the only clients — APIs, tools, and products designed to work with AI agents as naturally as they work with user interfaces.

**Current direction → Agent-native software**

### Shorter visual variation

Large visual text can remain:

**Software, systems, experiments.**

Supporting SEO/context text stays underneath:

I’m Ihor Mukovoz, software engineer working primarily with TypeScript, frontend architecture, web applications, developer tooling, and product systems. This site documents what I build, investigate, decide, and ship.

---

# 4. Workbench

Purpose:

Show active professional activity.

Not chronological blog feed.

Organize work by what is happening with it.

## BUILDING

Things currently being implemented.

### Section text

**Building**

Active software, prototypes, tools, and technical experiments.

Example:

**Agent-native SaaS backend**

Exploring application architecture where APIs and agent tools are first-class interfaces alongside traditional UI.

`TypeScript · Hono/Elysia · MCP`

→ Open work

---

## INVESTIGATING

Questions that need exploration before implementation decisions.

### Section text

**Investigating**

Problems, technologies, and ideas that are still being understood.

Example:

**What remains of UI when agents become clients?**

Looking at where graphical interfaces remain essential, where agent interaction can replace workflows, and how applications change when both humans and machines operate them.

→ Read investigation

---

## DECIDING

Architecture and engineering decisions.

Important: show reasoning rather than only final technology choice.

### Section text

**Deciding**

Architecture decisions, rejected alternatives, constraints, and reasons behind technical choices.

Example:

**Backend first or UI first for agent-native products?**

Why I would establish domain operations and machine-accessible contracts before committing to application interfaces.

→ Decision record

---

## KEEPING

Bookmarks, tools, references, ideas, libraries.

Evolution of current Bookmarks section.

### Section text

**Keeping**

Tools, articles, libraries, interfaces, and ideas that were useful enough to keep.

Not everything deserves an article. Some things are worth remembering.

→ Browse collection

---

# 5. Shipped

Purpose:

Main professional proof.

Contains selected production work and case fragments.

Avoid generic project cards.

Each entry should explain:

* context;
* problem;
* important constraint;
* decision;
* implementation;
* result;
* optionally technologies.

### Section intro

**Shipped**

Selected software I have worked on in production.

Less about screenshots and technology lists. More about problems, constraints, engineering decisions, and what eventually reached users.

### Example

**Forex Tester**

Modernizing a long-lived trading product while preserving existing business logic and user workflows.

**Problem**

Legacy architecture made product evolution increasingly difficult.

**Approach**

Incremental modernization instead of high-risk complete rewrite, with explicit boundaries between existing systems and new application architecture.

**Worked on**

Frontend architecture, application migration, product features, performance, and development infrastructure.

→ Inspect case

---

# 6. Log

Purpose:

Make site visibly alive.

Automatic or semi-automatic chronological stream generated from workbench activity.

### Section text

**Log**

Recent changes across workbench.

Small experiments, new notes, updated decisions, bookmarks, project changes, and things shipped.

Example:

03 Sep — Updated architecture notes for agent-native SaaS
31 Aug — Added investigation on UI becoming optional
28 Aug — Added new engineering reference
21 Aug — Compared mobile framework delivery workflows

→ View full log

Log does not require separate content creation. It should mostly be generated from publication/update timestamps of existing artifacts.

---

# 7. Secondary pages

## Workbench

Full searchable/filterable collection.

Possible filters:

`Building / Investigating / Deciding / Keeping / Shipped`

Later:

`Abandoned / Revisited / Learned`

---

## Shipped

Full professional case archive.

This replaces traditional Projects page.

---

## About

Secondary utility page rather than homepage centerpiece.

Contains:

* concise professional background;
* experience timeline;
* current role;
* location if useful;
* areas of expertise;
* contact information;
* résumé/CV.

Suggested introduction:

**About**

I’m Ihor Mukovoz, software engineer focused on frontend architecture, TypeScript applications, and web product development.

Most of my work sits between product and engineering: designing application architecture, evolving existing systems, building interfaces, improving developer workflows, and turning ambiguous product requirements into maintainable software.

This page contains conventional career information. The rest of the site shows the work behind it.

---

# 8. Content model

Prefer single shared content model instead of separate hardcoded systems for blog posts, projects, bookmarks, and experiments.

Conceptually:

Artifact

* title
* slug
* type
* status
* description
* publishedAt
* updatedAt
* tags
* technologies
* content
* related artifacts
* external links

Possible types:

* building
* investigation
* decision
* bookmark
* shipped
* note

Homepage should be composed from this content rather than manually maintained independent sections.

---

# 9. SEO requirements

Creative presentation must not reduce semantic clarity.

## Homepage

Suggested HTML title:

**Ihor Mukovoz — Software Engineer, Web Architecture & Experiments**

Possible alternative:

**Ihor Mukovoz — TypeScript, Frontend Architecture & Software Engineering**

Suggested meta description:

**Personal workbench of Ihor Mukovoz — software engineer working with TypeScript, frontend architecture, web applications, developer tooling, and agent-native software. Explore technical decisions, experiments, notes, and shipped work.**

Homepage must have one clear primary heading containing name.

Professional context should exist as visible HTML text, not only metadata or animation.

---

## Artifact pages

Every substantial investigation, decision, case, or note gets its own permanent URL.

Examples:

`/workbench/agent-native-software`

`/decisions/backend-before-ui`

`/shipped/forex-tester`

`/notes/react-router-framework-mode`

Each page should have:

* unique `<title>`;
* unique meta description;
* meaningful H1;
* publication/update date where relevant;
* crawlable internal links;
* canonical URL;
* semantic article/main structure.

---

## Technical SEO

Required:

* server-rendered or statically rendered primary content;
* semantic HTML;
* crawlable `<a href>` navigation;
* `sitemap.xml`;
* `robots.txt`;
* canonical URLs;
* useful 404;
* correct HTTP status codes;
* Open Graph metadata;
* favicon/site identity;
* fast mobile rendering;
* accessible content;
* Search Console integration.

Structured data can be added where it accurately represents page content.

Likely useful:

* `WebSite`;
* `Person`;
* `Article` / `BlogPosting` for substantial notes;
* `BreadcrumbList` on deeper pages.

Do not create artificial SEO landing pages or keyword-generated content.

---

# 10. Content principles

Every published item should provide at least one of:

**Evidence** — something built or shipped.

**Reasoning** — technical decision and why.

**Discovery** — something learned while investigating.

**Taste** — something considered worth keeping.

Avoid posts created only to maintain publishing cadence.

Avoid generic educational posts unless Ihor adds experience, opinion, experiment, or original technical context.

---

# 11. Visual direction

Prefer:

* editorial layout;
* strong typography;
* visible grid;
* restrained monospace metadata;
* timestamps;
* state/status indicators;
* minimal card usage;
* separators instead of containers everywhere;
* dense but readable information;
* subtle interaction;
* visible relationships between artifacts.

Avoid:

* excessive gradient backgrounds;
* generic glass cards;
* animated technology logos;
* 3D objects without informational purpose;
* large “developer portfolio” hero;
* excessive scroll animation;
* visual effects that hide searchable content.

Design should communicate **working system**, not finished marketing page.

---

# 12. Core navigation

Initial recommendation:

**Index / Workbench / Shipped / About**

Optional utility:

**Search / ⌘K**

Bookmarks should live inside Workbench rather than remain top-level navigation.

---

# 13. Core message

Site should never need to say:

“I am a passionate senior full-stack engineer.”

Visitor should reach that conclusion after seeing:

what I build → what I investigate → how I decide → what I ship.

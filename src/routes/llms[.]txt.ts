import { Discovery, Home, PUBLIC_PAGES, Site } from "~/constants";
import { artifacts, tools } from "~/content";
import { text } from "~/lib/text-response";
import { artifactHref } from "~/lib/workbench-href";

/**
 * The llmstxt.org format: an H1, a blockquote, then H2 sections whose bodies
 * are link lists. A curated index for agents already reading the site — no
 * crawler treats it as a ranking signal, so nothing here is written for one.
 */
function absolute(path: string): string {
  return path.startsWith("http") ? path : `${Site.baseUrl}${path}`;
}

function link(name: string, path: string, note?: string): string {
  const entry = `- [${name}](${absolute(path)})`;
  return note ? `${entry}: ${note}` : entry;
}

function section(heading: string, entries: string[]): string {
  return `## ${heading}\n\n${entries.join("\n")}\n`;
}

export function loader() {
  const document = [
    `# ${Site.name} — ${Site.ownerName}`,
    "",
    `> ${Home.introduction}`,
    "",
    `Every page is an MDX file in the repository, typed at load and compiled with the site. Published under ${Site.baseUrl}.`,
    "",
    section(
      "Pages",
      PUBLIC_PAGES.map((page) => link(page.name, page.path, page.note)),
    ),
    section(
      "Workbench",
      artifacts.map((artifact) =>
        link(artifact.title, artifactHref(artifact.slug), artifact.summary),
      ),
    ),
    section(
      "Tools",
      tools.map((tool) =>
        link(tool.name, tool.href ?? "/tools", tool.description),
      ),
    ),
    section("Machine-readable", [
      link("Sitemap", "/sitemap.xml", "Every indexable page"),
      link("RSS feed", "/feed.xml", "Workbench artifacts, newest first"),
      link("OpenAPI description", "/openapi.json", "The read-only endpoints"),
      link(
        "Security contact",
        Discovery.securityTxtPath,
        "How to report a vulnerability",
      ),
    ]),
  ].join("\n");

  return text(document);
}

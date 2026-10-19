import { Site } from "~/constants";
import { artifacts } from "~/content";
import { artifactHref } from "~/lib/workbench-href";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function loader() {
  const items = artifacts
    .map((artifact) => {
      const link = `${Site.baseUrl}${artifactHref(artifact.slug)}`;
      return `
  <item>
    <title>${escapeXml(artifact.title)}</title>
    <link>${link}</link>
    <guid>${link}</guid>
    <description>${escapeXml(artifact.summary)}</description>
    <pubDate>${new Date(artifact.publishedAt).toUTCString()}</pubDate>
  </item>`;
    })
    .join("");

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${Site.ownerName} | Workbench</title>
  <link>${Site.baseUrl}/workbench</link>
  <description>Implementation notes, open questions, technical decisions, and references.</description>${items}
</channel>
</rss>
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

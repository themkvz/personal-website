import { PUBLIC_PAGES, Site } from "~/constants";
import { artifacts, terms } from "~/content";
import { artifactHref, glossaryHref } from "~/lib/workbench-href";

export function loader() {
  const staticUrls = PUBLIC_PAGES.map(
    (page) => `
  <url>
    <loc>${Site.baseUrl}${page.path}</loc>
  </url>`,
  ).join("");

  const artifactUrls = artifacts
    .map(
      (artifact) => `
  <url>
    <loc>${Site.baseUrl}${artifactHref(artifact.slug)}</loc>
    <lastmod>${artifact.updatedAt ?? artifact.publishedAt}</lastmod>
  </url>`,
    )
    .join("");

  const termUrls = terms
    .map(
      (term) => `
  <url>
    <loc>${Site.baseUrl}${glossaryHref(term.slug)}</loc>${
      term.updatedAt ? `\n    <lastmod>${term.updatedAt}</lastmod>` : ""
    }
  </url>`,
    )
    .join("");

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${artifactUrls}${termUrls}
</urlset>
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

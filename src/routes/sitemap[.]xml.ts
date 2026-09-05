import { Site } from "~/constants";
import { artifacts } from "~/content";
import { artifactHref } from "~/lib/workbench-href";

const STATIC_ROUTES = ["/", "/tools", "/workbench", "/about"];

export function loader() {
  const staticUrls = STATIC_ROUTES.map(
    (route) => `
  <url>
    <loc>${Site.baseUrl}${route}</loc>
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

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${artifactUrls}
</urlset>
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

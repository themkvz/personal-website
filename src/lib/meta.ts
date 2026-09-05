import type { MetaDescriptor } from "react-router";
import { Site } from "~/constants";

type PageMetaInput = {
  title: string;
  description: string;
  /** Absolute path this page is served from. Omit for pages that have no
      canonical address of their own (the 404 view, which answers any URL). */
  path?: string;
  image?: string;
  /** Keep the page out of the index and emit no canonical or og:url. */
  noIndex?: boolean;
};

const FALLBACK_IMAGE = "/hero.webp";

export function pageMeta({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetaInput): MetaDescriptor[] {
  const ogImage = `${Site.baseUrl}${image ?? FALLBACK_IMAGE}`;

  const descriptors: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: Site.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];

  if (noIndex) {
    return [...descriptors, { name: "robots", content: "noindex" }];
  }

  const url = `${Site.baseUrl}${path}`;
  return [
    ...descriptors,
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:url", content: url },
  ];
}

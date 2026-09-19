import type { Lane } from "~/lib/lanes";

export function artifactHref(slug: string): string {
  return `/workbench/${slug}`;
}

export function laneHref(lane: Lane): string {
  return `/workbench?l=${lane}`;
}

export function glossaryHref(slug: string): string {
  return `/glossary/${slug}`;
}

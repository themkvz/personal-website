import type { Artifact } from "~/content";

const RELATED_FALLBACK_LIMIT = 3;

/** Throws when an artifact's `related` names an unknown, draft, repeated, or its own slug. */
export function assertRelated(artifacts: Artifact[]): void {
  const slugs = new Set(artifacts.map((artifact) => artifact.slug));
  for (const artifact of artifacts) {
    const seen = new Set<string>();
    for (const slug of artifact.related ?? []) {
      const problem =
        slug === artifact.slug
          ? "cannot name itself"
          : seen.has(slug)
            ? "is listed twice"
            : !slugs.has(slug)
              ? "is not a published artifact"
              : null;
      if (problem) {
        throw new Error(
          `Invalid frontmatter in /content/workbench/${artifact.slug}.mdx: field "related" — "${slug}" ${problem}`,
        );
      }
      seen.add(slug);
    }
  }
}

/** Declared `related` in order, else up to three by shared topics, then same lane. */
export function relatedArtifacts(
  artifact: Artifact,
  artifacts: Artifact[],
): Artifact[] {
  if (artifact.related && artifact.related.length > 0) {
    return artifact.related.flatMap(
      (slug) => artifacts.find((entry) => entry.slug === slug) ?? [],
    );
  }

  const others = artifacts.filter((entry) => entry.slug !== artifact.slug);
  const topics = new Set(artifact.topics);
  const shared = (entry: Artifact) =>
    (entry.topics ?? []).filter((topic) => topics.has(topic)).length;

  const byTopic = others
    .filter((entry) => shared(entry) > 0)
    .sort((a, b) => shared(b) - shared(a));
  const byLane = others.filter(
    (entry) => entry.lane === artifact.lane && !byTopic.includes(entry),
  );

  return [...byTopic, ...byLane].slice(0, RELATED_FALLBACK_LIMIT);
}

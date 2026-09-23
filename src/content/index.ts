import * as v from "valibot";
import { assertRelated } from "~/content/related";
import {
  type ArtifactFrontmatter,
  artifactSchema,
  type ExperienceFrontmatter,
  experienceSchema,
  type GlossaryFrontmatter,
  glossarySchema,
  type ToolFrontmatter,
  toolSchema,
} from "~/content/schema";
import { LANES, type Lane } from "~/lib/lanes";

function slugFromPath(path: string): string {
  const file = path.split("/").pop();
  if (!file) {
    throw new Error(`Cannot derive a slug from content path: ${path}`);
  }
  return file.replace(/\.mdx$/, "");
}

function parseFrontmatter<TSchema extends v.GenericSchema>(
  schema: TSchema,
  path: string,
  data: unknown,
): v.InferOutput<TSchema> {
  const result = v.safeParse(schema, data);
  if (!result.success) {
    const issue = result.issues[0];
    const field = issue.path?.map((p) => String(p.key)).join(".") || "(root)";
    throw new Error(
      `Invalid frontmatter in ${path}: field "${field}" — ${issue.message}`,
    );
  }
  return result.output;
}

export type Artifact = ArtifactFrontmatter & { slug: string };

const artifactFrontmatter = import.meta.glob("/content/workbench/*.mdx", {
  eager: true,
  import: "frontmatter",
});

const allArtifacts: Artifact[] = Object.entries(artifactFrontmatter).map(
  ([path, frontmatter]) => ({
    ...parseFrontmatter(artifactSchema, path, frontmatter),
    slug: slugFromPath(path),
  }),
);

export const artifacts: Artifact[] = allArtifacts
  .filter((artifact) => (import.meta.env.PROD ? !artifact.draft : true))
  .sort((a, b) => {
    if (a.publishedAt !== b.publishedAt) {
      return a.publishedAt < b.publishedAt ? 1 : -1;
    }
    return a.slug < b.slug ? -1 : 1;
  });

assertRelated(artifacts);

export function artifactsByLane(lane: Lane): Artifact[] {
  return artifacts.filter((artifact) => artifact.lane === lane);
}

export function groupArtifactsByLane(): Record<Lane, Artifact[]> {
  return Object.fromEntries(
    LANES.map((lane) => [lane, artifactsByLane(lane)]),
  ) as Record<Lane, Artifact[]>;
}

export type ExperienceEntry = ExperienceFrontmatter & { slug: string };

const experienceFrontmatter = import.meta.glob("/content/experience/*.mdx", {
  eager: true,
  import: "frontmatter",
});

export const experience: ExperienceEntry[] = Object.entries(
  experienceFrontmatter,
)
  .map(([path, frontmatter]) => ({
    ...parseFrontmatter(experienceSchema, path, frontmatter),
    slug: slugFromPath(path),
  }))
  .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

const experienceModules = import.meta.glob("/content/experience/*.mdx", {
  eager: true,
});

export const experienceBodies: Record<string, React.ComponentType> =
  Object.fromEntries(
    Object.entries(experienceModules).map(([path, mod]) => [
      slugFromPath(path),
      (mod as { default: React.ComponentType }).default,
    ]),
  );

export type ToolEntry = ToolFrontmatter & { slug: string };

const toolFrontmatter = import.meta.glob("/content/tools/*.mdx", {
  eager: true,
  import: "frontmatter",
});

export const tools: ToolEntry[] = Object.keys(toolFrontmatter)
  .sort()
  .map((path) => ({
    ...parseFrontmatter(toolSchema, path, toolFrontmatter[path]),
    slug: slugFromPath(path),
  }));

export type GlossaryTerm = GlossaryFrontmatter & { slug: string };

const glossaryFrontmatter = import.meta.glob("/content/glossary/*.mdx", {
  eager: true,
  import: "frontmatter",
});

const allTerms: GlossaryTerm[] = Object.entries(glossaryFrontmatter).map(
  ([path, frontmatter]) => ({
    ...parseFrontmatter(glossarySchema, path, frontmatter),
    slug: slugFromPath(path),
  }),
);

export const terms: GlossaryTerm[] = allTerms
  .filter((term) => (import.meta.env.PROD ? !term.draft : true))
  .sort((a, b) => {
    const byTerm = a.term.localeCompare(b.term, undefined, {
      sensitivity: "base",
    });
    if (byTerm !== 0) return byTerm;
    return a.slug < b.slug ? -1 : 1;
  });

export const termSlugs = new Set(terms.map((term) => term.slug));
for (const term of terms) {
  for (const slug of term.related ?? []) {
    if (!termSlugs.has(slug)) {
      throw new Error(
        `Invalid frontmatter in /content/glossary/${term.slug}.mdx: field "related" — unknown term "${slug}"`,
      );
    }
  }
}

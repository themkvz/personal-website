import * as v from "valibot";
import { LANES } from "~/lib/lanes";

const isoDate = v.pipe(
  v.string(),
  v.isoDate("Must be an ISO-8601 date (YYYY-MM-DD)."),
);

export const artifactSchema = v.object({
  title: v.string(),
  lane: v.picklist(LANES),
  summary: v.string(),
  publishedAt: isoDate,
  updatedAt: v.optional(isoDate),
  topics: v.optional(v.array(v.string())),
  kind: v.optional(v.string()),
  featured: v.optional(v.boolean(), false),
  draft: v.optional(v.boolean(), false),
});

export type ArtifactFrontmatter = v.InferOutput<typeof artifactSchema>;

export const experienceSchema = v.object({
  organisation: v.string(),
  role: v.string(),
  startDate: isoDate,
  endDate: v.optional(isoDate),
  location: v.optional(v.string()),
  url: v.optional(v.string()),
});

export type ExperienceFrontmatter = v.InferOutput<typeof experienceSchema>;

export const toolSchema = v.object({
  name: v.string(),
  category: v.string(),
  description: v.string(),
  href: v.optional(v.string()),
  featured: v.optional(v.boolean(), false),
});

export type ToolFrontmatter = v.InferOutput<typeof toolSchema>;

export const glossarySchema = v.object({
  term: v.string(),
  summary: v.string(),
  aka: v.optional(v.array(v.string())),
  related: v.optional(v.array(v.string())),
  updatedAt: v.optional(isoDate),
  draft: v.optional(v.boolean(), false),
});

export type GlossaryFrontmatter = v.InferOutput<typeof glossarySchema>;

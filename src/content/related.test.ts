import { expect, test } from "bun:test";
import type { Artifact } from "~/content";
import { assertRelated, relatedArtifacts } from "./related";

function artifact(slug: string, fields: Partial<Artifact> = {}): Artifact {
  return {
    slug,
    title: slug,
    lane: "building",
    summary: "",
    publishedAt: "2026-01-01",
    featured: false,
    draft: false,
    ...fields,
  };
}

const slugs = (list: Artifact[]) => list.map((entry) => entry.slug);

test("declared related resolve in declared order with no fallback", () => {
  const a = artifact("a", { related: ["c", "b"], topics: ["x"] });
  const all = [
    a,
    artifact("b"),
    artifact("c"),
    artifact("d", { topics: ["x"] }),
  ];
  expect(slugs(relatedArtifacts(a, all))).toEqual(["c", "b"]);
});

test("fallback ranks by shared topics, ties in index order, capped at three", () => {
  const a = artifact("a", { topics: ["x", "y"], lane: "deciding" });
  const all = [
    artifact("one", { topics: ["x"] }),
    a,
    artifact("two", { topics: ["x", "y"] }),
    artifact("three", { topics: ["y"] }),
    artifact("four", { topics: ["x"] }),
  ];
  expect(slugs(relatedArtifacts(a, all))).toEqual(["two", "one", "three"]);
});

test("fallback fills from the same lane in index order", () => {
  const a = artifact("a", { topics: ["x"], lane: "keeping" });
  const all = [
    artifact("lane-1", { lane: "keeping" }),
    a,
    artifact("other-lane", { lane: "building" }),
    artifact("topic", { topics: ["x"], lane: "keeping" }),
    artifact("lane-2", { lane: "keeping" }),
    artifact("lane-3", { lane: "keeping" }),
  ];
  expect(slugs(relatedArtifacts(a, all))).toEqual([
    "topic",
    "lane-1",
    "lane-2",
  ]);
});

test("nothing to relate yields an empty list", () => {
  const a = artifact("a", { topics: ["x"], lane: "keeping", related: [] });
  expect(relatedArtifacts(a, [a, artifact("b", { topics: ["y"] })])).toEqual(
    [],
  );
});

test("assertRelated accepts slugs that resolve", () => {
  expect(() =>
    assertRelated([artifact("a", { related: ["b"] }), artifact("b")]),
  ).not.toThrow();
});

test("assertRelated rejects unknown (or draft-filtered) slugs", () => {
  expect(() =>
    assertRelated([artifact("a", { related: ["missing"] })]),
  ).toThrow(
    'Invalid frontmatter in /content/workbench/a.mdx: field "related" — "missing" is not a published artifact',
  );
});

test("assertRelated rejects self and duplicate slugs", () => {
  expect(() => assertRelated([artifact("a", { related: ["a"] })])).toThrow(
    '"a" cannot name itself',
  );
  expect(() =>
    assertRelated([artifact("a", { related: ["b", "b"] }), artifact("b")]),
  ).toThrow('"b" is listed twice');
});

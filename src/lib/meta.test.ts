import { expect, test } from "bun:test";
import { pageMeta } from "./meta";

const base = { title: "T", description: "D", path: "/x" };

const property = (meta: ReturnType<typeof pageMeta>, name: string) => {
  const descriptor = meta.find((d) => "property" in d && d.property === name);
  return descriptor && "content" in descriptor ? descriptor.content : undefined;
};

test("non-article pages are websites with no article properties", () => {
  const meta = pageMeta(base);
  expect(property(meta, "og:type")).toBe("website");
  expect(
    meta.some(
      (d) => "property" in d && String(d.property).startsWith("article:"),
    ),
  ).toBe(false);
});

test("article pages carry published and modified times", () => {
  const meta = pageMeta({
    ...base,
    article: { publishedTime: "2026-01-01", modifiedTime: "2026-02-01" },
  });
  expect(property(meta, "og:type")).toBe("article");
  expect(property(meta, "article:published_time")).toBe("2026-01-01");
  expect(property(meta, "article:modified_time")).toBe("2026-02-01");
});

test("article without an update date omits modified time", () => {
  const meta = pageMeta({ ...base, article: { publishedTime: "2026-01-01" } });
  expect(property(meta, "article:modified_time")).toBeUndefined();
});

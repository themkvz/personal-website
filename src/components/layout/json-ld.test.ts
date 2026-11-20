import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JsonLd } from "./json-ld";

const render = (data: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(JsonLd, { data }));

const payload = (html: string) =>
  html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");

test("a value containing a closing script tag cannot end the element", () => {
  const html = render({ name: "a</script><b>" });
  expect(html.match(/<\/script>/g)).toHaveLength(1);
  expect(html.endsWith("</script>")).toBe(true);
});

test("escaped output parses back to the original data", () => {
  const data = { "@type": "Article", headline: "x < y </script>" };
  expect(JSON.parse(payload(render(data)))).toEqual({
    "@context": "https://schema.org",
    ...data,
  });
});

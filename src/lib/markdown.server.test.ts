import { expect, test } from "bun:test";
import { acceptsMarkdown, pageMarkdown } from "./markdown.server";

const origin = process.env.MARKDOWN_TEST_ORIGIN;

test.skipIf(!origin)(
  "HTTP negotiation includes the complete lazy article",
  async () => {
    for (const path of [
      "/",
      "/about",
      "/tools",
      "/workbench",
      "/workbench/how-to-review-code",
      "/missing-markdown-test-page",
    ]) {
      const response = await fetch(`${origin}${path}`, {
        headers: { Accept: "text/markdown" },
      });
      expect(response.status).toBe(
        path === "/missing-markdown-test-page" ? 404 : 200,
      );
      expect(response.headers.get("content-type")).toContain("text/markdown");
      expect(response.headers.get("vary")?.toLowerCase()).toContain("accept");
      const body = await response.text();
      expect(body).toMatch(/^# /m);
      expect(body).not.toMatch(/<script|<html|<style/);
      if (path === "/workbench/how-to-review-code")
        expect(body).toContain("## What's missing");
    }
    for (const accept of [
      "*/*",
      "text/html",
      "text/markdown;q=0",
      "text/html,text/markdown;q=0.5",
    ]) {
      const response = await fetch(`${origin}/`, {
        headers: { Accept: accept },
      });
      expect(response.headers.get("content-type")).toContain("text/html");
      expect(response.headers.get("vary")?.toLowerCase()).toContain("accept");
    }
    const head = await fetch(`${origin}/`, {
      method: "HEAD",
      headers: { Accept: "text/markdown" },
    });
    expect(head.headers.get("content-type")).toContain("text/markdown");
    expect(await head.text()).toBe("");
    const redirect = await fetch(`${origin}/bookmarks`, {
      redirect: "manual",
      headers: { Accept: "text/markdown" },
    });
    expect(redirect.status).toBe(301);
    expect(redirect.headers.get("location")).toBe("/workbench");
    const resource = await fetch(`${origin}/llms.txt`, {
      headers: { Accept: "text/markdown" },
    });
    expect(resource.headers.get("content-type")).toContain("text/plain");
  },
  30_000,
);

test("Markdown requires an explicit, acceptable preference", () => {
  for (const accept of [
    null,
    "*/*",
    "text/*",
    "text/html",
    "text/markdown;q=0",
    "text/markdown;q=invalid",
    "text/markdown;q=0.5,text/html",
    "text/markdown;q=0.5,*/*",
  ]) {
    expect(acceptsMarkdown(accept)).toBe(false);
  }
  for (const accept of [
    "text/markdown",
    "Text/Markdown; charset=utf-8",
    "text/html, text/markdown",
    "text/markdown;q=0.8,text/html;q=0.5",
    "text/markdown;q=0.8,text/html;q=0,*/*",
  ]) {
    expect(acceptsMarkdown(accept)).toBe(true);
  }
});

test("Markdown preserves content structure and excludes document chrome", () => {
  const markdown =
    pageMarkdown(`<!doctype html><html><head><title>Chrome</title></head><body>
    <div><header><a href="/">Navigation</a></header><main>
      <h1>Article &amp; notes</h1><p>Read <a href="/about">about</a>.</p>
      <ul><li>First item</li></ul><pre><code class="language-js">const x = 1;</code></pre>
      <script>secret()</script><style>.hidden {}</style><nav>Breadcrumb</nav>
      <button>Control</button><svg><title>Icon</title></svg>
      <h2>Final section</h2><p>Complete body.</p>
    </main><footer>Footer</footer></div><script>hydration()</script>
  </body></html>`);
  expect(markdown).toContain("# Article & notes");
  expect(markdown).toContain("[about](/about)");
  expect(markdown).toMatch(/- +First item/);
  expect(markdown).toContain("```js\nconst x = 1;\n```");
  expect(markdown).toContain("## Final section\n\nComplete body.");
  expect(markdown).not.toMatch(
    /Chrome|Navigation|secret|hidden|Breadcrumb|Control|Icon|Footer|hydration|<\/?[a-z]/,
  );
});

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// MDX bodies are static, so they render to HTML once on the server and ship
// as loader data — no body JavaScript reaches the client bundle.
function renderBodies(
  modules: Record<string, unknown>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, Body]) => [
      path.replace(/^.*\/|\.mdx$/g, ""),
      renderToStaticMarkup(createElement(Body as React.ComponentType)),
    ]),
  );
}

export const artifactHtml = renderBodies(
  import.meta.glob("/content/workbench/*.mdx", {
    eager: true,
    import: "default",
  }),
);

export const termHtml = renderBodies(
  import.meta.glob("/content/glossary/*.mdx", {
    eager: true,
    import: "default",
  }),
);

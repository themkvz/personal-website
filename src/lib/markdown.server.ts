import TurndownService from "turndown";

export function acceptsMarkdown(accept: string | null): boolean {
  const ranges = (accept ?? "")
    .toLowerCase()
    .split(",")
    .map((range) => {
      const [type, ...parameters] = range.trim().split(";");
      const quality = parameters.find((parameter) =>
        parameter.trim().startsWith("q="),
      );
      const value = quality ? Number(quality.trim().slice(2)) : 1;
      return {
        type: type.trim(),
        quality: Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0,
      };
    });
  const markdown = ranges.find((range) => range.type === "text/markdown");
  const html =
    ranges.find((range) => range.type === "text/html") ??
    ranges.find((range) => range.type === "text/*") ??
    ranges.find((range) => range.type === "*/*");
  return (
    !!markdown &&
    markdown.quality > 0 &&
    markdown.quality >= (html?.quality ?? 0)
  );
}

const converter = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

converter.addRule("pageContent", {
  filter(node) {
    if (
      ["SCRIPT", "STYLE", "NAV", "SVG", "BUTTON"].includes(
        node.nodeName.toUpperCase(),
      )
    )
      return true;
    // Keep the main content and its containing elements, excluding site chrome.
    for (
      let parent: HTMLElement | null = node;
      parent;
      parent = parent.parentElement
    ) {
      if (parent.nodeName === "MAIN") return false;
    }
    return !node.querySelector("main");
  },
  replacement: () => "",
});

export function pageMarkdown(html: string): string {
  return `${converter.turndown(html)}\n`;
}

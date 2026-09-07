import { Site } from "~/constants";
import { text } from "~/lib/text-response";

/**
 * Named here so the policy is a recorded decision with a name attached rather
 * than the absence of one. Every group is an allow today; reversing that for
 * any single crawler is then an edit, not a research project. This is also the
 * only file in the set that AI crawlers actually honour.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "Applebot-Extended",
];

function group(userAgent: string): string {
  return `User-agent: ${userAgent}\nContent-Signal: ai-train=yes, search=yes, ai-input=yes\nAllow: /\n`;
}

export function loader() {
  const document = [
    group("*"),
    ...AI_CRAWLERS.map(group),
    `Sitemap: ${Site.baseUrl}/sitemap.xml\n`,
  ].join("\n");

  return text(document);
}

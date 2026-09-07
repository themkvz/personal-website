import { Discovery, Home, Site } from "~/constants";
import { artifacts } from "~/content";
import { text } from "~/lib/text-response";

/**
 * Dated by the newest thing actually published, in the humans.txt convention's
 * YYYY/MM/DD, so the credit file cannot claim an update that never happened.
 */
function lastUpdate(): string | undefined {
  return artifacts
    .map((artifact) => artifact.updatedAt ?? artifact.publishedAt)
    .sort()
    .at(-1)
    ?.replaceAll("-", "/");
}

export function loader() {
  const updated = lastUpdate();

  const lines = [
    "//* TEAM *//",
    "",
    `  Developer: ${Site.ownerName}`,
    `  Role: ${Home.profileRole}`,
    `  Contact: ${Site.publicEmail}`,
    `  Site: ${Site.baseUrl}`,
    `  Location: ${Site.location}`,
    "",
    "//* SITE *//",
    "",
    ...(updated ? [`  Last update: ${updated}`] : []),
    "  Standards: HTML5, CSS3",
    `  Components: ${Discovery.stack.join(", ")}`,
    "  Content: MDX files in the repository — no database, no CMS",
  ];

  return text(`${lines.join("\n")}\n`);
}

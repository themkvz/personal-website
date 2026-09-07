import { Discovery, Site } from "~/constants";
import { text } from "~/lib/text-response";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * RFC 9116. `Expires` is computed per request rather than written down: a
 * hardcoded date is a file that silently goes stale, and RFC 9116 tells the
 * researcher who most needs it to distrust an expired file.
 */
export function loader() {
  const expires = new Date(
    Date.now() + Discovery.securityExpiryDays * DAY_MS,
  ).toISOString();

  return text(
    `${[
      `Contact: mailto:${Site.publicEmail}`,
      `Expires: ${expires}`,
      `Canonical: ${Site.baseUrl}${Discovery.securityTxtPath}`,
      `Preferred-Languages: ${Discovery.preferredLanguages}`,
    ].join("\n")}\n`,
  );
}

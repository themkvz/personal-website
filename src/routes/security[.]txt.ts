import { redirect } from "react-router";
import { Discovery, Site } from "~/constants";

/**
 * RFC 9116 permits the pre-standard top-level address only as a redirect to
 * the well-known path, so there is one file rather than two that can diverge.
 */
export function loader() {
  return redirect(`${Site.baseUrl}${Discovery.securityTxtPath}`, 301);
}

import { userContext } from "~/context/user";
import { getFingerprint } from "~/lib/fingerprint";
import { getServerAnalytics } from "~/lib/openpanel/getOpenPanel";
import type { Route } from "../+types/root";

export const identityMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const fingerprint = await getFingerprint(request);

  context.set(userContext, {
    fingerprint,
    analytics: getServerAnalytics(request, fingerprint),
  });

  // Responses carry this visitor's feature assignments, so a shared cache must
  // not hand one visitor's variant to the next.
  const response = await next();
  response.headers.set("Cache-Control", "private, no-cache");
  return response;
};

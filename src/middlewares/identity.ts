import { userContext } from "~/context/user";
import { getFingerprint } from "~/lib/fingerprint";
import { getServerAnalytics } from "~/lib/openpanel/getOpenPanel";
import type { Route } from "../+types/root";

export const identityMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  const fingerprint = await getFingerprint(request);

  context.set(userContext, {
    fingerprint,
    analytics: getServerAnalytics(request, fingerprint),
  });
};

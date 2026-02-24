import { userContext } from "~/context/user";
import { getFingerprint } from "~/lib/fingerprint";
import { identifyUser } from "~/lib/openpanel/getOpenPanel";
import type { Route } from "../+types/root";

export const identityMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  const fingerprint = await getFingerprint(request);

  void identifyUser(fingerprint, {
    fingerprint,
  });

  context.set(userContext, {
    fingerprint,
  });
};

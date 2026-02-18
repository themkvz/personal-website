import { userContext } from "~/context/user";
import { getFingerprint } from "~/lib/fingerprint";
import type { Route } from "../+types/root";

export const identityMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  const fingerprint = await getFingerprint(request);

  context.set(userContext, {
    fingerprint,
  });
};

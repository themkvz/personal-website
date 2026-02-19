import type { Route } from "../../.react-router/types/src/+types";
import { userContext } from "../context/user";
import { getFingerprint } from "../lib/fingerprint";

export const identityMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  const fingerprint = await getFingerprint(request);

  context.set(userContext, {
    fingerprint,
  });
};

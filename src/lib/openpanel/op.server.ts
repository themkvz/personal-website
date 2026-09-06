import { OpenPanel } from "@openpanel/sdk";
import { env } from "~/env.server";
import { getClientInfo } from "~/lib/client-info";

/**
 * Builds a request-scoped OpenPanel client.
 *
 * The SDK keeps `profileId`, `deviceId` and `sessionId` on the instance, so a
 * module-level singleton would let one in-flight request attribute another
 * request's events. Construction is just an `Api` wrapper — cheap enough to do
 * per request.
 *
 * OpenPanel derives device, session and geo from the ingesting connection.
 * Without the two header overrides below every server-side event would carry
 * the container's IP and user agent, landing visitors in a session belonging to
 * the datacenter rather than their own.
 */
export function getServerOp(request: Request) {
  const op = new OpenPanel({
    clientId: env.VITE_OP_CLIENT_ID,
    clientSecret: env.OP_CLIENT_SECRET,
    apiUrl: env.VITE_OP_API_URL,
  });

  const { ip, userAgent } = getClientInfo(request);
  if (ip) op.api.addHeader("x-client-ip", ip);
  if (userAgent) op.api.addHeader("user-agent", userAgent);

  return op;
}

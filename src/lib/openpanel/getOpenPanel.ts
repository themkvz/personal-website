import type { IdentifyPayload, TrackProperties } from "@openpanel/sdk";
import { op } from "~/lib/openpanel/op.server";

export async function trackEvent(name: string, properties?: TrackProperties) {
  return op.track(name, properties);
}

export async function identifyUser(
  id: string,
  properties?: IdentifyPayload["properties"],
) {
  return op.identify({ profileId: id, properties });
}

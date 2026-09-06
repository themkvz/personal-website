import type {
  IdentifyPayload,
  OpenPanel,
  TrackProperties,
} from "@openpanel/sdk";
import type { TrackEvent } from "~/lib/openpanel/events";
import { getServerOp } from "~/lib/openpanel/op.server";

export type EventProperties = Omit<TrackProperties, "profileId">;

export interface ServerAnalytics {
  track(name: TrackEvent, properties?: EventProperties): Promise<unknown>;
  identify(properties?: IdentifyPayload["properties"]): Promise<unknown>;
}

/**
 * Binds a request-scoped client to one visitor. `op` is passed in rather than
 * built here so tests can drive it without env vars or a network.
 */
export function createServerAnalytics(
  op: OpenPanel,
  profileId: string,
): ServerAnalytics {
  return {
    track(name, properties) {
      return op.track(name, { ...properties, profileId });
    },
    /**
     * `op.identify()` drops any payload holding only a profile id (its
     * `Object.keys(payload).length > 1` guard), so an identify with no extra
     * traits would silently no-op. `send()` has no such guard.
     */
    identify(properties) {
      return op.send({ type: "identify", payload: { profileId, properties } });
    },
  };
}

export function getServerAnalytics(
  request: Request,
  profileId: string,
): ServerAnalytics {
  return createServerAnalytics(getServerOp(request), profileId);
}

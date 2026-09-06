import type { IdentifyPayload, TrackProperties } from "@openpanel/web";
import { useCallback } from "react";
import type { TrackEvent } from "~/lib/openpanel/events";

/**
 * Loads the browser client on demand. The import stays dynamic — and therefore
 * outside `op.client.ts` — so constructing the singleton, and the SDK it pulls
 * in, stay out of the initial bundle.
 */
const getOp = () => import("~/lib/openpanel/op.client").then(({ op }) => op);

export function useTrack() {
  return useCallback(
    async (name: TrackEvent, properties?: TrackProperties) =>
      (await getOp()).track(name, properties),
    [],
  );
}

/**
 * Identifies the visitor and merges the given properties into their profile.
 *
 * OpenPanel deep-merges an identify's properties, so each call sends only what
 * it knows — callers need not accumulate, and two calls writing different keys
 * cannot clobber each other whatever order they arrive in.
 *
 * Never rejects: analytics is best effort.
 */
export async function identifyVisitor(
  profileId: string,
  properties: IdentifyPayload["properties"],
): Promise<void> {
  try {
    await (await getOp()).identify({ profileId, properties });
  } catch {
    // Blocked, offline, or refused.
  }
}

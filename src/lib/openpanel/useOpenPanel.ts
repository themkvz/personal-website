import type { IdentifyPayload, TrackProperties } from "@openpanel/web";
import { useCallback } from "react";
import type { TrackEvent } from "~/lib/openpanel/events";

const client = () => import("~/lib/openpanel/op.client").then(({ op }) => op);

export function useTrack() {
  return useCallback(
    async (name: TrackEvent, properties?: TrackProperties) =>
      (await client()).track(name, properties),
    [],
  );
}

export function useIdentify() {
  return useCallback(
    async (payload: IdentifyPayload) => (await client()).identify(payload),
    [],
  );
}

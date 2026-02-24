import type { OpenPanel } from "@openpanel/web";
import { useCallback } from "react";

type TrackFn = OpenPanel["track"];
type IdentifyFn = OpenPanel["identify"];

export function useTrack() {
  return useCallback<TrackFn>(async (name, properties) => {
    return import("~/lib/openpanel/op.client").then(({ op }) => {
      console.log("start tracking", name, properties);

      op.track(name, properties);
    });
  }, []);
}

export function useIdentify() {
  return useCallback<IdentifyFn>(async (payload) => {
    return import("~/lib/openpanel/op.client").then(({ op }) => {
      op.identify(payload);
    });
  }, []);
}

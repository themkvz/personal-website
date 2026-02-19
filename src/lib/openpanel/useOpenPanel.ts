import type { OpenPanel } from "@openpanel/web";
import { useCallback } from "react";
import { op } from "~/lib/openpanel/op.client";

type TrackFn = OpenPanel["track"];
type IdentifyFn = OpenPanel["identify"];

export function useTrack() {
  return useCallback<TrackFn>((name, properties) => {
    return op.track(name, properties);
  }, []);
}

export function useIdentify() {
  return useCallback<IdentifyFn>((payload) => {
    return op.identify(payload);
  }, []);
}

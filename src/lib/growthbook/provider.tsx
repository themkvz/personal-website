import { type FeatureApiResponse, GrowthBook } from "@growthbook/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useMemo } from "react";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { useTrack } from "~/lib/openpanel/useOpenPanel";

/**
 * Shares the root loader's feature snapshot with the tree.
 *
 * Built synchronously during render, so server rendering and hydration resolve
 * every feature to the same value with nothing to swap afterwards. Components
 * below read it with the SDK's ordinary `useFeatureValue` / `useFeatureIsOn`.
 */
export function ExperimentProvider({
  payload,
  fingerprint,
  children,
}: {
  payload: FeatureApiResponse;
  fingerprint: string;
  children: React.ReactNode;
}) {
  const track = useTrack();

  const growthbook = useMemo(() => {
    const gb = new GrowthBook({
      attributes: { id: fingerprint },
      trackingCallback: (experiment, result) => {
        // Server renders must not report: the visitor may never receive the
        // page, and the browser reports the same assignment anyway.
        if (typeof window === "undefined") return;

        track(TRACK_EVENTS.EXPERIMENT_VIEWED, {
          feature_key: result.featureId,
          experiment_id: experiment.key,
          variation_id: result.variationId,
          variation_key: result.key,
        });
      },
    });
    // `streaming: false` keeps the browser off GrowthBook entirely — it
    // evaluates this payload and never fetches. The instance also dedupes its
    // own tracking callback, so rerenders and navigation report once.
    return gb.initSync({ payload, streaming: false });
  }, [payload, fingerprint, track]);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}

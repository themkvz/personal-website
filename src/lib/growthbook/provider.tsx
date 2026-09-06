import { type FeatureApiResponse, GrowthBook } from "@growthbook/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useMemo } from "react";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { identifyVisitor, useTrack } from "~/lib/openpanel/useOpenPanel";

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
      // Reports as GrowthBook's guide does: from the callback, as the
      // assignment is evaluated. That means a render React later throws away
      // can still report — the alternative, draining a queue from an effect,
      // silently loses consumers that mount after the provider's last render,
      // and a missed exposure is worse than a spare one.
      trackingCallback: (experiment, result) => {
        // Server renders never report: the visitor may not receive the page,
        // and the browser reports the same assignment on hydration.
        if (typeof window === "undefined") return;

        // Identify first so the exposure cannot land on a previously
        // identified profile. Both calls await the same cached module import,
        // so this one's continuation runs first and sets the profile id before
        // the event goes out. One property per experiment: a shared "current
        // variant" field would be clobbered by the next experiment this
        // visitor is bucketed into. That property is a mutable index for
        // segmenting reports; the event below is the record.
        void identifyVisitor(fingerprint, {
          [`exp_${experiment.key}`]: result.key,
        });
        void track(TRACK_EVENTS.EXPERIMENT_VIEWED, {
          feature_key: result.featureId,
          experiment_id: experiment.key,
          variation_id: result.variationId,
          variation_key: result.key,
          // Best effort: a blocked send must not become an unhandled rejection.
        }).catch(() => undefined);
      },
    });
    // `streaming: false` keeps the browser off GrowthBook entirely — it
    // evaluates this payload and never fetches. The instance fires the callback
    // once per experiment, so rerenders and navigation report once.
    return gb.initSync({ payload, streaming: false });
  }, [payload, fingerprint, track]);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}

import { FeaturevisorProvider } from "@featurevisor/react";
import { createFeaturevisor } from "@featurevisor/sdk";
import { createContext, useMemo, useRef } from "react";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { identifyVisitor, useTrack } from "~/lib/openpanel/useOpenPanel";
import defaultDatafile from "./datafile.json";

export interface ExperimentExposure {
  key: string;
  variationId: number;
  variationKey: string;
}

export const ExposureContext = createContext<
  (exposure: ExperimentExposure) => void
>(() => undefined);

export function createExposureReporter({
  fingerprint,
  identify,
  track,
  seen = new Set<string>(),
}: {
  fingerprint: string;
  identify: (profileId: string, properties: Record<string, unknown>) => unknown;
  track: ReturnType<typeof useTrack>;
  seen?: Set<string>;
}) {
  return ({ key, variationId, variationKey }: ExperimentExposure) => {
    if (!fingerprint) return;
    const dedupeKey = `${fingerprint}:${key}:${variationId}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    void identify(fingerprint, { [`exp_${key}`]: variationKey });
    void track(TRACK_EVENTS.EXPERIMENT_VIEWED, {
      feature_key: key,
      experiment_id: key,
      variation_id: variationId,
      variation_key: variationKey,
    }).catch(() => undefined);
  };
}

export function ExperimentProvider({
  fingerprint,
  children,
}: {
  fingerprint: string;
  children: React.ReactNode;
}) {
  const track = useTrack();
  const seenExposuresRef = useRef<Set<string>>(new Set());

  const instance = useMemo(
    () =>
      createFeaturevisor({
        datafile: defaultDatafile as unknown as NonNullable<
          Parameters<typeof createFeaturevisor>[0]
        >["datafile"],
        context: { id: fingerprint },
        logLevel: import.meta.env.DEV ? "info" : "warn",
      }),
    [fingerprint],
  );

  const reportExposure = useMemo(
    () =>
      createExposureReporter({
        fingerprint,
        identify: identifyVisitor,
        track,
        seen: seenExposuresRef.current,
      }),
    [fingerprint, track],
  );

  return (
    <ExposureContext value={reportExposure}>
      <FeaturevisorProvider instance={instance}>
        {children}
      </FeaturevisorProvider>
    </ExposureContext>
  );
}

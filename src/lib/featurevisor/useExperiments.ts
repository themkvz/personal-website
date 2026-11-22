import { useSdk } from "@featurevisor/react";
import type { createFeaturevisor } from "@featurevisor/sdk";
import { use, useEffect } from "react";
import { type ExperimentExposure, ExposureContext } from "./provider";

type FeaturevisorInstance = ReturnType<typeof createFeaturevisor>;

export interface ExperimentDefinition<V = unknown> {
  readonly key: string;
  readonly fallback: V;
  readonly variations: Readonly<
    Record<string, { readonly id: number; readonly value: V }>
  >;
}

export const EXPERIMENTS = {
  FOOTER_BADGE: {
    key: "footer-badge",
    fallback: false,
    variations: {
      control: { id: 0, value: false },
      treatment: { id: 1, value: true },
    },
  },
} as const satisfies Record<string, ExperimentDefinition>;

const TRACKED_REASONS = new Set(["allocated", "rule", "sticky"]);

export function resolveExperimentEvaluation<V>(
  sdk: FeaturevisorInstance | undefined,
  experiment: ExperimentDefinition<V>,
): { value: V; exposure: ExperimentExposure | null } {
  if (!sdk) return { value: experiment.fallback, exposure: null };

  const evaluation = sdk.evaluateVariation(experiment.key);
  const variationKey = evaluation.variationValue ?? evaluation.variation?.value;

  if (
    TRACKED_REASONS.has(evaluation.reason) &&
    typeof variationKey === "string" &&
    Object.hasOwn(experiment.variations, variationKey)
  ) {
    const matched = experiment.variations[variationKey];
    return {
      value: matched.value,
      exposure: {
        key: experiment.key,
        variationId: matched.id,
        variationKey,
      },
    };
  }

  return { value: experiment.fallback, exposure: null };
}

export function useExperimentValue<V>(experiment: ExperimentDefinition<V>): V {
  const sdk = useSdk();
  const reportExposure = use(ExposureContext);
  const { value, exposure } = resolveExperimentEvaluation(sdk, experiment);
  const exposureKey = exposure?.key;
  const variationId = exposure?.variationId;
  const variationKey = exposure?.variationKey;

  useEffect(() => {
    if (exposureKey && variationId !== undefined && variationKey) {
      reportExposure({ key: exposureKey, variationId, variationKey });
    }
  }, [reportExposure, exposureKey, variationId, variationKey]);

  return value;
}

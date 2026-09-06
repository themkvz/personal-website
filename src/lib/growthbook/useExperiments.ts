import { useFeatureIsOn, useFeatureValue } from "@growthbook/growthbook-react";

/**
 * Every experiment the app consumes, with the value to render when GrowthBook
 * is unconfigured, unreachable, or has no definition for it.
 *
 * One entry per experiment: components reference `EXPERIMENTS.X` rather than
 * repeating its key, so a typo is a type error instead of a flag that silently
 * stays off.
 */
export const EXPERIMENTS = {
  FOOTER_BADGE: { key: "footer-badge", fallback: false },
} as const;

type Experiment = (typeof EXPERIMENTS)[keyof typeof EXPERIMENTS];

export function useExperimentIsOn({ key }: Experiment) {
  return useFeatureIsOn(key);
}

export function useExperimentValue<T extends Experiment>({ key, fallback }: T) {
  return useFeatureValue(key, fallback);
}

import { describe, expect, it } from "bun:test";
import { createFeaturevisor } from "@featurevisor/sdk";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import defaultDatafile from "./datafile.json";
import { createExposureReporter } from "./provider";
import { EXPERIMENTS, resolveExperimentEvaluation } from "./useExperiments";

type Datafile = NonNullable<
  Parameters<typeof createFeaturevisor>[0]
>["datafile"];

function makeFixtureDatafile(percentage: number): Datafile {
  return {
    schemaVersion: "4",
    revision: "test-1",
    segments: {},
    features: {
      "footer-badge": {
        bucketBy: "id",
        variations: [
          { value: "control", weight: 50 },
          { value: "treatment", weight: 50 },
        ],
        traffic: [
          {
            key: "everyone",
            conditions: "*",
            percentage,
            allocation: [
              { variation: "control", range: [0, 50_000] },
              { variation: "treatment", range: [50_000, 100_000] },
            ],
          },
        ],
        hash: "test-hash",
      },
    },
    variables: {},
  } as unknown as Datafile;
}

describe("Featurevisor evaluation and OpenPanel exposure bridge", () => {
  it("returns fallback and no exposure when rollout is 0%", () => {
    const sdk = createFeaturevisor({
      datafile: makeFixtureDatafile(0),
      context: { id: "visitor-a" },
    });

    const result = resolveExperimentEvaluation(sdk, EXPERIMENTS.FOOTER_BADGE);
    expect(result.value).toBe(false);
    expect(result.exposure).toBeNull();
  });

  it("allocates hero-primary-cta 50/50 from the compiled datafile", () => {
    const seenValues = new Set<string>();
    const sdk = createFeaturevisor({
      datafile: defaultDatafile as unknown as Datafile,
    });

    for (let i = 0; i < 50; i += 1) {
      sdk.setContext({ id: `hero-visitor-${i}` });
      const result = resolveExperimentEvaluation(
        sdk,
        EXPERIMENTS.HERO_PRIMARY_CTA,
      );
      expect(result.exposure).not.toBeNull();
      expect(result.exposure?.key).toBe("hero-primary-cta");
      seenValues.add(result.value);
    }

    expect(seenValues).toEqual(
      new Set(["Browse technical notes", "Explore the workbench"]),
    );
  });

  it("buckets deterministically for the same fingerprint and isolates concurrent instances", () => {
    const datafile = makeFixtureDatafile(100_000);
    const sdkA1 = createFeaturevisor({
      datafile,
      context: { id: "visitor-a" },
    });
    const sdkA2 = createFeaturevisor({
      datafile,
      context: { id: "visitor-a" },
    });

    const first = resolveExperimentEvaluation(sdkA1, EXPERIMENTS.FOOTER_BADGE);
    const second = resolveExperimentEvaluation(sdkA2, EXPERIMENTS.FOOTER_BADGE);

    expect(first).toEqual(second);
    expect(first.exposure).not.toBeNull();
    if (!first.exposure) {
      throw new Error("expected exposure");
    }
    expect(first.exposure.key).toBe("footer-badge");
    expect([0, 1]).toContain(first.exposure.variationId);
    expect(["control", "treatment"]).toContain(first.exposure.variationKey);

    let oppositeValue: boolean | null = null;
    for (let i = 0; i < 100; i += 1) {
      const candidateSdk = createFeaturevisor({
        datafile,
        context: { id: `visitor-other-${i}` },
      });
      const candidate = resolveExperimentEvaluation(
        candidateSdk,
        EXPERIMENTS.FOOTER_BADGE,
      );
      if (candidate.value !== first.value) {
        oppositeValue = candidate.value;
        break;
      }
    }

    expect(oppositeValue).toBe(!first.value);
    expect(
      resolveExperimentEvaluation(sdkA1, EXPERIMENTS.FOOTER_BADGE),
    ).toEqual(first);
  });

  it("deduplicates exposures per document lifetime and swallows analytics rejections", () => {
    const identified: Array<{
      profileId: string;
      properties: Record<string, unknown>;
    }> = [];
    const tracked: Array<{
      event: string;
      properties: Record<string, unknown> | undefined;
    }> = [];

    const report = createExposureReporter({
      fingerprint: "fp-123",
      identify: (profileId, properties) => {
        identified.push({ profileId, properties });
      },
      track: (event, properties) => {
        tracked.push({ event, properties });
        return Promise.reject(new Error("blocked by adblocker"));
      },
    });

    const exposure = {
      key: "footer-badge",
      variationId: 1,
      variationKey: "treatment",
    };

    report(exposure);
    report(exposure);

    expect(identified).toEqual([
      { profileId: "fp-123", properties: { "exp_footer-badge": "treatment" } },
    ]);
    expect(tracked).toEqual([
      {
        event: TRACK_EVENTS.EXPERIMENT_VIEWED,
        properties: {
          feature_key: "footer-badge",
          experiment_id: "footer-badge",
          variation_id: 1,
          variation_key: "treatment",
        },
      },
    ]);
  });
});

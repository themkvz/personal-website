import type { Integration } from "@sentry/core";

/** Shared between client and server `Sentry.init` calls; must stay safe for the client bundle. */
export const TRACES_SAMPLE_RATE = 0.1;

/** GlitchTip has no sessions API, so session envelopes are discarded on both sides. */
export function withoutSessions(
  sessionIntegrationName: string,
  ...extra: Integration[]
) {
  return (defaults: Integration[]): Integration[] => [
    ...defaults.filter(
      (integration) => integration.name !== sessionIntegrationName,
    ),
    ...extra,
  ];
}

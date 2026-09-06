import * as Sentry from "@sentry/react-router";
import { httpIntegration } from "@sentry/react-router";
import { env } from "~/env.server";

// ponytail: Sentry.init runs when this module loads, not before `react-router`
// resolves — later than the `NODE_OPTIONS='--import'` loader Sentry docs
// recommend. OTel's HTTP auto-instrumentation may miss spans from modules
// already resolved by then. Upgrade path if span gaps show up: move this file
// to a root instrument.server.mjs loaded via NODE_OPTIONS, reading
// process.env directly instead of the validated env module.
Sentry.init({
  dsn: env.VITE_GLITCHTIP_DSN,
  // The browser counterpart reads `import.meta.env.PROD`; this side has no such flag.
  enabled: env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  integrations: (defaults) => [
    // GlitchTip has no sessions API, so session envelopes are discarded. The
    // per-process session comes from `ProcessSession`, the per-request one from
    // `httpIntegration`; passing an instance here replaces the default.
    ...defaults.filter((integration) => integration.name !== "ProcessSession"),
    httpIntegration({ trackIncomingRequestsAsSessions: false }),
  ],
});

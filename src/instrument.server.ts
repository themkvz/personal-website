import * as Sentry from "@sentry/react-router";
import { env } from "~/env.server";
import { TRACES_SAMPLE_RATE, withoutSessions } from "~/lib/glitchtip/options";

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
  tracesSampleRate: TRACES_SAMPLE_RATE,
  // The per-process session comes from `ProcessSession`, the per-request one
  // from `httpIntegration`; passing an instance here replaces the default.
  integrations: withoutSessions(
    "ProcessSession",
    Sentry.httpIntegration({ trackIncomingRequestsAsSessions: false }),
  ),
});

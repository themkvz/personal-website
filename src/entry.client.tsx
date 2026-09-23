import * as Sentry from "@sentry/react-router";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { envPublic } from "~/env.client";
import { isClientError } from "~/lib/glitchtip/errors";
import { TRACES_SAMPLE_RATE, withoutSessions } from "~/lib/glitchtip/options";

Sentry.init({
  dsn: envPublic.VITE_GLITCHTIP_DSN,
  // The server counterpart reads `env.NODE_ENV`; only the browser has this flag.
  enabled: import.meta.env.PROD,
  tracesSampleRate: TRACES_SAMPLE_RATE,
  integrations: withoutSessions(
    "BrowserSession",
    Sentry.reactRouterTracingIntegration(),
  ),
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter
        instrumentations={[
          Sentry.createSentryClientInstrumentation({ captureErrors: false }),
        ]}
        onError={(error, info) => {
          if (isClientError(error)) return;
          Sentry.sentryOnError(error, info);
        }}
      />
    </StrictMode>,
  );
});

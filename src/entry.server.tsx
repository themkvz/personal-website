import "./instrument.server";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import * as Sentry from "@sentry/react-router";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import type {
  EntryContext,
  HandleErrorFunction,
  RouterContextProvider,
} from "react-router";
import { ServerRouter } from "react-router";
import { NonceContext } from "~/context/nonce";
import { env } from "~/env.server";
import { buildReportOnlyCsp } from "~/lib/csp";
import { parseGlitchtipDsn } from "~/lib/glitchtip/dsn";
import { isNotFound } from "~/lib/glitchtip/errors";

export const streamTimeout = 5_000;

const glitchtip = parseGlitchtipDsn(env.VITE_GLITCHTIP_DSN);
const opApiOrigin = new URL(env.VITE_OP_API_URL).origin;

// `captureErrors` defaults to true and reports with no filtering, which would
// both duplicate `handleError` and bypass its aborted/404 guards below.
export const instrumentations = [
  Sentry.createSentryServerInstrumentation({ captureErrors: false }),
];

export const handleError: HandleErrorFunction = (error, { request }) => {
  if (request.signal.aborted) return;
  if (isNotFound(error)) return;

  console.error(error);
  Sentry.captureException(error);
};

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider,
) {
  // Set before the HEAD branch so every document response carries the policy.
  const nonce = crypto.randomUUID();
  responseHeaders.set(
    "Content-Security-Policy-Report-Only",
    buildReportOnlyCsp({ nonce, opApiOrigin, glitchtip }),
  );

  // https://httpwg.org/specs/rfc9110.html#HEAD
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => abort(),
      streamTimeout + 1000,
    );

    const { pipe, abort } = renderToPipeableStream(
      <NonceContext value={nonce}>
        <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
      </NonceContext>,
      {
        nonce,
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              // Clear the timeout to prevent retaining the closure and memory leak
              clearTimeout(timeoutId);
              timeoutId = undefined;
              callback();
            },
          });
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          pipe(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );
  });
}

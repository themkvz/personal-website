import { isRouteErrorResponse } from "react-router";

/**
 * A 4xx route response (missing page, wrong method from a scanner) is the
 * request's fault, not the app's — never report one.
 */
export function isClientError(error: unknown): boolean {
  return (
    isRouteErrorResponse(error) && error.status >= 400 && error.status < 500
  );
}

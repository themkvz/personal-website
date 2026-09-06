import { isRouteErrorResponse } from "react-router";

/** A missing page is a normal outcome, not a failure — never report one. */
export function isNotFound(error: unknown): boolean {
  return isRouteErrorResponse(error) && error.status === 404;
}

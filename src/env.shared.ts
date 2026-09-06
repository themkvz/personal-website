import type { StandardSchemaV1 } from "@t3-oss/env-core";
import * as v from "valibot";
import { parseGlitchtipDsn } from "~/lib/glitchtip/dsn";

/** Public variables, readable on both sides. Declared once; `env.server.ts` and `env.client.ts` spread this. */
export const publicEnvSchema = {
  VITE_OP_CLIENT_ID: v.string(),
  VITE_OP_API_URL: v.string(),
  VITE_GLITCHTIP_DSN: v.pipe(
    v.string(),
    v.check((dsn) => {
      try {
        parseGlitchtipDsn(dsn);
        return true;
      } catch {
        return false;
      }
    }),
  ),
};

/**
 * Reports failing variable names only. Never include an issue's `message`:
 * valibot embeds the rejected value in it (`Invalid URL: Received "<value>"`),
 * which would put the secret straight into the logs this handler exists to
 * keep it out of.
 */
export function onValidationError(
  issues: readonly StandardSchemaV1.Issue[],
): never {
  const names = new Set(issues.map((issue) => String(issue.path?.[0])));
  throw new Error(`Invalid environment variables: ${[...names].join(", ")}`);
}

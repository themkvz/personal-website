import * as process from "node:process";
import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";
import { onValidationError, publicEnvSchema } from "~/env.shared";

export const env = createEnv({
  clientPrefix: "VITE_",
  server: {
    NODE_ENV: v.optional(
      v.picklist(["development", "production", "test"]),
      "development",
    ),
    OP_CLIENT_SECRET: v.string(),
    // HMAC key for the visitor fingerprint. Changing it re-ids every visitor.
    FINGERPRINT_SECRET: v.pipe(v.string(), v.minLength(32)),
  },
  shared: { ...publicEnvSchema },
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  onValidationError,
});

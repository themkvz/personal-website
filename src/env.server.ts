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
  },
  shared: { ...publicEnvSchema },
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  onValidationError,
});

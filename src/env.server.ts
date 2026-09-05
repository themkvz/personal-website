import * as process from "node:process";
import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  server: {
    NODE_ENV: v.optional(
      v.picklist(["development", "production", "test"]),
      "development",
    ),

    OP_CLIENT_SECRET: v.string(),
    VITE_OP_CLIENT_ID: v.string(),
    VITE_OP_API_URL: v.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

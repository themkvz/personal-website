import * as process from "node:process";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),

    SEND_CONTACT_TO: z.string(),

    OP_CLIENT_SECRET: z.string(),
    VITE_OP_CLIENT_ID: z.string(),
    VITE_OP_API_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

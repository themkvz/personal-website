import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envPublic = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_OP_CLIENT_ID: z.string(),
    VITE_OP_API_URL: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});

import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const envPublic = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_OP_CLIENT_ID: v.string(),
    VITE_OP_API_URL: v.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});

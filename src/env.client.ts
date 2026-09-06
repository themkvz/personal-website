import { createEnv } from "@t3-oss/env-core";
import { onValidationError, publicEnvSchema } from "~/env.shared";

export const envPublic = createEnv({
  clientPrefix: "VITE_",
  client: { ...publicEnvSchema },
  runtimeEnvStrict: {
    VITE_OP_CLIENT_ID: import.meta.env.VITE_OP_CLIENT_ID,
    VITE_OP_API_URL: import.meta.env.VITE_OP_API_URL,
    VITE_GLITCHTIP_DSN: import.meta.env.VITE_GLITCHTIP_DSN,
  },
  emptyStringAsUndefined: true,
  onValidationError,
});

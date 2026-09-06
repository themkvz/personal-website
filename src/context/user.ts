import { createContext } from "react-router";
import type { ServerAnalytics } from "~/lib/openpanel/getOpenPanel";

type UserData = {
  fingerprint: string;
  analytics: ServerAnalytics;
};

/** No default: `identityMiddleware` on the root route sets this before any loader runs. */
export const userContext = createContext<UserData>();

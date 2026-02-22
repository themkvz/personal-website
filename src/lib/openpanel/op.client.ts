import { OpenPanel } from "@openpanel/web";
import { envPublic } from "~/env.client";

export const op = new OpenPanel({
  clientId: envPublic.VITE_OP_CLIENT_ID,
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
  apiUrl: envPublic.VITE_OP_API_URL,
});

import { OpenPanel } from "@openpanel/sdk";
import { env } from "~/env.server";

export const op = new OpenPanel({
  clientId: env.VITE_OP_CLIENT_ID,
  clientSecret: env.OP_CLIENT_SECRET,
  apiUrl: env.VITE_OP_API_URL,
});

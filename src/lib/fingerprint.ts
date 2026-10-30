import { env } from "~/env.server";
import { getClientInfo } from "./client-info";

// Keyed, so the id cannot be brute-forced back to the visitor's IP.
const key = crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(env.FINGERPRINT_SECRET),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign"],
);

export async function getFingerprint(request: Request): Promise<string> {
  const { ip, userAgent } = getClientInfo(request);
  const raw = `${ip ?? "unknown"}|${userAgent ?? "unknown"}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await key,
    new TextEncoder().encode(raw),
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

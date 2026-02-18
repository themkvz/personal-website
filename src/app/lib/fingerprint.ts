import { getClientInfo } from "~/lib/client-info";

export async function getFingerprint(request: Request): Promise<string> {
  const { ip, userAgent } = getClientInfo(request);
  const raw = `${ip ?? "unknown"}|${userAgent ?? "unknown"}`;
  const encoded = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

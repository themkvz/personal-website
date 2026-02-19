/**
 * Extracts client IP and user agent from a request.
 * Handles Cloudflare proxy headers with fallbacks.
 */
export function getClientInfo(request: Request) {
  const headers = request.headers;

  // IP: Cloudflare → standard proxy chain → direct connection
  const ip =
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    null;

  const userAgent = headers.get("user-agent") ?? null;

  return { ip, userAgent };
}

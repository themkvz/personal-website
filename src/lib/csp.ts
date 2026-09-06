import type { GlitchtipDsn } from "~/lib/glitchtip/dsn";

export function buildReportOnlyCsp({
  nonce,
  opApiOrigin,
  glitchtip,
}: {
  nonce: string;
  opApiOrigin: string;
  glitchtip: GlitchtipDsn;
}): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    // React and `motion` set inline style attributes, which `style-src` governs.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self' ${opApiOrigin} ${glitchtip.origin}`,
    `report-uri ${glitchtip.cspReportUri}`,
  ].join("; ");
}

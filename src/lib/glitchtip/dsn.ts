export interface GlitchtipDsn {
  origin: string;
  cspReportUri: string;
}

/** Parses `https://<key>@<host>/<projectId>` — never import `~/env.server` here, this must stay safe for the client bundle. */
export function parseGlitchtipDsn(dsn: string): GlitchtipDsn {
  let url: URL;
  try {
    url = new URL(dsn);
  } catch {
    throw new Error("Invalid GlitchTip DSN");
  }

  const key = url.username;
  const projectId = url.pathname.slice(1);
  if (!key || !projectId) {
    throw new Error("Invalid GlitchTip DSN");
  }

  return {
    origin: url.origin,
    cspReportUri: `${url.origin}/api/${projectId}/security/?glitchtip_key=${key}`,
  };
}

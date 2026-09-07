/**
 * Every public plain-text endpoint answers with the same content type. The
 * charset is normative for `security.txt` (RFC 9116) and specified for the
 * rest, so it is declared once rather than in each route.
 */
export function text(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

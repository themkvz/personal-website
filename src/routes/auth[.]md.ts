export function loader() {
  return new Response(
    `# auth.md

## Agent audience and access

Agents reading themkvz.com can access its public pages and read-only feeds without authentication. Use HTTP GET to retrieve content. See [llms.txt](/llms.txt) for content discovery and [openapi.json](/openapi.json) for feed endpoints.

## Registration and provisioning

This site has no accounts, agent registration, or credential provisioning endpoints. No registration methods are supported, including identity assertions, verified email, or anonymous credential issuance. There is no POST /agent/auth endpoint.

## Credentials and OAuth

No API keys, bearer tokens, or other credentials are required or issued. Do not send credentials to this site. It does not operate an OAuth resource server or authorization server and does not publish OAuth discovery metadata.
`,
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
}

import { Site } from "~/constants";

export function loader() {
  const linkset = [
    {
      anchor: Site.baseUrl,
      "service-desc": [
        {
          href: `${Site.baseUrl}/openapi.json`,
          type: "application/openapi+json",
        },
      ],
      "service-doc": [{ href: `${Site.baseUrl}/openapi.json` }],
    },
  ];

  return new Response(JSON.stringify({ linkset }), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json",
    },
  });
}

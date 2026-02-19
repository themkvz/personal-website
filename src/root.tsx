import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import "./app.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { useEffect } from "react";
import { userContext } from "~/context/user";
import { useIdentify } from "~/lib/openpanel/useOpenPanel";
import type { Route } from "./+types/root";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { BASE_URL, PUBLIC_EMAIL, SOCIAL_LINKS } from "./constants";
import { identityMiddleware } from "./middlewares/identity";
import { resolveThemeClass, type Theme } from "./store/theme";

export const links: Route.LinksFunction = () => [
  { rel: "canonical", href: BASE_URL },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/apple-store.svg" },
];

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Ihor M. — Full-Stack Developer" },
    {
      name: "description",
      content:
        "Senior Full-Stack Developer specializing in React, Node.js, and modern web architecture. Building high-performance applications with a focus on UX and scalability.",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Ihor M." },
    { property: "og:url", content: BASE_URL },
    {
      property: "og:image",
      content: `${BASE_URL}/hero.webp`,
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: "@themkvz" },
    {
      name: "twitter:image",
      content: `${BASE_URL}/hero.webp`,
    },
    {
      name: "keywords",
      content:
        "Full-Stack Developer, Front-End Engineer, React, TypeScript, Node.js, Web Architecture",
    },
    { name: "author", content: "Ihor M." },
  ];
};

function parseThemeCookie(cookieHeader: string | null): Theme {
  if (!cookieHeader) return "system";
  const match = cookieHeader.match(/(?:^|;\s*)theme=(\w+)/);
  return (match?.[1] as Theme) || "system";
}

export const middleware = [identityMiddleware];

export function loader({ request, context }: Route.LoaderArgs) {
  const theme = parseThemeCookie(request.headers.get("Cookie"));

  const fingerprint = context.get(userContext).fingerprint;

  return data({ theme, fingerprint });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData("root") as { theme: Theme } | undefined;
  const theme = loaderData?.theme ?? "system";
  // For "system" theme, server defaults to "light"; client corrects on hydration
  const themeClass = theme === "system" ? "light" : resolveThemeClass(theme);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ihor M.",
    url: BASE_URL,
    image: `${BASE_URL}/hero.webp`,
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    jobTitle: "Senior Full-Stack Developer",
    email: PUBLIC_EMAIL,
    worksFor: {
      "@type": "Organization",
      name: "Forex Tester Software",
    },
    knowsAbout: [
      "Web Development",
      "React",
      "TypeScript",
      "Node.js",
      "Full-Stack Engineering",
    ],
  };

  return (
    <html lang="en" className={themeClass} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { fingerprint } = loaderData;
  const identify = useIdentify();

  useEffect(() => {
    identify({
      profileId: fingerprint,
      properties: {
        fingerprint,
      },
    });
  }, [fingerprint, identify]);

  return (
    <NuqsAdapter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1P mt-header">
          <Outlet />
        </main>
        <Footer />
      </div>
    </NuqsAdapter>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 mt-header py-header">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">{message}</h1>
          <p className="mt-4 text-muted-foreground">{details}</p>
          {stack && (
            <pre className="mt-6 max-w-2xl overflow-x-auto rounded-lg bg-muted p-4 text-left text-sm">
              <code>{stack}</code>
            </pre>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

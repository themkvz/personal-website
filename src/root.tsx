import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./app.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { useEffect, useLayoutEffect } from "react";
import { userContext } from "~/context/user";
import { useIdentify } from "~/lib/openpanel/useOpenPanel";
import { getStoredTheme, resolveTheme } from "~/lib/theme";
import { useThemeStore } from "~/store/theme";
import type { Route } from "./+types/root";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { Nav, Site } from "./constants";
import { identityMiddleware } from "./middlewares/identity";

// Runs synchronously before React hydrates to prevent theme flash.
// Reads localStorage and applies the correct class to <html> immediately.
const themeInitScript = `
(function () {
  try {
    var theme = localStorage.getItem("theme") || "system";
    var resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
  } catch (_) {}
})();
`.trim();

export const links: Route.LinksFunction = () => [
  { rel: "canonical", href: Site.baseUrl },
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
    { property: "og:url", content: Site.baseUrl },
    {
      property: "og:image",
      content: `${Site.baseUrl}/hero.webp`,
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: "@themkvz" },
    {
      name: "twitter:image",
      content: `${Site.baseUrl}/hero.webp`,
    },
    {
      name: "keywords",
      content:
        "Full-Stack Developer, Front-End Engineer, React, TypeScript, Node.js, Web Architecture",
    },
    { name: "author", content: "Ihor M." },
  ];
};

export const middleware = [identityMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const fingerprint = context.get(userContext).fingerprint;
  return data({ fingerprint });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  // Sync store from localStorage after hydration — runs before browser paint,
  // so the correct icon and class are applied without a visible flash.
  useLayoutEffect(() => {
    setTheme(getStoredTheme());
  }, [setTheme]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ihor M.",
    url: Site.baseUrl,
    image: `${Site.baseUrl}/hero.webp`,
    sameAs: Nav.social.map((link) => link.href),
    jobTitle: "Senior Full-Stack Developer",
    email: Site.publicEmail,
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
    <html lang="en" className={resolveTheme(theme)} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Anti-flicker: must be first script, before any stylesheet or React */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: sets correct theme class before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
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

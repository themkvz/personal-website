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
import { NotFound } from "~/components/layout/not-found";
import { Site } from "~/constants";
import { userContext } from "~/context/user";
import { useIdentify } from "~/lib/openpanel/useOpenPanel";
import { getStoredTheme, resolveTheme } from "~/lib/theme";
import { useThemeStore } from "~/store/theme";
import type { Route } from "./+types/root";
import { Footer } from "./components/layout/footer";
import { Nav } from "./components/layout/nav";
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
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/apple-store.svg" },
  {
    rel: "alternate",
    type: "application/rss+xml",
    href: `${Site.baseUrl}/feed.xml`,
  },
];

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

  return (
    <html lang="en" className={resolveTheme(theme)} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Anti-flicker: must be first script, before any stylesheet or React */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen antialiased">
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
        <Nav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </NuqsAdapter>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {isNotFound ? <NotFound /> : <ErrorPage error={error} />}
      </main>
      <Footer />
    </div>
  );
}

function ErrorPage({ error }: { error: unknown }) {
  let status = 500;
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    details = error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="t-display-xl text-muted-foreground">{status}</p>
      <p className="t-body text-muted-foreground">{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto rounded-md border border-border bg-muted p-4 text-left text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}

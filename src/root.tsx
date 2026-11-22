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
import { use, useEffect, useLayoutEffect } from "react";
import { Button } from "~/components/atoms/button";
import { Link } from "~/components/atoms/link";
import { NotFound } from "~/components/layout/not-found";
import { NotFound as NotFoundCopy, Site } from "~/constants";
import { NonceContext } from "~/context/nonce";
import { userContext } from "~/context/user";
import { ExperimentProvider } from "~/lib/featurevisor/provider";
import { identifyVisitor } from "~/lib/openpanel/useOpenPanel";
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
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "author", href: "/humans.txt" },
  {
    rel: "alternate",
    type: "application/rss+xml",
    href: `${Site.baseUrl}/feed.xml`,
  },
];

export const middleware = [identityMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const fingerprint = context.get(userContext).fingerprint;
  return data({ fingerprint });
}

/**
 * The visitor fingerprint does not change within a visit, and re-running this
 * loader on every navigation is unnecessary while the compiled datafile is
 * already bundled with the application.
 */
export const shouldRevalidate = () => false;

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();
  const nonce = use(NonceContext);

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
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Meta />
        {/* Browsers scrub the `nonce` attribute to "", so the client must render
            the same "" the `NonceContext` default provides — otherwise `Links`
            falls back to the framework-context nonce (undefined) and hydration
            mismatches. */}
        <Links nonce={nonce} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { fingerprint } = loaderData;
  useEffect(() => {
    // The SDK skips an identify carrying only a profile id, so the profile row
    // is written only because of this second field.
    identifyVisitor(fingerprint, { fingerprint });
  }, [fingerprint]);

  return (
    <ExperimentProvider fingerprint={fingerprint}>
      <NuqsAdapter>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </NuqsAdapter>
    </ExperimentProvider>
  );
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  // A child route's loader threw (the common case, e.g. an unknown slug) but
  // the root loader still ran, so its data is available here. Only a failure
  // in the root loader itself leaves this undefined; fall back to an empty
  // fingerprint so `Footer`'s experiment hook still has a provider to read.
  const { fingerprint } = loaderData ?? {
    fingerprint: "",
  };

  return (
    <ExperimentProvider fingerprint={fingerprint}>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          {isNotFound ? <NotFound /> : <ErrorPage error={error} />}
        </main>
        <Footer />
      </div>
    </ExperimentProvider>
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
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button to="/">{NotFoundCopy.returnCta}</Button>
        <Link to="/workbench" tone="accent">
          {NotFoundCopy.workbenchCta}
        </Link>
      </div>
      {stack && (
        <pre className="w-full overflow-x-auto rounded-md border border-border bg-muted p-4 text-left text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}

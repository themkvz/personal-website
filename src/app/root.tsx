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
import type { Route } from "./+types/root";
import "./app.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { PUBLIC_EMAIL, SOCIAL_LINKS } from "~/constants";
import { identityMiddleware } from "~/middlewares/identity";
import { resolveThemeClass, type Theme } from "~/store/theme";

export const links: Route.LinksFunction = () => [
  { rel: "canonical", href: "https://themkvz.com" },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/apple-store.svg" },
];

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Ihor Mukovoz — Full-Stack Developer" },
    {
      name: "description",
      content:
        "Full-Stack Developer & Tech Lead with 8+ years of experience building modern web applications.",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Ihor Mukovoz" },
    { property: "og:url", content: "https://themkvz.com" },
    {
      property: "og:image",
      content: "https://themkvz.com/hero.webp",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:image",
      content: "https://themkvz.com/hero.webp",
    },
  ];
};

function parseThemeCookie(cookieHeader: string | null): Theme {
  if (!cookieHeader) return "system";
  const match = cookieHeader.match(/(?:^|;\s*)theme=(\w+)/);
  return (match?.[1] as Theme) || "system";
}

export const middleware = [identityMiddleware];

export function loader({ request }: Route.LoaderArgs) {
  const theme = parseThemeCookie(request.headers.get("Cookie"));
  return data({ theme });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData("root") as { theme: Theme } | undefined;
  const theme = loaderData?.theme ?? "system";
  // For "system" theme, server defaults to "light"; client corrects on hydration
  const themeClass = theme === "system" ? "light" : resolveThemeClass(theme);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ihor Mukovoz",
    url: "https://themkvz.com",
    image: "https://themkvz.com/hero.webp",
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    jobTitle: "Full-Stack Developer",
    email: PUBLIC_EMAIL,
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

export default function App() {
  return (
    <NuqsAdapter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 mt-header">
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
      <main className="flex flex-1 items-center justify-center px-6">
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

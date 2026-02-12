import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { to: "/", label: "Introduce" },
  { to: "/about", label: "About" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Link to="/" className="font-mono text-lg font-semibold tracking-tight">
          themkvz
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                location.pathname === to
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === to
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

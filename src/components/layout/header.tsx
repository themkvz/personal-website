import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Nav } from "~/constants";
import { cn } from "~/lib/utils";
import { DecryptedText } from "../decrypted-text";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 bg-background/80 backdrop-blur-sm border-b border-border shadow-xs md:border md:rounded-full md:mt-4 md:w-[calc(100%-2rem)]">
      <div className="flex h-header items-center justify-between px-6">
        <Link to="/" className="font-mono text-lg font-semibold tracking-tight">
          <DecryptedText text="themkvz" animateOn="both" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {Nav.links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "link" }),
                  isActive && "underline",
                  "text-foreground hover:text-primary",
                )
              }
            >
              {label}
            </NavLink>
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
            {Nav.links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: isActive ? "default" : "ghost" }),
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

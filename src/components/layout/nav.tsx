import { NavLink } from "react-router";
import { Container } from "~/components/layout/container";
import { MobileNav } from "~/components/layout/mobile-nav";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { Nav as NavData, Site } from "~/constants";
import { cn } from "~/lib/utils";
import { DecryptedText } from "../identity/decrypted-text";

export function Nav() {
  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-6.5">
        <NavLink to="/" className="flex items-center gap-2.5" end>
          <span className="size-2.5 bg-building" aria-hidden="true" />
          <span className="font-mono text-[13px] font-bold tracking-[2px] text-foreground">
            <DecryptedText text={Site.name} />
          </span>
        </NavLink>

        <nav
          aria-label="Primary"
          className="mr-6 ml-auto hidden flex-wrap items-center gap-6 md:flex"
        >
          {NavData.links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "t-label",
                  isActive
                    ? "relative text-foreground before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:size-1 before:rounded-full before:bg-accent-foreground before:animate-ping before:animation-duration-[2s]"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}

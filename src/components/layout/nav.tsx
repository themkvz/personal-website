import { NavLink } from "react-router";
import { Container } from "~/components/layout/container";
import { ThemeToggle } from "~/components/layout/theme-toggle";
import { Nav as NavData, Site } from "~/constants";
import { cn } from "~/lib/utils";

export function Nav() {
  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-6.5">
        <NavLink to="/" className="flex items-center gap-2.5" end>
          <span className="size-2.5 bg-building" aria-hidden="true" />
          <span className="font-mono text-[13px] font-bold tracking-[2px] text-foreground">
            {Site.name}
          </span>
        </NavLink>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-6">
          {NavData.links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "font-mono text-[11px] tracking-[1.2px]",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}

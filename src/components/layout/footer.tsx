import { Fragment } from "react";
import { NavLink } from "react-router";
import { Container } from "~/components/layout/container";
import { Nav as NavData, Site } from "~/constants";
import { cn } from "~/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-7">
        <span className="font-mono text-[11px] tracking-[1.2px] text-muted-foreground">
          {Site.name}
        </span>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-2">
          {NavData.footerLinks.map(({ to, label }, index) => (
            <Fragment key={to}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] text-muted-foreground"
                >
                  ·
                </span>
              )}
              <NavLink
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
                {label.toUpperCase()}
              </NavLink>
            </Fragment>
          ))}
        </nav>
      </Container>
    </footer>
  );
}

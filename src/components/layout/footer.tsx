import { Fragment } from "react";
import { NavLink } from "react-router";
import { Container } from "~/components/layout/container";
import { Nav as NavData, Site } from "~/constants";
import {
  EXPERIMENTS,
  useExperimentIsOn,
} from "~/lib/growthbook/useExperiments";
import { cn } from "~/lib/utils";

export function Footer() {
  const hasBadge = useExperimentIsOn(EXPERIMENTS.FOOTER_BADGE);

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-7">
        <span className="t-label text-muted-foreground">
          {Site.name}

          {hasBadge && (
            <span className="ml-2 inline-flex items-center rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              BETA
            </span>
          )}
        </span>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-2">
          {NavData.footerLinks.map(({ to, label }, index) => (
            <Fragment key={to}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="t-label text-muted-foreground"
                >
                  ·
                </span>
              )}
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "t-label",
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

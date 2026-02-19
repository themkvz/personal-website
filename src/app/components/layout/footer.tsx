import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { SOCIAL_ICONS } from "~/components/social-icons";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  FOOTER_NAV_LINKS,
  PROJECT_TECH_STACK,
  SOCIAL_LINKS,
} from "~/constants";
import { cn } from "~/lib/utils";

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-3xl px-6">
        {/* Main footer content */}
        <div className="grid gap-10 py-16 sm:grid-cols-3">
          {/* Brand & description */}
          <div className="sm:col-span-1">
            <Link
              to="/"
              className="font-mono text-lg font-semibold tracking-tight"
            >
              themkvz
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Full-Stack Developer & Tech Lead with 8+ years of experience
              building modern web applications.
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>Ukraine</span>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold">Pages</h3>
            <ul className="mt-3">
              {FOOTER_NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Button
                    variant="link"
                    nativeButton={false}
                    render={(props) => (
                      <Link
                        {...props}
                        className={cn(
                          props.className,
                          "px-0 text-muted-foreground",
                        )}
                        to={to}
                      >
                        {label}
                      </Link>
                    )}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold">Connect</h3>
            <ul className="mt-3">
              {SOCIAL_LINKS.map(({ href, label, icon }) => {
                const IconComponent =
                  SOCIAL_ICONS[icon as keyof typeof SOCIAL_ICONS];

                return (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "px-0! text-muted-foreground",
                      )}
                    >
                      {<IconComponent />}
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Tech stack */}
        <div className="py-8">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Built with{" "}
            {PROJECT_TECH_STACK.map((tech, i) => (
              <span key={tech}>
                {i > 0 && (i === PROJECT_TECH_STACK.length - 1 ? " & " : ", ")}
                <span className="text-foreground/70">{tech}</span>
              </span>
            ))}
          </p>
        </div>

        <Separator />

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-3 py-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ihor Mukovoz. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, label, icon }) => {
              const IconComponent =
                SOCIAL_ICONS[icon as keyof typeof SOCIAL_ICONS];

              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                  aria-label={label}
                >
                  {<IconComponent />}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Large watermark text */}
      <div className="select-none overflow-hidden pb-4 pt-2" aria-hidden="true">
        <p
          className="text-center font-mono text-[clamp(4rem,15vw,12rem)] font-black leading-none tracking-normal text-transparent"
          style={{
            WebkitTextStroke: "1.5px var(--color-foreground)",
            opacity: 0.05,
          }}
        >
          THEMKVZ
        </p>
      </div>
    </footer>
  );
}

import { Link as RouterLink } from "react-router";
import { cn } from "~/lib/utils";

type LinkProps = React.ComponentProps<"a"> & {
  to?: string;
  tone?: "default" | "accent";
};

export function Link({ className, to, tone = "default", ...props }: LinkProps) {
  const classes = cn(
    "font-body text-sm font-semibold underline-offset-4 hover:underline",
    tone === "accent" ? "text-accent-foreground" : "text-foreground",
    className,
  );

  if (to) {
    return <RouterLink to={to} className={classes} {...props} />;
  }

  return <a className={classes} {...props} />;
}

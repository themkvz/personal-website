import { Link as RouterLink } from "react-router";
import { cn } from "~/lib/utils";

type ButtonProps = React.ComponentProps<"a"> & { to?: string };

export function Button({ className, to, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xs bg-primary px-4 py-2 font-body text-sm font-semibold text-primary-foreground hover:bg-primary/90",
    className,
  );

  if (to) {
    return <RouterLink to={to} className={classes} {...props} />;
  }

  return <a className={classes} {...props} />;
}

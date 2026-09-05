import { cn } from "~/lib/utils";

export function Overline({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("t-label text-muted-foreground", className)} {...props} />
  );
}

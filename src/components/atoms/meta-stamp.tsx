import { cn } from "~/lib/utils";

export function MetaStamp({
  className,
  ...props
}: React.ComponentProps<"time">) {
  return (
    <time
      className={cn("t-meta text-muted-foreground", className)}
      {...props}
    />
  );
}

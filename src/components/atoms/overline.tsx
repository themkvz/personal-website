import { cn } from "~/lib/utils";

export function Overline({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-semibold tracking-[2px] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

import { cn } from "~/lib/utils";

export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "rounded-xs border border-border bg-card px-1.5 py-[3px] font-mono text-[11px] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

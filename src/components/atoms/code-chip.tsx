import { cn } from "~/lib/utils";

export function CodeChip({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "t-code inline-block rounded-xs bg-muted px-1.5 py-[3px] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

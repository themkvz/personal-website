import { cn } from "~/lib/utils";

export function IconButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-9 items-center justify-center rounded-sm border border-border bg-card text-foreground hover:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

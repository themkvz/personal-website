import { cn } from "~/lib/utils";

export function Surface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-border bg-card p-6",
        className,
      )}
      {...props}
    />
  );
}

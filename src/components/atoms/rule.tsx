import { cn } from "~/lib/utils";

export function Rule({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <hr
      className={cn("h-px w-full border-0 bg-border", className)}
      {...props}
    />
  );
}

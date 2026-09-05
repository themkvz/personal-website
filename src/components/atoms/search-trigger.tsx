import { Search } from "lucide-react";
import { Kbd } from "~/components/atoms/kbd";
import { cn } from "~/lib/utils";

export function SearchTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        "flex w-60 items-center gap-3 rounded-sm border border-input bg-card p-3 text-muted-foreground disabled:cursor-default disabled:opacity-100",
        className,
      )}
      {...props}
    >
      <Search className="size-3.5" />
      <span className="flex-1 text-left text-sm">Search</span>
      <Kbd>⌘K</Kbd>
    </button>
  );
}

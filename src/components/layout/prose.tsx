import { cn } from "~/lib/utils";

export function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "t-body mx-auto flex w-full max-w-measure flex-col gap-4 text-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        "[&_code]:rounded-xs [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

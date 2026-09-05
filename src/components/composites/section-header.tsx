import { Overline } from "~/components/atoms/overline";
import { Rule } from "~/components/atoms/rule";
import { cn } from "~/lib/utils";

function Root({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function Top({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex w-full items-center justify-between", className)}
      {...props}
    />
  );
}

function Eyebrow({
  className,
  ...props
}: React.ComponentProps<typeof Overline>) {
  return <Overline className={className} {...props} />;
}

function Count({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("t-label text-muted-foreground", className)}
      {...props}
    />
  );
}

function Title({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("t-title-2", className)} {...props} />;
}

export const SectionHeader = {
  Root,
  Top,
  Eyebrow,
  Count,
  Title,
  Rule,
};

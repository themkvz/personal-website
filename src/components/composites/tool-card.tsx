import { Link } from "~/components/atoms/link";
import { Overline } from "~/components/atoms/overline";
import { cn } from "~/lib/utils";

function Root({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-sm border border-border bg-card p-6",
        className,
      )}
      {...props}
    />
  );
}

function Category({
  className,
  ...props
}: React.ComponentProps<typeof Overline>) {
  return <Overline className={className} {...props} />;
}

function Title({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("t-title-3", className)} {...props} />;
}

function Description({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("t-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function Meta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex items-center justify-between", className)}
      {...props}
    />
  );
}

function Action({ className, ...props }: React.ComponentProps<typeof Link>) {
  return <Link className={className} {...props} />;
}

export const ToolCard = {
  Root,
  Category,
  Title,
  Description,
  Meta,
  Action,
};

import { Link } from "~/components/atoms/link";
import { Tag } from "~/components/atoms/tag";
import { cn } from "~/lib/utils";

function Root({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article className={cn("flex flex-col gap-3", className)} {...props} />
  );
}

function Top({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3", className)}
      {...props}
    />
  );
}

function LaneTag({ className, ...props }: React.ComponentProps<typeof Tag>) {
  return <Tag className={className} {...props} />;
}

function Title({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn("t-title-3 block text-foreground", className)}
      {...props}
    />
  );
}

function Summary({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("t-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function Topics({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-wrap gap-2", className)} {...props} />;
}

function Action({ className, ...props }: React.ComponentProps<typeof Link>) {
  return <Link className={className} {...props} />;
}

export const ArtifactCard = {
  Root,
  Top,
  Lane: LaneTag,
  Title,
  Summary,
  Topics,
  Action,
};

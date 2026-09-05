import { Link } from "~/components/atoms/link";
import { cn } from "~/lib/utils";

export function Breadcrumb({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2", className)}
    >
      {children}
    </nav>
  );
}

function Crumb({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn("text-[13px] font-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

function Sep() {
  return (
    <span aria-hidden="true" className="t-label text-muted-foreground">
      /
    </span>
  );
}

function Current({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      className={cn("text-[13px] font-semibold text-foreground", className)}
      {...props}
    />
  );
}

Breadcrumb.Crumb = Crumb;
Breadcrumb.Sep = Sep;
Breadcrumb.Current = Current;

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const tagVariants = cva(
  "inline-flex items-center gap-2 rounded-xs px-2.5 py-1.5",
  {
    variants: {
      lane: {
        building: "bg-building-soft text-building",
        investigating: "bg-investigating-soft text-investigating",
        deciding: "bg-deciding-soft text-deciding",
        shipped: "bg-shipped-soft text-shipped",
        keeping: "bg-keeping-soft text-keeping",
      },
    },
    defaultVariants: {
      lane: "keeping",
    },
  },
);

export function Tag({
  className,
  lane,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return (
    <span className={cn(tagVariants({ lane }), className)} {...props}>
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      <span className="font-mono text-[11px] font-bold tracking-[1.2px]">
        {children}
      </span>
    </span>
  );
}

import { cn } from "~/lib/utils";

const TONE_CLASS = {
  default: "",
  muted: "bg-muted",
  accent: "bg-accent",
} as const;

export function Section({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"section"> & {
  tone?: keyof typeof TONE_CLASS;
}) {
  return (
    <section
      className={cn("pt-18 pb-22", TONE_CLASS[tone], className)}
      {...props}
    />
  );
}

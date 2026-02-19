interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight">{children}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-foreground/15 to-transparent" />
    </div>
  );
}

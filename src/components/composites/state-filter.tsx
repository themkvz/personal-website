import { tagVariants } from "~/components/atoms/tag";
import { LANE_LABELS, LANES, type Lane } from "~/lib/lanes";
import { cn } from "~/lib/utils";
import { laneHref } from "~/lib/workbench-href";

/** Lane filter. Plain links so the filtered index is server-rendered and shareable. */
export function StateFilter({
  active,
  className,
}: {
  active?: Lane;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex gap-0.5 rounded-sm border border-border p-0.5",
        className,
      )}
    >
      <a
        href="/workbench"
        aria-current={active ? undefined : "true"}
        className={cn(
          "rounded-xs px-2.5 py-1.5 t-label",
          active ? "text-muted-foreground" : "text-foreground",
        )}
      >
        ALL
      </a>
      {LANES.map((lane) => (
        <a
          key={lane}
          href={laneHref(lane)}
          aria-current={active === lane ? "true" : undefined}
          className={cn(
            "inline-flex items-center gap-1.5",
            active === lane
              ? tagVariants({ lane })
              : "rounded-xs px-2.5 py-1.5 text-muted-foreground",
          )}
        >
          {active === lane && (
            <span className="size-1.5 rounded-full bg-current" />
          )}
          <span className="t-label">{LANE_LABELS[lane]}</span>
        </a>
      ))}
    </div>
  );
}

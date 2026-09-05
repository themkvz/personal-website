import type { Lane } from "~/lib/lanes";
import { LANE_LABELS } from "~/lib/lanes";
import { cn } from "~/lib/utils";

const LANE_CLASS: Record<Lane, string> = {
  building: "text-building",
  investigating: "text-investigating",
  deciding: "text-deciding",
  keeping: "text-keeping",
};

/** The design's lane cue: a solid 8px square plus the lane name, both in the lane colour. */
export function LaneMarker({
  lane,
  className,
}: {
  lane: Lane;
  className?: string;
}) {
  return (
    <span
      className={cn("flex items-center gap-3", LANE_CLASS[lane], className)}
    >
      <span aria-hidden="true" className="size-2 shrink-0 bg-current" />
      <span className="t-label">{LANE_LABELS[lane]}</span>
    </span>
  );
}

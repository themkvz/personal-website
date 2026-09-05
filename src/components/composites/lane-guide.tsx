import { ListTree } from "lucide-react";
import { LaneMarker } from "~/components/atoms/lane-marker";
import { Overline } from "~/components/atoms/overline";
import { Surface } from "~/components/atoms/surface";
import { Workbench } from "~/constants";
import { LANE_DESCRIPTIONS, LANES } from "~/lib/lanes";
import { cn } from "~/lib/utils";

export function LaneGuide({ className }: { className?: string }) {
  return (
    <Surface className={cn("gap-6 p-8", className)}>
      <div className="flex items-center justify-between">
        <Overline>{Workbench.guideLabel}</Overline>
        <ListTree
          aria-hidden="true"
          className="size-4.5 text-muted-foreground"
        />
      </div>

      <dl className="flex flex-col gap-6">
        {LANES.map((lane) => (
          <div key={lane} className="flex flex-col gap-0.5">
            <dt>
              <LaneMarker lane={lane} />
            </dt>
            <dd className="t-body-sm pl-5 text-muted-foreground">
              {LANE_DESCRIPTIONS[lane]}
            </dd>
          </div>
        ))}
      </dl>
    </Surface>
  );
}

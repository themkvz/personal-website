import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { LaneMarker } from "~/components/atoms/lane-marker";
import { TopicChips } from "~/components/composites/topic-chips";
import type { Artifact } from "~/content";
import { artifactHref } from "~/lib/workbench-href";

/** One filed entry in the workbench index: lane, copy, topics, affordance. */
export function ArtifactRow({ artifact }: { artifact: Artifact }) {
  return (
    <article className="grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[170px_1fr_190px_auto] lg:gap-8">
      <LaneMarker lane={artifact.lane} className="lg:pt-1" />

      <div className="flex flex-col gap-2">
        <h3 className="t-title-3">
          <Link
            to={artifactHref(artifact.slug)}
            className="text-foreground underline-offset-4 hover:underline"
          >
            {artifact.title}
          </Link>
        </h3>
        <p className="t-body-sm text-muted-foreground">{artifact.summary}</p>
      </div>

      <TopicChips topics={artifact.topics ?? []} className="lg:justify-end" />

      <Link
        to={artifactHref(artifact.slug)}
        aria-hidden="true"
        tabIndex={-1}
        className="hidden text-muted-foreground transition-colors hover:text-foreground lg:mt-1 lg:block"
      >
        <ArrowUpRight className="size-4.5" />
      </Link>
    </article>
  );
}

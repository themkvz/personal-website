import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { CodeChip } from "~/components/atoms/code-chip";
import { LaneMarker } from "~/components/atoms/lane-marker";
import type { Artifact } from "~/content";
import { artifactHref } from "~/lib/workbench-href";

/** One filed entry in the workbench index: lane, copy, topics, affordance. */
export function ArtifactRow({ artifact }: { artifact: Artifact }) {
  return (
    <article className="group grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[170px_1fr_190px_auto] lg:gap-8">
      <LaneMarker lane={artifact.lane} className="lg:pt-1" />

      <div className="flex flex-col gap-2">
        <h3 className="t-title-3">
          <Link
            to={artifactHref(artifact.slug)}
            className="text-foreground underline-offset-4 group-hover:underline"
          >
            {artifact.title}
          </Link>
        </h3>
        <p className="t-body-sm text-muted-foreground">{artifact.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {artifact.topics?.map((topic) => (
          <CodeChip key={topic}>{topic}</CodeChip>
        ))}
      </div>

      <ArrowUpRight
        aria-hidden="true"
        className="hidden size-4.5 text-muted-foreground lg:block lg:mt-1"
      />
    </article>
  );
}

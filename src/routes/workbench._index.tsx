import { Link } from "~/components/atoms/link";
import { Overline } from "~/components/atoms/overline";
import { SearchTrigger } from "~/components/atoms/search-trigger";
import { ArtifactRow } from "~/components/composites/artifact-row";
import { LaneGuide } from "~/components/composites/lane-guide";
import { SectionHeader } from "~/components/composites/section-header";
import { StateFilter } from "~/components/composites/state-filter";
import { Container } from "~/components/layout/container";
import { Section } from "~/components/layout/section";
import { Workbench } from "~/constants";
import { artifacts } from "~/content";
import { isLane, LANE_LABELS } from "~/lib/lanes";
import { pageMeta } from "~/lib/meta";
import { artifactHref } from "~/lib/workbench-href";
import type { Route } from "./+types/workbench._index";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const laneParam = url.searchParams.get("lane");
  const lane = isLane(laneParam) ? laneParam : undefined;
  return { lane };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Workbench — Ihor Mukovoz",
    description: Workbench.lead,
    path: "/workbench",
  });

export default function WorkbenchIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  const { lane } = loaderData;
  const filtered = lane
    ? artifacts.filter((artifact) => artifact.lane === lane)
    : artifacts;
  const latest = artifacts[0];

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-24 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[780px] flex-col gap-8">
            <Overline>{Workbench.eyebrow}</Overline>
            <h1 className="t-display-xl whitespace-pre-line">
              {Workbench.title}
            </h1>
            <p className="t-body max-w-[720px] text-[18px] text-foreground">
              {Workbench.lead}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <SearchTrigger />
              {latest && (
                <Link to={artifactHref(latest.slug)} tone="accent">
                  {Workbench.latestCta}
                </Link>
              )}
            </div>
          </div>

          <LaneGuide className="w-full lg:w-[420px] lg:shrink-0" />
        </Container>
      </Section>

      <Section tone="muted" className="border-t border-border pt-16">
        <Container className="flex flex-col gap-12">
          <SectionHeader.Root>
            <SectionHeader.Top>
              <SectionHeader.Eyebrow>
                {Workbench.indexEyebrow}
              </SectionHeader.Eyebrow>
              <SectionHeader.Count>
                {String(filtered.length).padStart(2, "0")} ARTIFACTS
              </SectionHeader.Count>
            </SectionHeader.Top>
            <SectionHeader.Title>{Workbench.indexTitle}</SectionHeader.Title>
            <SectionHeader.Rule />
          </SectionHeader.Root>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="t-body max-w-[700px] text-muted-foreground">
              {Workbench.indexCopy}
            </p>
            <StateFilter active={lane} />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col gap-4 py-16 text-center">
              <p className="t-body text-muted-foreground">
                No artifacts are filed in{" "}
                {lane ? LANE_LABELS[lane] : "this lane"} yet.
              </p>
              <Link to="/workbench" className="mx-auto">
                Back to the full index
              </Link>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border border-t border-border">
              {filtered.map((artifact) => (
                <ArtifactRow key={artifact.slug} artifact={artifact} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

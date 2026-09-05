import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link as RouterLink } from "react-router";
import { Button } from "~/components/atoms/button";
import { CodeChip } from "~/components/atoms/code-chip";
import { LaneMarker } from "~/components/atoms/lane-marker";
import { Link } from "~/components/atoms/link";
import { Overline } from "~/components/atoms/overline";
import { Rule } from "~/components/atoms/rule";
import { Surface } from "~/components/atoms/surface";
import { SectionHeader } from "~/components/composites/section-header";
import { ToolCard } from "~/components/composites/tool-card";
import { Container } from "~/components/layout/container";
import { JsonLd } from "~/components/layout/json-ld";
import { Section } from "~/components/layout/section";
import { Home, Site, Tools as ToolsCopy } from "~/constants";
import { artifacts, tools } from "~/content";
import { LANES } from "~/lib/lanes";
import { pageMeta } from "~/lib/meta";
import { artifactHref } from "~/lib/workbench-href";
import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: `${Site.ownerName} — Software, systems, experiments`,
    description: Home.introduction,
    path: "/",
  });

function getWorkbenchPreview() {
  const featured =
    artifacts.find((artifact) => artifact.featured) ?? artifacts[0];

  const secondary = featured
    ? LANES.filter((lane) => lane !== featured.lane)
        .map((lane) => artifacts.find((artifact) => artifact.lane === lane))
        .filter((artifact) => artifact !== undefined)
    : [];

  return { featured, secondary };
}

export default function HomeRoute() {
  const { featured, secondary } = getWorkbenchPreview();

  return (
    <>
      <JsonLd
        data={{
          "@type": "WebSite",
          name: Site.name,
          url: Site.baseUrl,
        }}
      />
      <JsonLd
        data={{
          "@type": "Person",
          name: Site.ownerName,
          url: Site.baseUrl,
          email: Site.publicEmail,
        }}
      />

      <Section className="pt-22">
        <Container className="flex flex-col gap-24 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[780px] flex-col gap-8">
            <Overline>{Home.eyebrow}</Overline>
            <h1 className="t-display-xl whitespace-pre-line">
              {Home.displayStatement}
            </h1>
            <div className="flex max-w-[700px] flex-col gap-4">
              <p className="t-body text-[18px] text-foreground">
                {Home.introduction}
              </p>
              <p className="t-body text-muted-foreground">
                {Home.professionalContext}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button to="/workbench">{Home.primaryCta}</Button>
              <Link to="/about" tone="accent">
                {Home.secondaryCta}
              </Link>
            </div>
          </div>

          <Surface className="w-full gap-6 p-8 lg:w-[420px] lg:shrink-0">
            <div className="flex flex-col gap-3">
              <Overline>{Home.profileLabel}</Overline>
              <p className="t-display-sm text-foreground">{Site.ownerName}</p>
              <p className="t-body-sm text-[15px] text-muted-foreground">
                {Home.profileSummary}
              </p>
            </div>

            <Rule />

            <dl className="flex flex-col gap-4">
              {Home.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-4"
                >
                  <dt className="font-mono text-[11px] tracking-[1px] text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="font-body text-sm font-semibold text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2">
              {Home.profileTopics.map((topic) => (
                <CodeChip key={topic}>{topic}</CodeChip>
              ))}
            </div>
          </Surface>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <SectionHeader.Root>
              <SectionHeader.Top>
                <SectionHeader.Eyebrow>
                  {Home.workbenchEyebrow}
                </SectionHeader.Eyebrow>
              </SectionHeader.Top>
              <SectionHeader.Title>{Home.workbenchHeading}</SectionHeader.Title>
              <SectionHeader.Rule />
            </SectionHeader.Root>

            <p className="t-body max-w-[760px] text-[17px] text-muted-foreground">
              {Home.workbenchLead}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-24 lg:grid-cols-[760px_1fr]">
            {featured && (
              <article className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <LaneMarker lane={featured.lane} />
                  {featured.kind && <Overline>{featured.kind}</Overline>}
                </div>
                <h3 className="t-display-md">
                  <RouterLink
                    to={artifactHref(featured.slug)}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {featured.title}
                  </RouterLink>
                </h3>
                <p className="t-body text-muted-foreground">
                  {featured.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.topics?.map((topic) => (
                    <CodeChip key={topic}>{topic}</CodeChip>
                  ))}
                </div>
                <Link to={artifactHref(featured.slug)} tone="accent">
                  {Home.readFeatured}
                </Link>
              </article>
            )}

            <div className="flex flex-col">
              {secondary.map((artifact) => (
                <article
                  key={artifact.slug}
                  className="group flex flex-col gap-3 border-b border-border pb-6 last:border-b-0 [&:not(:first-child)]:pt-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <LaneMarker lane={artifact.lane} />
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <h3 className="t-title-3">
                    <RouterLink
                      to={artifactHref(artifact.slug)}
                      className="text-foreground underline-offset-4 group-hover:underline"
                    >
                      {artifact.title}
                    </RouterLink>
                  </h3>
                  <p className="t-body-sm text-muted-foreground">
                    {artifact.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.4px] text-muted-foreground">
              {Home.workbenchHint}
            </p>
            <Button to="/workbench">{Home.workbenchCta}</Button>
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-t border-border">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <SectionHeader.Root>
              <SectionHeader.Top>
                <SectionHeader.Eyebrow>
                  {Home.toolsEyebrow}
                </SectionHeader.Eyebrow>
              </SectionHeader.Top>
              <SectionHeader.Title>{Home.toolsHeading}</SectionHeader.Title>
              <SectionHeader.Rule />
            </SectionHeader.Root>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <p className="t-body max-w-[700px] text-[17px] text-muted-foreground">
                {Home.toolsBlurb}
              </p>
              <Link to="/tools" tone="accent">
                {Home.toolsCta}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard.Root key={tool.slug}>
                <ToolCard.Category>{`TOOL / ${tool.category}`}</ToolCard.Category>
                <ToolCard.Title>{tool.name}</ToolCard.Title>
                <ToolCard.Description>{tool.description}</ToolCard.Description>
                <ToolCard.Meta>
                  <CodeChip>
                    {tool.href
                      ? ToolsCopy.runtimeLabel
                      : ToolsCopy.forthcomingLabel}
                  </CodeChip>
                  {tool.href && (
                    <ToolCard.Action to={tool.href}>
                      {ToolsCopy.openCta}
                    </ToolCard.Action>
                  )}
                </ToolCard.Meta>
              </ToolCard.Root>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="size-4.5 text-investigating"
            />
            <p className="font-mono text-xs tracking-[0.3px] text-muted-foreground">
              {ToolsCopy.valueText}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

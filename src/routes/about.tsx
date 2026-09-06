import { existsSync } from "node:fs";
import { join } from "node:path";
import { ArrowUpRight, GitBranch, Layers, SquarePen } from "lucide-react";
import { Button } from "~/components/atoms/button";
import { CodeChip } from "~/components/atoms/code-chip";
import { Link } from "~/components/atoms/link";
import { Overline } from "~/components/atoms/overline";
import { Rule } from "~/components/atoms/rule";
import { SOCIAL_ICONS } from "~/components/atoms/social-icons";
import { Surface } from "~/components/atoms/surface";
import { SectionHeader } from "~/components/composites/section-header";
import { Container } from "~/components/layout/container";
import { Section } from "~/components/layout/section";
import { About, Site } from "~/constants";
import { experience, experienceBodies } from "~/content";
import { pageMeta } from "~/lib/meta";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { useTrack } from "~/lib/openpanel/useOpenPanel";
import type { Route } from "./+types/about";

const PRACTICE_ICONS = {
  layers: Layers,
  branch: GitBranch,
  note: SquarePen,
};

export function loader() {
  const hasResume = existsSync(join(process.cwd(), "public", "resume.pdf"));
  return { hasResume };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "About — Ihor Mukovoz",
    description: About.lead,
    path: "/about",
  });

function formatPeriod(startDate: string, endDate?: string): string {
  const startYear = startDate.slice(0, 4);
  const endYear = endDate ? endDate.slice(0, 4) : "NOW";
  return `${startYear} — ${endYear}`;
}

export default function AboutRoute({ loaderData }: Route.ComponentProps) {
  const { hasResume } = loaderData;
  const track = useTrack();

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-24 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[780px] flex-col gap-8">
            <Overline>{About.eyebrow}</Overline>
            <h1 className="t-display-xl whitespace-pre-line">{About.title}</h1>
            <div className="flex max-w-[720px] flex-col gap-4">
              <p className="t-body text-[18px] text-foreground">{About.lead}</p>
              <p className="t-body text-muted-foreground">{About.detail}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {hasResume && (
                <Button href={Site.resumeHref}>{About.resumeCta}</Button>
              )}
              <Link
                href={`mailto:${Site.publicEmail}`}
                tone="accent"
                onClick={() => track(TRACK_EVENTS.CONTACT_EMAIL_CLICKED)}
              >
                {About.emailCta}
              </Link>
            </div>
          </div>

          <Surface className="w-full gap-6 p-8 lg:w-[420px] lg:shrink-0">
            <Overline>{About.practiceLabel}</Overline>
            <p className="t-display-sm text-foreground">
              {About.practiceHeading}
            </p>
            <p className="t-body-sm text-[15px] text-muted-foreground">
              {About.practiceCopy}
            </p>

            <Rule />

            <ul className="flex flex-col gap-3">
              {About.practicePoints.map((point) => {
                const Icon = PRACTICE_ICONS[point.icon];
                return (
                  <li key={point.label} className="flex items-center gap-3">
                    <Icon
                      aria-hidden="true"
                      className="size-4.5 shrink-0 text-building"
                    />
                    <span className="font-body text-sm font-semibold text-foreground">
                      {point.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-2">
              {About.practiceTopics.map((topic) => (
                <CodeChip key={topic}>{topic}</CodeChip>
              ))}
            </div>
          </Surface>
        </Container>
      </Section>

      <Section tone="muted" className="border-t border-border">
        <Container className="flex flex-col gap-12">
          <SectionHeader.Root>
            <SectionHeader.Top>
              <SectionHeader.Eyebrow>
                {About.practiceSectionEyebrow}
              </SectionHeader.Eyebrow>
            </SectionHeader.Top>
            <SectionHeader.Title>
              {About.practiceSectionTitle}
            </SectionHeader.Title>
            <SectionHeader.Rule />
          </SectionHeader.Root>

          <p className="t-body max-w-[780px] text-[17px] text-muted-foreground">
            {About.practiceIntroduction}
          </p>

          <Rule />

          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {About.practiceColumns.map((column, index) => (
              <div key={column.title} className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <Overline>{String(index + 1).padStart(2, "0")}</Overline>
                  <Overline>{column.label}</Overline>
                </div>
                <h3 className="t-display-sm">{column.title}</h3>
                <p className="t-body-sm text-[15px] text-muted-foreground">
                  {column.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {column.topics.map((topic) => (
                    <CodeChip key={topic}>{topic}</CodeChip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container className="flex flex-col gap-12">
          <SectionHeader.Root>
            <SectionHeader.Top>
              <SectionHeader.Eyebrow>
                {About.experienceEyebrow}
              </SectionHeader.Eyebrow>
            </SectionHeader.Top>
            <SectionHeader.Title>{About.experienceTitle}</SectionHeader.Title>
            <SectionHeader.Rule />
          </SectionHeader.Root>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="t-body max-w-[720px] text-[17px] text-muted-foreground">
              {About.experienceCopy}
            </p>
            {hasResume && (
              <Link href={Site.resumeHref} tone="accent">
                {About.experienceCta}
              </Link>
            )}
          </div>

          <div className="flex flex-col divide-y divide-border border-t border-border">
            {experience.map((entry) => {
              const Body = experienceBodies[entry.slug];
              return (
                <article
                  key={entry.slug}
                  className="grid grid-cols-1 items-start gap-4 py-7 lg:grid-cols-[110px_300px_1fr_auto] lg:gap-12"
                >
                  <p className="font-mono text-xs tracking-[0.6px] text-muted-foreground">
                    {formatPeriod(entry.startDate, entry.endDate)}
                  </p>

                  <div className="flex flex-col gap-2">
                    <h3 className="t-display-sm">{entry.organisation}</h3>
                    <Overline>{entry.role.toUpperCase()}</Overline>
                  </div>

                  <div className="t-body-sm text-[15px] text-muted-foreground">
                    {Body ? <Body /> : null}
                  </div>

                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${entry.organisation} website`}
                    >
                      <ArrowUpRight className="size-4.5 text-muted-foreground" />
                    </a>
                  ) : (
                    <span />
                  )}
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="accent" className="border-t border-border">
        <Container className="flex flex-col gap-24 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[760px] flex-col gap-6">
            <Overline className="text-accent-foreground">
              {About.contactEyebrow}
            </Overline>
            <h2 className="t-display-md">{About.contactTitle}</h2>
            <p className="t-body max-w-[760px] text-[17px] text-muted-foreground">
              {About.contactCopy}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                href={`mailto:${Site.publicEmail}`}
                onClick={() => track(TRACK_EVENTS.CONTACT_EMAIL_CLICKED)}
              >
                {About.contactEmailCta}
              </Button>
              {hasResume && (
                <Link href={Site.resumeHref} tone="accent">
                  {About.contactResumeCta}
                </Link>
              )}
            </div>
          </div>

          <Surface className="w-full gap-4 p-8 lg:w-[440px] lg:shrink-0">
            <Overline>{About.elsewhereLabel}</Overline>
            {About.elsewhere.map((entry) => {
              const Icon = SOCIAL_ICONS[entry.icon];
              return (
                <div key={entry.label} className="flex items-start gap-3">
                  <Icon
                    aria-hidden="true"
                    className="mt-0.5 size-4.5 shrink-0 text-building"
                  />
                  <div className="flex flex-col gap-0.5">
                    <Link
                      to={"to" in entry ? entry.to : undefined}
                      href={"href" in entry ? entry.href : undefined}
                      className="text-[15px]"
                    >
                      {entry.label} →
                    </Link>
                    <p className="t-body-sm text-[13px] text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </Surface>
        </Container>
      </Section>
    </>
  );
}

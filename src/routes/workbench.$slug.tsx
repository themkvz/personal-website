import { Suspense } from "react";
import { data } from "react-router";
import { CodeChip } from "~/components/atoms/code-chip";
import { Link } from "~/components/atoms/link";
import { MetaStamp } from "~/components/atoms/meta-stamp";
import { Rule } from "~/components/atoms/rule";
import { Tag } from "~/components/atoms/tag";
import { Breadcrumb } from "~/components/composites/breadcrumb";
import { Container } from "~/components/layout/container";
import { JsonLd } from "~/components/layout/json-ld";
import { Prose } from "~/components/layout/prose";
import { Section } from "~/components/layout/section";
import { Site } from "~/constants";
import { artifacts, bodies } from "~/content";
import { userContext } from "~/context/user";
import { formatDate } from "~/lib/format-date";
import { LANE_LABELS } from "~/lib/lanes";
import { DEFAULT_OG_IMAGE, pageMeta } from "~/lib/meta";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { artifactHref, laneHref } from "~/lib/workbench-href";
import type { Route } from "./+types/workbench.$slug";

export function loader({ params, context }: Route.LoaderArgs) {
  const { analytics } = context.get(userContext);
  const artifact = artifacts.find((entry) => entry.slug === params.slug);

  // Fire-and-forget: analytics must never delay the document or hold a 404
  // open. The SDK swallows its own transport failures, so nothing can reject
  // here, and `react-router-serve` outlives the request that started the POST.
  if (!artifact) {
    void analytics.track(TRACK_EVENTS.ARTIFACT_NOT_FOUND, {
      slug: params.slug,
    });
    throw data(null, { status: 404 });
  }

  return { artifact };
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) {
    return pageMeta({
      title: "Not found — Workbench",
      description: "This artifact could not be found.",
      noIndex: true,
    });
  }

  const { artifact } = loaderData;

  return pageMeta({
    title: `${artifact.title} — Workbench`,
    description: artifact.summary,
    path: artifactHref(artifact.slug),
    article: {
      publishedTime: artifact.publishedAt,
      modifiedTime: artifact.updatedAt,
    },
  });
};

export default function ArtifactRoute({ loaderData }: Route.ComponentProps) {
  const { artifact } = loaderData;
  const Body = bodies[artifact.slug];
  const url = `${Site.baseUrl}${artifactHref(artifact.slug)}`;

  return (
    <Section className="pt-16">
      <Container className="flex max-w-measure flex-col gap-6">
        <JsonLd
          data={{
            "@type": "Article",
            headline: artifact.title,
            datePublished: artifact.publishedAt,
            ...(artifact.updatedAt && { dateModified: artifact.updatedAt }),
            description: artifact.summary,
            author: {
              "@type": "Person",
              name: Site.ownerName,
              url: Site.baseUrl,
            },
            mainEntityOfPage: url,
            image: DEFAULT_OG_IMAGE,
          }}
        />
        <JsonLd
          data={{
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Workbench",
                item: `${Site.baseUrl}/workbench`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: artifact.title,
                item: url,
              },
            ],
          }}
        />

        <Breadcrumb>
          <Breadcrumb.Crumb to="/workbench">Workbench</Breadcrumb.Crumb>
          <Breadcrumb.Sep />
          <Breadcrumb.Crumb to={laneHref(artifact.lane)}>
            {LANE_LABELS[artifact.lane]}
          </Breadcrumb.Crumb>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <Tag lane={artifact.lane}>{artifact.lane.toUpperCase()}</Tag>
          <MetaStamp dateTime={artifact.publishedAt}>
            {formatDate(artifact.publishedAt)}
            {artifact.updatedAt &&
              ` · UPDATED ${formatDate(artifact.updatedAt)}`}
          </MetaStamp>
        </div>

        <h1 className="t-display-lg">{artifact.title}</h1>
        <p className="t-body text-muted-foreground">{artifact.summary}</p>

        <Rule />

        <Prose>
          <Suspense fallback={null}>{Body && <Body />}</Suspense>
        </Prose>

        <Rule />

        <div className="flex flex-wrap items-center justify-between gap-4">
          {artifact.topics && artifact.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artifact.topics.map((topic) => (
                <CodeChip key={topic}>{topic}</CodeChip>
              ))}
            </div>
          )}
          <Link to="/workbench">Back to the Workbench</Link>
        </div>
      </Container>
    </Section>
  );
}

import { data } from "react-router";
import { Link } from "~/components/atoms/link";
import { Rule } from "~/components/atoms/rule";
import { Breadcrumb } from "~/components/composites/breadcrumb";
import { Container } from "~/components/layout/container";
import { JsonLd } from "~/components/layout/json-ld";
import { Prose } from "~/components/layout/prose";
import { Section } from "~/components/layout/section";
import { Glossary, Site } from "~/constants";
import { artifacts, termBodies, terms } from "~/content";
import { pageMeta } from "~/lib/meta";
import { artifactHref, glossaryHref } from "~/lib/workbench-href";
import type { Route } from "./+types/glossary.$slug";

export function loader({ params }: Route.LoaderArgs) {
  const term = terms.find((entry) => entry.slug === params.slug);

  if (!term) {
    throw data(null, { status: 404 });
  }

  return { term };
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) {
    return pageMeta({
      title: "Not found — Glossary",
      description: "This term could not be found.",
      noIndex: true,
    });
  }

  const { term } = loaderData;

  return pageMeta({
    title: `${term.term} — Glossary`,
    description: term.summary,
    path: glossaryHref(term.slug),
  });
};

export default function GlossaryTermRoute({
  loaderData,
}: Route.ComponentProps) {
  const { term } = loaderData;
  const Body = termBodies[term.slug];

  const relatedTerms = (term.related ?? [])
    .map((slug) => terms.find((entry) => entry.slug === slug))
    .filter((entry) => entry !== undefined);

  const usedInArtifacts = artifacts.filter((artifact) =>
    artifact.topics?.includes(term.slug),
  );

  return (
    <Section className="pt-16">
      <Container className="flex max-w-measure flex-col gap-6">
        <JsonLd
          data={{
            "@type": "DefinedTerm",
            name: term.term,
            description: term.summary,
            url: `${Site.baseUrl}${glossaryHref(term.slug)}`,
            inDefinedTermSet: `${Site.baseUrl}/glossary`,
            ...(term.aka && term.aka.length > 0 && { alternateName: term.aka }),
          }}
        />
        <JsonLd
          data={{
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Glossary",
                item: `${Site.baseUrl}/glossary`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: term.term,
                item: `${Site.baseUrl}${glossaryHref(term.slug)}`,
              },
            ],
          }}
        />

        <Breadcrumb>
          <Breadcrumb.Crumb to="/glossary">Glossary</Breadcrumb.Crumb>
        </Breadcrumb>

        <h1 className="t-display-lg">{term.term}</h1>
        {term.aka && term.aka.length > 0 && (
          <p className="t-body-sm text-muted-foreground">
            {term.aka.join(", ")}
          </p>
        )}
        <p className="t-body text-muted-foreground">{term.summary}</p>

        <Rule />

        <Prose>{Body && <Body />}</Prose>

        <Rule />

        <div className="flex flex-col gap-6">
          {relatedTerms.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="t-label text-muted-foreground">
                {Glossary.relatedLabel}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {relatedTerms.map((related) => (
                  <Link key={related.slug} to={glossaryHref(related.slug)}>
                    {related.term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {usedInArtifacts.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="t-label text-muted-foreground">
                {Glossary.usedInLabel}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {usedInArtifacts.map((artifact) => (
                  <Link key={artifact.slug} to={artifactHref(artifact.slug)}>
                    {artifact.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link to="/glossary">{Glossary.backCta}</Link>
        </div>
      </Container>
    </Section>
  );
}

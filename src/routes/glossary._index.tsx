import { Overline } from "~/components/atoms/overline";
import { SectionHeader } from "~/components/composites/section-header";
import { TermRow } from "~/components/composites/term-row";
import { Container } from "~/components/layout/container";
import { JsonLd } from "~/components/layout/json-ld";
import { Section } from "~/components/layout/section";
import { Glossary, Site } from "~/constants";
import { terms } from "~/content";
import { pageMeta } from "~/lib/meta";
import { glossaryHref } from "~/lib/workbench-href";
import type { Route } from "./+types/glossary._index";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Glossary — Ihor Mukovoz",
    description: Glossary.lede,
    path: "/glossary",
  });

export default function GlossaryIndexRoute() {
  return (
    <>
      <Section>
        <Container>
          <div className="flex max-w-[780px] flex-col gap-8">
            <Overline>{Glossary.eyebrow}</Overline>
            <h1 className="t-display-xl whitespace-pre-line">
              {Glossary.title}
            </h1>
            <p className="t-body max-w-[720px] text-[18px] text-foreground">
              {Glossary.lede}
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-t border-border pt-16">
        <Container className="flex flex-col gap-12">
          <JsonLd
            data={{
              "@type": "DefinedTermSet",
              name: "Glossary",
              url: `${Site.baseUrl}/glossary`,
              hasDefinedTerm: terms.map((term) => ({
                "@type": "DefinedTerm",
                name: term.term,
                description: term.summary,
                url: `${Site.baseUrl}${glossaryHref(term.slug)}`,
              })),
            }}
          />

          <SectionHeader.Root>
            <SectionHeader.Top>
              <SectionHeader.Eyebrow>
                {Glossary.indexEyebrow}
              </SectionHeader.Eyebrow>
              <SectionHeader.Count>
                {String(terms.length).padStart(2, "0")} TERMS
              </SectionHeader.Count>
            </SectionHeader.Top>
            <SectionHeader.Title>{Glossary.indexTitle}</SectionHeader.Title>
            <SectionHeader.Rule />
          </SectionHeader.Root>

          <p className="t-body max-w-[700px] text-muted-foreground">
            {Glossary.indexCopy}
          </p>

          {terms.length === 0 ? (
            <div className="flex flex-col gap-4 py-16 text-center">
              <p className="t-body text-muted-foreground">
                {Glossary.emptyState}
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border border-t border-border">
              {terms.map((term) => (
                <TermRow key={term.slug} term={term} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

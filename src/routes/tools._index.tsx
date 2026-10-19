import { CodeChip } from "~/components/atoms/code-chip";
import { Overline } from "~/components/atoms/overline";
import { SectionHeader } from "~/components/composites/section-header";
import { ToolCard } from "~/components/composites/tool-card";
import { Container } from "~/components/layout/container";
import { Section } from "~/components/layout/section";
import { Tools } from "~/constants";
import { tools } from "~/content";
import { pageMeta } from "~/lib/meta";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/tools._index";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Tools | Ihor Mukovoz",
    description: Tools.lede,
    path: "/tools",
  });

export default function ToolsIndexRoute() {
  return (
    <Section>
      <Container className="flex flex-col gap-16">
        <div className="flex max-w-[780px] flex-col gap-8">
          <Overline>{Tools.eyebrow}</Overline>
          <h1 className="t-display-xl whitespace-pre-line">{Tools.title}</h1>
          <p className="t-body max-w-[720px] text-[18px] text-foreground">
            {Tools.lede}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeader.Root>
            <SectionHeader.Top>
              <SectionHeader.Eyebrow>
                {Tools.collectionEyebrow}
              </SectionHeader.Eyebrow>
            </SectionHeader.Top>
            <SectionHeader.Title>{Tools.collectionTitle}</SectionHeader.Title>
            <SectionHeader.Rule />
          </SectionHeader.Root>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard.Root
                key={tool.slug}
                className={cn(tool.featured && "bg-accent")}
              >
                <ToolCard.Category>{tool.category}</ToolCard.Category>
                <ToolCard.Title>{tool.name}</ToolCard.Title>
                <ToolCard.Description>{tool.description}</ToolCard.Description>
                <ToolCard.Meta>
                  <CodeChip>
                    {tool.href ? Tools.runtimeLabel : Tools.forthcomingLabel}
                  </CodeChip>
                  {tool.href && (
                    <ToolCard.Action to={tool.href}>
                      {Tools.openCta}
                    </ToolCard.Action>
                  )}
                </ToolCard.Meta>
              </ToolCard.Root>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

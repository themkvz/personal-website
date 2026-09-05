import { ShieldCheck } from "lucide-react";
import { CodeChip } from "~/components/atoms/code-chip";
import { Overline } from "~/components/atoms/overline";
import { Rule } from "~/components/atoms/rule";
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
    title: "Tools — Ihor Mukovoz",
    description: Tools.lede,
    path: "/tools",
  });

export default function ToolsIndexRoute() {
  return (
    <Section>
      <Container className="flex flex-col gap-16">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[816px] flex-1 flex-col gap-2">
            <Overline>{Tools.eyebrow}</Overline>
            <h1 className="t-display-xl">{Tools.title}</h1>
            <Rule className="mt-6" />
          </div>
          <p className="t-body max-w-[416px] text-[20px] text-foreground">
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

          <div className="flex items-center gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="size-4.5 text-investigating"
            />
            <p className="font-mono text-xs tracking-[0.3px] text-muted-foreground">
              {Tools.valueText}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

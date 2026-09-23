import { Link } from "react-router";
import { CodeChip } from "~/components/atoms/code-chip";
import { termSlugs } from "~/content";
import { cn } from "~/lib/utils";
import { glossaryHref } from "~/lib/workbench-href";

/** Topic chips; a topic with a published glossary term links to it. */
export function TopicChips({
  topics,
  className,
}: {
  topics: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {topics.map((topic) =>
        termSlugs.has(topic) ? (
          <Link key={topic} to={glossaryHref(topic)} className="group/chip">
            <CodeChip className="transition-colors group-hover/chip:bg-accent group-hover/chip:text-accent-foreground">
              {topic}
            </CodeChip>
          </Link>
        ) : (
          <CodeChip key={topic}>{topic}</CodeChip>
        ),
      )}
    </div>
  );
}

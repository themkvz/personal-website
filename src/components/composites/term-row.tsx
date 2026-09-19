import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { GlossaryTerm } from "~/content";
import { glossaryHref } from "~/lib/workbench-href";

/** One filed entry in the glossary index: term, aliases, definition, affordance. */
export function TermRow({ term }: { term: GlossaryTerm }) {
  return (
    <article className="group grid grid-cols-1 items-start gap-4 py-6 lg:grid-cols-[220px_1fr_auto] lg:gap-8">
      <h3 className="t-title-3">
        <Link
          to={glossaryHref(term.slug)}
          className="text-foreground underline-offset-4 group-hover:underline"
        >
          {term.term}
        </Link>
        {term.aka && term.aka.length > 0 && (
          <span className="t-body-sm block text-muted-foreground">
            {term.aka.join(", ")}
          </span>
        )}
      </h3>

      <p className="t-body-sm text-muted-foreground">{term.summary}</p>

      <ArrowUpRight
        aria-hidden="true"
        className="hidden size-4.5 text-muted-foreground lg:block lg:mt-1"
      />
    </article>
  );
}

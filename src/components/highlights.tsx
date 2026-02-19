import { HIGHLIGHTS } from "../constants";
import { CountUp } from "./count-up";
import { SectionHeading } from "./section-heading";

export function Highlights() {
  return (
    <section className="py-16 container mx-auto px-4">
      <SectionHeading>Highlights</SectionHeading>

      <div className="mt-6 grid gap-6 grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((highlight, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <div key={index}>
            <CountUp
              from={1}
              to={highlight.to}
              after={highlight.after}
              className="text-[clamp(4rem,8vw,8rem)] font-bold tracking-tight"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              {highlight.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

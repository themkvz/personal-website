import { Briefcase, CheckCircleIcon } from "lucide-react";
import { Experience } from "../constants";
import { SectionHeading } from "./section-heading";

export function ExperienceTimeline() {
  return (
    <section className="py-16 container">
      <SectionHeading>Experience</SectionHeading>

      <div className="relative mt-8 ml-3 border-l border-foreground/10 pl-8">
        {Experience.jobs.map((job, index) => (
          <div
            key={`${job.company}-${job.period}`}
            className={`relative ${index < Experience.jobs.length - 1 ? "pb-10" : ""}`}
          >
            {/* Timeline dot */}
            <div className="absolute -left-[calc(2rem+12px)] flex size-6 items-center justify-center rounded-full border border-foreground/10 bg-background">
              {index === 0 ? (
                <Briefcase className="size-3 text-muted-foreground" />
              ) : (
                <CheckCircleIcon className="size-3 text-muted-foreground" />
              )}
            </div>

            {/* Period */}
            <p className="font-mono text-xs text-muted-foreground">
              {job.period}
            </p>

            {/* Role & Company */}
            <h3 className="mt-1 font-semibold">{job.role}</h3>
            <p className="text-sm text-muted-foreground">
              {job.company} · {job.location}
            </p>

            {/* Description */}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>

            {/* Site link */}
            {job.site && (
              <a
                href={job.site}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {job.site}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

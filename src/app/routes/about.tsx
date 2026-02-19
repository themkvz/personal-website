import { Briefcase, GraduationCap, Heart, MapPin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { EXPERIENCE, NOTABLE_PROJECTS, TECH_STACK } from "~/constants";

export function meta() {
  return [
    { title: "About — Ihor Mukovoz" },
    {
      name: "description",
      content:
        "Learn more about Ihor Mukovoz — Full-Stack Developer with 8+ years of experience.",
    },
    { property: "og:title", content: "About — Ihor Mukovoz" },
    {
      property: "og:description",
      content:
        "Learn more about Ihor Mukovoz — Full-Stack Developer with 8+ years of experience.",
    },
  ];
}

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Intro */}
      <section className="py-16 sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About me
        </h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
          <p>
            I'm a developer with 8+ years of experience spanning PHP/WordPress,
            JavaScript/TypeScript, React, Next.js, and mobile development with
            Expo. Based in Lviv, Ukraine.
          </p>
          <p>
            I'm constantly striving to learn new technologies and looking for
            ways to improve in the rapidly changing industry. Curious about new
            possibilities and always happy to implement them into my work
            process.
          </p>
          <p className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            Lviv, Ukraine
          </p>
        </div>
      </section>

      <Separator />

      {/* Experience */}
      <section className="py-16">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Briefcase className="h-5 w-5" />
          Experience
        </h2>

        <div className="mt-8 space-y-10">
          {EXPERIENCE.map((job) => (
            <div key={`${job.company}-${job.period}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-medium">{job.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.company} · {job.location}
                  </p>
                  {job.site && (
                    <a
                      href={job.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-muted-foreground transition-colors underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {job.site}
                    </a>
                  )}
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {job.period}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {job.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Notable Projects */}
      <section className="py-16">
        <h2 className="text-lg font-semibold tracking-tight">
          Notable and Public Projects
        </h2>
        <div className="mt-8 space-y-6">
          {NOTABLE_PROJECTS.map((project) => (
            <div key={project.name}>
              <div className="flex items-baseline gap-2">
                <h3 className="font-medium">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <>{project.name}</>
                  )}
                </h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description}
              </p>

              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted-foreground transition-colors underline-offset-4 hover:text-foreground hover:underline"
                >
                  {project.url}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Tech Stack */}
      <section className="py-16">
        <h2 className="text-lg font-semibold tracking-tight">Tech Stack</h2>
        <div className="mt-8 space-y-6">
          {Object.entries(TECH_STACK).map(([category, techs]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground">
                {category}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Volunteering */}
      <section className="py-16">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Heart className="h-5 w-5" />
          Volunteering
        </h2>
        <div className="mt-6">
          <h3 className="font-medium">Я-Доброволець</h3>
          <p className="font-mono text-xs text-muted-foreground">June 2024</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Developed a cross-platform mobile application (Android & iOS) and
            built the admin dashboard using React. Collaborated with a team to
            ensure seamless integration with the government register and
            compliance with regulatory requirements.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://apps.apple.com/ua/app/%D1%8F-%D0%B4%D0%BE%D0%B1%D1%80%D0%BE%D0%B2%D0%BE%D0%BB%D0%B5%D1%86%D1%8C/id6739776489"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/apple-store.svg"
                alt="Download on the App Store"
                className="h-10"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=ua.ivolunteer&hl=uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/google-store.svg"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a>
          </div>
        </div>
      </section>

      <Separator />

      {/* Education */}
      <section className="py-16">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <GraduationCap className="h-5 w-5" />
          Education
        </h2>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-medium">English for IT</h3>
            <p className="text-sm text-muted-foreground">
              Yappi School · Feb 2023 — Jun 2023
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Kamianets-Podilsky Ivan Ohienko National University
            </h3>
            <p className="text-sm text-muted-foreground">
              Specialist Degree · 2007 — 2012
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

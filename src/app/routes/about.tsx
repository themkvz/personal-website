import { Briefcase, GraduationCap, Heart, MapPin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

const experience = [
  {
    role: "Full-Stack Developer",
    company: "Forex Tester Software",
    location: "Lviv",
    period: "June 2024 — Present",
    description:
      "Rebuilding the public website and internal dashboard, transitioning legacy systems to a modern technology stack. Enhanced UI/UX, streamlined workflows, and improved scalability.",
  },
  {
    role: "Lead Developer",
    company: "DevOut Labs (Altum Software)",
    location: "Lviv",
    period: "Sep 2022 — Mar 2024",
    description:
      "Led development team designing websites and applications. Conducted technical code reviews, allocated tasks, onboarded new teammates. Increased sales through highly integrated systems and extended the team via tech interviews.",
  },
  {
    role: "Full-Stack Developer",
    company: "Altum Agency (Altum Software)",
    location: "Lviv",
    period: "Mar 2022 — Sep 2022",
    description:
      "Created WordPress-based sites, performed technical reviews for junior developers, outlined project scope. Increased client base and improved team code quality.",
  },
  {
    role: "Full-Stack Developer",
    company: "Deosebit Service SRL",
    location: "Chisinau",
    period: "Aug 2017 — Jun 2022",
    description:
      "Created projects for customers across multiple countries in a small SEO-oriented team. Built WordPress sites, managed VPS servers, and found new market opportunities.",
  },
  {
    role: "Front-End Developer",
    company: "Freelance",
    location: "Remote",
    period: "Jan 2013 — Jan 2019",
    description:
      "Starting point in IT. Fully engaged in the entire development process — from client communication to deployment.",
  },
];

const notableProjects = [
  {
    name: "TrekMovers",
    url: "https://trekmovers.com/",
    description: "Forbes list company with custom CRM integration",
  },
  {
    name: "Karcher Regional Shops",
    description:
      "E-commerce platform deployed across 8 countries (RS, GE, KZ, BG, AZ, AM, MD, BY)",
  },
  {
    name: "Web3 Validator",
    url: "https://web3validator.info/",
    description: "Knowledge base for blockchain",
  },
  {
    name: "AviaSim",
    url: "https://aviasim.com.ua/",
    description: "Flight simulator booking platform",
  },
  {
    name: "NSP25",
    url: "https://nsp25.md/ro/",
    description: "Multi-vendor platform with subdomain support for co-agents",
  },
];

const techStack = {
  Frontend: [
    "React",
    "React Router",
    "Next.js",
    "Remix",
    "Expo",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "SASS/SCSS",
    "HTML5",
    "CSS3",
  ],
  Backend: ["Node.js", "Express.js", "Fastify", "PHP", "WordPress", "REST API"],
  "Data & Tools": [
    "Prisma",
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Supabase",
    "AWS",
    "Git",
    "Jest",
    "PHPUnit",
  ],
  Patterns: ["MVC", "MVVM", "PWA", "Headless CMS"],
};

export function meta() {
  return [
    { title: "About — Ihor Mukovoz" },
    {
      name: "description",
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
          {experience.map((job) => (
            <div key={`${job.company}-${job.period}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-medium">{job.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.company} · {job.location}
                  </p>
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
          Notable Projects
        </h2>
        <div className="mt-8 space-y-6">
          {notableProjects.map((project) => (
            <div key={project.name}>
              <div className="flex items-baseline gap-2">
                <h3 className="font-medium">{project.name}</h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ↗
                  </a>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Tech Stack */}
      <section className="py-16">
        <h2 className="text-lg font-semibold tracking-tight">Tech Stack</h2>
        <div className="mt-8 space-y-6">
          {Object.entries(techStack).map(([category, techs]) => (
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
          <h3 className="font-medium">Я-Доброволець (I-Volunteer)</h3>
          <p className="font-mono text-xs text-muted-foreground">June 2024</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Developed a cross-platform mobile application (Android & iOS) and
            built the admin dashboard using React. Collaborated with a team to
            ensure seamless integration with the government register and
            compliance with regulatory requirements.
          </p>
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

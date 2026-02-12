import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const skills = [
  "React",
  "TypeScript",
  "Next.js",
  "React Router",
  "Node.js",
  "Express.js",
  "Fastify",
  "Zustand",
  "Prisma",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Tailwind CSS",
  "PHP",
  "WordPress",
  "REST API",
  "PWA",
  "AWS",
  "Expo",
  "Git",
];

export function meta() {
  return [
    { title: "Ihor Mukovoz — Full-Stack Developer" },
    {
      name: "description",
      content:
        "Full-Stack Developer & Tech Lead with 8+ years of experience building modern web applications.",
    },
  ];
}

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <p className="font-mono text-sm text-muted-foreground">Hi there 👋</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Ihor Mukovoz
        </h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Full-Stack Developer & Tech Lead
        </p>
        <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
          Developer with 8+ years of experience building modern web
          applications. Specializing in React, TypeScript, and Node.js
          ecosystems. Passionate about clean architecture, great user
          experiences, and turning complex problems into simple solutions.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Button asChild>
            <Link to="/contact">
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/about">About me</Link>
          </Button>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <a
            href="https://github.com/themkvz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/ihor-mukovoz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </section>

      <Separator />

      {/* Skills */}
      <section className="py-16">
        <h2 className="text-lg font-semibold tracking-tight">
          Skills & Technologies
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <Separator />

      {/* Quick highlights */}
      <section className="py-16">
        <h2 className="text-lg font-semibold tracking-tight">Highlights</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold tracking-tight">8+</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Years of experience
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">20+</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Projects delivered
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">8</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Countries served
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

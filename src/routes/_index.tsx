import { ExperienceTimeline } from "../components/experience-timeline";
import { Hero } from "../components/hero";
import { Highlights } from "../components/highlights";
import { Skills } from "../components/skills";
import { Separator } from "../components/ui/separator";

export function meta() {
  return [
    { title: "Ihor M. — Senior Full-Stack & Front-End Developer" },
    {
      name: "description",
      content:
        "Expert Full-Stack Developer specializing in React, TypeScript, and high-performance web applications. Delivering scalable front-end solutions and robust back-end architecture.",
    },
    {
      property: "og:title",
      content: "Ihor M. — Senior Full-Stack & Front-End Developer",
    },
    {
      property: "og:description",
      content:
        "Expert Full-Stack Developer specializing in React, TypeScript, and high-performance web applications. Delivering scalable front-end solutions and robust back-end architecture.",
    },
  ];
}

export default function Home() {
  return (
    <div className="">
      {/* Hero */}
      <Hero />

      {/* Skills */}
      <Skills />

      <Separator />

      {/* Quick highlights */}
      <Highlights />

      <Separator />

      {/* Experience */}
      <ExperienceTimeline />
    </div>
  );
}

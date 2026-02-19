import { Hero } from "~/components/hero";
import { Highlights } from "~/components/highlights";
import { Skills } from "~/components/skills";
import { Separator } from "~/components/ui/separator";

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
      <Hero />

      {/* Skills */}
      <Skills />

      <Separator />

      {/* Quick highlights */}
      <Highlights />
    </div>
  );
}

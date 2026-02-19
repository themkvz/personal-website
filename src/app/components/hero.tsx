import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function Hero() {
  return (
    <section
      className="-mt-header px-6 pt-28 pb-60 lg:pt-36 lg:pb-72 text-center flex flex-col items-center bg-cover bg-bottom bg-no-repeat"
      style={{
        backgroundImage: "url('/hero.webp')",
      }}
    >
      <p className="font-mono text-sm text-gray-50">Hi there 👋</p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl text-white">
        Ihor Mukovoz
      </h1>

      <p className="mt-2 text-xl text-gray-50">
        Full-Stack Developer & Tech Lead
      </p>

      <p className="mt-6 max-w-xl leading-relaxed text-gray-50">
        Developer with 8+ years of experience building modern web applications.
        Specializing in React, TypeScript, and Node.js ecosystems. Passionate
        about clean architecture, great user experiences, and turning complex
        problems into simple solutions.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Button render={<Link to="/contact" />}>
          Get in touch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button variant="outline" render={<Link to="/about" />}>
          About me
        </Button>
      </div>
    </section>
  );
}

import { ArrowRight, Github, Linkedin } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <p className="font-mono text-sm text-muted-foreground">Hi there 👋</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Ihor Mukovoz
      </h1>
      <p className="mt-2 text-xl text-muted-foreground">
        Full-Stack Developer & Tech Lead
      </p>
      <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
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
  );
}

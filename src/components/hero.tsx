import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { TRACK_EVENTS } from "~/lib/openpanel/events";
import { useTrack } from "~/lib/openpanel/useOpenPanel";
import { Button } from "./ui/button";

export function Hero() {
  const track = useTrack();

  return (
    <section className="dark -mt-header px-6 pt-28 pb-60 lg:pt-36 lg:pb-72 text-center flex flex-col items-center relative overflow-hidden text-secondary">
      <img
        className="absolute inset-0 w-full h-full -z-10 object-cover object-center pointer-events-none"
        width="100%"
        height="100%"
        title="hero background"
        alt="hero background"
        src="/hero.webp"
        fetchPriority="high"
      />

      <p className="font-mono text-sm uppercase">
        Architecting High-Performance Solutions
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
        Ihor Mukovoz
      </h1>

      <p className="mt-2 text-xl">Full-Stack & Frond-End Engineer</p>

      <div className="mt-6 max-w-2xl text-center space-y-4">
        <p className="text-lg leading-relaxed">
          Specializing in <strong>React</strong>, <strong>TypeScript</strong>,
          and scalable <strong>Node.js</strong> architectures. I leverage AI
          tools to amplify productivity and code quality—using them as powerful
          instruments to deliver robust, high-performance web applications
          faster.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button
          size="lg"
          render={<Link to="/contact" />}
          nativeButton={false}
          onClick={() => track(TRACK_EVENTS.HERO_GET_IN)}
        >
          Get in touch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          render={<Link to="/about" />}
          nativeButton={false}
          onClick={() => track(TRACK_EVENTS.HERO_ABOUT_CLICKED)}
          className="dark:bg-transparent dark:hover:border-muted dark:hover:bg-muted"
        >
          About
        </Button>
      </div>
    </section>
  );
}

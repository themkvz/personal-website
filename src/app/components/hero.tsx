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
      <p className="font-mono text-sm text-gray-50 uppercase">
        Architecting High-Performance Solutions
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl text-white">
        Ihor Mukovoz
      </h1>

      <p className="mt-2 text-xl text-gray-100">
        Full-Stack & Frond-End Engineer
      </p>

      <div className="mt-6 max-w-2xl text-center space-y-4 text-gray-100">
        <p className="text-lg leading-relaxed">
          Specializing in <strong>React</strong>, <strong>TypeScript</strong>,
          and scalable <strong>Node.js</strong> architectures. I leverage AI
          tools to amplify productivity and code quality—using them as powerful
          instruments to deliver robust, high-performance web applications
          faster.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button render={<Link to="/contact" />} nativeButton={false}>
          Get in touch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          render={<Link to="/about" />}
          nativeButton={false}
        >
          About
        </Button>
      </div>
    </section>
  );
}

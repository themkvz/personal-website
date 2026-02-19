import { Github, Linkedin, Mail } from "lucide-react";

export const PUBLIC_EMAIL = "ihor@themkvz.com";

export const FOOTER_NAV_LINKS = [
  { to: "/", label: "Introduce" },
  { to: "/about", label: "About" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/contact", label: "Contact" },
];

export const HEADER_NAV_LINKS = [
  { to: "/", label: "Introduce" },
  { to: "/about", label: "About" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/contact", label: "Contact" },
];

export const SOCIAL_LINKS = [
  {
    href: "https://github.com/themkvz",
    label: "GitHub",
    icon: <Github className="size-5" />,
  },
  {
    href: "https://www.linkedin.com/in/ihor-mukovoz/",
    label: "LinkedIn",
    icon: <Linkedin className="size-5" />,
  },
  {
    href: `mailto:${PUBLIC_EMAIL}`,
    label: "Email",
    icon: <Mail className="size-5" />,
  },
];

export const PROJECT_TECH_STACK = [
  "TypeScript",
  "Bun",
  "React",
  "React Router",
  "Drizzle ORM",
  "SQLite",
  "Nuqs",
  "Shadcn UI",
  "Tailwind CSS",
];

export const EXPERIENCE = [
  {
    role: "Full-Stack Developer",
    company: "Forex Tester Software",
    location: "Lviv",
    period: "June 2024 — Present",
    description:
      "Rebuilding the public website and internal dashboard, transitioning legacy systems to a modern technology stack. Enhanced UI/UX, streamlined workflows, and improved scalability.",
    site: "https://forextester.com",
  },
  {
    role: "Lead Developer",
    company: "DevOut Labs (Altum Software)",
    location: "Lviv",
    period: "Sep 2022 — Mar 2024",
    description:
      "Led development team designing websites and applications. Conducted technical code reviews, allocated tasks, onboarded new teammates. Increased sales through highly integrated systems and extended the team via tech interviews.",
    site: "https://devoutlabs.com",
  },
  {
    role: "Full-Stack Developer",
    company: "Altum Agency (Altum Software)",
    location: "Lviv",
    period: "Mar 2022 — Sep 2022",
    description:
      "Created WordPress-based sites, performed technical reviews for junior developers, outlined project scope. Increased client base and improved team code quality.",
    site: "https://altumsoftware.io",
  },
  {
    role: "Full-Stack Developer",
    company: "Deosebit Service SRL",
    location: "Chisinau",
    period: "Aug 2017 — Jun 2022",
    description:
      "Created projects for customers across multiple countries in a small SEO-oriented team. Built WordPress sites, managed VPS servers, and found new market opportunities.",
    site: "https://dits.md",
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

export const NOTABLE_PROJECTS = [
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

export const TECH_STACK = {
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

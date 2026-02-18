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

export const TECH_STACK_KEYWORDS = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "PostgreSQL",
  "AWS",
];

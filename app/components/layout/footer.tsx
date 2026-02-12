import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    href: "https://github.com/themkvz",
    label: "GitHub",
    icon: <Github className="h-4 w-4" />,
  },
  {
    href: "https://www.linkedin.com/in/ihor-mukovoz/",
    label: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
  },
  {
    href: "mailto:mukovoz.igor@gmail.com",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ihor Mukovoz
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

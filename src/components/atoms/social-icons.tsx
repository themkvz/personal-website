import { SiGithub } from "@icons-pack/react-simple-icons";
import { BookOpenIcon, MailIcon } from "lucide-react";
import type { SVGProps } from "react";

// Lucide v1 removed all brand icons and Simple Icons no longer ships LinkedIn,
// so this carries the outline glyph the site has always rendered.
function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  github: SiGithub,
  linkedin: LinkedinIcon,
  email: MailIcon,
  workbench: BookOpenIcon,
};

export type SOCIAL_ICON_KEY = keyof typeof SOCIAL_ICONS;

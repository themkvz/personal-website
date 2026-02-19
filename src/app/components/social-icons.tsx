import { SiGithub } from "@icons-pack/react-simple-icons";

import { LinkedinIcon, MailIcon } from "lucide-react";

export const SOCIAL_ICONS = {
  github: SiGithub,
  linkedin: LinkedinIcon,
  email: MailIcon,
};

export type SOCIAL_ICON_KEY = keyof typeof SOCIAL_ICONS;

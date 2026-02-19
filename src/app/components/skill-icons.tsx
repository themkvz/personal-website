import {
  SiBun,
  SiClaude,
  SiDocker,
  SiDrizzle,
  SiGit,
  SiGithub,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiReactrouter,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";

export const SKILL_ICONS = {
  react: SiReact,
  typescript: SiTypescript,
  nextjs: SiNextdotjs,
  reactrouter: SiReactrouter,
  bun: SiBun,
  nodejs: SiNodedotjs,
  tailwindcss: SiTailwindcss,
  postgresql: SiPostgresql,
  prisma: SiPrisma,
  docker: SiDocker,
  git: SiGit,
  drizzle: SiDrizzle,
  php: SiPhp,
  claude: SiClaude,
  copilot: SiGithub,
};

export type SKILL_ICON_KEY = keyof typeof SKILL_ICONS;

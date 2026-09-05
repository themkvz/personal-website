type NavLink = {
  to: string;
  label: string;
};

type SocialLink = {
  href: string;
  label: string;
  icon: "github" | "linkedin" | "email";
};

type PracticeColumn = {
  label: string;
  title: string;
  description: string;
  topics: readonly string[];
};

export const Site = {
  name: "THEMKVZ",
  ownerName: "Ihor Mukovoz",
  baseUrl: "https://themkvz.com",
  publicEmail: "ihor@themkvz.com",
  resumeHref: "/resume.pdf",
} as const;

export const Nav = {
  links: [
    { to: "/", label: "Index" },
    { to: "/tools", label: "Tools" },
    { to: "/workbench", label: "Workbench" },
    { to: "/about", label: "About" },
  ] satisfies NavLink[],

  // The footer reads workbench-first; the design orders it deliberately
  // differently from the primary nav.
  footerLinks: [
    { to: "/", label: "Index" },
    { to: "/workbench", label: "Workbench" },
    { to: "/tools", label: "Tools" },
    { to: "/about", label: "About" },
  ] satisfies NavLink[],

  social: [
    {
      href: "https://github.com/themkvz",
      label: "GitHub",
      icon: "github",
    },
    {
      href: "https://www.linkedin.com/in/ihor-mukovoz/",
      label: "LinkedIn",
      icon: "linkedin",
    },
    {
      href: `mailto:${Site.publicEmail}`,
      label: "Email",
      icon: "email",
    },
  ] satisfies SocialLink[],
} as const;

export const Home = {
  eyebrow: "IHOR MUKOVOZ — FRONT-END DEVELOPER · LEAD DEVELOPER",
  displayStatement: "Software, systems,\nexperiments.",
  introduction:
    "I build web software and keep the useful parts of the process here: technical notes, decisions, experiments, and small tools.",
  professionalContext:
    "My work spans TypeScript, React, cross-platform products, frontend architecture, and the careful modernization of long-lived systems.",
  primaryCta: "Explore the workbench",
  secondaryCta: "About Ihor →",

  profileLabel: "PROFILE / LVIV, UKRAINE",
  profileRole: "software engineer",
  profileSummary:
    "Frontend developer and technical lead working across web and cross-platform product systems.",
  facts: [
    { label: "EXPERIENCE", value: "9+ years" },
    { label: "PRIMARY WORK", value: "TypeScript · React" },
    { label: "SCOPE", value: "Architecture · Products" },
  ],
  profileTopics: ["WEB APPS", "CROSS-PLATFORM", "SYSTEMS"],

  workbenchEyebrow: "WORKBENCH",
  workbenchHeading: "Useful notes from real software work.",
  workbenchLead:
    "Read the implementation notes, open questions, decisions, and references that remain useful beyond a single project.",
  workbenchHint: "Four ways into the work: build, investigate, decide, keep.",
  workbenchCta: "Browse all notes",
  readFeatured: "Read the note →",

  toolsEyebrow: "TOOLS",
  toolsHeading: "Small utilities for specific problems.",
  toolsBlurb:
    "Useful immediately, focused on one task, and designed to work without an account.",
  toolsCta: "Browse all tools →",
} as const;

export const About = {
  eyebrow: "ABOUT / IHOR MUKOVOZ",
  title: "Frontend work,\nmade durable.",
  lead: "I’m a frontend developer and technical lead based in Lviv, Ukraine. I build web and cross-platform products, and help their foundations remain understandable as they grow.",
  detail:
    "My daily work is mostly TypeScript and React, with a focus on frontend architecture, legacy modernization, product development, and technical leadership.",
  resumeCta: "Résumé / CV",
  emailCta: "Email Ihor →",

  practiceLabel: "PRACTICE / 9+ YEARS",
  practiceHeading: "I work where interface decisions become system decisions.",
  practiceCopy:
    "That usually means shaping shared foundations, making state explicit, modernizing incrementally, and keeping delivery moving while the architecture improves.",
  practicePoints: [
    { label: "Product systems", icon: "layers" },
    { label: "Incremental modernization", icon: "branch" },
    { label: "Legible decisions", icon: "note" },
  ],
  practiceTopics: ["TYPESCRIPT", "REACT", "ARCHITECTURE"],

  practiceSectionEyebrow: "WORKING PRACTICE",
  practiceSectionTitle: "Where frontend work becomes system work.",
  practiceIntroduction:
    "My role usually sits between implementation, product delivery, and the technical foundations that let teams keep changing software safely.",
  practiceColumns: [
    {
      label: "ARCHITECTURE",
      title: "Frontend architecture",
      description:
        "Structures application UI, state, and shared foundations for React-based products.",
      topics: ["STATE", "SYSTEMS"],
    },
    {
      label: "MODERNIZATION",
      title: "Legacy modernization",
      description:
        "Improves long-lived frontend systems incrementally while product development continues.",
      topics: ["LEGACY", "DELIVERY"],
    },
    {
      label: "LEADERSHIP",
      title: "Technical leadership",
      description:
        "Supports delivery through technical direction, review, coordination, and clear engineering decisions.",
      topics: ["DIRECTION", "REVIEW"],
    },
  ] satisfies PracticeColumn[],

  experienceEyebrow: "EXPERIENCE",
  experienceTitle: "Selected professional timeline.",
  experienceCopy:
    "A concise view of the roles behind the work. The full employment history remains available in the résumé.",
  experienceCta: "Open full résumé →",

  contactEyebrow: "CONTACT / ELSEWHERE",
  contactTitle: "Work, questions, or a useful reference?",
  contactCopy:
    "I use this site to keep technical notes, experiments, and small tools outside my daily product work. If something here connects with your work, feel free to get in touch.",
  contactEmailCta: "Email Ihor",
  contactResumeCta: "Résumé / CV →",
  elsewhereLabel: "ELSEWHERE / PUBLIC",
  elsewhere: [
    {
      label: "GitHub",
      description: "Code and public repositories",
      href: "https://github.com/themkvz",
      icon: "github",
    },
    {
      label: "LinkedIn",
      description: "Professional background",
      href: "https://www.linkedin.com/in/ihor-mukovoz/",
      icon: "linkedin",
    },
    {
      label: "Workbench",
      description: "Notes, decisions, and references",
      to: "/workbench",
      icon: "workbench",
    },
  ],
} as const;

export const Workbench = {
  eyebrow: "WORKBENCH / NOTES FROM PRACTICE",
  title: "Notes from\nbuilding software.",
  lead: "Implementation notes, open questions, technical decisions, and references that remain useful beyond one project.",
  latestCta: "Open latest note →",
  guideLabel: "HOW TO READ",

  indexEyebrow: "ARTIFACT INDEX",
  indexTitle: "All notes, one index.",
  indexCopy:
    "Each entry is filed by intent, so the useful part is visible before you open it.",
} as const;

export const Tools = {
  eyebrow: "TOOLS",
  title: "Small utilities.",
  lede: "Focused browser tools for recurring technical work: inspect and rebuild URLs, convert timestamps, and clean pasted text.",
  collectionEyebrow: "AVAILABLE TOOLS",
  collectionTitle: "Pick a task.",
  valueText: "Local-first where practical · no account · keyboard friendly",
  openCta: "Open tool →",
  runtimeLabel: "LOCAL",
  forthcomingLabel: "FORTHCOMING",
} as const;

export const NotFound = {
  overline: "HTTP / REQUEST NOT FOUND",
  status: "ROUTE / UNAVAILABLE",
  title: "This route ends here.\nThe useful parts don’t.",
  explanation:
    "The address may have changed or the page may have moved. Search the notes, return to the index, or choose a useful destination below.",
  returnCta: "Return to index",
  workbenchCta: "Browse the workbench",
} as const;

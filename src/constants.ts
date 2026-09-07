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

type Integration = {
  /** The moment in a page's life this service acts at. Entries are ordered by it. */
  phase: string;
  name: string;
  role: string;
  consequence: string;
};

export const Site = {
  name: "THEMKVZ",
  ownerName: "Ihor Mukovoz",
  location: "Ukraine",
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

  profileLabel: "PROFILE / UKRAINE",
  profileRole: "software engineer",
  profileSummary:
    "Frontend developer and technical lead working across web and cross-platform product systems.",
  facts: [
    { label: "EXPERIENCE", value: "9+ years" },
    { label: "PRIMARY WORK", value: "TypeScript · React" },
    { label: "SCOPE", value: "Product · Delivery · Maintenance" },
  ],
  profileTopics: ["WEB APPS", "CROSS-PLATFORM", "EXPERIMENTS"],

  workbenchEyebrow: "WORKBENCH",
  workbenchHeading: "Useful notes from real software work.",
  workbenchLead:
    "Read the implementation notes, open questions, decisions, and references that remain useful beyond a single project.",
  workbenchHint: "Four ways into the work: investigate, decide, build, ship.",
  workbenchCta: "Browse all notes",
  readFeatured: "Read the note →",

  toolsEyebrow: "TOOLS",
  toolsHeading: "Small utilities for specific problems.",
  toolsBlurb: "Useful immediately, focused on one task, without distracting.",
  toolsCta: "Browse all tools →",

  integrationsEyebrow: "INTEGRATIONS / THIRD-PARTY",
  integrationsHeading: "Every moving part, in the open.",
  integrationsLead:
    "A site this size needs none of this. Running it anyway keeps the integration work visible and the failure modes real. Four services, in the order a page meets them.",
  integrations: [
    {
      phase: "BEFORE THE REQUEST",
      name: "MDX",
      role: "Every note, decision, and tool card is a file in the repository, typed at load and compiled with the site.",
      consequence:
        "No database, no editor, no admin login. Publishing is a commit, so the history of a page is the history of its file.",
    },
    {
      phase: "DURING THE RENDER",
      name: "GrowthBook",
      role: "Feature flags and experiment assignment, resolved on the server before the document is sent.",
      consequence:
        "The first paint is already the assigned variant. Nothing flickers from a default to a treatment once the page wakes up.",
    },
    {
      phase: "AFTER THE CLICK",
      name: "OpenPanel",
      role: "Product analytics, with experiment exposure recorded against the same visitor as everything that follows it.",
      consequence:
        "A variant and the actions after it belong to one profile, so a result reads as behaviour instead of a page count.",
    },
    {
      phase: "WHEN IT BREAKS",
      name: "GlitchTip",
      role: "Error and performance reporting from both the server and the browser, and the destination for content-security-policy reports.",
      consequence:
        "Traces resolve back to the original source. Expected outcomes, like a missing page or an abandoned request, never enter the feed.",
    },
  ] satisfies Integration[],
} as const;

export const About = {
  eyebrow: "ABOUT / IHOR MUKOVOZ",
  title: "Frontend work,\nmade durable.",
  lead: "I’m a frontend developer and technical lead based in Ukraine. I build web and cross-platform products, and help their foundations remain understandable as they grow.",
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
  practiceTopics: ["INVESTIGATE", "ARCHITECTURE", "LEADERSHIP"],

  practiceSectionEyebrow: "WORKING PRACTICE",
  practiceSectionTitle: "Where frontend work becomes system work.",
  practiceIntroduction:
    "My role usually sits between implementation, product delivery, marketing vision and the technical foundations that let teams keep changing software safely.",
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
    "A concise view of the roles behind the work. The full employment history remains available in the CV.",
  experienceCta: "Open full CV →",

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
      description: "Code, repositories and graphs",
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
    "Each entry is filed by intent, so the main part is visible before you open it.",
} as const;

export const Tools = {
  eyebrow: "TOOLS",
  title: "Small utilities.",
  lede: "Focused browser tools for recurring technical work: later more",
  collectionEyebrow: "AVAILABLE TOOLS",
  collectionTitle: "Pick a task.",
  valueText:
    "Local-first where practical · one solution · deps free · no tracking",
  openCta: "Open tool →",
  runtimeLabel: "LOCAL",
  forthcomingLabel: "FORTHCOMING",
} as const;

export const NotFound = {
  overline: "HTTP / REQUEST NOT FOUND",
  status: "ROUTE / UNAVAILABLE",
  title: "This route ends here.\nThe useful parts don’t.",
  explanation:
    "The address may have changed or the page may have moved. Return to the index, or choose a useful destination below.",
  returnCta: "Return to index",
  workbenchCta: "Browse the workbench",
} as const;

/**
 * The indexable static pages, in reading order. Deliberately separate from
 * `Nav.links`, which holds the same four paths today: tying the sitemap to a
 * navigation decision would silently drop the first page that is published
 * without being linked from the header. Notes reuse each page's own meta
 * description so the agent index and the page agree.
 */
export const PUBLIC_PAGES = [
  { path: "/", name: "Index", note: Home.introduction },
  { path: "/tools", name: "Tools", note: Tools.lede },
  { path: "/workbench", name: "Workbench", note: Workbench.lead },
  { path: "/about", name: "About", note: About.lead },
] as const;

/** Values the public plain-text discovery files are generated from. */
export const Discovery = {
  /** The authoritative address of `security.txt` (RFC 9116, via RFC 8615). */
  securityTxtPath: "/.well-known/security.txt",
  /**
   * How long a freshly served `security.txt` stays valid. RFC 9116 recommends
   * under a year; the shorter window bounds how long a cached copy keeps
   * claiming validity after the site stops being maintained.
   */
  securityExpiryDays: 180,
  /** RFC 9116: the languages a vulnerability report may be written in. */
  preferredLanguages: "en",
  /** Credited in `humans.txt`. Curated, not the dependency tree. */
  stack: [
    "React Router",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "MDX",
    "Bun",
  ] as readonly string[],
} as const;

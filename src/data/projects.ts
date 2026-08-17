/**
 * ─────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT — replace with your real work.
 *
 *  Each entry here automatically gets:
 *    • a row on the home page (when `featured` is true)
 *    • a row on /projects
 *    • a fully rendered breakdown page at /projects/<slug>
 *    • an entry in the sitemap
 *
 *  Edit or add objects below; nothing else needs to change.
 * ─────────────────────────────────────────────────────────────────────
 */

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  /** URL segment: /projects/<slug> */
  slug: string;
  title: string;
  year: string;
  /** One-liner shown in list rows. */
  summary: string;
  /** Paragraphs for the breakdown page's overview. */
  overview: string[];
  role: string;
  stack: string[];
  /** Concrete outcomes / decisions worth bragging about. */
  highlights: string[];
  links?: ProjectLink[];
  /** Featured projects appear on the home page. */
  featured: boolean;
  /**
   * Unlisted pages still build at /projects/<slug> and work when
   * someone has the link, but never appear in the header dropdown,
   * home page, /projects index, or sitemap — and they tell search
   * engines not to index them.
   */
  unlisted?: boolean;
};

export const projects: Project[] = [
  {
    slug: "portfolio",
    title: "This Website",
    year: "2026",
    summary:
      "A fully static portfolio served from Cloudflare's edge — zero servers, sub-second loads worldwide.",
    overview: [
      "This site is a deliberately small system: Next.js 15 compiled to a fully static export, styled with a five-token Tailwind design system, and served as static assets by a Cloudflare Worker with a Cloudflare Pages fallback.",
      "Every page is pre-rendered at build time — project breakdowns are generated from a single typed data file, so adding a case study is a data change, not a code change. No runtime, no database, nothing to patch on a Sunday night.",
    ],
    role: "Design & engineering",
    stack: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS v4",
      "Cloudflare Workers",
    ],
    highlights: [
      "Static-first architecture: one `next build` artifact deploys unchanged to both Workers and Pages.",
      "Design tokens with automatic light/dark schemes driven by system preference.",
      "Accessible by construction — semantic landmarks, skip link, focus-visible states, reduced-motion support.",
    ],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/PMARC14/pratul-portfolio-website",
      },
    ],
    featured: true,
  },
  {
    slug: "sap-cloud-migration",
    title: "SAP Legacy System Migration",
    year: "2025",
    summary:
      "Near-zero-downtime migration of a new acquisition's legacy SAP data and middleware onto Google Cloud.",
    overview: [
      "At Blackstone Valley Consulting, I learned and configured the SAP Forecast to Stock module and led the migration of Functional Locations, Equipment, and BOM data off a legacy system (MYOB) into SAP — coordinating with teams in the US and Australia to keep the acquisition's operations running through the cutover.",
      "Alongside the migration, I built middleware integrating SAP iDocs and carrier data, moving legacy SAP workloads from on-prem infrastructure to Google Cloud, and hosted Vertex AI agents that aggregate customer support tickets from separate services into a single internal dashboard.",
    ],
    role: "SAP & Cloud Consultant",
    stack: ["SAP S/4HANA", "Google Cloud", "Vertex AI", "iDocs middleware"],
    highlights: [
      "Migrated Functional Locations, Equipment, and BOM data with virtually no downtime during a critical legacy system cutover.",
      "Built SAP iDocs/carrier middleware and moved it from local infrastructure to Google Cloud.",
      "Hosted Vertex AI agents to aggregate and triage customer tickets into one dashboard.",
    ],
    featured: true,
  },
  {
    slug: "american-airlines-crew-checkin",
    title: "Crew Check-in, Baggage & Travel Documents",
    year: "2025",
    summary:
      "Internal apps for crew check-in and baggage equipment tracking, plus cross-country travel document systems.",
    overview: [
      "As a Software Engineer at American Airlines, I worked within an Agile framework on the Crew Check-in app and website and Baggage Equipment Tracking, owning features and backlog items independently and managing deployments to Microsoft Azure. I built automated test coverage for check-in functionality with Playwright and helped introduce and roll out GitHub Copilot to the development team.",
      "On the Check-in and Travel Documents team, I worked in Java to resolve incompatibilities between travel-document systems across countries, deploying services to Google Cloud Run and Google Kubernetes Engine.",
    ],
    role: "Software Engineer",
    stack: [
      "JavaScript",
      "Java",
      "SQL",
      "Azure",
      "Google Cloud Run",
      "Playwright",
    ],
    highlights: [
      "Shipped crew check-in and baggage tracking features independently within an Agile team.",
      "Built Playwright test automation for crew check-in functionality.",
      "Resolved cross-country travel document incompatibilities, deployed via Cloud Run and GKE.",
    ],
    featured: true,
  },
  {
    slug: "western-digital-hdd-firmware",
    title: "HDD Algorithms & Firmware R&D",
    year: "2021",
    summary:
      "Statistical analysis and next-generation firmware algorithms to improve hard disk drive throughput.",
    overview: [
      "As an R&D co-op at Western Digital, I analyzed hard disk drive performance characteristics using Python's statistical stack (NumPy, SciPy, Pandas) to inform next-generation firmware algorithms aimed at improving HDD throughput.",
      "I also built embedded workloads for onboard HDD training and set up Docker-based OS-level virtualization to host and run models during development.",
    ],
    role: "Hard Disk Drive Algorithms/Firmware R&D Co-op",
    stack: ["Python", "NumPy", "SciPy", "Pandas", "Docker"],
    highlights: [
      "Analyzed HDD performance data to guide next-gen throughput algorithms.",
      "Built embedded workloads for onboard HDD training.",
      "Containerized model workloads with Docker for reproducible runs.",
    ],
    featured: false,
  },
  {
    slug: "playground",
    title: "Playground",
    year: "2026",
    summary:
      "An unlisted example page — only people with the direct link can find it.",
    overview: [
      "PLACEHOLDER — this entry demonstrates unlisted pages. It is reachable at /projects/playground for anyone with the link, but it appears nowhere on the site: no header dropdown, no home page row, no /projects index, no sitemap entry, and search engines are told not to index it.",
      "Use unlisted entries for work you want to share selectively — a case study for one specific application, a demo that isn't ready for the front page, or notes for a class.",
    ],
    role: "Example",
    stack: ["Unlisted", "Direct link only"],
    highlights: [
      "Set `unlisted: true` on any project to get a page like this one.",
      "Delete this entry whenever you like — nothing links to it.",
    ],
    featured: false,
    unlisted: true,
  },
];

/** Everything shown in public lists (home, /projects, dropdown, sitemap). */
export const visibleProjects = projects.filter((p) => !p.unlisted);

export const featuredProjects = visibleProjects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

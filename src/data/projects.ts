/**
 * ─────────────────────────────────────────────────────────────────────
 *  Project content. Entries marked PLACEHOLDER are samples to replace.
 *  Order matters: it's the display order everywhere (home, /projects,
 *  header dropdown, and prev/next links).
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

import { hotline } from "./hotline";

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectImage = {
  /** Site-relative path under public/, e.g. "/projects/foo.png". */
  src: string;
  /** Describe what the screenshot shows (read by screen readers). */
  alt: string;
  /** Intrinsic pixel size — reserves layout space so the page doesn't jump. */
  width: number;
  height: number;
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
  /** Optional screenshots shown under the title on the breakdown page. */
  images?: ProjectImage[];
  /** Optional primary button on the breakdown page, pointing at a page on this site. */
  cta?: { label: string; href: string };
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
    slug: "hotline",
    title: "Hotline",
    year: "2026",
    summary:
      "A native Windows 11 AI panel on the Copilot key — fast, private, and wired to whichever AI you choose.",
    overview: [
      "Windows 11 keyboards ship with a Copilot key that only opens Microsoft's assistant. Hotline takes it over: one press opens a native popup on the monitor you're working on, focused and ready to type, and it talks to the AI you pick — your existing Claude Code or Antigravity CLI sign-ins, an Anthropic, Gemini, or OpenAI-compatible API key, or a local model behind an OpenAI-style server like llama.cpp.",
      "It's a WinUI 3 app with no embedded webview, built on a UI-free .NET core. Answers render as Markdown with tables, copyable code, math, and inline SVG. It pulls in context without grabbing your clipboard — the text you had selected arrives through UI Automation, and screenshots fall back to Windows' offline OCR for models that can't see images. Tools come from your MCP servers; read-only tools run on their own and anything else asks first. Settings, prompts, quick actions, and memory are all plain files, and API keys live in Windows Credential Locker.",
      "Hotline has no server, accounts, or telemetry, and ships with a written privacy policy that says exactly what leaves your PC. It's pre-1.0 and used daily, so expect rough edges: Windows 11 only (x64 and ARM64), Apache-2.0, and developed in the open by one person. It's available from the Microsoft Store (as Hotline AI) and from GitHub Releases.",
    ],
    role: "Design & engineering (solo)",
    stack: ["C#", ".NET 10", "WinUI 3", "MSIX", "MCP", "GitHub Actions"],
    highlights: [
      "Provider-agnostic by design: Claude Code and Antigravity CLI sign-ins, three API families, and local models, switchable from an effort → model → provider picker in the bar.",
      "Native and light: WinUI 3 with acrylic instead of a webview, with all logic that doesn't touch the UI split into a separately tested .NET library.",
      "Reads context respectfully: selected text over UI Automation, screenshots of a window, screen, or dragged region, and on-device OCR — nothing is sent until you press Enter.",
      "Tools with guardrails: MCP servers and Windows agent connectors, where read-only tools run and everything else asks Allow once / Always / Deny in the panel.",
      "Private by construction: no telemetry, keys in Credential Locker and sent only over https, and a published privacy policy.",
      "Shipped like a product: 500+ unit tests, an end-to-end smoke test that drives the Copilot key, hotkey, and protocol links, CI on every PR, and automated x64 + ARM64 MSIX releases.",
    ],
    links: [
      { label: "Source on GitHub", href: hotline.repo },
      { label: "Microsoft Store", href: hotline.store },
      { label: "Releases", href: hotline.releases },
      { label: "Privacy policy", href: hotline.privacy },
    ],
    cta: { label: "Install Hotline", href: hotline.path },
    images: [
      {
        src: "/projects/hotline-panel.png",
        alt: "The Hotline panel answering a question about the area of a circle, with a formula, a Python code block with a Copy button, and a results table. The bar below shows effort, model, and provider pickers.",
        width: 720,
        height: 763,
      },
      {
        src: "/projects/hotline-settings.png",
        alt: "The Hotline settings window on the General page, with options for what a short and long press of the Copilot key do, an extra hotkey, and window behavior.",
        width: 900,
        height: 668,
      },
    ],
    featured: true,
  },
  {
    slug: "unlimited-upgrades",
    title: "Unlimited Upgrades",
    year: "2026",
    summary:
      "A mod for House of the Dying Sun that lifts the cap on ship upgrades and adds a scrolling, one-click hangar UI.",
    overview: [
      "House of the Dying Sun is a Unity space-combat game that limits how many field upgrades a ship can carry. Unlimited Upgrades removes that limit: any Interceptor, Destroyer, or Capital ship can equip as many upgrades as you own.",
      "The game isn't built for modding, so the mod loads through BepInEx and changes the game at runtime with Harmony instead of editing its files — six patches in about 300 lines of C#. They lift the per-ship cap, replace the hangar's fixed row of slots with a scrolling window that always ends in an empty slot, and turn the upgrade picker into a toggle: click to equip, click again to remove. Scrolling works with the mouse wheel, arrow keys or WASD, and a controller's D-pad.",
      "Upgrades that don't belong on a ship's class are blocked before they're attached, which keeps fighter-only upgrades off capital ships, and loadouts are saved through the game's own save system. It's packaged for mod managers with a Thunderstore manifest and a BepInEx dependency, and released under the MIT license.",
    ],
    role: "Developer",
    stack: ["C#", "Harmony", "BepInEx", "Unity"],
    highlights: [
      "Changes a closed-source Unity game at runtime with Harmony patches, rather than modifying its files.",
      "Replaced the fixed slot row with a scrolling window: mouse wheel, keyboard, and controller navigation, with an empty slot always at the end for adding more.",
      "Toggle-style selection: click an upgrade to equip it and click again to remove it, and buying a locked upgrade equips it straight away.",
      "A compatibility guard blocks upgrades that don't fit a ship's class, so fighter-only upgrades can't end up on capital ships.",
      "Saves loadouts through the game's own save system, and ships as a Thunderstore package that mod managers can install in one click.",
    ],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/PMARC14/Unlimited_Upgrades",
      },
      {
        label: "Thunderstore",
        href: "https://thunderstore.io/c/hotds/p/BaconGames/Unlimited_Upgrades/",
      },
    ],
    featured: true,
  },
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

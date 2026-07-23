/**
 * Global site facts. Everything personal lives here (and in
 * `projects.ts`) so page components never hard-code copy.
 */
export const site = {
  name: "Pratul Maddipudi",
  role: "Software Engineer",
  email: "pmaddipudi@gmail.com",
  // Production domain — drives canonical URLs, Open Graph, and the sitemap.
  url: "https://pratul.maddipudi.com",
  description:
    "Portfolio of Pratul Maddipudi — a software engineer building fast, thoughtful products for the web.",
  resumePath: "/resume.pdf",
  github: "https://github.com/PMARC14",
  // TODO: replace with your real profile URL.
  linkedin: "https://www.linkedin.com/in/REPLACE_ME",
  location: "United States",
} as const;

/**
 * Every outbound destination, in one place, so pages don't each hand-type
 * hrefs/labels (and risk drifting from `site` above). Page-specific copy
 * (descriptions, CTAs) stays local to whichever page needs it.
 */
export const links = {
  email: {
    label: "Email",
    href: `mailto:${site.email}`,
    value: site.email,
    external: false,
    download: false,
  },
  github: {
    label: "GitHub",
    href: site.github,
    value: "github.com/PMARC14",
    external: true,
    download: false,
  },
  linkedin: {
    label: "LinkedIn",
    href: site.linkedin,
    value: "linkedin.com/in/…",
    external: true,
    download: false,
  },
  resume: {
    label: "Resume",
    href: site.resumePath,
    value: "One page, PDF",
    external: false,
    download: true,
  },
} as const;

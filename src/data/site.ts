/**
 * Global site facts. Everything personal lives here (and in
 * `projects.ts`) so page components never hard-code copy.
 */
export const site = {
  name: "Pratul Maddipudi",
  role: "Software Engineer",
  email: "pratul.maddipudi@gmail.com",
  // Production domain — drives canonical URLs, Open Graph, and the sitemap.
  url: "https://pratul.maddipudi.com",
  description:
    "Portfolio of Pratul Maddipudi — a software engineer working across cloud engineering, full-stack development, and applied AI/ML.",
  resumePath: "/Pratul-Maddipudi-Resume.pdf",
  github: "https://github.com/PMARC14",
  linkedin: "https://www.linkedin.com/in/pratul-maddipudi",
  location: "Rhode Island, USA",
  // Cloudflare Web Analytics token (cookieless). Leave empty when using the
  // dashboard's automatic setup; paste the token here only if you use the
  // manual JS snippet. Not a secret — it ships in the page.
  analyticsToken: "" as string,
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
    value: "linkedin.com/in/pratul-maddipudi",
    external: true,
    download: false,
  },
  resume: {
    label: "Resume",
    href: site.resumePath,
    value: "Two pages, PDF",
    external: false,
    download: true,
  },
} as const;

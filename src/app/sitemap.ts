import type { MetadataRoute } from "next";

import { visibleProjects } from "@/data/projects";
import { site } from "@/data/site";

export const dynamic = "force-static";

// Unlisted projects are deliberately absent — link-only pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/projects`, priority: 0.8 },
    { url: `${site.url}/about`, priority: 0.8 },
    { url: `${site.url}/contact`, priority: 0.7 },
    { url: `${site.url}/contact-book`, priority: 0.5 },
    ...visibleProjects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      priority: 0.6,
    })),
  ];
}

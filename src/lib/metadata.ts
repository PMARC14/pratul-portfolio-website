import type { Metadata } from "next";

import { site } from "@/data/site";

/** Default share card (1200×630) used for Open Graph and Twitter previews. */
export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.role}`,
} as const;

type PageMetadataInput = {
  /** Page title — the root layout's template appends the site name. */
  title: string;
  description: string;
  /** Site-relative path, e.g. "/about" (resolved against `metadataBase`). */
  path: string;
  robots?: Metadata["robots"];
};

/**
 * Per-page metadata with matching canonical, Open Graph, and Twitter
 * fields. Next inherits a parent's `openGraph` wholesale when a page
 * doesn't set its own, which would give every page the home page's
 * title, description, and `og:url` in link previews.
 */
export function pageMetadata({
  title,
  description,
  path,
  robots,
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    robots,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}

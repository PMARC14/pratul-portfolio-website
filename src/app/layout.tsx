import "../styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { visibleProjects } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// Manually derived from globals.css's --bg tokens (meta theme-color can't
// reference CSS custom properties) — keep these in sync if --bg changes.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/**
 * Replays the persisted theme choice before first paint so a forced
 * light/dark preference never flashes the wrong scheme. No stored
 * value (or "system") leaves the attribute off → CSS media query rules.
 */
const themeInitScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the theme script may add data-theme to
    // <html> before React hydrates; that mismatch is intentional.
    <html
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-bg font-sans text-ink antialiased">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, hand-written theme bootstrap */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          className="sr-only z-100 rounded-md bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          href="#main"
        >
          Skip to content
        </a>
        {/* Only listed projects are handed to the client header, so
				    unlisted entries never appear in the shipped JS bundle. */}
        <SiteHeader
          projects={visibleProjects.map(({ slug, title, year }) => ({
            slug,
            title,
            year,
          }))}
        />
        <main className="flex-1" id="main">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

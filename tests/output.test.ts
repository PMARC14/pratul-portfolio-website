import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

import { projects, visibleProjects } from "@/data/projects";
import { site } from "@/data/site";

/**
 * Built-output tests: assert on the actual artifact in `out/` — the
 * exact bytes Cloudflare will serve. `npm test` builds first (pretest),
 * so these always run against the current source.
 */

const OUT = path.join(import.meta.dirname, "..", "out");

const read = (file: string) => readFileSync(path.join(OUT, file), "utf8");
const has = (file: string) => existsSync(path.join(OUT, file));

/** All built pages, as forward-slash paths relative to out/. */
function htmlFiles(): string[] {
  return (readdirSync(OUT, { recursive: true }) as string[])
    .map((f) => f.split(path.sep).join("/"))
    .filter((f) => f.endsWith(".html"));
}

/** Does an absolute site path (href/src) resolve to a built file? */
function resolves(sitePath: string): boolean {
  const clean = sitePath.replace(/[?#].*$/, "");
  if (clean === "/") return has("index.html");
  const rel = decodeURIComponent(clean.slice(1));
  return has(rel) || has(`${rel}.html`) || has(`${rel}/index.html`);
}

beforeAll(() => {
  if (!existsSync(OUT)) {
    throw new Error(
      "out/ not found — run `npm run build` first (`npm test` does this automatically via pretest).",
    );
  }
});

describe("routes", () => {
  const expected = [
    "index.html",
    "about.html",
    "projects.html",
    "contact.html",
    "contact-book.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "_headers",
    site.resumePath.slice(1),
    "favicon.ico",
    "icon.svg",
    "apple-touch-icon.png",
    "og.png",
    "_redirects",
    ...projects.map((p) => `projects/${p.slug}.html`),
  ];

  it.each(expected)("builds %s", (file) => {
    expect(has(file), `${file} missing from out/`).toBe(true);
  });
});

describe("page structure", () => {
  it.each(htmlFiles())("%s is well-formed", (file) => {
    const html = read(file);
    expect(html).toMatch(/<html[^>]*\blang="en"/);
    expect(html.match(/<h1[\s>]/g), "expected exactly one <h1>").toHaveLength(
      1,
    );
    expect(html).toMatch(/<title>[^<]+<\/title>/);
    expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  });
});

describe("home page", () => {
  it("links the contact email", () => {
    expect(read("index.html")).toContain(`mailto:${site.email}`);
  });

  it("bootstraps the theme before paint", () => {
    expect(read("index.html")).toContain('localStorage.getItem("theme")');
  });

  it("keeps the skip link for keyboard users", () => {
    expect(read("index.html")).toContain('href="#main"');
  });
});

describe("internal links", () => {
  it("every internal href/src resolves to a built file", () => {
    const broken: string[] = [];
    for (const file of htmlFiles()) {
      const html = read(file);
      for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
        const target = match[1] ?? "";
        if (!resolves(target)) {
          broken.push(`${file} → ${target}`);
        }
      }
    }
    expect(broken, `broken internal links:\n${broken.join("\n")}`).toEqual([]);
  });
});

describe("sitemap", () => {
  const locs = () =>
    Array.from(read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)).map(
      (m) => m[1] ?? "",
    );

  it("only lists URLs on the production origin", () => {
    for (const loc of locs()) {
      expect(loc.startsWith(site.url)).toBe(true);
    }
  });

  it("every listed URL resolves to a built page", () => {
    for (const loc of locs()) {
      const sitePath = loc.slice(site.url.length) || "/";
      expect(resolves(sitePath), `${loc} has no built file`).toBe(true);
    }
  });

  it("covers all visible projects", () => {
    const xml = read("sitemap.xml");
    for (const project of visibleProjects) {
      expect(xml).toContain(`/projects/${project.slug}`);
    }
  });
});

describe("unlisted pages", () => {
  const unlisted = projects.filter((p) => p.unlisted);

  it("has at least one unlisted example to test against", () => {
    // If you delete the last unlisted project, delete this block too.
    expect(unlisted.length).toBeGreaterThan(0);
  });

  it.each(
    unlisted.map((p) => [p.slug, p] as const),
  )("%s builds, is noindexed, and is linked from nowhere", (slug) => {
    const own = `projects/${slug}.html`;
    expect(has(own)).toBe(true);
    expect(read(own)).toMatch(/<meta name="robots" content="noindex/);
    expect(read("sitemap.xml")).not.toContain(`/projects/${slug}`);
    for (const file of htmlFiles()) {
      if (file === own) continue;
      expect(
        read(file),
        `${file} links to unlisted /projects/${slug}`,
      ).not.toContain(`/projects/${slug}`);
    }
  });
});

describe("icons", () => {
  const icon = () => readFileSync(path.join(OUT, "favicon.ico"));

  it("favicon.ico is a structurally valid multi-size ICO", () => {
    // Guards against the file being mangled by line-ending normalization.
    const buffer = icon();
    expect(buffer.readUInt16LE(0), "reserved").toBe(0);
    expect(buffer.readUInt16LE(2), "type (1 = icon)").toBe(1);
    const count = buffer.readUInt16LE(4);
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      const entry = 6 + i * 16;
      const size = buffer.readUInt32LE(entry + 8);
      const offset = buffer.readUInt32LE(entry + 12);
      expect(offset + size, `image ${i} overruns the file`).toBeLessThanOrEqual(
        buffer.length,
      );
    }
  });

  it("apple-touch-icon.png is a real 180×180 PNG", () => {
    const png = readFileSync(path.join(OUT, "apple-touch-icon.png"));
    expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(180);
    expect(png.readUInt32BE(20)).toBe(180);
  });

  it("every page links the favicon, SVG icon, and touch icon", () => {
    for (const file of htmlFiles().filter((f) => f !== "404.html")) {
      const html = read(file);
      expect(html, file).toContain('href="/favicon.ico"');
      expect(html, file).toContain('href="/icon.svg"');
      expect(html, file).toContain('href="/apple-touch-icon.png"');
    }
  });
});

describe("share card", () => {
  it("og.png is a 1200×630 PNG", () => {
    const png = readFileSync(path.join(OUT, "og.png"));
    expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  it.each(
    htmlFiles().filter((f) => f !== "404.html"),
  )("%s advertises the card for Open Graph and Twitter", (file) => {
    const html = read(file);
    expect(html).toContain(`property="og:image" content="${site.url}/og.png"`);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });
});

describe("home page structured data", () => {
  it("embeds a valid Person JSON-LD block", () => {
    const match = read("index.html").match(
      /<script type="application\/ld\+json">([^<]+)<\/script>/,
    );
    expect(match, "JSON-LD script missing").not.toBeNull();
    const data = JSON.parse(match?.[1] ?? "{}");
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe(site.name);
    expect(data.sameAs).toContain(site.github);
    expect(JSON.stringify(data)).not.toContain(site.email);
  });
});

describe("per-page social metadata", () => {
  it.each([
    ["about.html", "/about"],
    ["projects.html", "/projects"],
    ["contact.html", "/contact"],
    ["contact-book.html", "/contact-book"],
    ...projects.map((p) => [`projects/${p.slug}.html`, `/projects/${p.slug}`]),
  ])("%s has its own canonical and og:url", (file, route) => {
    const html = read(file as string);
    expect(html).toContain(`rel="canonical" href="${site.url}${route}"`);
    expect(html).toContain(`property="og:url" content="${site.url}${route}"`);
    expect(html).not.toContain(
      `property="og:title" content="${site.name} — ${site.role}"`,
    );
  });
});

describe("resume", () => {
  it("lives at the descriptive filename", () => {
    expect(site.resumePath).toBe("/Pratul-Maddipudi-Resume.pdf");
  });

  it("old resume URL redirects permanently to the new one", () => {
    expect(read("_redirects")).toMatch(
      new RegExp(`^/Pratul-Resume\\.pdf\\s+${site.resumePath}\\s+301$`, "m"),
    );
    expect(has("Pratul-Resume.pdf")).toBe(false);
  });
});

describe("deployment artifacts", () => {
  it("resume is a real PDF", () => {
    const buffer = readFileSync(path.join(OUT, site.resumePath.slice(1)));
    expect(buffer.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it("_headers keeps security and caching rules", () => {
    const headers = read("_headers");
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("max-age=31536000, immutable");
  });

  it("_headers lets Cloudflare Web Analytics load and report", () => {
    const csp = read("_headers").match(/Content-Security-Policy:[^\n]*/)?.[0];
    expect(csp).toMatch(
      /script-src[^;]*https:\/\/static\.cloudflareinsights\.com/,
    );
    expect(csp).toMatch(/connect-src[^;]*https:\/\/cloudflareinsights\.com/);
  });

  it("renders the analytics beacon only when a token is configured", () => {
    const html = read("index.html");
    if (site.analyticsToken) {
      expect(html).toContain("static.cloudflareinsights.com/beacon.min.js");
      expect(html).toContain(site.analyticsToken);
    } else {
      expect(html).not.toContain("cloudflareinsights");
    }
  });

  it("_headers locks down framing, plugins, and transport", () => {
    const headers = read("_headers");
    expect(headers).toContain("X-Frame-Options: DENY");
    expect(headers).toContain("Strict-Transport-Security:");
    expect(headers).toMatch(
      /Content-Security-Policy:[^\n]*frame-ancestors 'none'/,
    );
    expect(headers).toMatch(/Content-Security-Policy:[^\n]*object-src 'none'/);
  });

  it("robots.txt points at the sitemap", () => {
    expect(read("robots.txt")).toContain(`${site.url}/sitemap.xml`);
  });
});

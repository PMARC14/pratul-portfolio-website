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
    "resume.pdf",
    "favicon.ico",
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

describe("deployment artifacts", () => {
  it("resume.pdf is a real PDF", () => {
    const buffer = readFileSync(path.join(OUT, "resume.pdf"));
    expect(buffer.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it("_headers keeps security and caching rules", () => {
    const headers = read("_headers");
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("max-age=31536000, immutable");
  });

  it("robots.txt points at the sitemap", () => {
    expect(read("robots.txt")).toContain(`${site.url}/sitemap.xml`);
  });
});

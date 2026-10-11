import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { hotline } from "@/data/hotline";
import { featuredProjects, projects, visibleProjects } from "@/data/projects";
import { site } from "@/data/site";

/**
 * Content-integrity tests: catch bad data before it ever builds.
 * These run against the source data files directly.
 */

describe("site config", () => {
  it("has a plausible contact email", () => {
    expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("has an https production URL without a trailing slash", () => {
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith("/")).toBe(false);
  });

  it("has an https GitHub URL", () => {
    expect(site.github).toMatch(/^https:\/\/github\.com\//);
  });

  it("points resumePath at a file that exists in public/", () => {
    expect(site.resumePath.startsWith("/")).toBe(true);
    const file = path.join(
      import.meta.dirname,
      "..",
      "public",
      site.resumePath.slice(1),
    );
    expect(existsSync(file), `${site.resumePath} missing from public/`).toBe(
      true,
    );
  });
});

describe("project data", () => {
  it("has unique, URL-safe slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it.each(
    projects.map((p) => [p.slug, p] as const),
  )("%s has complete content", (_slug, project) => {
    expect(project.title.trim()).not.toBe("");
    expect(project.summary.trim()).not.toBe("");
    expect(project.role.trim()).not.toBe("");
    expect(project.year).toMatch(/^\d{4}$/);
    expect(project.overview.length).toBeGreaterThan(0);
    expect(project.highlights.length).toBeGreaterThan(0);
    expect(project.stack.length).toBeGreaterThan(0);
    for (const link of project.links ?? []) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.label.trim()).not.toBe("");
    }
  });

  it.each(
    projects.flatMap((p) => (p.images ?? []).map((i) => [p.slug, i] as const)),
  )("%s image %#  exists, has alt text, and declares its real size", (_slug, image) => {
    expect(image.alt.trim().length).toBeGreaterThan(20);
    const file = path.join(
      import.meta.dirname,
      "..",
      "public",
      image.src.slice(1),
    );
    expect(existsSync(file), `${image.src} missing from public/`).toBe(true);
    const png = readFileSync(file);
    expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
    expect(png.readUInt32BE(16), "declared width").toBe(image.width);
    expect(png.readUInt32BE(20), "declared height").toBe(image.height);
  });

  it("call-to-action buttons point at pages on this site", () => {
    for (const project of projects) {
      if (!project.cta) continue;
      expect(project.cta.href).toMatch(/^\/[a-z0-9-/]*$/);
      expect(project.cta.label.trim()).not.toBe("");
    }
  });

  it("hotline's case study links its install page and shared URLs", () => {
    const project = projects.find((p) => p.slug === "hotline");
    expect(project?.cta?.href).toBe(hotline.path);
    const hrefs = (project?.links ?? []).map((l) => l.href);
    expect(hrefs).toContain(hotline.repo);
    expect(hrefs).toContain(hotline.releases);
  });

  it("hotline URLs are https GitHub links for the Hotline repo", () => {
    for (const key of [
      "repo",
      "releases",
      "latestRelease",
      "privacy",
      "configuration",
      "license",
    ] as const) {
      expect(hotline[key]).toMatch(/^https:\/\/github\.com\/PMARC14\/Hotline/);
    }
  });

  it("keeps unlisted projects out of the visible and featured sets", () => {
    for (const project of visibleProjects) {
      expect(project.unlisted).not.toBe(true);
    }
    for (const project of featuredProjects) {
      expect(project.unlisted).not.toBe(true);
      expect(project.featured).toBe(true);
    }
  });

  it("features at least one project on the home page", () => {
    expect(featuredProjects.length).toBeGreaterThan(0);
  });
});

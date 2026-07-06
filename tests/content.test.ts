import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

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

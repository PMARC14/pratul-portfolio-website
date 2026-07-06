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
	location: "United States",
} as const;

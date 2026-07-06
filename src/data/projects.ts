/**
 * ─────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT — replace with your real work.
 *
 *  Each entry here automatically gets:
 *    • a row on the home page (when `featured` is true)
 *    • a row on /projects
 *    • a fully rendered breakdown page at /projects/<slug>
 *    • an entry in the sitemap
 *
 *  Edit or add objects below; nothing else needs to change.
 * ─────────────────────────────────────────────────────────────────────
 */

export type ProjectLink = {
	label: string;
	href: string;
};

export type Project = {
	/** URL segment: /projects/<slug> */
	slug: string;
	title: string;
	year: string;
	/** One-liner shown in list rows. */
	summary: string;
	/** Paragraphs for the breakdown page's overview. */
	overview: string[];
	role: string;
	stack: string[];
	/** Concrete outcomes / decisions worth bragging about. */
	highlights: string[];
	links?: ProjectLink[];
	/** Featured projects appear on the home page. */
	featured: boolean;
	/**
	 * Unlisted pages still build at /projects/<slug> and work when
	 * someone has the link, but never appear in the header dropdown,
	 * home page, /projects index, or sitemap — and they tell search
	 * engines not to index them.
	 */
	unlisted?: boolean;
};

export const projects: Project[] = [
	{
		slug: "portfolio",
		title: "This Website",
		year: "2026",
		summary:
			"A fully static portfolio served from Cloudflare's edge — zero servers, sub-second loads worldwide.",
		overview: [
			"This site is a deliberately small system: Next.js 15 compiled to a fully static export, styled with a five-token Tailwind design system, and served as static assets by a Cloudflare Worker with a Cloudflare Pages fallback.",
			"Every page is pre-rendered at build time — project breakdowns are generated from a single typed data file, so adding a case study is a data change, not a code change. No runtime, no database, nothing to patch on a Sunday night.",
		],
		role: "Design & engineering",
		stack: [
			"Next.js 15",
			"TypeScript",
			"Tailwind CSS v4",
			"Cloudflare Workers",
		],
		highlights: [
			"Static-first architecture: one `next build` artifact deploys unchanged to both Workers and Pages.",
			"Design tokens with automatic light/dark schemes driven by system preference.",
			"Accessible by construction — semantic landmarks, skip link, focus-visible states, reduced-motion support.",
		],
		links: [
			{
				label: "Source on GitHub",
				href: "https://github.com/PMARC14/pratul-portfolio-website",
			},
		],
		featured: true,
	},
	{
		slug: "signal-dashboard",
		title: "Signal Dashboard",
		year: "2025",
		summary:
			"Real-time telemetry dashboard streaming thousands of sensor updates per second to the browser.",
		overview: [
			"PLACEHOLDER — swap in a real project. Signal Dashboard is a sample case study describing a live-updating operations dashboard: WebSocket ingestion, ring-buffered chart state, and a rendering budget that keeps the main thread free.",
			"Use this space to explain the problem, the constraints you were working under, and the approach you took — two or three short paragraphs is plenty.",
		],
		role: "Full-stack engineering",
		stack: ["React", "TypeScript", "WebSockets", "Node.js"],
		highlights: [
			"Replace these bullets with concrete, measurable outcomes.",
			"Ship metrics beat adjectives: latency numbers, load-time wins, adoption.",
			"Two to four bullets reads best on the breakdown page.",
		],
		featured: true,
	},
	{
		slug: "waypoint",
		title: "Waypoint",
		year: "2025",
		summary:
			"Interactive pathfinding visualizer that animates A*, Dijkstra, and BFS across editable terrain.",
		overview: [
			"PLACEHOLDER — swap in a real project. Waypoint is a sample case study describing an algorithm visualizer: a canvas-rendered grid, draggable walls and weights, and step-through animation of each algorithm's frontier.",
			"Describe what made it interesting to build — the data structures, the rendering approach, what you'd do differently now.",
		],
		role: "Design & engineering",
		stack: ["TypeScript", "Canvas API", "Vite"],
		highlights: [
			"Replace these bullets with concrete, measurable outcomes.",
			"Mention scale where you can: users, stars, requests, dataset size.",
		],
		featured: true,
	},
	{
		slug: "coursemap",
		title: "Coursemap",
		year: "2024",
		summary:
			"Degree-planning tool that turns a course catalog into an interactive prerequisite graph.",
		overview: [
			"PLACEHOLDER — swap in a real project. Coursemap is a sample case study describing a planning tool: catalog data normalized into a DAG, semester-by-semester drag-and-drop planning, and validation that flags broken prerequisite chains as you go.",
			"Older projects are worth keeping if they show range — a different domain, a different stack, or a different kind of problem.",
		],
		role: "Full-stack engineering",
		stack: ["Next.js", "PostgreSQL", "Drizzle ORM"],
		highlights: [
			"Replace these bullets with concrete, measurable outcomes.",
			"Even one strong sentence per bullet is enough.",
		],
		featured: false,
	},
	{
		slug: "playground",
		title: "Playground",
		year: "2026",
		summary:
			"An unlisted example page — only people with the direct link can find it.",
		overview: [
			"PLACEHOLDER — this entry demonstrates unlisted pages. It is reachable at /projects/playground for anyone with the link, but it appears nowhere on the site: no header dropdown, no home page row, no /projects index, no sitemap entry, and search engines are told not to index it.",
			"Use unlisted entries for work you want to share selectively — a case study for one specific application, a demo that isn't ready for the front page, or notes for a class.",
		],
		role: "Example",
		stack: ["Unlisted", "Direct link only"],
		highlights: [
			"Set `unlisted: true` on any project to get a page like this one.",
			"Delete this entry whenever you like — nothing links to it.",
		],
		featured: false,
		unlisted: true,
	},
];

/** Everything shown in public lists (home, /projects, dropdown, sitemap). */
export const visibleProjects = projects.filter((p) => !p.unlisted);

export const featuredProjects = visibleProjects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}

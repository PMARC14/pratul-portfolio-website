import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProject, projects, visibleProjects } from "@/data/projects";
import { accentStyle } from "@/lib/accents";

type Props = {
	params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

// Unlisted projects still get their page built — they're excluded from
// lists and the sitemap, not from the build.
export function generateStaticParams() {
	return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const project = getProject(slug);
	if (!project) {
		return {};
	}
	return {
		title: project.title,
		description: project.summary,
		// Keep unlisted pages out of search engines; link-only access.
		robots: project.unlisted ? { index: false, follow: false } : undefined,
	};
}

export default async function ProjectPage({ params }: Props) {
	const { slug } = await params;
	const project = getProject(slug);
	if (!project) {
		notFound();
	}

	// Prev/next only walks listed projects, so unlisted pages are never
	// surfaced by navigation (and don't participate in it themselves).
	const index = visibleProjects.findIndex((p) => p.slug === project.slug);
	const previous = index >= 0 ? visibleProjects[index - 1] : undefined;
	const next = index >= 0 ? visibleProjects[index + 1] : undefined;

	return (
		<article
			className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32"
			style={accentStyle(Math.max(index, 0))}
		>
			<Link
				className="group inline-flex items-center gap-2 font-mono text-muted text-xs uppercase tracking-widest transition-colors hover:text-ink"
				href="/projects"
			>
				<span
					aria-hidden="true"
					className="transition-transform group-hover:-translate-x-1"
				>
					&larr;
				</span>
				All projects
			</Link>

			<header className="mt-10">
				<h1 className="max-w-3xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
					{project.title}
				</h1>
				<p className="mt-5 max-w-2xl text-lg text-muted leading-relaxed sm:text-xl">
					{project.summary}
				</p>
			</header>

			<dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-line border-y py-8 sm:grid-cols-3">
				<div>
					<dt className="font-mono text-muted text-xs uppercase tracking-widest">
						Year
					</dt>
					<dd className="mt-2 text-sm">{project.year}</dd>
				</div>
				<div>
					<dt className="font-mono text-muted text-xs uppercase tracking-widest">
						Role
					</dt>
					<dd className="mt-2 text-sm">{project.role}</dd>
				</div>
				<div className="col-span-2 sm:col-span-1">
					<dt className="font-mono text-muted text-xs uppercase tracking-widest">
						Stack
					</dt>
					<dd className="mt-2 text-sm">{project.stack.join(" · ")}</dd>
				</div>
			</dl>

			<section aria-labelledby="overview-heading" className="mt-14 max-w-2xl">
				<h2
					className="font-mono text-muted text-xs uppercase tracking-widest"
					id="overview-heading"
				>
					Overview
				</h2>
				<div className="mt-5 space-y-5">
					{project.overview.map((paragraph) => (
						<p className="leading-relaxed" key={paragraph.slice(0, 32)}>
							{paragraph}
						</p>
					))}
				</div>
			</section>

			<section aria-labelledby="highlights-heading" className="mt-14 max-w-2xl">
				<h2
					className="font-mono text-muted text-xs uppercase tracking-widest"
					id="highlights-heading"
				>
					Highlights
				</h2>
				<ul className="mt-5 space-y-4">
					{project.highlights.map((highlight) => (
						<li className="flex gap-3 leading-relaxed" key={highlight}>
							<span aria-hidden="true" className="mt-px text-accent">
								&#9656;
							</span>
							{highlight}
						</li>
					))}
				</ul>
			</section>

			{project.links && project.links.length > 0 && (
				<section aria-labelledby="links-heading" className="mt-14">
					<h2
						className="font-mono text-muted text-xs uppercase tracking-widest"
						id="links-heading"
					>
						Links
					</h2>
					<ul className="mt-5 flex flex-wrap gap-3">
						{project.links.map((link) => (
							<li key={link.href}>
								<a
									className="inline-block rounded-full border border-line px-5 py-2.5 font-medium text-sm transition-colors hover:border-accent hover:text-accent"
									href={link.href}
									rel="noreferrer"
									target="_blank"
								>
									{link.label} &#8599;
								</a>
							</li>
						))}
					</ul>
				</section>
			)}

			{(previous || next) && (
				<nav
					aria-label="More projects"
					className="mt-20 grid gap-6 border-line border-t pt-8 sm:grid-cols-2"
				>
					<div>
						{previous && (
							<Link
								className="group block"
								href={`/projects/${previous.slug}`}
								rel="prev"
							>
								<span className="font-mono text-muted text-xs uppercase tracking-widest">
									&larr; Previous
								</span>
								<span className="mt-2 block font-semibold text-lg tracking-tight transition-colors group-hover:text-accent">
									{previous.title}
								</span>
							</Link>
						)}
					</div>
					<div className="sm:text-right">
						{next && (
							<Link
								className="group block"
								href={`/projects/${next.slug}`}
								rel="next"
							>
								<span className="font-mono text-muted text-xs uppercase tracking-widest">
									Next &rarr;
								</span>
								<span className="mt-2 block font-semibold text-lg tracking-tight transition-colors group-hover:text-accent">
									{next.title}
								</span>
							</Link>
						)}
					</div>
				</nav>
			)}
		</article>
	);
}

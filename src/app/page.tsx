import Link from "next/link";

import { ProjectList } from "@/components/project-list";
import { featuredProjects } from "@/data/projects";
import { site } from "@/data/site";
import { accent } from "@/lib/accents";

export default function Home() {
	return (
		<>
			{/* Hero fills the first viewport; its content dims and drifts
			    upward as you scroll (scroll-driven, reduced-motion aware). */}
			<section className="relative mx-auto flex min-h-[calc(100dvh-3.75rem)] w-full max-w-5xl flex-col justify-center px-6 py-20">
				<div className="scroll-dim">
					<p className="animate-rise font-mono text-accent text-xs uppercase tracking-widest">
						{site.role} &middot; {site.location}
					</p>
					<h1 className="mt-5 max-w-3xl animate-rise text-balance font-semibold text-5xl tracking-tight [animation-delay:80ms] sm:text-7xl">
						I build fast, thoughtful software for the web.
					</h1>
					<p className="mt-6 max-w-xl animate-rise text-lg text-muted leading-relaxed [animation-delay:160ms]">
						I'm {site.name.split(" ")[0]} — an engineer who cares about the
						details: clean systems, quick pages, and interfaces that feel
						obvious. I work across the stack with TypeScript, React, and modern
						edge infrastructure.
					</p>
					<div className="mt-10 flex animate-rise flex-wrap items-center gap-4 [animation-delay:240ms]">
						<a
							className="rounded-full bg-ink px-6 py-3 font-medium text-bg text-sm transition-colors hover:bg-accent"
							href="#work"
						>
							View my work &darr;
						</a>
						<Link
							className="rounded-full border border-line px-6 py-3 font-medium text-sm transition-colors hover:border-accent hover:text-accent"
							href="/contact"
						>
							Get in touch
						</Link>
					</div>
				</div>

				<div className="scroll-cue-fade absolute bottom-8 left-1/2 -translate-x-1/2">
					<span className="flex animate-float items-center gap-2 font-mono text-muted text-xs uppercase tracking-widest">
						Scroll <span aria-hidden="true">&darr;</span>
					</span>
				</div>
			</section>

			<section
				aria-labelledby="work-heading"
				className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 pb-24 sm:pb-32"
				id="work"
				style={accent.green}
			>
				<div className="reveal mb-8 flex items-baseline justify-between">
					<h2
						className="font-mono text-accent text-xs uppercase tracking-widest"
						id="work-heading"
					>
						Selected work
					</h2>
					<span className="font-mono text-muted text-xs tabular-nums">
						{String(featuredProjects.length).padStart(2, "0")} projects
					</span>
				</div>

				<ProjectList projects={featuredProjects} />

				<div className="reveal mt-10">
					<Link
						className="group inline-flex items-center gap-2 font-medium text-sm transition-colors hover:text-accent"
						href="/projects"
					>
						All project breakdowns
						<span
							aria-hidden="true"
							className="transition-transform group-hover:translate-x-1"
						>
							&rarr;
						</span>
					</Link>
				</div>
			</section>
		</>
	);
}

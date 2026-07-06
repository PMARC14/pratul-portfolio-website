import Link from "next/link";

import type { Project } from "@/data/projects";
import { accentStyle } from "@/lib/accents";

/**
 * Editorial list rows. Each row rotates through the red → green → blue
 * accent family (hover tint, index number) and reveals on scroll entry.
 */
export function ProjectList({ projects }: { projects: Project[] }) {
	return (
		<ul className="divide-y divide-line border-line border-y">
			{projects.map((project, index) => (
				<li className="reveal" key={project.slug} style={accentStyle(index)}>
					<Link
						className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 py-8 sm:grid-cols-[3rem_1fr_auto] sm:py-10"
						href={`/projects/${project.slug}`}
					>
						<span className="font-mono text-accent text-xs tabular-nums">
							{String(index + 1).padStart(2, "0")}
						</span>

						<span className="min-w-0">
							<span className="flex items-baseline gap-3">
								<span className="font-semibold text-2xl tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
									{project.title}
								</span>
								<span
									aria-hidden="true"
									className="text-accent opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
								>
									&#8599;
								</span>
							</span>
							<span className="mt-2 block max-w-xl text-muted text-sm leading-relaxed sm:text-base">
								{project.summary}
							</span>
							<span className="mt-3 block font-mono text-muted text-xs uppercase tracking-wider sm:hidden">
								{project.stack.join(" · ")}
							</span>
						</span>

						<span className="hidden text-right font-mono text-muted text-xs leading-loose sm:block">
							{project.year}
							<span className="block max-w-44 normal-case">
								{project.stack.join(" · ")}
							</span>
						</span>
					</Link>
				</li>
			))}
		</ul>
	);
}

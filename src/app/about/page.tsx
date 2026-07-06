import type { Metadata } from "next";

import { site } from "@/data/site";
import { accent } from "@/lib/accents";

export const metadata: Metadata = {
	title: "About",
	description: `Who ${site.name} is, what he works with, and where to get his resume.`,
};

const capabilities = [
	{
		area: "Frontend",
		items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
	},
	{
		area: "Backend",
		items: ["Node.js", "PostgreSQL", "Drizzle ORM", "REST & tRPC"],
	},
	{
		area: "Platform",
		items: ["Cloudflare Workers", "CI/CD", "Git", "Performance tuning"],
	},
] as const;

export default function AboutPage() {
	return (
		<section
			className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32"
			style={accent.blue}
		>
			<p className="font-mono text-accent text-xs uppercase tracking-widest">
				About
			</p>
			<h1 className="mt-4 max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
				Engineer first, generalist by habit.
			</h1>

			<div className="mt-14 grid gap-14 lg:grid-cols-[1fr_20rem] lg:gap-20">
				<div className="max-w-2xl space-y-5 leading-relaxed">
					{/* TODO: personalize this bio — it's intentionally generic. */}
					<p>
						I'm {site.name}, a software engineer who likes owning problems end
						to end — from the data model to the final pixel. The work I'm
						proudest of is rarely the cleverest code; it's the systems that
						stayed simple under pressure and the interfaces people didn't have
						to think about.
					</p>
					<p>
						My day-to-day stack is TypeScript, React, and Next.js, backed by
						relational databases and deployed to edge platforms like Cloudflare.
						I hold my work to practical standards: fast first loads, accessible
						by default, and boring to operate.
					</p>
					<p>
						Right now I'm looking for opportunities where I can ship product
						quickly with a small, senior-minded team. If that sounds like your
						team, the resume on the right is current — or just{" "}
						<a
							className="underline decoration-2 decoration-accent underline-offset-4 transition-colors hover:text-accent"
							href={`mailto:${site.email}`}
						>
							email me
						</a>
						.
					</p>
				</div>

				<aside className="space-y-10">
					<div className="rounded-2xl border border-line p-6">
						<h2 className="font-mono text-muted text-xs uppercase tracking-widest">
							Resume
						</h2>
						<p className="mt-3 text-muted text-sm leading-relaxed">
							One page, kept current. The full picture of where I've worked and
							what I shipped.
						</p>
						<a
							className="mt-5 inline-block w-full rounded-full bg-ink px-6 py-3 text-center font-medium text-bg text-sm transition-colors hover:bg-accent"
							download
							href={site.resumePath}
						>
							Download resume (PDF) &darr;
						</a>
					</div>

					<div>
						<h2 className="font-mono text-muted text-xs uppercase tracking-widest">
							Capabilities
						</h2>
						<dl className="mt-4 space-y-5">
							{capabilities.map((group) => (
								<div key={group.area}>
									<dt className="font-medium text-sm">{group.area}</dt>
									<dd className="mt-1 text-muted text-sm leading-relaxed">
										{group.items.join(" · ")}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</aside>
			</div>
		</section>
	);
}

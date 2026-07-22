import Link from "next/link";

import { links, site } from "@/data/site";
import { accent } from "@/lib/accents";

export function SiteFooter() {
	return (
		<footer className="border-line border-t" style={accent.blue}>
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="font-mono text-muted text-xs uppercase tracking-widest">
						Get in touch
					</p>
					<a
						className="mt-1 inline-block font-semibold text-lg tracking-tight transition-colors hover:text-accent"
						href={`mailto:${site.email}`}
					>
						{site.email}
					</a>
				</div>

				<ul className="flex items-center gap-6 font-mono text-muted text-xs">
					<li>
						<Link className="transition-colors hover:text-ink" href="/contact">
							Contact &rarr;
						</Link>
					</li>
					<li>
						<a
							className="transition-colors hover:text-ink"
							href={links.github.href}
							rel="noreferrer"
							target="_blank"
						>
							GitHub &#8599;
						</a>
					</li>
					<li>
						<a
							className="transition-colors hover:text-ink"
							href={links.linkedin.href}
							rel="noreferrer"
							target="_blank"
						>
							LinkedIn &#8599;
						</a>
					</li>
					<li>
						<a
							className="transition-colors hover:text-ink"
							download
							href={links.resume.href}
						>
							Resume &#8595;
						</a>
					</li>
				</ul>

				<p className="font-mono text-muted text-xs">
					&copy; {new Date().getFullYear()} {site.name}
				</p>
			</div>
		</footer>
	);
}

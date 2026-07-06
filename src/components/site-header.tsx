"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/data/site";
import { accentStyle } from "@/lib/accents";

const navItems = [
	{ label: "Projects", href: "/projects" },
	{ label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
] as const;

type DropdownProject = {
	slug: string;
	title: string;
	year: string;
};

/**
 * Sticky header that slides away while scrolling down and returns the
 * moment you scroll up (or focus anything inside it). "Projects" grows
 * a hover/focus dropdown of case-study links on pointer devices; on
 * touch the link itself just navigates to /projects.
 *
 * The dropdown list arrives as a prop from the server layout so that
 * only listed projects are serialized into the client bundle — unlisted
 * entries never leave the server.
 */
export function SiteHeader({ projects }: { projects: DropdownProject[] }) {
	const pathname = usePathname();
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		let lastY = window.scrollY;
		let scrollingDown = false;
		let nearTop = false;
		let ticking = false;

		const update = () => {
			setHidden(scrollingDown && !nearTop && window.scrollY > 96);
		};

		function onScroll() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const y = window.scrollY;
				scrollingDown = y > lastY;
				lastY = y;
				ticking = false;
				update();
			});
		}

		// Moving the pointer near the top edge summons the header back
		// without needing to scroll up.
		function onPointerMove(event: PointerEvent) {
			const wasNearTop = nearTop;
			nearTop = event.clientY <= 80;
			if (nearTop !== wasNearTop) update();
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("pointermove", onPointerMove, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("pointermove", onPointerMove);
		};
	}, []);

	return (
		<header
			className={`sticky top-0 z-50 border-line border-b bg-bg/85 backdrop-blur-md transition-transform duration-300 focus-within:translate-y-0 ${
				hidden ? "-translate-y-full" : "translate-y-0"
			}`}
		>
			<div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-4">
				<Link
					className="font-medium text-sm tracking-tight transition-colors hover:text-accent"
					href="/"
				>
					{site.name}
				</Link>

				<div className="flex items-center gap-5 sm:gap-7">
					<nav aria-label="Primary">
						<ul className="flex items-center gap-5 sm:gap-7">
							{navItems.map((item) => {
								const isActive = pathname.startsWith(item.href);
								const isProjects = item.href === "/projects";
								return (
									<li
										className={isProjects ? "group relative" : undefined}
										key={item.href}
									>
										<Link
											aria-current={isActive ? "page" : undefined}
											className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:text-ink ${
												isActive
													? "text-ink underline decoration-2 decoration-accent underline-offset-8"
													: "text-muted"
											}`}
											href={item.href}
										>
											{item.label}
											{isProjects && (
												<svg
													aria-hidden="true"
													className="hidden transition-transform duration-200 group-hover:rotate-180 sm:block"
													fill="none"
													height="8"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 12 8"
													width="12"
												>
													<path d="M1.5 2 6 6.5 10.5 2" />
												</svg>
											)}
										</Link>

										{isProjects && (
											<div className="invisible absolute top-full left-1/2 hidden -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 sm:block">
												<ul className="w-72 rounded-2xl border border-line bg-panel p-2 shadow-menu">
													{projects.map((project, index) => (
														<li key={project.slug} style={accentStyle(index)}>
															<Link
																className="flex items-baseline justify-between gap-4 rounded-xl px-4 py-2.5 transition-colors hover:bg-line/40 hover:text-accent"
																href={`/projects/${project.slug}`}
															>
																<span className="font-medium text-sm tracking-tight">
																	{project.title}
																</span>
																<span className="font-mono text-muted text-xs tabular-nums">
																	{project.year}
																</span>
															</Link>
														</li>
													))}
													<li className="mt-2 border-line border-t pt-2">
														<Link
															className="flex items-center justify-between rounded-xl px-4 py-2.5 font-mono text-muted text-xs uppercase tracking-widest transition-colors hover:bg-line/40 hover:text-ink"
															href="/projects"
														>
															All projects
															<span aria-hidden="true">&rarr;</span>
														</Link>
													</li>
												</ul>
											</div>
										)}
									</li>
								);
							})}
						</ul>
					</nav>

					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}

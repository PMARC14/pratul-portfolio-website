import type { Metadata } from "next";

import { ProjectList } from "@/components/project-list";
import { visibleProjects } from "@/data/projects";
import { accent } from "@/lib/accents";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Detailed breakdowns of selected projects — the problem, the approach, and what shipped.",
};

export default function ProjectsPage() {
  return (
    <section
      className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32"
      style={accent.green}
    >
      <p className="font-mono text-accent text-xs uppercase tracking-widest">
        Projects
      </p>
      <h1 className="mt-4 max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
        Case studies, not screenshots.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
        Every project below links to a full breakdown — the problem it solves,
        the decisions behind it, and what I'd do differently now.
      </p>

      <div className="mt-14">
        <ProjectList projects={visibleProjects} />
      </div>
    </section>
  );
}

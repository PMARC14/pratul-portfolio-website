import type { Metadata } from "next";
import Image from "next/image";

import { links, site } from "@/data/site";
import { accent, accentStyle } from "@/lib/accents";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `Background, skills, and experience of ${site.name}, plus a downloadable resume.`,
  path: "/about",
});

const capabilities = [
  {
    area: "Languages",
    items: ["Python", "Java", "TypeScript/JavaScript", "C/C++/C#", "SQL"],
  },
  {
    area: "Cloud & Data",
    items: [
      "GCP (BigQuery, Vertex AI)",
      "Azure",
      "AWS",
      "Snowflake",
      "Databricks",
    ],
  },
  {
    area: "AI/ML & DevOps",
    items: [
      "Vertex AI Agents",
      "MLOps",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
    ],
  },
  {
    area: "Systems & SAP",
    items: [
      "SAP S/4HANA",
      "Linux (NixOS)",
      "FreeRTOS",
      "STM32",
      "Microservices",
    ],
  },
] as const;

const experience = [
  {
    company: "Blackstone Valley Consulting Inc",
    role: "SAP & Cloud Consultant",
    period: "Jun 2025 — Present",
    location: "Lincoln, RI",
    highlights: [
      "Migrated Functional Locations, Equipment, and BOM data off a legacy MYOB system into SAP with virtually no downtime across US and Australia teams.",
      "Built middleware integrating SAP iDocs and carrier data, moving legacy SAP workloads from on-prem to Google Cloud.",
      "Hosted Vertex AI agents in GCP to aggregate customer tickets across services into a unified internal dashboard.",
    ],
  },
  {
    company: "American Airlines",
    role: "Software Engineer — Crew Check-in, Baggage Tracking & Travel Documents",
    period: "Jun 2022 — May 2025",
    location: "Dallas, TX",
    highlights: [
      "Owned features end-to-end for the Crew Check-in app and Baggage Equipment Tracking, deploying to Microsoft Azure within an Agile team.",
      "Built automated test coverage for check-in functionality with Playwright, and piloted GitHub Copilot for the dev team.",
      "Resolved cross-country travel document incompatibilities in Java, deploying to Google Cloud Run and GKE.",
    ],
  },
  {
    company: "Western Digital Corporation",
    role: "Hard Disk Drive Algorithms/Firmware R&D Co-op",
    period: "Aug 2021 — Dec 2021",
    location: "Rochester, MN",
    highlights: [
      "Ran statistical analysis on HDD performance characteristics with NumPy, SciPy, and Pandas.",
      "Developed and tested next-generation algorithms to improve HDD throughput, including embedded onboard training workloads.",
      "Set up Docker-based OS-level virtualization to host and run models.",
    ],
  },
] as const;

const education = {
  school: "Rensselaer Polytechnic Institute",
  location: "Troy, NY",
  degree: "B.S., Computer Science & Economics",
  coursework: [
    "Data Structures",
    "Introduction to Algorithms",
    "Operating Systems",
    "Machine Learning from Data",
    "Linear Algebra",
    "Applied Game Theory",
    "Econometrics",
  ],
};

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
          <p>
            I'm {site.name}, a software engineer with four years of professional
            experience spanning full-stack development, cloud migrations, and
            statistical analysis. I like owning problems end to end — from a
            legacy system migration with zero acceptable downtime to the
            interface a crew member checks in with every morning.
          </p>
          <p>
            My work has taken me across GCP, Azure, and AWS, through SAP S/4HANA
            configuration and migration, and into hosting Vertex AI agents that
            turn scattered customer tickets into one usable dashboard. Day to
            day I write TypeScript, Java, Python, and SQL, and I'm particularly
            drawn to lightweight edge AI and embedded Linux systems.
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
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line">
            <Image
              alt={`Photo of ${site.name}`}
              className="object-cover"
              fill
              sizes="20rem"
              src="/headshot.jpg"
            />
          </div>

          <ul className="flex items-center gap-5 font-mono text-muted text-xs">
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
          </ul>

          <div className="rounded-2xl border border-line p-6">
            <h2 className="font-mono text-muted text-xs uppercase tracking-widest">
              Resume
            </h2>
            <p className="mt-3 text-muted text-sm leading-relaxed">
              Two pages, kept current. The full picture of where I've worked and
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

      <div className="mt-20">
        <h2 className="font-mono text-accent text-xs uppercase tracking-widest">
          Experience
        </h2>
        <ul className="mt-6 space-y-6">
          {experience.map((job, index) => (
            <li
              className="rounded-2xl border border-line p-6"
              key={job.company}
              style={accentStyle(index)}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-semibold text-lg tracking-tight">
                  {job.company}
                </p>
                <p className="font-mono text-muted text-xs tabular-nums">
                  {job.period}
                </p>
              </div>
              <p className="mt-1 text-accent text-sm">
                {job.role} &middot; {job.location}
              </p>
              <ul className="mt-4 space-y-2 text-muted text-sm leading-relaxed">
                {job.highlights.map((point) => (
                  <li className="flex gap-3" key={point}>
                    <span aria-hidden="true" className="text-accent">
                      &middot;
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16">
        <h2 className="font-mono text-accent text-xs uppercase tracking-widest">
          Education
        </h2>
        <div
          className="mt-6 rounded-2xl border border-line p-6"
          style={accent.green}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-semibold text-lg tracking-tight">
              {education.school}
            </p>
            <p className="font-mono text-muted text-xs">{education.location}</p>
          </div>
          <p className="mt-1 text-accent text-sm">{education.degree}</p>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Relevant coursework: {education.coursework.join(", ")}.
          </p>
        </div>
      </div>
    </section>
  );
}

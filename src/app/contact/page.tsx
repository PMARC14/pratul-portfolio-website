import type { Metadata } from "next";
import Link from "next/link";

import { links, site } from "@/data/site";
import { accent, accentStyle } from "@/lib/accents";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — email, GitHub, or grab the resume.`,
};

const channels = [
  {
    ...links.email,
    description: "The fastest way to reach me. I reply within a day.",
    cta: "Write to me",
  },
  {
    ...links.github,
    description: "Code, experiments, and whatever I'm currently breaking.",
    cta: "See the code",
  },
  {
    ...links.linkedin,
    description: "Professional background and where else I show up online.",
    cta: "Connect",
  },
  {
    ...links.resume,
    description: "Where I've worked and what I shipped, kept current.",
    cta: "Download",
  },
] as const;

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <p
        className="font-mono text-accent text-xs uppercase tracking-widest"
        style={accent.red}
      >
        Contact
      </p>
      <h1 className="mt-4 max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
        Let's talk.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
        Whether it's a role, a project, or a question about something I built —
        my inbox is open. No forms, no tickets; just email.
      </p>

      <a
        className="group mt-10 inline-flex items-baseline gap-3 font-semibold text-2xl tracking-tight transition-colors hover:text-accent sm:text-4xl"
        href={`mailto:${site.email}`}
        style={accent.red}
      >
        {site.email}
        <span
          aria-hidden="true"
          className="text-accent transition-transform group-hover:translate-x-1.5"
        >
          &rarr;
        </span>
      </a>

      <p className="mt-6 text-muted text-sm" style={accent.green}>
        Not an email person?{" "}
        <Link
          className="font-medium text-ink underline decoration-2 decoration-accent underline-offset-4 transition-colors hover:text-accent"
          href="/contact-book"
        >
          Sign the contact book
        </Link>{" "}
        instead.
      </p>

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((channel, index) => (
          <li key={channel.label} style={accentStyle(index)}>
            <a
              className="group flex h-full flex-col rounded-2xl border border-line p-6 transition-colors hover:border-accent"
              download={channel.download || undefined}
              href={channel.href}
              rel={channel.external ? "noreferrer" : undefined}
              target={channel.external ? "_blank" : undefined}
            >
              <span className="font-mono text-accent text-xs uppercase tracking-widest">
                {channel.label}
              </span>
              <span className="mt-3 font-medium text-sm tracking-tight">
                {channel.value}
              </span>
              <span className="mt-2 text-muted text-sm leading-relaxed">
                {channel.description}
              </span>
              <span className="mt-6 inline-flex items-center gap-2 font-medium text-accent text-sm">
                {channel.cta}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

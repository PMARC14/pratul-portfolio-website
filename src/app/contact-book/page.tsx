import type { Metadata } from "next";

import { accent } from "@/lib/accents";
import { ContactBook } from "./contact-book";

export const metadata: Metadata = {
  title: "Contact book",
  description:
    "Leave a note — a guestbook backed by SQLite (Cloudflare D1) at the edge.",
};

export default function ContactBookPage() {
  return (
    <section
      className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32"
      style={accent.green}
    >
      <p className="font-mono text-accent text-xs uppercase tracking-widest">
        Contact book
      </p>
      <h1 className="mt-4 max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
        Leave a note.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
        Passing through? Sign the book. Your name and message appear below; if
        you leave a way to reach you, only I can see it.
      </p>

      <div className="mt-14">
        <ContactBook />
      </div>
    </section>
  );
}

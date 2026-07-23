import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-start px-6 pt-24 pb-32 sm:pt-36">
      <p className="font-mono text-accent text-xs uppercase tracking-widest">
        404
      </p>
      <h1 className="mt-4 font-semibold text-4xl tracking-tight sm:text-6xl">
        This page doesn't exist.
      </h1>
      <p className="mt-5 max-w-md text-muted leading-relaxed">
        The link may be old, or the page may have moved. Everything worth seeing
        is one click away.
      </p>
      <Link
        className="mt-10 rounded-full bg-ink px-6 py-3 font-medium text-bg text-sm transition-colors hover:bg-accent"
        href="/"
      >
        Back to home
      </Link>
    </section>
  );
}

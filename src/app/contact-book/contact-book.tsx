"use client";

import { useCallback, useEffect, useState } from "react";

import { accentStyle } from "@/lib/accents";

type Entry = {
	id: number;
	name: string;
	message: string;
	created_at: string;
};

type Status = "loading" | "unavailable" | "ready";

const inputClasses =
	"w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm transition-colors placeholder:text-muted focus:border-accent";

function formatDate(sqliteUtc: string): string {
	const date = new Date(`${sqliteUtc.replace(" ", "T")}Z`);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

/**
 * Client half of the contact book: reads and writes /api/entries, which
 * exists only on the Workers deployment. On a static-only host (Pages
 * fallback, `next dev`) the fetch fails and this degrades to a notice.
 */
export function ContactBook() {
	const [status, setStatus] = useState<Status>("loading");
	const [entries, setEntries] = useState<Entry[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [note, setNote] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			const res = await fetch("/api/entries");
			if (!res.ok) throw new Error(String(res.status));
			const data = (await res.json()) as { entries: Entry[] };
			setEntries(data.entries);
			setStatus("ready");
		} catch {
			setStatus("unavailable");
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		setSubmitting(true);
		setNote(null);
		try {
			const res = await fetch("/api/entries", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					name: data.get("name"),
					contact: data.get("contact"),
					message: data.get("message"),
					website: data.get("website"),
				}),
			});
			const result = (await res.json()) as { error?: string };
			if (!res.ok) {
				setNote(result.error ?? "Something went wrong — try again.");
			} else {
				form.reset();
				setNote("Thanks — you're in the book.");
				await load();
			}
		} catch {
			setNote("Network error — try again in a moment.");
		} finally {
			setSubmitting(false);
		}
	}

	if (status === "unavailable") {
		return (
			<div className="max-w-xl rounded-2xl border border-line p-6 text-muted text-sm leading-relaxed">
				The contact book runs on the Cloudflare Workers deployment — this copy
				of the site is static, so signing is disabled here. Locally, run{" "}
				<code className="font-mono text-ink">npm run db:migrate</code> once,
				then <code className="font-mono text-ink">npm run preview</code>.
			</div>
		);
	}

	return (
		<div className="grid gap-14 lg:grid-cols-[24rem_1fr] lg:gap-20">
			<form className="space-y-4" onSubmit={onSubmit}>
				<div>
					<label
						className="font-mono text-muted text-xs uppercase tracking-widest"
						htmlFor="cb-name"
					>
						Name
					</label>
					<input
						className={`mt-2 ${inputClasses}`}
						id="cb-name"
						maxLength={60}
						name="name"
						placeholder="Ada Lovelace"
						required
						type="text"
					/>
				</div>

				<div>
					<label
						className="font-mono text-muted text-xs uppercase tracking-widest"
						htmlFor="cb-contact"
					>
						Contact{" "}
						<span className="normal-case">(optional, only I see it)</span>
					</label>
					<input
						className={`mt-2 ${inputClasses}`}
						id="cb-contact"
						maxLength={120}
						name="contact"
						placeholder="you@example.com"
						type="text"
					/>
				</div>

				<div>
					<label
						className="font-mono text-muted text-xs uppercase tracking-widest"
						htmlFor="cb-message"
					>
						Message
					</label>
					<textarea
						className={`mt-2 ${inputClasses} min-h-28 resize-y`}
						id="cb-message"
						maxLength={500}
						name="message"
						placeholder="Say hello, leave feedback, or drop a haiku."
						required
					/>
				</div>

				{/* Honeypot: invisible to people, irresistible to bots. */}
				<div aria-hidden="true" className="absolute -left-[9999px]">
					<label htmlFor="cb-website">Website</label>
					<input
						autoComplete="off"
						id="cb-website"
						name="website"
						tabIndex={-1}
						type="text"
					/>
				</div>

				<button
					className="w-full rounded-full bg-ink px-6 py-3 font-medium text-bg text-sm transition-colors hover:bg-accent disabled:opacity-50"
					disabled={submitting || status === "loading"}
					type="submit"
				>
					{submitting ? "Signing…" : "Sign the book"}
				</button>

				{note && (
					<p aria-live="polite" className="text-muted text-sm">
						{note}
					</p>
				)}
			</form>

			<div>
				<h2 className="font-mono text-muted text-xs uppercase tracking-widest">
					{status === "loading"
						? "Loading entries…"
						: `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
				</h2>
				{status === "ready" && entries.length === 0 && (
					<p className="mt-4 text-muted text-sm leading-relaxed">
						No entries yet — the first page is yours.
					</p>
				)}
				<ul className="mt-4 space-y-4">
					{entries.map((entry, index) => (
						<li
							className="rounded-2xl border border-line p-5"
							key={entry.id}
							style={accentStyle(index)}
						>
							<div className="flex items-baseline justify-between gap-4">
								<p className="font-medium text-accent text-sm tracking-tight">
									{entry.name}
								</p>
								<p className="font-mono text-muted text-xs tabular-nums">
									{formatDate(entry.created_at)}
								</p>
							</div>
							<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
								{entry.message}
							</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

import { validateEntry } from "./validate";

/**
 * The dynamic half of the site. Static assets are served before this
 * Worker is ever invoked; it only sees /api/* and unknown paths (which
 * it hands back to the asset layer for 404 handling).
 *
 * API:
 *   GET  /api/entries → { entries: [{ id, name, message, created_at }] }
 *   POST /api/entries → { ok: true } | { error }
 *
 * `contact` is stored but never returned by the API — it's for the site
 * owner only (read it with `wrangler d1 execute`).
 */

interface Env {
	DB: D1Database;
	ASSETS: Fetcher;
}

const MAX_ENTRIES = 50;

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
			"x-content-type-options": "nosniff",
		},
	});
}

async function handleEntries(request: Request, env: Env): Promise<Response> {
	if (!env.DB) {
		return json({ error: "The contact book isn't configured yet." }, 503);
	}

	if (request.method === "GET") {
		const { results } = await env.DB.prepare(
			"SELECT id, name, message, created_at FROM entries ORDER BY id DESC LIMIT ?1",
		)
			.bind(MAX_ENTRIES)
			.all();
		return json({ entries: results });
	}

	if (request.method === "POST") {
		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return json({ error: "Body must be JSON." }, 400);
		}

		const parsed = validateEntry(body);
		if (!parsed.ok) {
			return json({ error: parsed.error }, 400);
		}

		// Honeypot tripped: claim success, store nothing.
		if (parsed.value.website !== "") {
			return json({ ok: true }, 201);
		}

		await env.DB.prepare(
			"INSERT INTO entries (name, message, contact) VALUES (?1, ?2, ?3)",
		)
			.bind(parsed.value.name, parsed.value.message, parsed.value.contact)
			.run();
		return json({ ok: true }, 201);
	}

	return json({ error: "Method not allowed." }, 405);
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/api/entries") {
			return handleEntries(request, env);
		}
		if (url.pathname.startsWith("/api/")) {
			return json({ error: "Not found." }, 404);
		}

		// Everything else: back to the static site (incl. its 404 page).
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;

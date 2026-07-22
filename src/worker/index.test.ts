import { describe, expect, it } from "vitest";

import worker from "./index";

/**
 * Handler tests for the contact-book API. Lives under src/worker (not
 * tests/) so it type-checks against tsconfig.worker.json's Cloudflare
 * runtime types instead of the DOM lib the rest of the app uses — same
 * split the source files already follow.
 */

type Row = {
	id: number;
	name: string;
	message: string;
	contact: string | null;
	created_at: string;
};

/** Minimal in-memory stand-in for the two D1 queries the handler runs. */
function fakeDb(seed: Row[] = []) {
	const rows = [...seed];
	let nextId = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
	const inserted: Row[] = [];

	const db = {
		prepare(sql: string) {
			return {
				bind(...args: unknown[]) {
					return {
						async all() {
							if (!sql.startsWith("SELECT")) {
								throw new Error(`unexpected all(): ${sql}`);
							}
							const limit = args[0] as number;
							const results = [...rows]
								.sort((a, b) => b.id - a.id)
								.slice(0, limit)
								.map(({ id, name, message, created_at }) => ({
									id,
									name,
									message,
									created_at,
								}));
							return { results };
						},
						async run() {
							if (!sql.startsWith("INSERT")) {
								throw new Error(`unexpected run(): ${sql}`);
							}
							const [name, message, contact] = args as [
								string,
								string,
								string | null,
							];
							const row: Row = {
								id: nextId++,
								name,
								message,
								contact,
								created_at: new Date().toISOString(),
							};
							rows.push(row);
							inserted.push(row);
							return {};
						},
					};
				},
			};
		},
	};

	return { db, inserted };
}

const notFoundAssets = {
	async fetch() {
		return new Response("asset 404", { status: 404 });
	},
};

function env(overrides: Partial<{ DB: unknown; ASSETS: unknown }> = {}) {
	return {
		DB: fakeDb().db,
		ASSETS: notFoundAssets,
		...overrides,
		// biome-ignore lint: test double, real Env type lives in index.ts
	} as any;
}

function post(path: string, body: unknown) {
	return new Request(`https://example.com${path}`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: { "content-type": "application/json" },
	});
}

function get(path: string) {
	return new Request(`https://example.com${path}`);
}

/**
 * `worker.fetch`'s Request type carries Cloudflare's incoming-request Cf
 * properties; a plain `new Request(...)` (outgoing-style Cf generic)
 * isn't structurally assignable to it. One cast here beats one per call.
 */
function callFetch(request: Request, env: unknown) {
	return worker.fetch(
		request as unknown as Parameters<typeof worker.fetch>[0],
		env as Parameters<typeof worker.fetch>[1],
	);
}

const validEntry = { name: "Ada", message: "hello", contact: "", website: "" };

describe("GET /api/entries", () => {
	it("returns entries newest-first, without the contact field", async () => {
		const { db } = fakeDb([
			{
				id: 1,
				name: "Ada",
				message: "first",
				contact: "secret@example.com",
				created_at: "2024-01-01T00:00:00.000Z",
			},
			{
				id: 2,
				name: "Grace",
				message: "second",
				contact: null,
				created_at: "2024-01-02T00:00:00.000Z",
			},
		]);
		const res = await callFetch(get("/api/entries"), env({ DB: db }));
		expect(res.status).toBe(200);
		const body = (await res.json()) as { entries: unknown[] };
		expect(body.entries).toEqual([
			{
				id: 2,
				name: "Grace",
				message: "second",
				created_at: "2024-01-02T00:00:00.000Z",
			},
			{
				id: 1,
				name: "Ada",
				message: "first",
				created_at: "2024-01-01T00:00:00.000Z",
			},
		]);
		for (const entry of body.entries as Record<string, unknown>[]) {
			expect(entry.contact).toBeUndefined();
		}
	});

	it("responds 503 when the DB binding is missing", async () => {
		const res = await callFetch(get("/api/entries"), env({ DB: undefined }));
		expect(res.status).toBe(503);
	});
});

describe("POST /api/entries", () => {
	it("stores a valid entry and reports success", async () => {
		const { db, inserted } = fakeDb();
		const res = await callFetch(
			post("/api/entries", validEntry),
			env({ DB: db }),
		);
		expect(res.status).toBe(201);
		expect(await res.json()).toEqual({ ok: true });
		expect(inserted).toHaveLength(1);
		expect(inserted[0]).toMatchObject({ name: "Ada", message: "hello" });
	});

	it("rejects an invalid entry without touching the DB", async () => {
		const { db, inserted } = fakeDb();
		const res = await callFetch(
			post("/api/entries", { ...validEntry, name: "" }),
			env({ DB: db }),
		);
		expect(res.status).toBe(400);
		expect((await res.json()) as { error: string }).toHaveProperty("error");
		expect(inserted).toHaveLength(0);
	});

	it("rejects malformed JSON bodies", async () => {
		const req = new Request("https://example.com/api/entries", {
			method: "POST",
			body: "not json",
			headers: { "content-type": "application/json" },
		});
		const res = await callFetch(req, env());
		expect(res.status).toBe(400);
	});

	it("silently discards honeypot submissions and reports fake success", async () => {
		const { db, inserted } = fakeDb();
		const res = await callFetch(
			post("/api/entries", { ...validEntry, website: "spam.example" }),
			env({ DB: db }),
		);
		expect(res.status).toBe(201);
		expect(await res.json()).toEqual({ ok: true });
		expect(inserted).toHaveLength(0);
	});

	it("responds 503 when the DB binding is missing", async () => {
		const res = await callFetch(
			post("/api/entries", validEntry),
			env({ DB: undefined }),
		);
		expect(res.status).toBe(503);
	});
});

describe("routing", () => {
	it("rejects unsupported methods on /api/entries", async () => {
		const req = new Request("https://example.com/api/entries", {
			method: "DELETE",
		});
		const res = await callFetch(req, env());
		expect(res.status).toBe(405);
	});

	it("404s unknown /api/* routes without touching ASSETS", async () => {
		const res = await callFetch(get("/api/nope"), env());
		expect(res.status).toBe(404);
		expect((await res.json()) as { error: string }).toHaveProperty("error");
	});

	it("falls back to ASSETS for everything else", async () => {
		const res = await callFetch(get("/some/page"), env());
		expect(res.status).toBe(404);
		expect(await res.text()).toBe("asset 404");
	});
});

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
  /** Per-IP throttle for posting (see `ratelimits` in wrangler.jsonc). Optional: absent on non-Workers hosts. */
  POST_LIMITER?: RateLimit;
}

const MAX_ENTRIES = 50;
// Valid payloads are well under 1 KB (name 60 + message 500 + contact
// 120 chars); anything past this is junk and never gets parsed.
const MAX_BODY_BYTES = 4096;

/**
 * Rate-limit key for a client. IPv6 users usually control a whole /64,
 * so keying by the full address would let one person rotate through
 * billions of keys; the /64 prefix is the practical "one household" unit.
 */
export function limiterKey(ip: string | null): string {
  if (!ip) return "local";
  if (!ip.includes(":")) return ip;
  const [head = "", tail = ""] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const groups = ip.includes("::")
    ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right]
    : left;
  return `${groups
    .slice(0, 4)
    .map((g) => g.toLowerCase().replace(/^0+(?=.)/, ""))
    .join(":")}::/64`;
}

/**
 * Only the site's own page may post. Requiring a JSON content type means
 * a cross-site browser request must pass a CORS preflight, which fails
 * because this API sends no CORS headers; the Origin/Sec-Fetch-Site
 * checks reject the rest outright.
 */
function rejectForeignPost(request: Request, url: URL): Response | null {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    return json({ error: "Body must be JSON." }, 415);
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ error: "Cross-site posts aren't accepted." }, 403);
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) {
    return json({ error: "Cross-site posts aren't accepted." }, 403);
  }
  return null;
}

function json(
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...extraHeaders,
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
    const foreign = rejectForeignPost(request, new URL(request.url));
    if (foreign) return foreign;

    // Refuse declared-oversized bodies before reading a byte of them.
    const declared = Number(request.headers.get("content-length"));
    if (declared > MAX_BODY_BYTES) {
      return json({ error: "Request body is too large." }, 413);
    }

    // Throttle before doing any real work. Cloudflare always sets
    // CF-Connecting-IP in production; the key lives only in the rate
    // limiter and is never stored with the entry.
    if (env.POST_LIMITER) {
      const key = limiterKey(request.headers.get("cf-connecting-ip"));
      const { success } = await env.POST_LIMITER.limit({ key });
      if (!success) {
        return json(
          { error: "Too many entries — please wait a minute and try again." },
          429,
          { "retry-after": "60" },
        );
      }
    }

    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return json({ error: "Request body is too large." }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
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

  return json({ error: "Method not allowed." }, 405, {
    allow: "GET, POST",
  });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/entries") {
      try {
        return await handleEntries(request, env);
      } catch (error) {
        // A D1 hiccup shouldn't surface as a platform error page: the
        // client expects JSON from this route.
        console.error("contact book request failed", error);
        return json({ error: "Something went wrong — try again." }, 500);
      }
    }
    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found." }, 404);
    }

    // Everything else: back to the static site (incl. its 404 page).
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

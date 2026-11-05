/**
 * Validation for contact-book submissions. Pure functions only — no
 * Cloudflare types — so the unit tests can exercise every rule.
 */

export const LIMITS = {
  name: 60,
  message: 500,
  contact: 120,
} as const;

export type EntryInput = {
  name: string;
  message: string;
  /** Optional reply address/handle; stored, never displayed publicly. */
  contact: string | null;
  /** Honeypot field — humans never fill it, bots do. */
  website: string;
};

export type ValidationResult =
  | { ok: true; value: EntryInput }
  | { ok: false; error: string };

/**
 * Normalizes user text: unifies line endings and tabs, then drops control
 * characters (except newline) and invisible format characters such as
 * zero-width spaces and bidi overrides, which can make an entry look
 * blank or display reversed. The zero-width joiner stays, since emoji
 * sequences need it.
 */
export function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[^\P{Cc}\n]|[^\P{Cf}\u200d]/gu, "")
    .trim();
}

export function validateEntry(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Expected a JSON object." };
  }
  const record = input as Record<string, unknown>;

  const name = clean(record.name).replace(/\s+/g, " ");
  const message = clean(record.message);
  const contactRaw = clean(record.contact);
  const website = typeof record.website === "string" ? record.website : "";

  if (!name) {
    return { ok: false, error: "Name is required." };
  }
  if (name.length > LIMITS.name) {
    return {
      ok: false,
      error: `Name must be ${LIMITS.name} characters or fewer.`,
    };
  }
  if (!message) {
    return { ok: false, error: "Message is required." };
  }
  if (message.length > LIMITS.message) {
    return {
      ok: false,
      error: `Message must be ${LIMITS.message} characters or fewer.`,
    };
  }
  if (contactRaw.length > LIMITS.contact) {
    return {
      ok: false,
      error: `Contact must be ${LIMITS.contact} characters or fewer.`,
    };
  }

  return {
    ok: true,
    value: { name, message, contact: contactRaw || null, website },
  };
}

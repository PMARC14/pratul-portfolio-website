import { describe, expect, it } from "vitest";

import { LIMITS, validateEntry } from "../src/worker/validate";

/**
 * Unit tests for the contact-book API validation — the only code that
 * stands between the public internet and the D1 database.
 */

const valid = {
  name: "Ada Lovelace",
  message: "First!",
  contact: "ada@example.com",
  website: "",
};

describe("validateEntry", () => {
  it("accepts a complete valid entry", () => {
    const result = validateEntry(valid);
    expect(result).toEqual({ ok: true, value: valid });
  });

  it("trims whitespace and normalizes empty contact to null", () => {
    const result = validateEntry({
      name: "  Ada  ",
      message: "  hi  ",
      contact: "   ",
      website: "",
    });
    expect(result).toEqual({
      ok: true,
      value: { name: "Ada", message: "hi", contact: null, website: "" },
    });
  });

  it("treats a missing contact field as null", () => {
    const result = validateEntry({ name: "Ada", message: "hi" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.contact).toBeNull();
    }
  });

  it.each([
    null,
    undefined,
    "string",
    42,
    [],
  ])("rejects non-object input %p", (input) => {
    // Arrays are objects but have no usable fields → fails on name.
    expect(validateEntry(input).ok).toBe(false);
  });

  it("rejects a missing or blank name", () => {
    expect(validateEntry({ ...valid, name: undefined }).ok).toBe(false);
    expect(validateEntry({ ...valid, name: "   " }).ok).toBe(false);
  });

  it("rejects a missing or blank message", () => {
    expect(validateEntry({ ...valid, message: undefined }).ok).toBe(false);
    expect(validateEntry({ ...valid, message: "   " }).ok).toBe(false);
  });

  it("rejects non-string name/message types", () => {
    expect(validateEntry({ ...valid, name: 7 }).ok).toBe(false);
    expect(validateEntry({ ...valid, message: ["hi"] }).ok).toBe(false);
  });

  it("enforces length limits exactly", () => {
    expect(validateEntry({ ...valid, name: "a".repeat(LIMITS.name) }).ok).toBe(
      true,
    );
    expect(
      validateEntry({ ...valid, name: "a".repeat(LIMITS.name + 1) }).ok,
    ).toBe(false);
    expect(
      validateEntry({ ...valid, message: "a".repeat(LIMITS.message) }).ok,
    ).toBe(true);
    expect(
      validateEntry({ ...valid, message: "a".repeat(LIMITS.message + 1) }).ok,
    ).toBe(false);
    expect(
      validateEntry({ ...valid, contact: "a".repeat(LIMITS.contact + 1) }).ok,
    ).toBe(false);
  });

  it("passes the honeypot value through for the handler to inspect", () => {
    const result = validateEntry({ ...valid, website: "spam.example" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.website).toBe("spam.example");
    }
  });
});

describe("invisible and control characters", () => {
  it("strips zero-width and bidi-override characters", () => {
    const result = validateEntry({
      ...valid,
      name: "Ada​‮",
      message: "hi​ there",
    });
    expect(result).toEqual({
      ok: true,
      value: { ...valid, name: "Ada", message: "hi there" },
    });
  });

  it("rejects a name made only of invisible characters", () => {
    const result = validateEntry({ ...valid, name: "​​⁠" });
    expect(result).toEqual({ ok: false, error: "Name is required." });
  });

  it("keeps newlines in messages but folds them out of names", () => {
    const result = validateEntry({
      ...valid,
      name: "Ada\nLovelace",
      message: "line one\r\nline two\u0007",
    });
    expect(result).toEqual({
      ok: true,
      value: { ...valid, name: "Ada Lovelace", message: "line one\nline two" },
    });
  });

  it("keeps emoji joined by zero-width joiners intact", () => {
    const family = "\u{1F468}‍\u{1F469}‍\u{1F467}";
    const result = validateEntry({ ...valid, message: family });
    expect(result.ok && result.value.message).toBe(family);
  });
});

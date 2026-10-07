import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * globals.css declares the dark palette twice — once for the system
 * preference and once for the forced `data-theme="dark"` toggle. If they
 * drift, the toggle looks different from "system dark" (this once left
 * `--panel` white, which made dropdowns and inputs unreadable).
 */

const css = readFileSync(
  path.join(import.meta.dirname, "..", "src", "styles", "globals.css"),
  "utf8",
);

function declarations(blockStart: string): Record<string, string> {
  const start = css.indexOf(blockStart);
  expect(start, `${blockStart} not found`).toBeGreaterThan(-1);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const out: Record<string, string> = {};
  for (const match of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    out[match[1] ?? ""] = (match[2] ?? "").replace(/\s+/g, " ").trim();
  }
  return out;
}

describe("dark theme tokens", () => {
  it("forced dark matches system dark exactly", () => {
    const system = declarations(':root:not([data-theme="light"])');
    const forced = declarations(':root[data-theme="dark"]');
    expect(Object.keys(system).length).toBeGreaterThan(5);
    expect(forced).toEqual(system);
  });
});

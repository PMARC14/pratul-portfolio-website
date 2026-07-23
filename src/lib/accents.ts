import type { CSSProperties } from "react";

/**
 * The three brand accents, in rotation order. Setting `--accent` on an
 * element re-tints every `*-accent` utility inside it (the Tailwind
 * tokens resolve through `var(--accent)`), so rotation is just an
 * inline custom property — no extra classes.
 */
const ACCENT_VARS = [
  "var(--accent-red)",
  "var(--accent-green)",
  "var(--accent-blue)",
] as const;

export function accentStyle(index: number): CSSProperties {
  return {
    "--accent": ACCENT_VARS[index % ACCENT_VARS.length],
  } as CSSProperties;
}

/** Named variants for deliberate (non-rotating) section accents. */
export const accent = {
  red: { "--accent": "var(--accent-red)" } as CSSProperties,
  green: { "--accent": "var(--accent-green)" } as CSSProperties,
  blue: { "--accent": "var(--accent-blue)" } as CSSProperties,
};

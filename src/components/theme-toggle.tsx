"use client";

import { useEffect, useState } from "react";

const THEMES = ["system", "light", "dark"] as const;
type Theme = (typeof THEMES)[number];

const ICONS: Record<Theme, React.ReactNode> = {
  // Monitor
  system: (
    <>
      <rect height="13" rx="2" width="19" x="2.5" y="4" />
      <path d="M8 20.5h8M12 17v3.5" />
    </>
  ),
  // Sun
  light: (
    <>
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
    </>
  ),
  // Moon
  dark: <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />,
};

/**
 * Cycles system → light → dark. The choice is persisted to
 * localStorage and applied as `data-theme` on <html>; the inline
 * script in layout.tsx replays it before first paint so there is
 * no flash on load. "System" simply removes the attribute.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  // Read the persisted choice after mount (SSR always renders "system").
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length] as Theme;

  function cycle() {
    setTheme(next);
    if (next === "system") {
      localStorage.removeItem("theme");
      delete document.documentElement.dataset.theme;
    } else {
      localStorage.setItem("theme", next);
      document.documentElement.dataset.theme = next;
    }
  }

  return (
    <button
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
      className="rounded-full border border-line p-2 text-muted transition-colors hover:border-accent hover:text-accent"
      onClick={cycle}
      title={`Theme: ${theme} (click for ${next})`}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        width="15"
      >
        {ICONS[theme]}
      </svg>
    </button>
  );
}

import Image from "next/image";

/**
 * Official Microsoft Store badge. The two image files in public/badges/ are
 * Microsoft's own artwork from https://github.com/microsoft/app-store-badge,
 * copied byte for byte: don't edit, recolor, or redraw them (Microsoft Store
 * badge guidelines). The dark badge belongs on light backgrounds and the
 * light badge on dark ones, so both render and CSS shows the one that matches
 * the current theme (see `.theme-light-only` in globals.css).
 */
export function MicrosoftStoreBadge({ href }: { href: string }) {
  return (
    <a
      className="inline-block rounded-[5px] transition-opacity hover:opacity-85"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <Image
        alt="Download from the Microsoft Store"
        className="theme-light-only h-[52px] w-auto"
        height={44}
        src="/badges/get-it-from-microsoft-dark.svg"
        width={161}
      />
      <Image
        alt="Download from the Microsoft Store"
        className="theme-dark-only h-[52px] w-auto"
        height={44}
        src="/badges/get-it-from-microsoft-light.svg"
        width={161}
      />
    </a>
  );
}

/**
 * GitHub download button, laid out like the Store badge beside it. GitHub
 * has no official download badge, so this pairs GitHub's own mark (the
 * unmodified "mark-github" icon from the MIT-licensed @primer/octicons
 * package) with plain text. It uses the page's ink/bg colours, so it flips
 * with the theme like the Store badge does.
 */
export function GitHubDownloadButton({ href }: { href: string }) {
  return (
    <a
      className="inline-flex h-[52px] items-center gap-3 rounded-[5px] border border-line bg-ink px-4 text-bg transition-opacity hover:opacity-85"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <svg
        aria-hidden="true"
        className="size-8 shrink-0"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-xs">Download from</span>
        <span className="font-semibold text-xl tracking-tight">GitHub</span>
      </span>
    </a>
  );
}

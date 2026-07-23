/**
 * Static export: the whole site compiles to plain HTML/CSS/JS in `out/`,
 * which is what lets one build serve both Cloudflare Workers (static
 * assets) and Cloudflare Pages. Anything that needs a server (API routes,
 * SSR, next/image optimization) is intentionally off the table.
 *
 * @type {import("next").NextConfig}
 */
const config = {
  output: "export",
  images: { unoptimized: true },
  // Pin the workspace root: a stray lockfile in the user profile dir
  // otherwise makes Next infer the wrong one.
  outputFileTracingRoot: import.meta.dirname,
};

export default config;

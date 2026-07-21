# Pratul Maddipudi — Personal Portfolio

Personal portfolio at **pratul.maddipudi.com** — a static-first Next.js 15
site served from Cloudflare's edge, plus one small dynamic feature (the
[contact book](#contact-book-d1sqlite), backed by D1/SQLite). One
`next build` produces `out/`; the Worker serves those static assets
directly and only runs code for `/api/*`. The same static artifact also
deploys to **Cloudflare Pages** as a fallback (where the contact book
degrades to a notice, since Pages has no Worker).

## Stack

- [Next.js 15](https://nextjs.org) (App Router, `output: "export"`)
- [Tailwind CSS v4](https://tailwindcss.com) — neutral surface tokens plus a
  three-accent brand family (red / dark green / light blue) that rotates
  across rows, cards, and sections via a contextual `--accent` variable
- Light + **OLED-black dark mode**: follows the system by default, with a
  header toggle (system → light → dark) persisted in `localStorage` and
  applied before first paint (no flash)
- Scroll-driven effects (pure CSS `animation-timeline`): the hero dims as
  you scroll away, the scroll cue disappears, rows reveal on entry, and the
  header hides while scrolling down — all disabled for reduced-motion users
- [Geist](https://vercel.com/font) sans + mono, self-hosted via the `geist` package
- [Biome](https://biomejs.dev) for linting and formatting
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for deploys

## Editing content

All personal content lives in two files — pages render from them:

| File | What's in it |
| --- | --- |
| [`src/data/site.ts`](src/data/site.ts) | Name, role, email, GitHub, production URL |
| [`src/data/projects.ts`](src/data/projects.ts) | Projects — each entry gets a home-page row, a `/projects` row, a full breakdown page at `/projects/<slug>`, and a sitemap entry |

Before going live: **replace `public/resume.pdf`** (the current file is a
generated placeholder) and swap the `PLACEHOLDER`-marked sample projects in
`projects.ts` for your real work.

### Unlisted pages

Set `unlisted: true` on any project and its page still builds at
`/projects/<slug>`, but it appears nowhere — no header dropdown, no lists,
no sitemap — and search engines are told not to index it. Only people you
give the link to will find it (see the `playground` example entry). The same
idea works for arbitrary pages: any new folder under `src/app/` gets a page
at that path, and as long as you don't add it to the nav or
`src/app/sitemap.ts`, it stays link-only.

> Unlisted ≠ private: the page is still a public URL for anyone who has
> (or guesses) the link. Don't put confidential content on one.

## Contact book (D1/SQLite)

`/contact-book` is a guestbook: visitors leave a name + message (public)
and optionally a way to reach them (**stored, never displayed, and never
returned by the API** — read it yourself with
`npx wrangler d1 execute portfolio-contact-book --remote --command "SELECT * FROM entries"`).
Spam is filtered by a honeypot field and strict length limits, validated in
[`src/worker/validate.ts`](src/worker/validate.ts) (unit-tested).

The pieces: [`migrations/`](migrations/) (schema),
[`src/worker/index.ts`](src/worker/index.ts) (the `/api/entries` handler),
and [`src/app/contact-book/`](src/app/contact-book/) (the page — static
HTML whose form talks to the API from the browser).

**One-time activation:**

```bash
npx wrangler d1 create portfolio-contact-book   # prints a database_id
# → paste that id into wrangler.jsonc (replacing the zeroed placeholder)
npm run db:migrate          # local database, used by `npm run preview`
npm run db:migrate:remote   # production database
```

Until then, deploys to Workers will fail (the binding points at a
placeholder id) — local `npm run preview` works immediately after
`npm run db:migrate`, no Cloudflare account needed.

## Development

```bash
npm install
npm run dev            # dev server at localhost:3000
npm run typecheck      # TypeScript
npm run check          # Biome lint + format check
npm test               # build + full test suite (see Testing)
npm run preview        # production build served by the Workers runtime → localhost:8787
npm run preview:pages  # same build served by the Pages emulator   → localhost:8789
```

Run `preview` and `preview:pages` in two terminals to compare the Workers
deployment and the Pages fallback side by side. Today they serve the same
static artifact, so they should look identical — any future dynamic features
(API routes on the Worker) would exist only on the Workers side.

## Testing

`npm test` builds the site, then runs two Vitest suites:

- **`tests/content.test.ts`** — data integrity before anything builds:
  unique/URL-safe slugs, complete project fields, https-only links, the
  resume file actually existing, unlisted projects staying out of the
  visible/featured sets.
- **`tests/output.test.ts`** — assertions on `out/`, the exact bytes
  Cloudflare serves: every route builds, every page has one `<h1>`, a
  title, and a meta description, **every internal link resolves to a real
  file**, the sitemap matches the built pages, unlisted pages are
  noindexed and linked from nowhere, and `_headers` / `resume.pdf` are
  intact.

`npm run test:watch` runs the suites in watch mode (without rebuilding;
run a build first for the output tests).

## Automatic deploys (CI/CD)

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on
every push and PR: lint → typecheck → tests. Pushes to `main` that pass
then deploy the same build artifact to **both** Cloudflare Workers and
Cloudflare Pages automatically.

> Both deploy jobs are enabled, but will fail until the one-time setup
> below is done (missing secrets, or a placeholder D1 `database_id` in
> `wrangler.jsonc`). Tests still run and pass either way.

One-time setup:

1. Create the Pages project: `npx wrangler pages project create pratul-portfolio`
2. In Cloudflare: **My Profile → API Tokens → Create Token**, using the
   *Edit Cloudflare Workers* template, and add two permissions to it:
   **Account → Cloudflare Pages → Edit** (Pages deploy job) and
   **Account → D1 → Edit** (contact-book migrations). Copy the token when
   shown — Cloudflare displays it only once.
3. In the GitHub repo: **Settings → Secrets and variables → Actions**, add
   `CLOUDFLARE_API_TOKEN` (the token) and `CLOUDFLARE_ACCOUNT_ID` (from the
   right sidebar of the dashboard's **Workers & Pages** overview).

Secrets live only in those two places: GitHub Actions secrets for CI, and
`npx wrangler login` (OAuth, cached in your user profile) for local deploys.
Never put tokens in `wrangler.jsonc`, the workflow file, or anything
committed — the repo is public.

After that, `git push` to main is a deploy. The manual commands below still
work as an escape hatch.

## Deployment

### Cloudflare Workers (primary)

```bash
npx wrangler login   # once
npm run deploy
```

This builds the static export and deploys it as an **assets-only Worker**
(config in [`wrangler.jsonc`](wrangler.jsonc)) — static hosting on the Workers
platform with no Worker script and no per-request cost. Attach your custom
domain in the Cloudflare dashboard under the Worker's **Settings → Domains &
Routes**.

### Cloudflare Pages (static fallback)

Same artifact, different host:

```bash
npm run deploy:pages
```

Or connect the GitHub repo in the Cloudflare dashboard with:

- **Build command:** `npm run build`
- **Build output directory:** `out`

`public/_headers` (security + immutable caching for hashed assets) is honored
by both platforms.

## Project structure

```
src/
  data/          site facts + project content (edit these)
  components/    header (dropdown, hide-on-scroll, theme toggle), footer, project list
  lib/accents.ts accent rotation helper (red → green → blue)
  app/
    page.tsx             home: full-screen intro → selected work → footer
    projects/page.tsx    all project breakdowns
    projects/[slug]/     per-project case study (statically generated)
    about/page.tsx       bio, capabilities, resume download
    contact/page.tsx     dedicated contact page
    sitemap.ts robots.ts not-found.tsx
  styles/globals.css     design tokens, themes, scroll-driven animations
```

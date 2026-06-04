# Pratul Maddipudi - Personal Portfolio

A highly performant, full-stack personal portfolio website designed to showcase my software engineering projects, technical skills, and professional background. 

This project is built with a focus on strict type safety, fast edge-rendering, and a seamless developer experience.

## 🚀 Tech Stack

This project utilizes a modern, edge-compatible web stack:

* **Framework:** [Next.js](https://nextjs.org/) (App Router & React Server Components)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **API Layer:** [tRPC](https://trpc.io/) (End-to-end typesafe APIs)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [SQLite](https://sqlite.org/) 
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Hosting:** [Cloudflare Pages & Workers](https://developers.cloudflare.com/pages/)

## ✨ Key Features

* **Server-Side Rendering:** Utilizes React Server Components (RSC) to ship minimal JavaScript to the client, maximizing Lighthouse performance scores and Core Web Vitals.
* **Type-Safe Data Fetching:** tRPC ensures that the API contract between the frontend and the SQLite database remains strictly typed, eliminating runtime errors.
* **Dynamic Content:** Projects and technical skills are served dynamically from the database, making it easy to update the portfolio without touching the frontend code.
* **Responsive Design:** Fully mobile-responsive UI built with utility-first Tailwind CSS.

## 🛠️ Local Development

Because this project uses a local SQLite database, getting it running on your machine is incredibly fast and requires zero external database configuration.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
   cd your-repo-name
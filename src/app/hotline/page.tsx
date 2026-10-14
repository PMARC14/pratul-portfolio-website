import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { hotline } from "@/data/hotline";
import { accent, accentStyle } from "@/lib/accents";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Install Hotline",
  description:
    "Download and set up Hotline, a native Windows 11 app that puts the AI of your choice on the Copilot key.",
  path: hotline.path,
});

const steps = [
  {
    title: "Download it",
    body: (
      <>
        Get it from the{" "}
        <a
          className="font-medium text-ink underline decoration-2 decoration-accent underline-offset-4 transition-colors hover:text-accent"
          href={hotline.store}
          rel="noreferrer"
          target="_blank"
        >
          Microsoft Store
        </a>
        , where Microsoft signs it and keeps it up to date. Or grab the latest{" "}
        <code className="font-mono text-ink">.msixbundle</code> from{" "}
        <a
          className="font-medium text-ink underline decoration-2 decoration-accent underline-offset-4 transition-colors hover:text-accent"
          href={hotline.releases}
          rel="noreferrer"
          target="_blank"
        >
          GitHub Releases
        </a>{" "}
        and double-click it; for automatic updates, open{" "}
        <code className="font-mono text-ink">Hotline.appinstaller</code>{" "}
        instead.
      </>
    ),
  },
  {
    title: "Give it the Copilot key",
    body: (
      <>
        In Windows, go to{" "}
        <span className="font-medium text-ink">
          Settings → Personalization → Text input → Customize Copilot key on
          keyboard → Custom → Hotline
        </span>{" "}
        (the Store version may be listed as {hotline.storeName}). Windows only
        lets packaged apps take the key, which is why Hotline installs as a
        package.
      </>
    ),
  },
  {
    title: "Connect an AI",
    body: (
      <>
        Open Hotline, then pick a provider from the bar or add one in Settings →
        AI connections. Use what you already have, or bring a key — the options
        are below.
      </>
    ),
  },
] as const;

const connections = [
  {
    name: "Claude Code",
    needs: "Claude Code installed and signed in (run claude once)",
  },
  {
    name: "Antigravity CLI",
    needs: "The Antigravity CLI installed and signed in (run agy once)",
  },
  {
    name: "Anthropic, Gemini, OpenAI-compatible",
    needs:
      "An API key: Settings → AI connections → Add connection, paste the key, pick a model",
  },
  {
    name: "Local models",
    needs:
      "An OpenAI-style server running, like llama.cpp's llama-server, LM Studio, or vLLM",
  },
] as const;

const linkClasses =
  "font-medium text-ink underline decoration-2 decoration-accent underline-offset-4 transition-colors hover:text-accent";

export default function HotlinePage() {
  return (
    <section
      className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32"
      style={accent.red}
    >
      <div className="grid items-start gap-14 lg:grid-cols-[1fr_22rem] lg:gap-20">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest">
            Hotline
          </p>
          <h1 className="mt-4 max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
            Your Copilot key, your AI.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
            Hotline replaces the Windows Copilot key with a fast, native popup
            that talks to whichever AI you choose — your Claude Code or
            Antigravity sign-in, an API key, or a model running on your own PC.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              className="rounded-full bg-ink px-6 py-3 font-medium text-bg text-sm transition-colors hover:bg-accent"
              href={hotline.store}
              rel="noreferrer"
              target="_blank"
            >
              Get it from the Microsoft Store &#8599;
            </a>
            <a
              className="rounded-full border border-line px-6 py-3 font-medium text-sm transition-colors hover:border-accent hover:text-accent"
              href={hotline.releases}
              rel="noreferrer"
              target="_blank"
            >
              Download from GitHub &#8599;
            </a>
          </div>

          <p className="mt-6 font-mono text-muted text-xs leading-relaxed">
            {hotline.requirements} · free and open source (Apache-2.0)
          </p>
          <p className="mt-2 text-muted text-sm leading-relaxed">
            Hotline is pre-1.0 and used daily, so expect some rough edges.
            Curious how it's built?{" "}
            <Link className={linkClasses} href="/projects/hotline">
              Read the case study
            </Link>{" "}
            or{" "}
            <a
              className={linkClasses}
              href={hotline.repo}
              rel="noreferrer"
              target="_blank"
            >
              browse the source on GitHub
            </a>
            .
          </p>
        </div>

        <Image
          alt="The Hotline panel answering a question about the area of a circle, with a formula, a Python code block, and a results table."
          className="h-auto w-full rounded-2xl border border-line"
          height={763}
          priority
          sizes="(min-width: 1024px) 352px, 100vw"
          src="/projects/hotline-panel.png"
          width={720}
        />
      </div>

      <div className="mt-20" style={accent.green}>
        <h2 className="font-mono text-accent text-xs uppercase tracking-widest">
          Install
        </h2>
        <ol className="mt-6 grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              className="rounded-2xl border border-line p-6"
              key={step.title}
              style={accentStyle(index)}
            >
              <span className="font-mono text-accent text-xs tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-semibold text-lg tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-muted text-sm leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <details className="mt-6 rounded-2xl border border-line p-6">
          <summary className="cursor-pointer font-medium text-sm">
            Windows refuses a GitHub test build?
          </summary>
          <div className="mt-4 space-y-3 text-muted text-sm leading-relaxed">
            <p>
              Pre-release test builds are signed with a throwaway self-signed
              certificate, so Windows refuses them until you trust that build's{" "}
              <code className="font-mono text-ink">Hotline.cer</code> once. In
              an admin PowerShell, in the download folder:
            </p>
            <pre className="overflow-x-auto rounded-xl border border-line bg-panel p-4 font-mono text-ink text-xs leading-relaxed">
              Import-Certificate -FilePath .\Hotline.cer -CertStoreLocation
              Cert:\LocalMachine\TrustedPeople
            </pre>
            <p>
              Each test build has its own certificate, and test builds don't
              update automatically. The Microsoft Store version and releases
              signed with a trusted certificate need none of this.
            </p>
          </div>
        </details>

        <details className="mt-4 rounded-2xl border border-line p-6">
          <summary className="cursor-pointer font-medium text-sm">
            Build it from source
          </summary>
          <div className="mt-4 space-y-3 text-muted text-sm leading-relaxed">
            <p>
              Needs the .NET SDK 10.0.401 or newer. The first script creates and
              trusts a self-signed certificate (once, with a UAC prompt); the
              second builds, signs, and installs Hotline, then starts it in the
              tray.
            </p>
            <pre className="overflow-x-auto rounded-xl border border-line bg-panel p-4 font-mono text-ink text-xs leading-relaxed">
              {`git clone https://github.com/PMARC14/hotline
cd hotline
scripts/dev-cert.sh
scripts/install.sh`}
            </pre>
            <p>Then assign the Copilot key as in step 2.</p>
          </div>
        </details>
      </div>

      <div className="mt-20" style={accent.blue}>
        <h2 className="font-mono text-accent text-xs uppercase tracking-widest">
          Connecting an AI
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {connections.map((connection, index) => (
            <li
              className="rounded-2xl border border-line p-6"
              key={connection.name}
              style={accentStyle(index)}
            >
              <p className="font-semibold tracking-tight">{connection.name}</p>
              <p className="mt-2 text-muted text-sm leading-relaxed">
                {connection.needs}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          Keys are only ever sent over https, with plain http allowed only to
          your own PC. All options and the file layout are in the{" "}
          <a
            className={linkClasses}
            href={hotline.configuration}
            rel="noreferrer"
            target="_blank"
          >
            configuration guide
          </a>
          .
        </p>
      </div>

      <div className="mt-20 max-w-2xl" style={accent.red}>
        <h2 className="font-mono text-accent text-xs uppercase tracking-widest">
          What leaves your PC
        </h2>
        <p className="mt-6 leading-relaxed">
          Hotline has no server and collects nothing — no account, analytics, or
          telemetry. When you press Enter, your message goes to the AI
          connection you picked, along with any attachments, your system prompt
          and memory notes, and the earlier messages in the chat. Chat history
          and settings stay on your PC, and API keys live in Windows Credential
          Locker. What each AI provider does with your data is up to its own
          terms.
        </p>
        <p className="mt-4 text-muted text-sm leading-relaxed">
          The full details are in the{" "}
          <a
            className={linkClasses}
            href={hotline.privacy}
            rel="noreferrer"
            target="_blank"
          >
            privacy policy
          </a>
          . Hotline is licensed under{" "}
          <a
            className={linkClasses}
            href={hotline.license}
            rel="noreferrer"
            target="_blank"
          >
            Apache-2.0
          </a>
          .
        </p>
      </div>
    </section>
  );
}

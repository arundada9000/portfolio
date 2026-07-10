"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/data/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

type Status = "idle" | "sending" | "sent" | "error";

// Web3Forms routes submissions straight to Arun's inbox. Env var wins if set,
// otherwise the public key baked into site config (same as the old portfolio).
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? site.web3formsKey;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!WEB3FORMS_KEY) {
      // no key configured - fall back to a prefilled email
      const data = new FormData(form);
      const subject = encodeURIComponent(`Portfolio inquiry from ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\n- ${data.get("name")} <${data.get("email")}>`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const data = new FormData(form);
      data.append("access_key", WEB3FORMS_KEY);
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full border border-line bg-panel px-4 py-3 font-mono text-sm text-fog placeholder:text-dust/60 focus:border-amber focus:outline-none";

  return (
    <Section id="contact" command="mail -s 'let's build something'" title="Get in touch">
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="text-lg leading-relaxed text-dust">
            Interested in working together? I take on{" "}
            <span className="text-fog">freelance builds</span>,{" "}
            <span className="text-fog">full-time roles</span>, and{" "}
            <span className="text-fog">consulting</span> on React / Next.js architecture.
            If it ships to real users, I&apos;m listening.
          </p>

          <a
            href={`mailto:${site.email}`}
            className="link-underline mt-8 block break-all font-mono text-xl text-amber sm:text-2xl"
          >
            {site.email}
          </a>

          <dl className="mt-8 space-y-2 font-mono text-sm text-dust">
            <div className="flex gap-3">
              <dt className="text-amber">response_time:</dt>
              <dd>usually within 24 hours (faster after dark)</dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-amber">timezone:</dt>
              <dd>NPT (UTC+5:45) - see statusline below</dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-amber">phone:</dt>
              <dd>{site.phone}</dd>
            </div>
          </dl>

          {/* quick channels - one tap to a real conversation */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${site.whatsapp}?text=Hi%20Arun%2C%20I%20saw%20your%20portfolio`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-sm text-fog transition-colors hover:border-amber hover:text-amber"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.12.82.83-3.04-.2-.32a8.19 8.19 0 01-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23s8.23 3.69 8.23 8.23-3.69 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-sm text-fog transition-colors hover:border-amber hover:text-amber"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="space-y-4" aria-label="Contact form">
            <div>
              <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-dust">
                --name
              </label>
              <input id="name" name="name" type="text" required autoComplete="name" className={fieldClass} placeholder="Ada Lovelace" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-dust">
                --email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} placeholder="ada@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-dust">
                --message
              </label>
              <textarea id="message" name="message" required rows={5} className={fieldClass} placeholder="Tell me what you're building…" />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-amber px-6 py-3 font-mono text-sm font-bold text-night transition-colors hover:bg-ember disabled:opacity-60"
            >
              {status === "sending" ? "sending…" : "send message ↵"}
            </button>
            <p role="status" className="min-h-5 font-mono text-sm">
              {status === "sent" && <span className="text-amber">✓ message sent - talk soon.</span>}
              {status === "error" && (
                <span className="text-ember">
                  ✗ something broke - email me directly at {site.email}
                </span>
              )}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

"use client";

import { useEffect } from "react";
import { site } from "@/lib/data/site";

/**
 * Three developer-facing flourishes:
 *  1. A styled greeting when DevTools opens.
 *  2. Typeable console "commands" (property getters) — type `help`, `hire`,
 *     `github`, `neofetch`, `secret`, `cls` and hit enter.
 *  3. An animated <title> marquee while the tab is in the background.
 */
export function DevConsole() {
  useEffect(() => {
    // ── 1. greeting ────────────────────────────────────────────
    const big = "color:#ffb454;font:700 42px/1.1 monospace";
    const dim = "color:#8d97a9;font:14px/1.6 monospace";
    const hot = "color:#ff7a2f;font:700 14px/1.6 monospace";
    console.log("%c> arun.sh", big);
    console.log(
      "%cHey, curious developer 👋  You opened the console — I respect that.\n" +
        "This portfolio is Next.js 16 + React 19 + TypeScript, hand-built.\n",
      dim
    );
    console.log("%cType any of these and hit enter:", hot);
    console.log("%c  help · hire · github · linkedin · socials · neofetch · secret · cls", dim);

    // ── 2. typeable commands (getters fire on evaluation) ──────
    const w = window as unknown as Record<string, unknown>;
    const line = (s: string) => console.log(`%c${s}`, dim);
    const define = (name: string, fn: () => void) => {
      try {
        Object.defineProperty(window, name, {
          get() {
            fn();
            return undefined;
          },
          configurable: true,
        });
      } catch {
        /* already defined / restricted — skip */
      }
    };

    define("help", () => {
      console.log("%cavailable commands", hot);
      line("  hire       — why you should hire Arun");
      line("  github     — open the github profile");
      line("  linkedin   — open linkedin");
      line("  socials    — list every link");
      line("  neofetch   — system info, portfolio edition");
      line("  secret     — you'll see");
      line("  cls / clear— clean the console");
    });
    define("hire", () => {
      console.log("%c$ hire arun --role any", hot);
      line(`  open · freelance · full-time · consulting`);
      line(`  → ${site.email}`);
      line(`  → ${site.linkedin}`);
    });
    define("github", () => window.open(site.github, "_blank"));
    define("linkedin", () => window.open(site.linkedin, "_blank"));
    define("socials", () => {
      console.log("%csocials", hot);
      site.socials.forEach((s) => line(`  ${s.label.padEnd(10)} ${s.href}`));
    });
    define("neofetch", () => {
      console.log(
        "%c" +
          `        _         arun@butwal
       /_\\        ─────────────
      / _ \\       role:   Frontend Dev · CTO @ Sajilo Digital
     /_/ \\_\\      stack:  React · Next.js · TypeScript · Tailwind
                  repos:  70+ public
                  uptime: coding since 2023
                  shell:  arun.sh — press ⌘K on the page`,
        dim
      );
    });
    define("secret", () => {
      console.log("%c🔓 you found it. type `hire` — that's the real secret.", hot);
    });
    const clearConsole = () => console.clear();
    define("cls", clearConsole);
    // don't clobber the native console.clear name on window if present
    if (!("clear" in window)) define("clear", clearConsole);

    // ── 3. animated background-tab title ───────────────────────
    const original = document.title;
    const marquee = "  ·  psst… come back — arun.sh is still running  ·  ⌘K to explore";
    let frame = 0;
    let spin: ReturnType<typeof setInterval> | null = null;

    const onVisibility = () => {
      if (document.hidden) {
        spin = setInterval(() => {
          frame = (frame + 1) % marquee.length;
          document.title = marquee.slice(frame) + marquee.slice(0, frame);
        }, 320);
      } else {
        if (spin) clearInterval(spin);
        spin = null;
        document.title = original;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (spin) clearInterval(spin);
      document.title = original;
      ["help", "hire", "github", "linkedin", "socials", "neofetch", "secret", "cls", "clear"].forEach((k) => {
        try {
          delete w[k];
        } catch {
          /* ignore */
        }
      });
    };
  }, []);

  return null;
}

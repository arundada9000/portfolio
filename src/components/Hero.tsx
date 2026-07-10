"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/data/site";
import { Typing } from "./Typing";

function MaskLine({ children, delay, className = "" }: { children: string; delay: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={reduced ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const spot = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = spot.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      data-section="hero"
      onPointerMove={onMove}
      className="relative overflow-hidden"
    >
      {/* ambient layers */}
      <div ref={spot} className="hero-spotlight pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
      <div className="dot-grid pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6 sm:pt-40">
        {/* status row */}
        <motion.div {...fade(0.1)} className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
          <span className="text-eyebrow !text-dust">
            <span className="text-amber">$</span> whoami
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-dust">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-amber" />
            </span>
            available for work
          </span>
          <span className="text-dust">butwal, nepal · UTC+5:45</span>
        </motion.div>

        {/* the name - masked line reveal */}
        <h1 className="text-display mt-6 text-[clamp(3.5rem,13vw,11rem)] uppercase">
          <MaskLine delay={0.15}>Arun</MaskLine>
          <MaskLine delay={0.28} className="text-amber">Neupane</MaskLine>
        </h1>

        <motion.p {...fade(0.7)} className="mt-4 font-mono text-lg text-fog sm:text-xl">
          <span className="text-dust">&gt; </span>
          <Typing phrases={site.roles} />
        </motion.p>

        <motion.p {...fade(0.82)} className="mt-6 max-w-xl text-lg leading-relaxed text-dust">
          I build production web systems from Nepal - disaster-response platforms, map-first
          apps, and terminal-driven company sites. Currently CTO at{" "}
          <a href={site.company.url} className="link-underline text-fog" target="_blank" rel="noopener noreferrer">
            Sajilo Digital
          </a>
          . {site.tagline}
        </motion.p>

        <motion.div {...fade(0.92)} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/#work"
            data-cursor
            className="bg-amber px-6 py-3 font-mono text-sm font-bold text-night transition-colors hover:bg-ember"
          >
            view projects ↓
          </Link>
          <a
            href={site.resume}
            data-cursor
            className="border border-line px-6 py-3 font-mono text-sm text-fog transition-colors hover:border-amber hover:text-amber"
          >
            download resume
          </a>
          <button
            type="button"
            onClick={() => (window as unknown as { openTerminal?: () => void }).openTerminal?.()}
            className="hidden items-center gap-2 font-mono text-sm text-dust transition-colors hover:text-amber sm:inline-flex"
          >
            or press
            <kbd className="rounded border border-line px-1.5 py-0.5 text-[11px] text-fog">⌘K</kbd>
          </button>
        </motion.div>

        <motion.ul {...fade(1.02)} className="mt-10 flex flex-wrap gap-5 font-mono text-sm">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-dust transition-colors hover:text-amber">
                {s.label.toLowerCase()} ↗
              </a>
            </li>
          ))}
        </motion.ul>
      </div>

      {/* scroll cue */}
      <motion.div
        {...fade(1.2)}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 mx-auto flex w-full max-w-6xl justify-center px-6 sm:justify-start"
      >
        <span className="flex items-center gap-2 font-mono text-xs text-dust">
          <span className="h-8 w-px bg-gradient-to-b from-amber to-transparent motion-safe:animate-pulse" />
          scroll to explore
        </span>
      </motion.div>
    </section>
  );
}

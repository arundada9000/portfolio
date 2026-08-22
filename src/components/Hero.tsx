"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/data/site";
import { Typing } from "./Typing";
import dynamic from "next/dynamic";
import { soundPop } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";
import { ArrowDown, ArrowUpRight } from "./Icon";

const HeroPlayground = dynamic(() => import("./HeroPlayground").then((m) => m.HeroPlayground), { ssr: false });

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
  const glow = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ticking = useRef(false);

  const onMove = (e: React.PointerEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      const el = glow.current;
      if (!el || !el.parentElement) return;
      const r = el.parentElement.getBoundingClientRect();
      el.style.transform = `translate3d(${pos.current.x - r.left - 420}px, ${pos.current.y - r.top - 420}px, 0)`;
    });
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
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div ref={glow} className="hero-glow" style={{ transform: "translate3d(calc(50vw - 420px), -280px, 0)" }} />
      </div>
      <div className="dot-grid pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-4 pt-12 pb-2 sm:px-6 sm:pt-14 sm:pb-3 lg:grid-cols-[1fr_420px]">
        <div>
        <motion.div {...fade(0.1)} className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
          <span className="text-eyebrow !text-dust">
            <span className="text-amber">$</span> whoami
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-line/60 px-3 py-1 text-dust">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-amber" />
            </span>
            available for work
          </span>
          <span className="text-dust">butwal, nepal · UTC+5:45</span>
        </motion.div>

        <h1 className="text-display mt-3 text-[clamp(2.5rem,7vw,4.75rem)] uppercase">
          <MaskLine delay={0.15}>Arun</MaskLine>
          <MaskLine delay={0.28} className="text-amber">Neupane</MaskLine>
        </h1>

        <motion.p {...fade(0.7)} className="mt-2.5 font-mono text-base text-fog sm:text-lg">
          <span className="text-dust">&gt; </span>
          <Typing phrases={site.roles} />
        </motion.p>

        <motion.p {...fade(0.82)} className="mt-3 max-w-xl text-base leading-relaxed text-dust sm:text-lg">
          I build production web systems from Nepal - disaster-response platforms, map-first
          apps, and terminal-driven company sites. Currently CTO at{" "}
          <a href={site.company.url} className="link-underline text-fog" target="_blank" rel="noopener noreferrer">
            Sajilo Digital
          </a>
          . {site.tagline}
        </motion.p>

        <motion.div {...fade(0.92)} className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/#work"
            data-cursor
            className="ios-touch rounded-[12px] bg-amber px-5 py-2.5 font-mono text-sm font-bold text-night transition-all duration-150 hover:bg-ember active:scale-[0.97]"
            onClick={() => { soundPop(); hapticTap(); }}
          >
            view projects <ArrowDown size={14} className="inline" />
          </Link>
          <a
            href="/arun-neupane-resume.pdf"
            className="ios-touch rounded-[12px] border border-line/60 bg-panel/60 px-5 py-2.5 font-mono text-sm text-fog backdrop-blur-sm transition-all duration-150 hover:border-amber/60 hover:text-amber active:scale-[0.97]"
            onClick={() => { soundPop(); hapticTap(); }}
          >
            resume.pdf
          </a>
          <button
            type="button"
            onClick={() => (window as unknown as { openTerminal?: () => void }).openTerminal?.()}
            className="ios-touch hidden items-center gap-2 rounded-[12px] border border-line/50 px-3.5 py-2.5 font-mono text-xs text-dust transition-all duration-150 hover:border-amber/50 hover:text-fog sm:inline-flex active:scale-95"
            aria-label="Open command palette"
          >
            <span>terminal</span>
            <span className="rounded-[6px] border border-line/50 px-1.5 py-0.5 text-[10px]">⌘K</span>
          </button>
        </motion.div>
        </div>

        <motion.div
          {...fade(0.9)}
          className="hidden lg:block"
        >
          <HeroPlayground />
        </motion.div>
      </div>
    </section>
  );
}

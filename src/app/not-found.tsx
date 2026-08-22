"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { soundPop, soundTap } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";
import { ArrowRight, RotateCcw, ArrowLeft } from "@/components/Icon";

const EXCUSES = [
  "git blame points to nobody. This file was never staged.",
  "404: The server stepped out to grab chiya & samosa in Butwal.",
  "Worked on Arun's machine, but clearly not on this URL.",
  "This page is currently living in a detached HEAD state.",
  "Null pointer exception: Page dereferenced into the void.",
  "The dog ate the route handler. We're training a new one.",
  "404: Even Google's indexers gave up looking for this path.",
];

export default function NotFound() {
  const [excuseIndex, setExcuseIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExcuseIndex(Math.floor(Math.random() * EXCUSES.length));
  }, []);

  const nextExcuse = () => {
    soundTap();
    hapticTap();
    setExcuseIndex((prev) => (prev + 1) % EXCUSES.length);
  };

  const handleOpenTerminal = () => {
    soundPop();
    hapticTap();
    (window as unknown as { openTerminal?: () => void }).openTerminal?.();
  };

  return (
    <main
      data-section="404"
      className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-4 pt-28 pb-20 sm:px-6"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-amber/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 font-mono text-xs text-dust">
          <span className="text-amber">$</span>
          <span>HTTP 404 · PAGE_NOT_FOUND</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line/60 bg-panel/60 px-2.5 py-0.5 text-[10px] text-ember">
            <span className="size-1.5 rounded-full bg-ember animate-pulse" />
            unresolved route
          </span>
        </div>

        {/* Big Glitch Header */}
        <div className="space-y-2">
          <h1 className="text-display text-6xl uppercase tracking-tight text-fog sm:text-8xl">
            Lost in <span className="text-amber">Transit</span>
          </h1>
          <p className="text-lg text-dust">
            The route you requested does not exist or has been garbage collected.
          </p>
        </div>

        {/* iOS Frosted Glass Terminal Card */}
        <div className="ios-glass-card overflow-hidden rounded-[20px] border border-line/60 shadow-2xl">
          {/* Card Header Bar */}
          <div className="flex items-center gap-2 border-b border-line/40 bg-panel/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-ember/80" />
              <span className="size-3 rounded-full bg-amber/80" />
              <span className="size-3 rounded-full bg-line" />
            </div>
            <span className="ml-3 font-mono text-xs text-dust">
              arun@butwal: ~/errors/404.sh
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-5 font-mono text-sm space-y-4">
            <div className="space-y-1">
              <p className="text-fog">
                <span className="text-amber">$</span> curl -I https://arun.sh/this-page
              </p>
              <p className="text-ember">
                HTTP/2 404 Not Found (route_not_matched)
              </p>
            </div>

            <div className="rounded-[12px] border border-line/50 bg-surface-bg/80 p-3.5 text-xs">
              <div className="flex items-center justify-between text-dust/80 mb-1">
                <span>// Developer Diagnosis:</span>
                <button
                  type="button"
                  onClick={nextExcuse}
                  className="ios-touch inline-flex items-center gap-1 text-amber hover:text-amber/80 transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>reroll excuse</span>
                </button>
              </div>
              <p className="text-fog font-medium">
                &ldquo;{mounted ? EXCUSES[excuseIndex] : EXCUSES[0]}&rdquo;
              </p>
            </div>

            {/* Quick Diagnostic Checklist */}
            <div className="space-y-1 text-xs text-dust">
              <p className="text-dust/70">Suggested recovery actions:</p>
              <p className="flex items-center gap-2">
                <span className="text-amber">▸</span> 1. Return to the homepage safely.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber">▸</span> 2. Explore featured engineering projects.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber">▸</span> 3. Pop open the terminal (press ⌘K or click below).
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center gap-3 border-t border-line/40 bg-panel/50 p-4">
            <Link
              href="/"
              onClick={() => { soundPop(); hapticTap(); }}
              className="ios-touch inline-flex items-center gap-2 rounded-[12px] bg-amber px-5 py-2.5 font-mono text-xs font-bold text-night transition-all duration-150 hover:bg-ember active:scale-[0.97]"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/#work"
              onClick={() => { soundPop(); hapticTap(); }}
              className="ios-touch inline-flex items-center gap-2 rounded-[12px] border border-line/60 bg-panel/80 px-4 py-2.5 font-mono text-xs text-fog transition-all duration-150 hover:border-amber hover:text-amber active:scale-[0.97]"
            >
              <span>Explore Work</span>
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              onClick={handleOpenTerminal}
              className="ios-touch inline-flex items-center gap-2 rounded-[12px] border border-line/60 bg-panel/80 px-4 py-2.5 font-mono text-xs text-dust transition-all duration-150 hover:border-amber hover:text-amber active:scale-[0.97] sm:ml-auto"
            >
              <span>Open Terminal</span>
              <kbd className="rounded-[6px] border border-line/60 px-1 py-0.5 text-[10px] text-fog">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


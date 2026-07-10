"use client";

import { useEffect, useState } from "react";

const words = ["booting", "loading assets", "mounting ui", "almost there", "ready"];

/**
 * Bold count-up loader. A huge percentage climbs 00→100 while a full-width
 * rule fills, then the whole panel wipes upward to reveal the page. Runs on
 * every full page load; skipped for reduced motion.
 */
export function Preloader() {
  const [phase, setPhase] = useState<"boot" | "leaving" | "done">("done");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("boot");
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 1500;
    let raf = 0;
    const tick = (now: number) => {
      // easeOutCubic so it decelerates toward 100 - feels intentional
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("leaving"), 220);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 700);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  const word = words[Math.min(words.length - 1, Math.floor((pct / 100) * words.length))];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-night p-6 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] sm:p-10 ${
        phase === "leaving" ? "-translate-y-full" : ""
      }`}
    >
      {/* top row - identity */}
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-dust sm:text-sm">
        <span>
          <span className="text-amber">◆</span> Arun Neupane
        </span>
        <span className="hidden sm:inline">Frontend Developer</span>
      </div>

      {/* center - status word cycling */}
      <div className="flex flex-1 items-center">
        <p className="font-mono text-sm text-dust sm:text-base">
          <span className="text-amber">$</span> {word}
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-amber align-middle" />
        </p>
      </div>

      {/* bottom - giant counter + filling rule */}
      <div>
        <div className="mb-4 h-px w-full overflow-hidden bg-line">
          <div className="h-full bg-gradient-to-r from-amber to-ember" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-dust">butwal · nepal</span>
          <span className="text-display text-[22vw] leading-[0.8] text-fog sm:text-[16vw]">
            {String(pct).padStart(2, "0")}
            <span className="text-amber">%</span>
          </span>
        </div>
      </div>
    </div>
  );
}

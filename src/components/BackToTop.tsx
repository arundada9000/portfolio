"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { soundTap } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        soundTap();
        hapticTap();
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className={`ios-touch fixed bottom-12 right-4 z-40 flex items-center gap-1.5 rounded-[12px] border border-line/60 bg-panel/90 px-3 py-2.5 font-mono text-xs text-dust backdrop-blur-sm transition-all duration-300 hover:border-amber/50 hover:text-amber active:scale-[0.95] sm:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="text-amber">▲</span> top
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts a numeric value up when scrolled into view. Accepts the raw display
 * string ("70+", "★ 52", "1 AM", "TypeScript") - animates the number it finds
 * and preserves the surrounding characters. No digits → renders as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  const match = value.match(/\d[\d,]*/);
  const target = match ? parseInt(match[0].replace(/,/g, ""), 10) : null;
  const [n, setN] = useState(reduced || target === null ? target ?? 0 : 0);

  useEffect(() => {
    if (target === null) return;
    if (!inView || reduced) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced]);

  if (target === null) return <span ref={ref} className={className}>{value}</span>;

  const rendered = value.replace(match![0], n.toLocaleString());
  return <span ref={ref} className={className}>{rendered}</span>;
}

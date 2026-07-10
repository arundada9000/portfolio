"use client";

import { motion, useReducedMotion } from "motion/react";

/** A line of text that slides up from behind a mask when scrolled into view. */
export function MaskText({
  children,
  delay = 0,
  className = "",
}: {
  children: string;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={reduced ? false : { y: "115%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

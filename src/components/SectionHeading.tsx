"use client";

import { motion, useReducedMotion } from "motion/react";
import { MaskText } from "./MaskText";

/** Section eyebrow + masked heading + an underline that draws in. */
export function SectionHeading({ command, title }: { command: string; title: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="mb-2 sm:mb-2.5">
      <motion.p
        className="text-eyebrow text-xs"
        initial={reduced ? false : { opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span aria-hidden="true">$ </span>
        {command}
      </motion.p>

      <h2 className="text-display mt-0.5 text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase leading-tight sm:text-3xl">
        <MaskText delay={0.05}>{title}</MaskText>
      </h2>

      <motion.div
        aria-hidden="true"
        className="mt-1.5 h-0.5 w-16 origin-left bg-gradient-to-r from-amber to-transparent"
        initial={reduced ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { experience } from "@/lib/data/experience";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function ExperienceTimeline() {
  const reduced = useReducedMotion();

  return (
    <Section id="experience" command="history | grep career" title="Experience">
      <ol className="relative ml-3 pl-8">
        {/* static rail + amber line that draws down on scroll */}
        <span className="absolute left-0 top-0 h-full w-px bg-line" aria-hidden="true" />
        <motion.span
          className="absolute left-0 top-0 w-px origin-top bg-gradient-to-b from-amber via-amber/60 to-transparent"
          style={{ height: "100%" }}
          initial={reduced ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />

        {experience.map((item, i) => (
          <li key={item.org} className="relative pb-12 last:pb-0">
            <motion.span
              className="absolute -left-[37px] top-2 size-2.5 rounded-full bg-amber shadow-[0_0_12px_rgba(255,180,84,0.6)]"
              initial={reduced ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
              aria-hidden="true"
            />
            <Reveal delay={i * 0.08}>
              <p className="font-mono text-xs text-dust">{item.period}</p>
              <h3 className="text-display mt-1 text-2xl text-fog">
                {item.role}
                <span className="text-dust"> · </span>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-amber transition-opacity hover:opacity-80">
                    {item.org}
                  </a>
                ) : (
                  <span className="text-amber">{item.org}</span>
                )}
              </h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-dust">{item.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.tech.map((tech) => (
                  <li key={tech} className="rounded-sm bg-line/50 px-2 py-0.5 font-mono text-[11px] text-dust">
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

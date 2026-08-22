"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ThemePicker } from "./ThemePicker";

const links = [
  { href: "/#about", label: "about" },
  { href: "/#skills", label: "skills" },
  { href: "/#work", label: "work" },
  { href: "/#gallery", label: "gallery" },
  { href: "/#open-source", label: "open-source" },
  { href: "/#experience", label: "experience" },
  { href: "/#contact", label: "contact" },
];

function openTerminal() {
  (window as unknown as { openTerminal?: () => void }).openTerminal?.();
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Sync active section with viewport via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            const id = entry.target.dataset.section ?? "";
            setActiveSection(id);
          }
        }
      },
      { rootMargin: "-30% 0px -30% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // close the overlay on Escape, and if the viewport grows past the mobile breakpoint
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="ios-glass-bar fixed inset-x-0 top-0 z-50 transition-all"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 font-mono text-sm sm:px-6"
      >
        <Link
          href="/"
          className="ios-touch flex items-center rounded-[8px] py-1 text-fog transition-colors hover:text-amber"
        >
          <span className="text-amber">arun</span>@butwal<span className="text-dust">:~$</span>
        </Link>

        {/* desktop nav with animated underline */}
        <ul className="hidden items-center gap-2 md:flex">
          {links.map((l) => {
            const isActive = activeSection === l.label || (l.label === "work" && activeSection.startsWith("work"));
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  className={`ios-touch relative block px-2.5 py-1.5 text-xs transition-colors duration-150 ${
                    isActive ? "text-amber font-medium" : "text-dust hover:text-fog"
                  }`}
                >
                  ./{l.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-amber shadow-[0_0_8px_var(--accent)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
          <li className="ml-2 pl-2 border-l border-line/50 flex items-center gap-2">
            <ThemePicker />
          </li>
          <li>
            <button
              type="button"
              onClick={openTerminal}
              className="ios-touch flex items-center gap-1.5 rounded-[8px] border border-line/50 px-2 py-1 text-xs text-dust transition-colors hover:border-amber hover:text-amber"
              aria-label="Open command terminal"
            >
              <span>⌘K</span>
            </button>
          </li>
          <li>
            <a
              href="/arun-neupane-resume.pdf"
              className="ios-touch rounded-[10px] border border-amber/60 px-3 py-1.5 text-xs text-amber transition-all duration-150 hover:bg-amber hover:text-night active:scale-95"
            >
              resume.pdf
            </a>
          </li>
        </ul>

        {/* mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemePicker />
          {/* mobile terminal launcher */}
          <button
            type="button"
            onClick={openTerminal}
            className="ios-touch rounded-[8px] border border-line/50 px-2 py-1 text-xs text-dust"
            aria-label="Open command terminal"
          >
            ⌘K
          </button>
          {/* mobile toggle */}
          <button
            type="button"
            className="ios-touch rounded-[8px] border border-line/50 px-2.5 py-1 text-xs text-fog"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "[ close ]" : "[ menu ]"}
          </button>
        </div>
      </nav>

      {/* mobile overlay drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="ios-glass-bar absolute inset-x-0 top-full h-[calc(100dvh-3.5rem)] overflow-y-auto scroll-momentum md:hidden bg-panel/95 backdrop-blur-xl"
        >
          <ul className="flex flex-col gap-2 p-6">
            {links.map((l, i) => {
              const isActive = activeSection === l.label;
              return (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`text-display ios-touch relative flex items-center justify-between py-3 text-2xl transition-colors duration-150 ${
                      isActive ? "text-amber font-bold" : "text-fog hover:text-amber"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-dust">0{i + 1}</span>
                      <span>{l.label.replace("-", " ")}</span>
                    </div>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavMobileUnderline"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-amber"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
            <li className="mt-6 pt-4 border-t border-line/40">
              <a
                href="/arun-neupane-resume.pdf"
                className="ios-touch inline-flex items-center justify-center w-full rounded-[14px] bg-amber px-5 py-3.5 font-mono text-sm font-bold text-night"
              >
                download resume.pdf
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

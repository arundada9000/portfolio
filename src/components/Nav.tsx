"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemePicker } from "./ThemePicker";

const links = [
  { href: "/#about", label: "about" },
  { href: "/#skills", label: "skills" },
  { href: "/#work", label: "work" },
  { href: "/#gallery", label: "gallery" },
  { href: "/#experience", label: "experience" },
  { href: "/#contact", label: "contact" },
];

function openTerminal() {
  (window as unknown as { openTerminal?: () => void }).openTerminal?.();
}

export function Nav() {
  const [open, setOpen] = useState(false);

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
      className="ios-glass-bar fixed inset-x-0 top-0 z-50"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 font-mono text-sm sm:px-6"
      >
        <Link href="/" className="text-fog transition-colors hover:text-amber">
          <span className="text-amber">arun</span>@butwal<span className="text-dust">:~$</span>
        </Link>

        {/* desktop */}
        <ul className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="ios-touch flex items-center text-dust transition-colors hover:text-amber">
                ./{l.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemePicker />
          </li>
          <li>
            <button
              type="button"
              onClick={openTerminal}
              className="ios-touch flex items-center gap-1.5 text-dust transition-colors hover:text-amber"
              aria-label="Open command terminal"
            >
              <span className="rounded-[6px] border border-line/50 px-1.5 py-0.5 text-[11px]">⌘K</span>
            </button>
          </li>
          <li>
            <a
              href="/arun-neupane-resume.pdf"
              className="ios-touch border border-amber/60 px-3 py-1.5 text-amber transition-colors hover:bg-amber hover:text-night"
            >
              resume.pdf
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <ThemePicker />
          {/* mobile terminal launcher */}
          <button
            type="button"
            onClick={openTerminal}
            className="ios-touch rounded-[6px] border border-line/50 px-1.5 py-0.5 text-[11px] text-dust"
            aria-label="Open command terminal"
          >
            ⌘K
          </button>
          {/* mobile toggle */}
          <button
            type="button"
            className="ios-touch text-fog"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "[ close ]" : "[ menu ]"}
          </button>
        </div>
      </nav>

      {/* mobile overlay */}
      {open && (
        <div
          id="mobile-menu"
          className="ios-glass-bar absolute inset-x-0 top-full h-[calc(100dvh-3.5rem)] overflow-y-auto scroll-momentum md:hidden"
        >
          <ul className="flex flex-col gap-2 px-6 py-10">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-display ios-touch block py-3 text-4xl text-fog transition-colors hover:text-amber"
                >
                  <span className="mr-3 font-mono text-sm text-dust">0{i + 1}</span>
                  {l.label.replace("-", " ")}
                </Link>
              </li>
            ))}
            <li className="mt-6">
              <a
                href="/arun-neupane-resume.pdf"
                className="ios-touch inline-block border border-amber px-5 py-3 font-mono text-amber"
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

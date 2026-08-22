"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { soundTap, soundPop, soundThemeSwitch, areSoundsEnabled, setSoundsEnabled } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";
import { useTheme } from "@/lib/theme-context";

const NAV: Record<string, string> = {
  h: "#hero",
  a: "#about",
  s: "#skills",
  w: "#work",
  g: "#gallery",
  o: "#open-source",
  e: "#experience",
  c: "#contact",
};

const SHORTCUTS: [string, string][] = [
  ["⌘K / Ctrl+K", "open command terminal"],
  ["j / k", "scroll next / prev section"],
  ["g then <key>", "jump to: h, a, s, w, g, o, e, c"],
  ["t", "cycle next theme"],
  ["m", "mute / unmute audio feedback"],
  ["?", "show / hide shortcuts cheat sheet"],
  ["Esc", "close any open modal / palette"],
];

function goto(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.location.assign(`/${hash}`);
}

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const leader = useRef(false);
  const leaderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { theme, themes, setTheme } = useTheme();

  useEffect(() => {
    const inField = () => {
      const el = document.activeElement;
      return (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      );
    };

    const getSections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (inField()) return;

      if (leader.current) {
        leader.current = false;
        if (leaderTimer.current) clearTimeout(leaderTimer.current);
        const hash = NAV[e.key.toLowerCase()];
        if (hash) {
          e.preventDefault();
          setOpen(false);
          soundPop();
          hapticTap();
          goto(hash);
        }
        return;
      }

      const key = e.key.toLowerCase();

      if (key === "?") {
        e.preventDefault();
        soundTap();
        hapticTap();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      } else if (key === "j") {
        // Scroll to next section
        e.preventDefault();
        const sections = getSections();
        const currentY = window.scrollY + 100;
        const next = sections.find((s) => s.offsetTop > currentY);
        if (next) {
          soundPop();
          next.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        }
      } else if (key === "k") {
        // Scroll to previous section
        e.preventDefault();
        const sections = getSections();
        const currentY = window.scrollY - 100;
        const prevList = sections.filter((s) => s.offsetTop < currentY);
        const prev = prevList[prevList.length - 1] ?? sections[0];
        if (prev) {
          soundPop();
          prev.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        }
      } else if (key === "t") {
        // Cycle theme
        e.preventDefault();
        const currentIndex = themes.findIndex((t) => t.id === theme.id);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        if (nextTheme) {
          setTheme(nextTheme.id);
          soundThemeSwitch();
          hapticTap();
        }
      } else if (key === "m") {
        // Toggle sound
        e.preventDefault();
        const currentMute = areSoundsEnabled();
        setSoundsEnabled(!currentMute);
        soundTap();
        hapticTap();
      } else if (key === "g") {
        leader.current = true;
        leaderTimer.current = setTimeout(() => (leader.current = false), 1200);
      }
    };

    const toggle = () => setOpen((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener("toggle-shortcuts", toggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("toggle-shortcuts", toggle);
    };
  }, []);

  // focus trap
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const prev = document.activeElement as HTMLElement | null;

    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-night/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={() => setOpen(false)}
    >
      <div
        ref={dialogRef}
        className="ios-glass-card w-full max-w-md overflow-hidden rounded-[20px] border border-line/50 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line/40 px-5 py-3">
          <h2 className="font-mono text-sm text-fog">keyboard shortcuts</h2>
          <button
            type="button"
            onClick={() => { soundTap(); setOpen(false); }}
            className="ios-touch rounded-[8px] px-2 py-1 font-mono text-xs text-dust hover:text-amber"
          >
            esc
          </button>
        </div>
        <ul className="divide-y divide-line/40 px-5">
          {SHORTCUTS.map(([keys, desc]) => (
            <li key={keys} className="flex items-center justify-between gap-4 py-3 font-mono text-sm">
              <span className="text-dust">{desc}</span>
              <kbd className="whitespace-nowrap rounded-[8px] border border-line/50 px-2 py-0.5 text-xs text-amber">{keys}</kbd>
            </li>
          ))}
        </ul>
        <p className="border-t border-line/40 px-5 py-3 font-mono text-xs text-dust">
          tip: open the terminal and type <span className="text-amber">help</span> for more.
        </p>
      </div>
    </div>
  );
}

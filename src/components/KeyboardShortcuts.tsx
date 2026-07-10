"use client";

import { useEffect, useRef, useState } from "react";

const NAV: Record<string, string> = {
  h: "#hero",
  a: "#about",
  s: "#skills",
  w: "#work",
  o: "#open-source",
  g: "#github",
  e: "#experience",
  c: "#contact",
};

const SHORTCUTS: [string, string][] = [
  ["⌘K / Ctrl+K", "open the command terminal"],
  ["?", "show / hide this panel"],
  ["g then h", "jump to top"],
  ["g then w", "jump to work"],
  ["g then s", "jump to skills"],
  ["g then e", "jump to experience"],
  ["g then c", "jump to contact"],
  ["t", "back to top"],
  ["Esc", "close any overlay"],
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

  useEffect(() => {
    const inField = () => {
      const el = document.activeElement;
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    };

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
          goto(hash);
        }
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key.toLowerCase() === "t") {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
      } else if (e.key.toLowerCase() === "g") {
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
        className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="font-mono text-sm text-fog">keyboard shortcuts</h2>
          <button type="button" onClick={() => setOpen(false)} className="font-mono text-xs text-dust hover:text-amber">
            esc
          </button>
        </div>
        <ul className="divide-y divide-line/60 px-5">
          {SHORTCUTS.map(([keys, desc]) => (
            <li key={keys} className="flex items-center justify-between gap-4 py-2.5 font-mono text-sm">
              <span className="text-dust">{desc}</span>
              <kbd className="whitespace-nowrap rounded border border-line px-2 py-0.5 text-xs text-amber">{keys}</kbd>
            </li>
          ))}
        </ul>
        <p className="border-t border-line px-5 py-3 font-mono text-xs text-dust">
          tip: open the terminal and type <span className="text-amber">help</span> for more.
        </p>
      </div>
    </div>
  );
}

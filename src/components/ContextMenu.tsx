"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/lib/data/site";

type Item =
  | { type: "sep" }
  | { type: "item"; label: string; hint?: string; run: () => void };

export function ContextMenu() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const openTerminal = () => (window as unknown as { openTerminal?: () => void }).openTerminal?.();

  const copy = useCallback(async (text: string, note: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(note);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      /* clipboard blocked - ignore */
    }
  }, []);

  const items: Item[] = [
    { type: "item", label: "Open terminal", hint: "⌘K", run: openTerminal },
    { type: "item", label: "Keyboard shortcuts", hint: "?", run: () => window.dispatchEvent(new Event("toggle-shortcuts")) },
    { type: "sep" },
    { type: "item", label: "Copy email", run: () => copy(site.email, "email copied") },
    { type: "item", label: "Copy page link", run: () => copy(window.location.href, "link copied") },
    { type: "sep" },
    { type: "item", label: "GitHub", hint: "↗", run: () => window.open(site.github, "_blank") },
    { type: "item", label: "LinkedIn", hint: "↗", run: () => window.open(site.linkedin, "_blank") },
    { type: "item", label: "Download résumé", hint: "↗", run: () => window.open(site.resume, "_blank") },
  ];

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      // let inputs keep the native menu (copy/paste)
      if (e.target instanceof Element && e.target.closest("input, textarea")) return;
      e.preventDefault();
      const pad = 12;
      const w = 232;
      const h = 320;
      setPos({
        x: Math.min(e.clientX, window.innerWidth - w - pad),
        y: Math.min(e.clientY, window.innerHeight - h - pad),
      });
    };
    const close = () => setPos(null);
    window.addEventListener("contextmenu", onContext);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("keydown", (e) => e.key === "Escape" && close());
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close);
    };
  }, []);

  return (
    <>
      {pos && (
        <div
          className="fixed z-[80] w-58 overflow-hidden rounded-lg border border-line bg-panel/95 py-1.5 font-mono text-sm shadow-2xl shadow-black/60 backdrop-blur"
          style={{ left: pos.x, top: pos.y, width: 232 }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-3 py-1.5 text-[11px] text-dust">arun@butwal:~$</p>
          {items.map((it, i) =>
            it.type === "sep" ? (
              <div key={i} className="my-1 border-t border-line" />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => {
                  it.run();
                  setPos(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left text-dust transition-colors hover:bg-line/50 hover:text-amber"
              >
                {it.label}
                {it.hint && <span className="text-dust/60">{it.hint}</span>}
              </button>
            )
          )}
        </div>
      )}

      {/* copy toast */}
      {copied && (
        <div className="fixed bottom-14 left-1/2 z-[85] -translate-x-1/2 border border-amber/60 bg-panel px-4 py-2 font-mono text-xs text-amber shadow-lg">
          ✓ {copied}
        </div>
      )}
    </>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { soundPop, soundSwitch } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";
import type { Theme } from "@/lib/themes";

const THEME_ICONS: Record<string, string> = {
  amber: "⚡",
  moon: "🌙",
  sun: "☀️",
  wave: "🌊",
  sparkle: "✨",
  flower: "🌸",
  leaf: "🌿",
  cloud: "☁️",
};

export function ThemePicker() {
  const { theme: current, themes, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (t: Theme) => {
      if (t.id === current.id) return;
      setTheme(t.id);
      soundPop();
      hapticTap();
      setOpen(false);
    },
    [current.id, setTheme],
  );

  const handleToggle = useCallback(() => {
    setOpen((v) => !v);
    soundSwitch();
    hapticTap();
  }, []);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={handleToggle}
        className="ios-touch flex items-center gap-2 rounded-[12px] border border-line/60 bg-panel/80 px-3 py-2 text-sm text-dust transition-all duration-150 hover:border-amber/40 hover:text-fog active:scale-[0.96]"
        aria-label="Change theme"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{THEME_ICONS[current.icon] ?? "🎨"}</span>
        <span className="hidden sm:inline font-mono text-xs">{current.name}</span>
        <svg
          className={`h-3 w-3 text-dust transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[80]"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div
            ref={panelRef}
            className="absolute right-0 top-full z-[85] mt-2 w-64 overflow-hidden rounded-[16px] border border-line/60 bg-panel shadow-lg"
          >
            <div className="p-3">
              <div className="mb-2 px-1 font-mono text-[11px] uppercase tracking-widest text-dust">
                themes
              </div>
              <div className="space-y-1">
                {themes.map((t) => {
                  const isActive = t.id === current.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelect(t)}
                      className={`ios-touch flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                        isActive
                          ? "bg-amber/10 text-amber"
                          : "text-fog hover:bg-line/40"
                      }`}
                    >
                      {/* Color swatch */}
                      <div className="flex shrink-0 gap-1">
                        <span
                          className="h-4 w-4 rounded-full border border-line/50"
                          style={{ background: t.colors["surface-bg"] }}
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-line/50"
                          style={{ background: t.colors.accent }}
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-line/50"
                          style={{ background: t.colors["text-primary"] }}
                        />
                      </div>
                      <span className="flex-1 truncate text-xs font-medium">
                        {THEME_ICONS[t.icon]} {t.name}
                      </span>
                      <span className="text-[10px] text-dust/60">
                        {t.dark ? "🌙" : "☀️"}
                      </span>
                      {isActive && (
                        <span className="text-amber text-xs">●</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-line/40 px-3 py-2 font-mono text-[10px] text-dust/60">
              also try: <span className="text-amber/70">theme switch &lt;name&gt;</span> in terminal
            </div>
          </div>
        </>
      )}
    </div>
  );
}

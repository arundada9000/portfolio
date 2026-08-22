"use client";

import { useCallback, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { soundPop, soundSwitch, soundTap } from "@/lib/sounds";
import { hapticTap } from "@/lib/haptics";
import type { Theme } from "@/lib/themes";
import { Plus, Trash, Palette } from "./Icon";

const THEME_ICONS: Record<string, string> = {
  amber: "⚡",
  moon: "🌙",
  sun: "☀️",
  wave: "🌊",
  sparkle: "✨",
  flower: "🌸",
  leaf: "🌿",
  cloud: "☁️",
  palette: "🎨",
};

export function ThemePicker() {
  const {
    theme: current,
    themes,
    customThemes,
    setTheme,
    removeCustomTheme,
    openCustomThemeBuilder,
  } = useTheme();
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

  const handleCreateTheme = useCallback(() => {
    setOpen(false);
    soundTap();
    hapticTap();
    openCustomThemeBuilder();
  }, [openCustomThemeBuilder]);

  const handleDeleteCustom = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      soundTap();
      hapticTap();
      removeCustomTheme(id);
    },
    [removeCustomTheme],
  );

  const builtInThemes = themes.filter((t) => !t.isCustom);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={handleToggle}
        className="ios-touch flex h-9 w-9 items-center justify-center rounded-[10px] border border-line/60 bg-panel/80 text-sm text-dust transition-all duration-150 hover:border-amber/50 hover:text-amber active:scale-[0.94]"
        aria-label={`Change theme (current: ${current.name})`}
        title={`Theme: ${current.name}`}
        aria-expanded={open}
      >
        <span className="text-base leading-none select-none" suppressHydrationWarning>
          {THEME_ICONS[current.icon] ?? current.icon ?? "🎨"}
        </span>
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
            className="absolute right-0 top-full z-[85] mt-2 w-72 overflow-hidden rounded-[20px] border border-line/60 bg-panel shadow-2xl animate-[slide-up_0.2s_cubic-bezier(0.32,0.72,0,1)_both]"
          >
            <div className="max-h-96 overflow-y-auto p-3 space-y-3">
              <div>
                <div className="mb-2 px-1 font-mono text-[11px] uppercase tracking-widest text-dust">
                  Built-in Themes
                </div>
                <div className="space-y-1">
                  {builtInThemes.map((t) => {
                    const isActive = t.id === current.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelect(t)}
                        className={`ios-touch flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                          isActive
                            ? "bg-amber/10 text-amber font-semibold"
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
                        <span className="flex-1 truncate text-xs">
                          {THEME_ICONS[t.icon] ?? t.icon} {t.name}
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

              {/* Custom themes section if any */}
              {customThemes.length > 0 && (
                <div className="border-t border-line/40 pt-2">
                  <div className="mb-2 px-1 font-mono text-[11px] uppercase tracking-widest text-dust">
                    Custom Themes ({customThemes.length})
                  </div>
                  <div className="space-y-1">
                    {customThemes.map((t) => {
                      const isActive = t.id === current.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleSelect(t)}
                          role="button"
                          tabIndex={0}
                          className={`ios-touch flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                            isActive
                              ? "bg-amber/10 text-amber font-semibold"
                              : "text-fog hover:bg-line/40"
                          }`}
                        >
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
                          <span className="flex-1 truncate text-xs">
                            {THEME_ICONS[t.icon] ?? t.icon} {t.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustom(e, t.id)}
                            className="size-6 flex items-center justify-center rounded text-dust/60 hover:text-ember hover:bg-line/60"
                            title="Delete custom theme"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom button to launch CustomThemeBuilder */}
            <div className="border-t border-line/40 p-2 bg-panel/80">
              <button
                type="button"
                onClick={handleCreateTheme}
                className="ios-touch flex w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-line/80 px-3 py-2.5 font-mono text-xs font-medium text-fog transition-all duration-150 hover:border-amber hover:text-amber active:scale-[0.98]"
              >
                <Plus size={14} className="text-amber" />
                <span>Create Custom Theme…</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


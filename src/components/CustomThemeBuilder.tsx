"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import {
  createCustomTheme,
  THEME_STARTER_PRESETS,
  type CustomThemeSeed,
  type Theme,
} from "@/lib/themes";
import { exportThemeJSON, importThemeJSON } from "@/lib/theme-utils";
import { soundPop, soundSuccess, soundSwitch, soundTap, soundError } from "@/lib/sounds";
import { hapticTap, hapticSuccess, hapticError } from "@/lib/haptics";
import {
  XMark,
  Check,
  Palette,
  Sparkles,
  Download,
  Upload,
  Copy,
  RotateCcw,
  Sun,
  Moon,
} from "./Icon";

const THEME_ICONS = ["⚡", "🌙", "☀️", "🌊", "✨", "🌸", "🌿", "☁️", "🎨", "🔮", "🪐", "💎", "🌋", "🌌"];

export function CustomThemeBuilder() {
  const {
    isCustomThemeBuilderOpen,
    closeCustomThemeBuilder,
    addCustomTheme,
    theme: currentTheme,
  } = useTheme();

  const [name, setName] = useState("My Custom Theme");
  const [icon, setIcon] = useState("✨");
  const [dark, setDark] = useState(true);
  const [bg, setBg] = useState("#0a0e15");
  const [card, setCard] = useState("#0f1520");
  const [border, setBorder] = useState("#1e2839");
  const [text, setText] = useState("#e9e4d8");
  const [textSecondary, setTextSecondary] = useState("#8d97a9");
  const [accent, setAccent] = useState("#ffb454");
  const [accentHover, setAccentHover] = useState("#ff7a2f");

  const [importJson, setImportJson] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);

  // Initialize from current theme when modal opens
  useEffect(() => {
    if (isCustomThemeBuilderOpen) {
      setName(currentTheme.isCustom ? currentTheme.name : `${currentTheme.name} Remix`);
      setDark(currentTheme.dark);
      setBg(currentTheme.colors["surface-bg"]);
      setCard(currentTheme.colors["surface-card"]);
      setBorder(currentTheme.colors["surface-border"]);
      setText(currentTheme.colors["text-primary"]);
      setTextSecondary(currentTheme.colors["text-secondary"]);
      setAccent(currentTheme.colors.accent);
      setAccentHover(currentTheme.colors["accent-hover"]);
      setStatusMessage(null);
      setShowImport(false);
    }
  }, [isCustomThemeBuilderOpen, currentTheme]);

  // Handle starter preset selection
  const applyPreset = useCallback((preset: { name: string; seed: CustomThemeSeed }) => {
    soundSwitch();
    hapticTap();
    setName(preset.seed.name);
    setDark(preset.seed.dark);
    setBg(preset.seed.bg);
    setCard(preset.seed.card);
    setBorder(preset.seed.border);
    setText(preset.seed.text);
    setTextSecondary(preset.seed.textSecondary);
    setAccent(preset.seed.accent);
    setAccentHover(preset.seed.accentHover);
  }, []);

  const seed: CustomThemeSeed = useMemo(
    () => ({
      name: name.trim() || "Untitled Theme",
      dark,
      icon,
      bg,
      card,
      border,
      text,
      textSecondary,
      accent,
      accentHover,
    }),
    [name, dark, icon, bg, card, border, text, textSecondary, accent, accentHover],
  );

  const previewTheme = useMemo(() => createCustomTheme(seed, "preview-theme"), [seed]);

  const handleSaveAndApply = useCallback(() => {
    if (!name.trim()) {
      soundError();
      hapticError();
      setStatusMessage("Please enter a theme name");
      return;
    }
    const themeToSave = createCustomTheme(seed);
    addCustomTheme(themeToSave);
    soundSuccess();
    hapticSuccess();
    closeCustomThemeBuilder();
  }, [seed, name, addCustomTheme, closeCustomThemeBuilder]);

  const handleExport = useCallback(() => {
    soundPop();
    hapticTap();
    const json = exportThemeJSON(previewTheme);
    navigator.clipboard?.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setStatusMessage("Theme JSON copied to clipboard!");
  }, [previewTheme]);

  const handleImportSubmit = useCallback(() => {
    if (!importJson.trim()) return;
    const imported = importThemeJSON(importJson);
    if (!imported) {
      soundError();
      hapticError();
      setStatusMessage("Invalid JSON format");
      return;
    }
    soundSuccess();
    hapticSuccess();
    addCustomTheme(imported);
    setShowImport(false);
    setImportJson("");
    closeCustomThemeBuilder();
  }, [importJson, addCustomTheme, closeCustomThemeBuilder]);

  // Trap focus and close on Escape
  useEffect(() => {
    if (!isCustomThemeBuilderOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCustomThemeBuilder();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCustomThemeBuilderOpen, closeCustomThemeBuilder]);

  if (!isCustomThemeBuilderOpen) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-night/80 p-4 pt-16 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-builder-title"
      onClick={(e) => e.target === e.currentTarget && closeCustomThemeBuilder()}
    >
      <div className="ios-glass-card relative my-auto w-full max-w-2xl overflow-hidden rounded-[24px] border border-line/60 bg-panel shadow-2xl shadow-black/80 animate-[fade-in_0.25s_cubic-bezier(0.32,0.72,0,1)_both]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line/40 px-6 py-4">
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-amber" />
            <h2 id="theme-builder-title" className="font-mono text-sm font-bold uppercase tracking-wider text-fog">
              Theme Studio & Customizer
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundTap();
              hapticTap();
              closeCustomThemeBuilder();
            }}
            className="ios-touch flex size-8 items-center justify-center rounded-full border border-line/60 text-dust transition-colors hover:border-amber hover:text-fog active:scale-95"
            aria-label="Close theme studio"
          >
            <XMark size={16} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Preset Starters */}
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-dust">
              Starter Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {THEME_STARTER_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="ios-touch rounded-[10px] border border-line/60 bg-line/20 px-3 py-1.5 font-mono text-xs text-dust transition-all duration-150 hover:border-amber/60 hover:text-fog active:scale-95"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-dust">
              Live Preview
            </label>
            <div
              className="overflow-hidden rounded-[18px] border p-5 shadow-lg transition-colors duration-200"
              style={{
                backgroundColor: previewTheme.colors["surface-bg"],
                borderColor: previewTheme.colors["surface-border"],
                color: previewTheme.colors["text-primary"],
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: previewTheme.colors["text-primary"] }}>
                    {name || "Theme Preview"}
                  </span>
                </div>
                <span
                  className="rounded-[6px] px-2 py-0.5 font-mono text-[10px] font-medium"
                  style={{
                    backgroundColor: previewTheme.colors.accent,
                    color: previewTheme.colors["surface-bg"],
                  }}
                >
                  {dark ? "DARK MODE" : "LIGHT MODE"}
                </span>
              </div>

              <div
                className="mt-3 rounded-[12px] border p-4 transition-colors"
                style={{
                  backgroundColor: previewTheme.colors["surface-card"],
                  borderColor: previewTheme.colors["surface-border"],
                }}
              >
                <h4 className="text-base font-bold" style={{ color: previewTheme.colors["text-primary"] }}>
                  iOS Liquid Glass Card
                </h4>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: previewTheme.colors["text-secondary"] }}>
                  Testing high-contrast typography, readable body text, and luminous accent buttons.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-[10px] px-3.5 py-1.5 font-mono text-xs font-bold transition-transform active:scale-95"
                    style={{
                      backgroundColor: previewTheme.colors.accent,
                      color: previewTheme.colors["surface-bg"],
                    }}
                  >
                    Primary Action
                  </button>
                  <span
                    className="font-mono text-xs underline cursor-pointer"
                    style={{ color: previewTheme.colors["accent-hover"] }}
                  >
                    Hover Accent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Meta Inputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="theme-name-input" className="mb-1.5 block font-mono text-xs text-dust">
                Theme Name
              </label>
              <input
                id="theme-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[12px] border border-line/60 bg-panel/90 px-3.5 py-2.5 font-mono text-sm text-fog placeholder:text-dust/50 focus:border-amber focus:outline-none"
                placeholder="e.g. Neon Sunset"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-xs text-dust">Theme Mode</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDark(true);
                    soundTap();
                    hapticTap();
                  }}
                  className={`ios-touch flex flex-1 items-center justify-center gap-2 rounded-[12px] border px-3 py-2 font-mono text-xs font-medium transition-all ${
                    dark ? "border-amber bg-amber/10 text-amber" : "border-line/60 text-dust hover:text-fog"
                  }`}
                >
                  <Moon size={14} /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDark(false);
                    soundTap();
                    hapticTap();
                  }}
                  className={`ios-touch flex flex-1 items-center justify-center gap-2 rounded-[12px] border px-3 py-2 font-mono text-xs font-medium transition-all ${
                    !dark ? "border-amber bg-amber/10 text-amber" : "border-line/60 text-dust hover:text-fog"
                  }`}
                >
                  <Sun size={14} /> Light
                </button>
              </div>
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="mb-1.5 block font-mono text-xs text-dust">Theme Icon</label>
            <div className="flex flex-wrap gap-2">
              {THEME_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => {
                    setIcon(ic);
                    soundTap();
                    hapticTap();
                  }}
                  className={`flex size-9 items-center justify-center rounded-[10px] border text-base transition-all ${
                    icon === ic ? "border-amber bg-amber/15 scale-105" : "border-line/50 hover:border-line/80"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes Grid */}
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-dust">
              Color Token Tuning
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <ColorField label="Surface Background" value={bg} onChange={setBg} />
              <ColorField label="Card / Panel Surface" value={card} onChange={setCard} />
              <ColorField label="Border / Divider" value={border} onChange={setBorder} />
              <ColorField label="Primary Text" value={text} onChange={setText} />
              <ColorField label="Secondary / Muted Text" value={textSecondary} onChange={setTextSecondary} />
              <ColorField label="Accent (Amber)" value={accent} onChange={setAccent} />
              <ColorField label="Accent Hover (Ember)" value={accentHover} onChange={setAccentHover} />
            </div>
          </div>

          {/* Import JSON area */}
          {showImport && (
            <div className="rounded-[16px] border border-line/60 bg-line/20 p-4 space-y-3">
              <label htmlFor="import-json-area" className="block font-mono text-xs font-bold text-fog">
                Paste Theme JSON
              </label>
              <textarea
                id="import-json-area"
                rows={4}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{"name": "Custom", "dark": true, "colors": { ... }}'
                className="w-full rounded-[10px] border border-line/60 bg-panel p-2.5 font-mono text-xs text-fog placeholder:text-dust/50 focus:border-amber focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="rounded-[8px] px-3 py-1.5 font-mono text-xs text-dust hover:text-fog"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="rounded-[8px] bg-amber px-3.5 py-1.5 font-mono text-xs font-bold text-night hover:bg-ember"
                >
                  Apply Imported Theme
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <p className="font-mono text-xs text-amber animate-[fade-in_0.2s_ease_both]">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/40 bg-panel px-6 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="ios-touch flex items-center gap-1.5 rounded-[12px] border border-line/60 px-3 py-2 font-mono text-xs text-dust transition-colors hover:border-amber/40 hover:text-fog active:scale-95"
            >
              {copied ? <Check size={14} className="text-amber" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Export JSON"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImport((v) => !v);
                soundTap();
                hapticTap();
              }}
              className="ios-touch flex items-center gap-1.5 rounded-[12px] border border-line/60 px-3 py-2 font-mono text-xs text-dust transition-colors hover:border-amber/40 hover:text-fog active:scale-95"
            >
              <Upload size={14} />
              Import
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                soundTap();
                hapticTap();
                closeCustomThemeBuilder();
              }}
              className="ios-touch rounded-[12px] border border-line/60 px-4 py-2 font-mono text-xs text-dust transition-colors hover:text-fog active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="ios-touch flex items-center gap-1.5 rounded-[12px] bg-amber px-5 py-2 font-mono text-xs font-bold text-night transition-all hover:bg-ember active:scale-95"
            >
              <Check size={14} />
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[12px] border border-line/50 bg-panel/60 p-2.5 transition-colors hover:border-line/80">
      <span className="font-mono text-xs text-dust">{label}</span>
      <div className="flex items-center gap-2">
        <label className="relative flex size-7 cursor-pointer items-center justify-center rounded-full border border-line/60 shadow-sm transition-transform hover:scale-110 active:scale-95" style={{ backgroundColor: value }}>
          <input
            type="color"
            value={value.startsWith("#") ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            title={`Pick ${label}`}
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 rounded-[8px] border border-line/50 bg-surface-bg px-2 py-1 font-mono text-[11px] text-fog focus:border-amber focus:outline-none cursor-text select-all"
        />
      </div>
    </div>
  );
}
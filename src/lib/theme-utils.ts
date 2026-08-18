import { Theme, ThemeColors } from "./themes";

const STORAGE_KEY = "portfolio-theme";

/** Apply a theme by setting CSS custom properties on :root */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.setAttribute("data-theme", theme.id);
  root.classList.toggle("light", !theme.dark);
  root.classList.toggle("dark", theme.dark);

  // Update color-scheme for native form controls / scrollbars
  root.style.colorScheme = theme.dark ? "dark" : "light";

  // Set semantic CSS custom properties
  const entries = Object.entries(theme.colors) as [keyof ThemeColors, string][];
  for (const [key, value] of entries) {
    root.style.setProperty(`--${key}`, value);
  }
}

/** Read persisted theme ID from localStorage */
export function loadThemeId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Persist theme ID to localStorage */
export function saveThemeId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // storage full or disabled — silent
  }
}

/** Get system color scheme preference */
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/** Convert hex to RGB triplet string (e.g. "#ffb454" → "255,180,84") */
export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(num >> 16) & 255},${(num >> 8) & 255},${num & 255}`;
}

/** Read a computed CSS custom property value */
export function getThemeColor(varName: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`).trim();
}

/** Transition class helper: adds a temporary class that enables color transitions during theme switch */
export function withThemeTransition(fn: () => void): void {
  if (typeof document === "undefined") {
    fn();
    return;
  }
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  fn();
  // Remove after transition completes
  requestAnimationFrame(() => {
    setTimeout(() => root.classList.remove("theme-transitioning"), 350);
  });
}

/** Sound settings */
const SOUND_KEY = "portfolio-sound";

export function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(SOUND_KEY);
    if (v === null) return true; // default on
    return v === "on";
  } catch {
    return true;
  }
}

export function setSoundEnabled(v: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOUND_KEY, v ? "on" : "off");
  } catch {
    // silent
  }
}

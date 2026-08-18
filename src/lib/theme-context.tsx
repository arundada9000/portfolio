"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  themes,
  DEFAULT_THEME,
  type Theme,
} from "./themes";
import {
  applyTheme,
  loadThemeId,
  saveThemeId,
  getSystemTheme,
  withThemeTransition,
} from "./theme-utils";

interface ThemeContextValue {
  theme: Theme;
  themes: Theme[];
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Resolves the initial theme on the client, matching the
 * logic used in the inline <script> for flash prevention.
 */
function resolveInitialTheme(): Theme {
  const saved = loadThemeId();
  if (saved) {
    const found = themes.find((t) => t.id === saved);
    if (found) return found;
  }
  const mode = getSystemTheme();
  // Pick the first theme matching the system preference
  const match = themes.find((t) => t.dark === (mode === "dark"));
  return match ?? themes.find((t) => t.id === DEFAULT_THEME)!;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme);
  const [mounted, setMounted] = useState(false);

  // On mount, apply the resolved theme (ensures sync with inline script)
  useEffect(() => {
    applyTheme(theme);
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      // Only auto-switch if user hasn't manually chosen
      const saved = loadThemeId();
      if (!saved) {
        const mode = mq.matches ? "light" : "dark";
        const match = themes.find((t) => t.dark === (mode === "dark"));
        if (match) {
          withThemeTransition(() => {
            applyTheme(match);
            setThemeState(match);
          });
        }
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((id: string) => {
    const found = themes.find((t) => t.id === id);
    if (!found) return;
    withThemeTransition(() => {
      applyTheme(found);
      setThemeState(found);
      saveThemeId(id);
    });
  }, []);

  const value = useMemo(
    () => ({ theme, themes, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback for SSR or components outside provider
    return {
      theme: themes.find((t) => t.id === DEFAULT_THEME)!,
      themes,
      setTheme: () => {},
    };
  }
  return ctx;
}

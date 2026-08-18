"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

function resolveInitialTheme(): Theme {
  const saved = loadThemeId();
  if (saved) {
    const found = themes.find((t) => t.id === saved);
    if (found) return found;
  }
  const mode = getSystemTheme();
  const match = themes.find((t) => t.dark === (mode === "dark"));
  return match ?? themes.find((t) => t.id === DEFAULT_THEME)!;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme);
  const [mounted, setMounted] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme(theme);
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
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
    // Announce to screen readers
    if (liveRef.current) {
      liveRef.current.textContent = `Theme changed to ${found.name}`;
    }
  }, []);

  const value = useMemo(
    () => ({ theme, themes, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: themes.find((t) => t.id === DEFAULT_THEME)!,
      themes,
      setTheme: () => {},
    };
  }
  return ctx;
}

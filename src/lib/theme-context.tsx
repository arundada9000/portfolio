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
  loadCustomThemes,
  saveCustomThemes,
  getSystemTheme,
  withThemeTransition,
} from "./theme-utils";

interface ThemeContextValue {
  theme: Theme;
  themes: Theme[];
  customThemes: Theme[];
  mounted: boolean;
  setTheme: (id: string) => void;
  addCustomTheme: (theme: Theme) => void;
  removeCustomTheme: (id: string) => void;
  isCustomThemeBuilderOpen: boolean;
  openCustomThemeBuilder: () => void;
  closeCustomThemeBuilder: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DEFAULT_THEME_OBJ = themes.find((t) => t.id === DEFAULT_THEME) ?? themes[0];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME_OBJ);
  const [mounted, setMounted] = useState(false);
  const [isCustomThemeBuilderOpen, setIsCustomThemeBuilderOpen] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

  // Load custom themes from storage on client mount
  useEffect(() => {
    const loaded = loadCustomThemes();
    setCustomThemes(loaded);
    const saved = loadThemeId();
    const all = [...themes, ...loaded];
    let found = all.find((t) => t.id === saved);
    if (!found) {
      const mode = getSystemTheme();
      found = all.find((t) => t.dark === (mode === "dark")) ?? DEFAULT_THEME_OBJ;
    }
    setThemeState(found);
    applyTheme(found);
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const allThemes = useMemo(() => [...themes, ...customThemes], [customThemes]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      const saved = loadThemeId();
      if (!saved) {
        const mode = mq.matches ? "light" : "dark";
        const match = allThemes.find((t) => t.dark === (mode === "dark"));
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
  }, [allThemes]);

  const setTheme = useCallback(
    (id: string) => {
      const found = allThemes.find((t) => t.id === id);
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
    },
    [allThemes],
  );

  const addCustomTheme = useCallback(
    (newTheme: Theme) => {
      setCustomThemes((prev) => {
        const filtered = prev.filter((t) => t.id !== newTheme.id);
        const updated = [...filtered, newTheme];
        saveCustomThemes(updated);
        return updated;
      });
      withThemeTransition(() => {
        applyTheme(newTheme);
        setThemeState(newTheme);
        saveThemeId(newTheme.id);
      });
      if (liveRef.current) {
        liveRef.current.textContent = `Custom theme created and applied: ${newTheme.name}`;
      }
    },
    [],
  );

  const removeCustomTheme = useCallback(
    (id: string) => {
      setCustomThemes((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        saveCustomThemes(updated);
        return updated;
      });
      if (theme.id === id) {
        const fallback = themes.find((t) => t.id === DEFAULT_THEME)!;
        withThemeTransition(() => {
          applyTheme(fallback);
          setThemeState(fallback);
          saveThemeId(fallback.id);
        });
      }
    },
    [theme.id],
  );

  const openCustomThemeBuilder = useCallback(() => setIsCustomThemeBuilderOpen(true), []);
  const closeCustomThemeBuilder = useCallback(() => setIsCustomThemeBuilderOpen(false), []);

  const value = useMemo(
    () => ({
      theme,
      themes: allThemes,
      customThemes,
      mounted,
      setTheme,
      addCustomTheme,
      removeCustomTheme,
      isCustomThemeBuilderOpen,
      openCustomThemeBuilder,
      closeCustomThemeBuilder,
    }),
    [
      theme,
      allThemes,
      customThemes,
      mounted,
      setTheme,
      addCustomTheme,
      removeCustomTheme,
      isCustomThemeBuilderOpen,
      openCustomThemeBuilder,
      closeCustomThemeBuilder,
    ],
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
      customThemes: [],
      mounted: false,
      setTheme: () => {},
      addCustomTheme: () => {},
      removeCustomTheme: () => {},
      isCustomThemeBuilderOpen: false,
      openCustomThemeBuilder: () => {},
      closeCustomThemeBuilder: () => {},
    };
  }
  return ctx;
}

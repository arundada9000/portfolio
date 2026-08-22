export interface ThemeColors {
  // Surface
  "surface-bg": string;
  "surface-card": string;
  "surface-elevated": string;
  "surface-border": string;

  // Text
  "text-primary": string;
  "text-secondary": string;
  "text-accent": string;

  // Accent
  accent: string;
  "accent-hover": string;

  // Status
  "color-success": string;
  "color-danger": string;
  "color-warning": string;
  "color-info": string;

  // Materials (glass)
  "glass-bg": string;
  "glass-border": string;

  // Shadows
  "shadow-sm": string;
  "shadow-md": string;
  "shadow-lg": string;
}

export interface Theme {
  id: string;
  name: string;
  icon: string;
  dark: boolean;
  colors: ThemeColors;
  isCustom?: boolean;
}

export const themes: Theme[] = [
  {
    id: "midnight-amber",
    name: "Midnight Amber",
    icon: "amber",
    dark: true,
    colors: {
      "surface-bg": "#0a0e15",
      "surface-card": "#0f1520",
      "surface-elevated": "#141c2b",
      "surface-border": "#1e2839",
      "text-primary": "#e9e4d8",
      "text-secondary": "#8d97a9",
      "text-accent": "#ffb454",
      accent: "#ffb454",
      "accent-hover": "#ff7a2f",
      "color-success": "#34d399",
      "color-danger": "#f87171",
      "color-warning": "#fbbf24",
      "color-info": "#60a5fa",
      "glass-bg": "rgba(15,21,32,0.72)",
      "glass-border": "rgba(30,40,57,0.6)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.25)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.3)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.4)",
    },
  },
  {
    id: "ios-dark",
    name: "iOS Dark",
    icon: "moon",
    dark: true,
    colors: {
      "surface-bg": "#000000",
      "surface-card": "#1c1c1e",
      "surface-elevated": "#2c2c2e",
      "surface-border": "#38383a",
      "text-primary": "#ffffff",
      "text-secondary": "#8e8e93",
      "text-accent": "#0a84ff",
      accent: "#0a84ff",
      "accent-hover": "#409cff",
      "color-success": "#30d158",
      "color-danger": "#ff453a",
      "color-warning": "#ff9f0a",
      "color-info": "#64d2ff",
      "glass-bg": "rgba(28,28,30,0.75)",
      "glass-border": "rgba(84,84,88,0.36)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.5)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.6)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.7)",
    },
  },
  {
    id: "ios-light",
    name: "iOS Light",
    icon: "sun",
    dark: false,
    colors: {
      "surface-bg": "#f2f2f7",
      "surface-card": "#ffffff",
      "surface-elevated": "#ffffff",
      "surface-border": "#c6c6c8",
      "text-primary": "#000000",
      "text-secondary": "#3c3c43",
      "text-accent": "#007aff",
      accent: "#007aff",
      "accent-hover": "#0066d6",
      "color-success": "#34c759",
      "color-danger": "#ff3b30",
      "color-warning": "#ff9500",
      "color-info": "#5ac8fa",
      "glass-bg": "rgba(255,255,255,0.72)",
      "glass-border": "rgba(60,60,67,0.12)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.06)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.08)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.1)",
    },
  },
  {
    id: "ocean-deep",
    name: "Ocean Deep",
    icon: "wave",
    dark: true,
    colors: {
      "surface-bg": "#0b1628",
      "surface-card": "#111f35",
      "surface-elevated": "#162640",
      "surface-border": "#1a2d4a",
      "text-primary": "#e0e8f0",
      "text-secondary": "#6b8aab",
      "text-accent": "#3b9eff",
      accent: "#3b9eff",
      "accent-hover": "#5bb3ff",
      "color-success": "#34d399",
      "color-danger": "#f87171",
      "color-warning": "#fbbf24",
      "color-info": "#67e8f9",
      "glass-bg": "rgba(17,31,53,0.75)",
      "glass-border": "rgba(26,45,74,0.6)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.3)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.35)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.45)",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    icon: "sparkle",
    dark: true,
    colors: {
      "surface-bg": "#0d0f1a",
      "surface-card": "#131726",
      "surface-elevated": "#1a1e32",
      "surface-border": "#1e2440",
      "text-primary": "#e8e6f0",
      "text-secondary": "#8a8ba8",
      "text-accent": "#a78bfa",
      accent: "#a78bfa",
      "accent-hover": "#c4b5fd",
      "color-success": "#34d399",
      "color-danger": "#fb7185",
      "color-warning": "#fbbf24",
      "color-info": "#93c5fd",
      "glass-bg": "rgba(19,23,38,0.75)",
      "glass-border": "rgba(30,36,64,0.6)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.3)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.35)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.45)",
    },
  },
  {
    id: "sakura",
    name: "Sakura",
    icon: "flower",
    dark: false,
    colors: {
      "surface-bg": "#fdf2f8",
      "surface-card": "#ffffff",
      "surface-elevated": "#ffffff",
      "surface-border": "#f0d4e0",
      "text-primary": "#1a1020",
      "text-secondary": "#5e4a5a",
      "text-accent": "#ec4899",
      accent: "#ec4899",
      "accent-hover": "#d946a8",
      "color-success": "#34c759",
      "color-danger": "#ff3b30",
      "color-warning": "#ff9500",
      "color-info": "#5ac8fa",
      "glass-bg": "rgba(255,255,255,0.72)",
      "glass-border": "rgba(240,212,224,0.6)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.04)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.06)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.08)",
    },
  },
  {
    id: "forest",
    name: "Forest",
    icon: "leaf",
    dark: true,
    colors: {
      "surface-bg": "#0a1210",
      "surface-card": "#0f1a16",
      "surface-elevated": "#14221c",
      "surface-border": "#1a2e24",
      "text-primary": "#e0ece6",
      "text-secondary": "#6b9a80",
      "text-accent": "#34d399",
      accent: "#34d399",
      "accent-hover": "#10b981",
      "color-success": "#4ade80",
      "color-danger": "#f87171",
      "color-warning": "#fbbf24",
      "color-info": "#67e8f9",
      "glass-bg": "rgba(15,26,22,0.75)",
      "glass-border": "rgba(26,46,36,0.6)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.25)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.3)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.4)",
    },
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    icon: "cloud",
    dark: true,
    colors: {
      "surface-bg": "#0a0e1a",
      "surface-card": "#101628",
      "surface-elevated": "#161e36",
      "surface-border": "#1e2a44",
      "text-primary": "#e4e8f4",
      "text-secondary": "#7a86a8",
      "text-accent": "#60a5fa",
      accent: "#60a5fa",
      "accent-hover": "#3b82f6",
      "color-success": "#34d399",
      "color-danger": "#f87171",
      "color-warning": "#fbbf24",
      "color-info": "#38bdf8",
      "glass-bg": "rgba(16,22,40,0.75)",
      "glass-border": "rgba(30,42,68,0.6)",
      "shadow-sm": "0 1px 3px rgba(0,0,0,0.3)",
      "shadow-md": "0 4px 12px rgba(0,0,0,0.35)",
      "shadow-lg": "0 8px 32px rgba(0,0,0,0.45)",
    },
  },
];

export const DEFAULT_THEME = "midnight-amber";

export function getThemeById(id: string, allThemes: Theme[] = themes): Theme | undefined {
  return allThemes.find((t) => t.id === id);
}

export interface CustomThemeSeed {
  name: string;
  dark: boolean;
  icon?: string;
  bg: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
}

export function createCustomTheme(seed: CustomThemeSeed, idOverride?: string): Theme {
  const isDark = seed.dark;
  const id =
    idOverride ??
    `custom-${seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
  return {
    id,
    name: seed.name,
    icon: seed.icon ?? "palette",
    dark: isDark,
    isCustom: true,
    colors: {
      "surface-bg": seed.bg,
      "surface-card": seed.card,
      "surface-elevated": seed.card,
      "surface-border": seed.border,
      "text-primary": seed.text,
      "text-secondary": seed.textSecondary,
      "text-accent": seed.accent,
      accent: seed.accent,
      "accent-hover": seed.accentHover,
      "color-success": isDark ? "#34d399" : "#34c759",
      "color-danger": isDark ? "#f87171" : "#ff3b30",
      "color-warning": isDark ? "#fbbf24" : "#ff9500",
      "color-info": isDark ? "#60a5fa" : "#007aff",
      "glass-bg": isDark ? "rgba(20,25,35,0.78)" : "rgba(255,255,255,0.78)",
      "glass-border": isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
      "shadow-sm": isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
      "shadow-md": isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
      "shadow-lg": isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
    },
  };
}

export const THEME_STARTER_PRESETS: { name: string; seed: CustomThemeSeed }[] = [
  {
    name: "Cyberpunk Neon",
    seed: {
      name: "Cyberpunk Neon",
      dark: true,
      icon: "sparkle",
      bg: "#080811",
      card: "#121124",
      border: "#292349",
      text: "#f0f2ff",
      textSecondary: "#8b85b8",
      accent: "#00f0ff",
      accentHover: "#ff0055",
    },
  },
  {
    name: "Solarized Dark",
    seed: {
      name: "Solarized Dark",
      dark: true,
      icon: "sun",
      bg: "#002b36",
      card: "#073642",
      border: "#0e4a59",
      text: "#839496",
      textSecondary: "#586e75",
      accent: "#b58900",
      accentHover: "#cb4b16",
    },
  },
  {
    name: "Nord Frost",
    seed: {
      name: "Nord Frost",
      dark: true,
      icon: "cloud",
      bg: "#242933",
      card: "#2e3440",
      border: "#3b4252",
      text: "#eceff4",
      textSecondary: "#d8dee9",
      accent: "#88c0d0",
      accentHover: "#81a1c1",
    },
  },
  {
    name: "Dracula",
    seed: {
      name: "Dracula",
      dark: true,
      icon: "moon",
      bg: "#1e1f29",
      card: "#282a36",
      border: "#44475a",
      text: "#f8f8f2",
      textSecondary: "#6272a4",
      accent: "#bd93f9",
      accentHover: "#ff79c6",
    },
  },
  {
    name: "Matcha Light",
    seed: {
      name: "Matcha Light",
      dark: false,
      icon: "leaf",
      bg: "#f6f8f5",
      card: "#ffffff",
      border: "#dce3da",
      text: "#223324",
      textSecondary: "#5c6e5e",
      accent: "#4e8752",
      accentHover: "#39683c",
    },
  },
  {
    name: "OLED Monochrome",
    seed: {
      name: "OLED Monochrome",
      dark: true,
      icon: "moon",
      bg: "#000000",
      card: "#121212",
      border: "#282828",
      text: "#ffffff",
      textSecondary: "#999999",
      accent: "#ffffff",
      accentHover: "#cccccc",
    },
  },
];


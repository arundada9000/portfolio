# Theme System + iOS HIG Transformation Plan

> **Scope**: Add multi-theme support (built-in + custom user themes) and transform the visual language to follow Apple's Human Interface Guidelines (iOS 17/18/Liquid Glass).
>
> **Architecture**: Tailwind v4 CSS-first (`@theme`), React Context for theme state, `localStorage` persistence, system preference detection.
>
> **Strategy**: Each phase is a standalone, committable, revertable unit. Phases 1-3 are infrastructure (no visible change). Phases 4-9 are visual transformation. Phase 10 is polish.
>
> **Sensory Design Pillars** (woven through every phase):
> - **Haptics**: `navigator.vibrate()` for tap feedback, success, error states
> - **Sound**: Subtle UI audio cues (tap, success chime, error buzz) via Web Audio API
> - **Microinteractions**: Scale springs, opacity fades, cursor morphing, magnetic hover, staggered reveals
> - **Responsiveness**: 44px touch targets, fluid type (`clamp()`), mobile-first, safe-area insets
> - **Human convenience**: Undo toasts, auto-save preferences, reduced motion respect, dark/light system detection
> - **Feel-good**: Delightful preloader, Easter eggs in CommandPalette, smooth page transitions, particle effects on milestones

---

## Phase 0 — Audit & Inventory (no code changes)

**Goal**: Document every hardcoded color, spacing value, and component that needs changes.

- [ ] `git checkout -b theme-ios-hig` — create feature branch
- [ ] Grep all files for hardcoded `rgba(`, `#hex`, `rgb(` values outside token system
- [ ] List every component with its styling approach (Tailwind classes / inline / CSS)
- [ ] Screenshot current state at multiple viewports (320px, 768px, 1280px)
- [ ] Verify `prefers-reduced-motion` gate works on all animations

**Files to audit**:
| File | Issue |
|------|-------|
| `HeroPlayground.tsx` | 20+ hardcoded `rgba()` canvas constants |
| `DevConsole.tsx` | `#ffb454`, `#8d97a9`, `#ff7a2f` console CSS |
| `GitHubActivity.tsx` | `LANG_COLORS` hex array |
| `SortingVisualizer.tsx` | `rgba(255,122,47,0.6)` inline boxShadow |
| `ExperienceTimeline.tsx` | `rgba(255,180,84,0.6)` inline boxShadow |
| `ProjectCard.tsx` | `rgba(255,180,84,0.25)` hover shadow |
| `opengraph-image.tsx` | Server-only hardcoded hex |
| `layout.tsx` | `theme-color: #0a0e15`, `color-scheme: dark` |
| `manifest.ts` | `theme_color: "#0a0e15"` |
| `globals.css` | CRT vignette `rgba(4,6,10,0.55)` |

**Commit**: `chore: audit codebase for hardcoded colors and theme debt`

---

## Phase 1 — Theme Token Architecture

**Goal**: Restructure `globals.css` to support multiple theme palettes via CSS custom properties with a class-based toggle system.

### 1.1 Redefine the token layer in `globals.css`

Replace the current flat `@theme {}` with a **two-tier system**:

```css
@import "tailwindcss";

/* ── Theme-agnostic semantic tokens (resolve at runtime) ── */
:root {
  /* Surface colors */
  --surface-bg: var(--night);
  --surface-card: var(--panel);
  --surface-elevated: var(--panel);
  --surface-border: var(--line);

  /* Text colors */
  --text-primary: var(--fog);
  --text-secondary: var(--dust);
  --text-accent: var(--amber);

  /* Accent colors */
  --accent: var(--amber);
  --accent-hover: var(--ember);

  /* Status colors */
  --color-success: #34c759;
  --color-danger: #ff3b30;
  --color-warning: #ff9500;
  --color-info: #007aff;

  /* Materials */
  --glass-bg: rgba(15, 21, 32, 0.72);
  --glass-border: rgba(30, 40, 57, 0.6);
  --glass-blur: blur(20px) saturate(180%);

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* ── Tailwind v4 @theme (maps tokens to utilities) ── */
@theme {
  --color-night: var(--surface-bg);
  --color-panel: var(--surface-card);
  --color-line: var(--surface-border);
  --color-fog: var(--text-primary);
  --color-dust: var(--text-secondary);
  --color-amber: var(--accent);
  --color-ember: var(--accent-hover);
  --color-success: var(--color-success);
  --color-danger: var(--color-danger);
  --color-warning: var(--color-warning);
  --color-info: var(--color-info);

  --font-display: var(--font-bricolage);
  --font-body: var(--font-instrument);
  --font-mono: var(--font-jetbrains);

  /* iOS-style spacing tokens */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */

  /* Border radius tokens */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Animation tokens */
  --ease-ios: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);

  --animate-blink: blink 1.1s step-end infinite;
  --animate-marquee: marquee 32s linear infinite;
  --animate-fade-in: fade-in 0.3s var(--ease-ios) both;
  --animate-slide-up: slide-up 0.4s var(--ease-ios) both;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

### 1.2 Create `src/lib/themes.ts` — theme definitions

```ts
export interface Theme {
  id: string;
  name: string;
  icon: string;
  colors: Record<string, string>;
  dark: boolean;
  isCustom?: boolean;
}

export const themes: Theme[] = [
  // Built-in themes (see Phase 2)
];

export const DEFAULT_THEME = "midnight-amber";
```

### 1.3 Create `src/lib/theme-context.tsx` — React context

- `ThemeProvider` wraps the app
- Reads initial theme from `localStorage("portfolio-theme")` or system `prefers-color-scheme`
- Sets `data-theme` attribute on `<html>`
- Updates CSS custom properties on theme change
- Exposes `theme`, `setTheme`, `availableThemes`
- Handles flash-of-incorrect-theme via inline `<script>` in `<head>`

### 1.4 Create `src/lib/theme-utils.ts` — utility functions

- `applyTheme(theme: Theme)` — sets CSS custom properties on `:root`
- `getSystemTheme()` — returns `"light"` or `"dark"` based on `prefers-color-scheme`
- `saveTheme(id: string)` — saves to `localStorage`
- `loadTheme()` — loads from `localStorage`, falls back to system
- `hexToRgb(hex: string)` — for canvas components that need RGB values
- `getThemeColor(varName: string)` — reads computed CSS variable value at runtime

### 1.5 Create inline `<script>` for flash prevention

In `layout.tsx`, add a blocking `<script>` in `<head>` that reads `localStorage("portfolio-theme")` and sets the class on `<html>` before first paint.

**Files modified**: `globals.css`, `layout.tsx`
**Files created**: `src/lib/themes.ts`, `src/lib/theme-context.tsx`, `src/lib/theme-utils.ts`
**Commit**: `feat: add theme token architecture with semantic CSS variables`

---

## Phase 2 — Define Built-in Themes

**Goal**: Create 6+ curated theme palettes that users can choose from.

### Theme Palette Definitions

| ID | Name | Mode | BG | Card | Border | Text | Secondary | Accent | Accent Hover | Personality |
|---|---|---|---|---|---|---|---|---|---|---|
| `midnight-amber` | Midnight Amber | dark | `#0a0e15` | `#0f1520` | `#1e2839` | `#e9e4d8` | `#8d97a9` | `#ffb454` | `#ff7a2f` | Current terminal theme |
| `ios-dark` | iOS Dark | dark | `#000000` | `#1c1c1e` | `#38383a` | `#ffffff` | `#8e8e93` | `#0a84ff` | `#409cff` | Apple OLED dark |
| `ios-light` | iOS Light | light | `#f2f2f7` | `#ffffff` | `#c6c6c8` | `#000000` | `#3c3c43` | `#007aff` | `#0066d6` | Apple system light |
| `ocean-deep` | Ocean Deep | dark | `#0b1628` | `#111f35` | `#1a2d4a` | `#e0e8f0` | `#6b8aab` | `#3b9eff` | `#5bb3ff` | Cool blue palette |
| `aurora` | Aurora | dark | `#0d0f1a` | `#131726` | `#1e2440` | `#e8e6f0` | `#8a8ba8` | `#a78bfa` | `#c4b5fd` | Purple/violet accents |
| `sakura` | Sakura | light | `#fdf2f8` | `#ffffff` | `#f0d4e0` | `#1a1020` | `#7c6078` | `#ec4899` | `#d946a8` | Pink/rose, soft warm |
| `forest` | Forest | dark | `#0a1210` | `#0f1a16` | `#1a2e24` | `#e0ece6` | `#6b9a80` | `#34d399` | `#10b981` | Green nature palette |
| `midnight-blue` | Midnight Blue | dark | `#0a0e1a` | `#101628` | `#1e2a44` | `#e4e8f4` | `#7a86a8` | `#60a5fa` | `#3b82f6` | Blue monotone dark |

### Each theme defines:
- All 7 surface/text/accent colors (mapped to semantic tokens)
- Glass material values (bg rgba, border rgba, blur amount)
- Shadow tint (rgba for sm/md/lg)
- CRT vignette color (or `none` to disable)
- Selection color
- Focus ring color

**File modified**: `src/lib/themes.ts`
**Commit**: `feat: define 8 built-in theme palettes`

---

## Phase 3 — Theme Provider & Persistence

**Goal**: Wire up React context, localStorage, system detection, and flash prevention.

### 3.1 `ThemeProvider` component

```tsx
// src/lib/theme-context.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Theme, themes, DEFAULT_THEME } from "./themes";
import { applyTheme, loadTheme, saveTheme, getSystemTheme } from "./theme-utils";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue>(/* ... */);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Server-safe: return default, hydrate from localStorage in useEffect
    return themes.find(t => t.id === DEFAULT_THEME)!;
  });

  useEffect(() => {
    const saved = loadTheme();
    if (saved) {
      const found = themes.find(t => t.id === saved);
      if (found) {
        setThemeState(found);
        applyTheme(found);
      }
    }
  }, []);

  const setTheme = (id: string) => {
    const found = themes.find(t => t.id === id);
    if (found) {
      setThemeState(found);
      applyTheme(found);
      saveTheme(id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### 3.2 Flash-prevention inline script

In `layout.tsx`, inside `<head>`:
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t){document.documentElement.setAttribute('data-theme',t);var d=JSON.parse(localStorage.getItem('portfolio-theme-data')||'{}');if(d.colors)Object.entries(d.colors).forEach(function(e){document.documentElement.style.setProperty('--'+e[0],e[1)})}}catch(e){}})();`
  }}
/>
```

### 3.3 Update `layout.tsx`

- Wrap `<body>` children in `<ThemeProvider>`
- Add `data-theme` to `<html>` from context
- Update `theme-color` meta tag dynamically (or keep server-static for initial)

### 3.4 `applyTheme` function

Reads the theme's color map and sets each as a CSS custom property on `document.documentElement`:
```ts
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.id);
  root.classList.toggle("light", !theme.dark);
  root.classList.toggle("dark", theme.dark);
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}
```

**Files modified**: `layout.tsx`
**Files created**: `src/lib/theme-context.tsx`, `src/lib/theme-utils.ts`
**Commit**: `feat: add ThemeProvider with localStorage persistence and flash prevention`

---

## Phase 4 — Theme Picker UI

**Goal**: Add a theme selector to the CommandPalette and as a standalone component.

### 4.1 Add theme command to `CommandPalette.tsx`

Add a `theme` command group:
- `theme switch <name>` — switch to a named theme
- `theme list` — show all available themes with preview swatches
- `theme create` — enter custom theme creation flow

### 4.2 Create `ThemePicker.tsx` component

A compact inline component showing:
- Grid of theme color swatches (small circles showing BG, accent, text colors)
- Active theme highlighted with ring
- "Custom" option that opens a color picker modal
- Respects 44px touch targets

### 4.3 Custom Theme Builder

A modal/sheet where users can:
- Pick background color (hex input or color picker)
- Pick card/surface color
- Pick text color
- Pick accent color
- Toggle light/dark mode
- Preview live
- Save to `localStorage` as `custom-theme-{name}`
- Export as JSON / Import JSON

### 4.4 Add keyboard shortcut

`g then t` — jump to theme picker in CommandPalette

**Files modified**: `CommandPalette.tsx`, `KeyboardShortcuts.tsx`
**Files created**: `src/components/ThemePicker.tsx`, `src/components/CustomThemeBuilder.tsx`
**Commit**: `feat: add theme picker UI with custom theme builder`

---

## Phase 5 — iOS Typography & Color System

**Goal**: Transform the type scale and color tokens to match iOS HIG.

### 5.1 Typography transformation

**Decision**: Keep existing Google Fonts (Bricolage Grotesque, Instrument Sans, JetBrains Mono) but remap the semantic scale. Do NOT switch to SF Pro (not available as web font without licensing issues). Instead, use the existing fonts with iOS-style sizing and tracking.

```css
/* iOS-inspired type scale using existing fonts */
--text-large-title: 2.125rem;   /* 34px */
--text-title-1: 1.75rem;        /* 28px */
--text-title-2: 1.375rem;       /* 22px */
--text-title-3: 1.25rem;        /* 20px */
--text-headline: 1.0625rem;     /* 17px */
--text-body: 1.0625rem;         /* 17px */
--text-callout: 1rem;           /* 16px */
--text-subhead: 0.9375rem;      /* 15px */
--text-footnote: 0.8125rem;     /* 13px */
--text-caption-1: 0.75rem;      /* 12px */
--text-caption-2: 0.6875rem;    /* 11px */
```

- Update `.text-display` class to use new scale
- Add `.text-ios-*` utility classes for each tier
- Ensure tracking matches iOS conventions (`-0.02em` for large titles, `-0.005em` for body)

### 5.2 Color system for iOS themes

For `ios-light` and `ios-dark` themes, define exact iOS system colors:

```ts
// iOS Dark theme colors
{
  surface: "#000000",        // System Background
  card: "#1c1c1e",           // Secondary Grouped Background
  elevated: "#2c2c2e",       // Tertiary Grouped Background
  border: "#38383a",         // Separator
  textPrimary: "#ffffff",    // Label
  textSecondary: "#8e8e93",  // Secondary Label
  textTertiary: "#636366",   // Tertiary Label
  accent: "#0a84ff",         // System Blue (dark)
  success: "#30d158",        // System Green (dark)
  danger: "#ff453a",         // System Red (dark)
  warning: "#ff9f0a",        // System Orange (dark)
}
```

### 5.3 Update `globals.css` body and selection rules

- Body background and color now read from semantic tokens
- Selection color adapts to theme
- Focus ring adapts to theme accent
- Scrollbar colors adapt

**Files modified**: `globals.css`, `src/lib/themes.ts`
**Commit**: `feat: iOS typography scale and color system`

---

## Phase 6 — Visual Component Transformation

**Goal**: Transform core UI components to iOS HIG style.

### 6.1 Nav.tsx → iOS Frosted Glass Navigation Bar

**Current**: `backdrop-blur-md bg-night/80 border-b border-line/70`, terminal logo
**Target**: `ios-glass-bar` with frosted glass, large title collapse behavior

Changes:
- Replace solid bg with `backdrop-filter: blur(20px) saturate(180%)` glass material
- Add scroll listener: large title at top, compact title on scroll
- iOS-style nav bar height (44px compact)
- Keep terminal logo but adapt to theme colors
- Mobile overlay stays but gets frosted glass treatment

### 6.2 Cards → iOS Grouped Inset Cards

**Current**: `bg-panel border border-line` with `rounded-lg`
**Target**: `rounded-[20px]` with subtle shadow, 0.5px hairline separators

Affected components:
- `ProjectCard.tsx` — featured projects
- `Skills.tsx` — skill grid cards
- `About.tsx` — stats grid
- `Contact.tsx` — form card
- `GitHubActivity.tsx` — repo cards

### 6.3 Buttons → iOS Touch Feedback

Add to all interactive elements:
```css
active:scale-[0.97] active:opacity-80 transition-all duration-150 ease-out select-none
```

Minimum 44px touch targets on all clickable elements.

### 6.4 SectionHeadings → iOS Style

**Current**: `$ command` eyebrow + large MaskText heading
**Target**: Keep the terminal eyebrow (brand identity) but adapt heading sizes to iOS scale. Add subtle glass background to section headers.

### 6.5 Forms → iOS Style Inputs

**Current**: `border border-line bg-panel font-mono text-sm`
**Target**: iOS-style rounded inputs with `rounded-[12px]`, subtle border, proper padding

### 6.6 Lightbox → iOS Sheet

**Current**: `z-[95] bg-night/95 backdrop-blur-sm`
**Target**: Bottom sheet style with drag handle, rounded top corners (`rounded-t-[32px]`)

### 6.7 CommandPalette → iOS Alert Style

**Current**: Terminal emulator modal
**Target**: Keep terminal identity (it's the brand!) but add frosted glass backdrop, rounded corners, spring animation

### 6.8 StatusLine → iOS Tab Bar Hybrid

**Current**: Vim-style fixed bottom statusline
**Target**: Keep the vim aesthetic but add frosted glass material, adapt colors to theme

**Files modified**: `Nav.tsx`, `ProjectCard.tsx`, `Skills.tsx`, `About.tsx`, `Contact.tsx`, `Lightbox.tsx`, `CommandPalette.tsx`, `StatusLine.tsx`, `BackToTop.tsx`, `ContextMenu.tsx`, `KeyboardShortcuts.tsx`
**Commit**: `feat: transform core components to iOS HIG visual style`

---

## Phase 7 — Canvas & Hardcoded Color Remediation

**Goal**: Make all canvas-based and hardcoded color components theme-aware.

### 7.1 HeroPlayground.tsx — Canvas theme bridge

Replace hardcoded constants with runtime CSS variable reads:

```ts
// Before
const AMBER = "255,180,84";
const EMBER = "255,122,47";

// After
function getThemeRgb(varName: string): string {
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName}`)
    .trim();
  // Convert hex to rgb triplet
  return hexToRgb(val);
}

// In useEffect / init:
const AMBER = getThemeRgb("accent");
const EMBER = getThemeRgb("accent-hover");
```

The 4 canvas modes (particles, snake, radar, life) need their color constants re-read on theme change via a `useEffect` that listens to theme context.

### 7.2 DevConsole.tsx — Read theme for console styling

Replace hardcoded hex strings with theme color reads.

### 7.3 GitHubActivity.tsx — Dynamic LANG_COLORS

Replace static `LANG_COLORS` array with a function that reads from theme or provides accessible fallbacks.

### 7.4 SortingVisualizer.tsx & ExperienceTimeline.tsx — Inline boxShadow

Replace hardcoded `rgba()` shadows with CSS variable-based values:
```css
box-shadow: 0 0 12px color-mix(in srgb, var(--accent-hover) 60%, transparent);
```

### 7.5 ProjectCard.tsx — Hover shadow

Replace `rgba(255,180,84,0.25)` with `color-mix(in srgb, var(--accent) 25%, transparent)`.

### 7.6 CRT Vignette (globals.css)

For non-terminal themes, disable or soften the CRT overlay:
```css
[data-theme="ios-light"] .crt::before,
[data-theme="ios-dark"] .crt::before,
[data-theme="sakura"] .crt::before {
  display: none;
}
```

For terminal themes, keep but make color adaptive.

### 7.7 OG Image (opengraph-image.tsx)

Keep server-only hardcoded colors OR read from a static theme config. Low priority — OG images don't need to be theme-aware.

### 7.8 meta tags (layout.tsx, manifest.ts)

Use the default theme's background for `theme-color` meta tag. Update via client-side `useEffect` if needed, or keep static.

**Files modified**: `HeroPlayground.tsx`, `DevConsole.tsx`, `GitHubActivity.tsx`, `SortingVisualizer.tsx`, `ExperienceTimeline.tsx`, `ProjectCard.tsx`, `globals.css`, `layout.tsx`, `manifest.ts`
**Commit**: `feat: make canvas and hardcoded components theme-aware`

---

## Phase 8 — Motion, Haptics, Sound & Microinteractions

**Goal**: iOS spring animations, haptic feedback, audio cues, microinteractions, and delightful feel-good moments.

### 8.1 Create `src/lib/haptics.ts` — Haptic feedback module

```ts
// Lightweight haptic feedback using navigator.vibrate()
// Falls back gracefully on desktop (no-op)

export function hapticTap() {
  navigator.vibrate?.(8); // light tap — selection, button press
}

export function hapticSuccess() {
  navigator.vibrate?.([10, 30, 15]); // double pulse — success, sent
}

export function hapticError() {
  navigator.vibrate?.(40); // heavy thud — error, delete
}

export function hapticWarning() {
  navigator.vibrate?.([15, 20, 15]); // triple pulse — warning
}
```

### 8.2 Create `src/lib/sounds.ts` — Audio cue module

```ts
// Web Audio API synth — no audio files needed
// Generates tiny UI sounds programmatically

const ctx = typeof window !== "undefined"
  ? new AudioContext()
  : null;

function play(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function soundTap() {
  play(1200, 0.06, "sine", 0.05); // soft click
}

export function soundSuccess() {
  // Major third chime: E5 → G#5
  play(659, 0.12, "sine", 0.06);
  setTimeout(() => play(830, 0.15, "sine", 0.05), 80);
}

export function soundError() {
  play(130, 0.18, "triangle", 0.07); // low buzz
}

export function soundSwitch() {
  play(800, 0.04, "sine", 0.03); // tiny tick
}

export function soundHover() {
  play(2400, 0.03, "sine", 0.015); // barely-there shimmer
}

export function soundPop() {
  play(600, 0.05, "sine", 0.04);
  setTimeout(() => play(900, 0.06, "sine", 0.03), 30);
}

// Theme-aware: mute sounds if user preference
let soundsEnabled = true;
export function setSoundsEnabled(v: boolean) { soundsEnabled = v; }
export function areSoundsEnabled() { return soundsEnabled; }
```

### 8.3 Create `src/lib/microinteractions.ts` — shared interaction helpers

```ts
// Magnetic hover effect: element subtly follows cursor
export function magneticHover(el: HTMLElement, strength = 0.3) { ... }

// Tilt effect: 3D perspective tilt on hover (for cards)
export function tiltEffect(el: HTMLElement, maxTilt = 5) { ... }

// Stagger children: animate children in sequence
export function staggerIn(children: HTMLElement[], delay = 50) { ... }

// Number ticker: smooth count-up with easing
export function tickNumber(el: HTMLElement, target: number, duration = 800) { ... }
```

### 8.4 Spring animations

Update all transition classes to use iOS spring curves:
```css
/* Replace */
transition: all 0.2s ease
/* With */
transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1)
```

Affected: Nav transitions, card hover, modal open/close, theme switch transition.

### 8.5 Touch feedback on all interactive elements

Add consistent active press with haptic + sound:
```tsx
// Utility class for interactive elements
className="ios-touch active:scale-[0.97] active:opacity-80 transition-all duration-150"
```

```css
/* globals.css */
.ios-touch {
  min-height: 44px;
  min-width: 44px;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}
```

Verify 44px minimum touch targets on all interactive elements.

### 8.6 Momentum scrolling

Add to scrollable containers:
```css
-webkit-overflow-scrolling: touch;
overscroll-behavior-y: contain;
```

### 8.7 Theme switch animation

When switching themes, animate the color transition smoothly:
```css
html.theme-transition * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
}
```

### 8.8 Microinteractions per component

| Component | Interaction | Feedback |
|-----------|------------|----------|
| Nav links | Hover underline slides in | soundHover (desktop only) |
| Project cards | Magnetic hover + subtle tilt | soundTap on click |
| Skills grid | Stagger reveal on scroll | — |
| CommandPalette | Typing sound per character | hapticTap per keystroke |
| Theme picker | Color swatch pop on select | soundPop + hapticTap |
| Back to top | Scale spring on appear | soundSwitch |
| Social icons | Magnetic hover + glow | soundHover |
| Form submit | Button pulse → success chime | hapticSuccess + soundSuccess |
| Lightbox | Drag-to-dismiss with spring | hapticWarning at boundary |
| Custom cursor | Morph shape on hover (dot → ring swell) | — |
| Preloader | Typing sound per character | — |
| Context menu | Scale-in from click point | soundTap |
| Scroll progress | Smooth gradient fill | — |
| Gallery images | Scale-up on hover, lightbox open | soundPop |

### 8.9 Sound settings

Add a toggle in CommandPalette: `sound on|off|mute`
- Stored in `localStorage`
- Default: on on mobile (haptics available), off on desktop
- Visual indicator in StatusLine: 🔊 / 🔇 icon

### 8.10 Feel-good touches

- **Page load**: Smooth fade-in instead of hard render (Preloader already does this)
- **404 page**: Playful animation + Easter egg
- **Theme switch**: 200ms color crossfade — feels like changing wallpaper
- **Scroll milestones**: Subtle particle burst at 50%, 100% scroll
- **CommandPalette Easter eggs**: `matrix`, `rainbow`, `zen` commands
- **Footer**: Subtle parallax on scroll

**Files created**: `src/lib/haptics.ts`, `src/lib/sounds.ts`, `src/lib/microinteractions.ts`
**Files modified**: `globals.css`, 20+ component files for interaction classes
**Commit**: `feat: add haptics, audio cues, microinteractions and feel-good patterns`

---

## Phase 9 — Responsive & Accessibility Audit

**Goal**: Ensure themes work across all viewports and meet accessibility standards.

### 9.1 Contrast ratios

Verify all text/background combinations meet WCAG AA (4.5:1) for every theme:
- Primary text on background
- Secondary text on background
- Accent text on background
- Text on card surfaces

### 9.2 Reduced motion

Verify `prefers-reduced-motion: reduce` gate works with new animations. Ensure theme switching doesn't cause excessive motion.

### 9.3 Dark/Light mode system detection

- `prefers-color-scheme: dark` → default to a dark theme
- `prefers-color-scheme: light` → default to a light theme
- User override persists in localStorage

### 9.4 Mobile testing

- Theme picker touch targets (44px)
- iOS glass blur performance on mobile (backdrop-filter can be expensive)
- Custom theme builder usability on small screens

### 9.5 Screen reader

- Theme picker announced properly
- Theme change announced via `aria-live` region

**Files modified**: Various components for a11y fixes
**Commit**: `feat: accessibility and responsive audit for all themes`

---

## Phase 10 — Polish & Documentation

**Goal**: Final polish, documentation, and performance optimization.

### 10.1 Update DESIGN.md

Document the new theme system, available themes, and how to create custom themes.

### 10.2 Performance

- Audit backdrop-filter performance on low-end devices
- Add `will-change` hints for theme transitions
- Lazy-load theme picker UI
- Ensure theme switch doesn't cause layout thrash

### 10.3 Theme import/export

- JSON export of custom themes
- URL-based theme sharing (encode theme in query params)
- Reset to default option

### 10.4 Final screenshots

- Screenshot all 8+ themes at 320px, 768px, 1280px
- Update README with theme showcase

**Commit**: `feat: final polish and documentation for theme system`

---

## File Change Summary

| File | Phases | Action |
|------|--------|--------|
| `src/app/globals.css` | 1, 5, 6, 8, 9 | Major rewrite — semantic tokens, iOS utilities, motion |
| `src/app/layout.tsx` | 3, 5, 7 | ThemeProvider wrap, flash script, dynamic meta |
| `src/components/Nav.tsx` | 6 | Frosted glass, large title collapse |
| `src/components/Hero.tsx` | 6 | Adapt to theme tokens |
| `src/components/HeroPlayground.tsx` | 7 | Theme-aware canvas colors |
| `src/components/About.tsx` | 6 | iOS card style |
| `src/components/Skills.tsx` | 6 | iOS grid cards |
| `src/components/Projects.tsx` | 6 | Adapt spacing |
| `src/components/ProjectCard.tsx` | 6, 7 | iOS card, theme shadow |
| `src/components/Contact.tsx` | 6 | iOS form inputs |
| `src/components/Footer.tsx` | 6 | Adapt to theme |
| `src/components/StatusLine.tsx` | 6 | Frosted glass, theme colors |
| `src/components/CommandPalette.tsx` | 4, 6 | Theme commands, glass style |
| `src/components/ContextMenu.tsx` | 6 | Theme colors |
| `src/components/KeyboardShortcuts.tsx` | 4, 6 | Theme shortcut, glass |
| `src/components/BackToTop.tsx` | 6 | Theme colors |
| `src/components/Lightbox.tsx` | 6 | iOS bottom sheet |
| `src/components/DevConsole.tsx` | 7 | Theme-aware console |
| `src/components/GitHubActivity.tsx` | 6, 7 | Theme cards, dynamic colors |
| `src/components/ExperienceTimeline.tsx` | 7 | Theme shadow |
| `src/components/SortingVisualizer.tsx` | 7 | Theme shadow |
| `src/components/Preloader.tsx` | 6 | Adapt to theme |
| `src/components/CustomCursor.tsx` | 6 | Theme accent for cursor |
| `src/components/SectionHeading.tsx` | 6 | iOS heading scale |
| `src/components/Section.tsx` | 5, 6 | iOS spacing |
| `src/components/OpenSource.tsx` | 9 | Filter adaptation |
| `src/components/Typing.tsx` | 6 | Theme accent cursor |
| `src/components/Gallery.tsx` | 6 | Theme colors |
| `src/components/ProjectVisual.tsx` | 6 | Theme gradient |
| `src/components/ProjectGallery.tsx` | 6 | Theme colors |
| `src/components/MaskText.tsx` | — | No changes needed |
| `src/components/Reveal.tsx` | — | No changes needed |
| `src/components/CountUp.tsx` | — | No changes needed |
| `src/components/TerminalWindow.tsx` | 6 | Theme traffic lights |
| `src/components/ScrollProgress.tsx` | 6 | Theme accent gradient |
| `src/components/ServiceWorker.tsx` | — | No changes needed |
| `src/components/SectionHeading.tsx` | 6 | iOS heading |
| `src/app/work/[slug]/page.tsx` | 6 | iOS card styling |
| `src/app/not-found.tsx` | 6 | Theme colors |
| `src/app/offline/page.tsx` | 6 | Theme colors |
| `src/app/opengraph-image.tsx` | 7 | Low priority |
| `src/app/manifest.ts` | 7 | Dynamic theme color |
| `src/lib/data/site.ts` | — | No changes needed |
| `src/lib/themes.ts` | 1, 2 | **NEW** — theme definitions |
| `src/lib/theme-context.tsx` | 3 | **NEW** — React context |
| `src/lib/theme-utils.ts` | 1, 3 | **NEW** — utility functions |
| `src/components/ThemePicker.tsx` | 4 | **NEW** — theme picker UI |
| `src/components/CustomThemeBuilder.tsx` | 4 | **NEW** — custom theme modal |
| `src/lib/haptics.ts` | 8 | **NEW** — haptic feedback module |
| `src/lib/sounds.ts` | 8 | **NEW** — audio cue module (Web Audio synth) |
| `src/lib/microinteractions.ts` | 8 | **NEW** — magnetic hover, tilt, stagger |
| `next.config.ts` | — | No changes needed |

**Total files modified**: ~30
**Total files created**: 8
**Estimated effort**: 45-60 hours across all phases

---

## Execution Order & Risk Mitigation

```
Phase 0 (Audit)         ──→ commit ──→ test ──→ ✓ or revert
Phase 1 (Token Arch)    ──→ commit ──→ test ──→ ✓ or revert
Phase 2 (Theme Defs)    ──→ commit ──→ test ──→ ✓ or revert
Phase 3 (Provider)      ──→ commit ──→ test ──→ ✓ or revert
Phase 4 (Picker UI)     ──→ commit ──→ test ──→ ✓ or revert
Phase 5 (iOS Type/Color) ──→ commit ──→ test ──→ ✓ or revert
Phase 6 (Components)    ──→ commit ──→ test ──→ ✓ or revert
Phase 7 (Canvas Fix)    ──→ commit ──→ test ──→ ✓ or revert
Phase 8 (Motion)        ──→ commit ──→ test ──→ ✓ or revert
Phase 9 (A11y)          ──→ commit ──→ test ──→ ✓ or revert
Phase 10 (Polish)       ──→ commit ──→ final test
```

**High-risk phases**: 1 (token rewrite breaks Tailwind), 3 (hydration mismatch), 6 (visual regression), 7 (canvas rendering). Test thoroughly before committing each.

**Low-risk phases**: 0, 2, 4, 5, 8, 9, 10.

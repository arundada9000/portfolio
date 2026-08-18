# Phase 0 Audit Findings

> Generated: 2026-08-18 | Branch: theme-ios-hig

## Hardcoded Colors (32 occurrences in TSX, 10 in CSS)

### Critical (must fix for theming)
| File | Line | Value | Context |
|------|------|-------|---------|
| `HeroPlayground.tsx` | 23-24 | `AMBER="255,180,84"`, `EMBER="255,122,47"` | Canvas RGB constants |
| `HeroPlayground.tsx` | 247 | `rgba(10,14,21,0.72)` | Snake overlay |
| `HeroPlayground.tsx` | 348-349 | `rgba(255,180,84,0)` | Radar gradient stops |
| `DevConsole.tsx` | 16-18 | `#ffb454`, `#8d97a9`, `#ff7a2f` | Console CSS strings |
| `GitHubActivity.tsx` | 28 | `["#ffb454","#ff7a2f","#8d97a9","#e9e4d8","#c98a3a","#5a6b85"]` | Language bar |
| `ExperienceTimeline.tsx` | 29 | `rgba(255,180,84,0.6)` | Timeline dot glow |
| `SortingVisualizer.tsx` | 185 | `rgba(255,122,47,0.6)` | Hot bar glow |
| `ProjectCard.tsx` | 12 | `rgba(255,180,84,0.25)` | Hover shadow |

### Low priority (server/meta)
| File | Line | Value | Context |
|------|------|-------|---------|
| `opengraph-image.tsx` | 17-34 | `#0a0e15`, `#e9e4d8`, `#8d97a9`, `#ffb454` | OG image |
| `layout.tsx` | 103 | `#0a0e15` | theme-color meta |
| `manifest.ts` | 12-13 | `#0a0e15` | PWA theme |
| `globals.css` | 139 | `rgba(4,6,10,0.55)` | CRT vignette |

## Touch Targets (20 elements under 44px)

### Must fix
- Nav mobile hamburger, cmd+K button, nav links
- Hero social links (zero padding)
- Lightbox close/prev/next buttons
- ContextMenu items (24px height)
- CommandPalette autocomplete rows
- SortingVisualizer toggle/shuffle buttons
- BackToTop button
- HeroPlayground channel tabs
- Gallery case study badges
- Skills tag pills

## Responsive (320px)
- **Status**: Sound. No overflow risks. `clamp()` fluid type used correctly.

## Safe Area Insets
- **Status**: NOT IMPLEMENTED. Missing `viewport-fit=cover` and all `env(safe-area-inset-*)`.
- Affects: Nav (top), StatusLine (bottom), BackToTop, Lightbox

## Haptic/Sound
- **Status**: Not implemented. Only music player in CommandPalette.

## prefers-reduced-motion
- **Status**: Excellent. Global CSS kill-switch + 11 components with explicit checks.

## Hover Media Query
- **Status**: Not guarded. Sticky hover on touch devices (cards lift, images scale and stay).

## Focus Management
- **Status**: Good global `:focus-visible`, traps in 4 overlays. Missing in Nav mobile overlay.

## Scroll Behavior
- **Status**: Smooth scroll works. Missing `overscroll-behavior: contain` on scroll containers.

## Microinteractions
- **Status**: Rich. Motion spring curve `[0.22, 1, 0.36, 1]` used consistently. Canvas, CSS, and JS animations all present.

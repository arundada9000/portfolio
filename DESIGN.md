# DESIGN.md - Arun Neupane Portfolio

> Visual system for the impeccable design skill. Answers how it looks.
> Paired with [PRODUCT.md](./PRODUCT.md) (who / what / why).
> Source of truth for tokens: `src/app/globals.css` (`@theme`). Keep this file in sync.

## Theme

**"The night shift"** - a late-night amber-phosphor terminal session on deep night-blue.
Dark-only by intent (a developer coding after midnight; the live clock reinforces it).
Warm amber against cool blue-black, not the clichéd single-neon-on-black. The interface
borrows real terminal literacy - prompts, buffers, a vim statusline - as identity, never
decoration.

## Color

Dark theme, warm accent on cool base. OKLCH-friendly, verified for contrast on `night`.

| Token | Hex | Role |
|-------|-----|------|
| `night` | `#0a0e15` | Page background (deep blue-black) |
| `panel` | `#0f1520` | Cards, terminals, raised surfaces |
| `line` | `#1e2839` | Borders, dividers, chips |
| `fog` | `#e9e4d8` | Primary text (warm off-white, ~13:1 on night) |
| `dust` | `#8d97a9` | Secondary / muted text (~5.6:1 on night - passes body 4.5:1) |
| `amber` | `#ffb454` | Primary accent - links, CTAs, focus, headings highlight |
| `ember` | `#ff7a2f` | Secondary accent - hover, INSERT-mode statusline |

Rules:
- Accent is amber; use `ember` only for state change (hover, active mode). Never a third hue.
- Muted text is `dust`, never a lighter gray - it must clear 4.5:1. Don't drop below it for "elegance."
- Selection and focus are `amber` on `night`. Focus ring is always visible (2px, 3px offset).

## Typography

Three roles, deliberately paired - not one neutral family doing everything.

| Role | Family | Usage |
|------|--------|-------|
| Display | **Bricolage Grotesque** (700-800, tight −0.03em) | Section headings, hero name, uppercase |
| Body | **Instrument Sans** | Paragraphs, prose, form values |
| Mono | **JetBrains Mono** | Terminal chrome, eyebrows, labels, statusline, code, chips |

- Hero name: `clamp(3.5rem, 12vw, 10rem)`, uppercase, line-height 0.95.
- Eyebrows are mono, uppercase, letter-spacing 0.18em, amber, prefixed with a `$` command.
- Body prose maxes ~65ch for readability; never full-bleed paragraphs.

## Layout

- **Mobile-first.** Breakpoints: base (mobile) → `sm` 640 → `md` 768 → `lg` 1024.
- Content column: `max-w-6xl` (72rem), padded `px-4 sm:px-6`.
- Sections: consistent vertical rhythm `py-20 sm:py-28`, `scroll-mt-20` for anchor offset.
- Grid-of-panels pattern: 1px `line` gaps over a `line` background so cards read as a
  terminal-grid, not floating cards.
- Body has bottom padding reserved for the fixed statusline.

## Components

- **StatusLine** (signature) - fixed vim-style bar: mode (`NORMAL`/`INSERT`), active section
  as an open buffer, live NPT clock, scroll position. `aria-hidden` (decorative duplicate).
- **TerminalWindow** - traffic-light chrome + titled bar; reused for hero boot, project
  card mockups, case-study architecture diagrams, and the 404.
- **ProjectCard** - terminal mockup on top, content below; hover lifts 1.5px with an amber
  glow shadow. Whole card is a stretched link to the case study.
- **Section** - shared shell: `$ command` eyebrow + display heading + content.
- **Nav** - fixed, blurred; desktop inline links, mobile full-screen opaque overlay
  (numbered), Escape + resize-past-breakpoint close it.
- **Reveal / Typing** - motion primitives, both gated on `prefers-reduced-motion`.

## Motion

Restrained by mandate (over-animation is an anti-reference).

- Hero: one orchestrated boot-then-reveal sequence on load. Not repeated elsewhere.
- Scroll: single rise-and-fade (`Reveal`) per section, `once: true`. No parallax, no scroll-jacking.
- Micro: card hover-lift, link underline, statusline mode flip. Small, purposeful.
- Ambient: one faint CRT vignette + grain layer. A skill marquee (pauses for reduced motion).
- **Every animation must survive `prefers-reduced-motion: reduce`** - all disabled there.

## Accessibility floor

Semantic landmarks and heading order; visible amber focus rings; skip link; Escape closes
the mobile menu; contrast verified (`dust` is the muted floor at 4.5:1); typing/marquee/
reveals all respect reduced motion; the decorative statusline is `aria-hidden`.

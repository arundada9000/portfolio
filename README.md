<div align="center">
  <img src="public/images/arun.png" alt="Arun Neupane" width="120" height="120" style="border-radius: 50%;" />
  <br />
  <br />

  # Arun Neupane - Portfolio

  **`/arundada9000`** - Frontend Developer · CTO @ Sajilo Digital · Nepal

  <br />

  [![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-amber?style=flat-square&logo=vercel&logoColor=white)](https://arunneupane.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js%2016-000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React%2019-000?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-000?style=flat-square&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20v4-000?style=flat-square&logo=tailwindcss&logoColor=06B6D4)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](LICENSE)

  <br />

  **[arunneupane.vercel.app](https://arunneupane.vercel.app)** &nbsp;·&nbsp; **[arun.sajilodigital.com.np](https://arun.sajilodigital.com.np)**

  <br />
</div>

---

## Overview

This is the personal portfolio of **Arun Neupane (arundada9000)** - a self-taught frontend developer from Butwal, Lumbini, Nepal, and CTO at Sajilo Digital Pvt. Ltd.

The design concept is a **late-night amber-phosphor terminal session**. The signature element is a vim-style statusline fixed to the bottom of every page, showing the current section as an open buffer, scroll progress, and a live Nepal-time clock (UTC+5:45).

### What it showcases

- **Production systems**: Disaster-response platform (Sajilo Sahayata), map-first room finder (Roomeo), terminal-driven company site (Sajilo Digital)
- **Case studies**: Architecture decisions, constraint-driven design, and lessons learned - documented for each featured project
- **Open source**: 70+ public repositories, algorithm visualizers, utilities, and learning-in-public artifacts
- **Technical depth**: React 19, Next.js 16 App Router, TypeScript strict mode, Tailwind CSS v4, Motion (Framer Motion), GSAP, PostGIS, WebAuthn

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Motion (Framer Motion) + GSAP |
| **Fonts** | Bricolage Grotesque, Instrument Sans, JetBrains Mono |
| **Deployment** | Vercel (zero-config) |

---

## Sections

| Section | Description |
|---|---|
| **Hero** | Animated name reveal, typing role switcher, ambient spotlight + dot-grid layers |
| **About** | Self-taught origin story, portrait, live stats (70+ repos, 3 production systems, 2+ years) |
| **Skills** | Category grids (Languages, Frontend, Backend, DevOps) + infinite marquee strip |
| **Projects** | Featured case-study cards with terminal mockups, architecture diagrams, technical decisions |
| **Gallery** | Real screenshot lightbox for every project |
| **Open Source** | Stats, pinned repos, contribution activity |
| **Experience** | Timeline: CTO @ Sajilo Digital, Vice Secretary @ Code for Change, independent projects, BSc CSIT |
| **Contact** | Form (Web3Forms) with terminal feedback + WhatsApp, LinkedIn, Email links |

---

## Running Locally

```bash
# install dependencies
pnpm install

# start dev server
pnpm dev          # → http://localhost:3000

# production build
pnpm build

# lint
pnpm lint
```

### Environment

Copy `.env.local.example` → `.env.local` and set `NEXT_PUBLIC_WEB3FORMS_KEY` for the contact form. Without it, the form degrades to a `mailto:` fallback.

---

## Project Structure

```
arun-portfolio/
├── public/
│   ├── images/           # Portrait, OG images
│   ├── screenshots/      # Project screenshots for gallery
│   └── arun-neupane-resume.pdf
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout + SEO/AEO JSON-LD
│   │   ├── page.tsx      # Home page composition
│   │   ├── not-found.tsx # Custom 404
│   │   ├── robots.ts     # robots.txt
│   │   ├── sitemap.ts    # sitemap.xml
│   │   └── work/         # Case study routes (/work/[slug])
│   ├── components/       # UI components (Hero, About, Skills, Projects, etc.)
│   └── lib/
│       └── data/         # All content: site, projects, skills, experience, gallery
├── LICENSE               # All Rights Reserved
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── .gitignore
└── package.json
```

### Customization

All content lives in `src/lib/data/` - edit the data files, not the components:

| File | What it drives |
|---|---|
| `src/lib/data/site.ts` | Name, roles (typing effect), email, socials, stats, deployed URL |
| `src/lib/data/projects.ts` | Featured projects + case studies + "more projects" grid |
| `src/lib/data/skills.ts` | Skills categories + marquee strip |
| `src/lib/data/experience.ts` | Timeline entries |
| `src/lib/data/gallery.ts` | Screenshot gallery |

---

## Deployment

Zero-config on **Vercel**:

```bash
vercel deploy
```

After deploying, update `site.url` in `src/lib/data/site.ts` to your production domain.

---

## License & Copyright

**All Rights Reserved.** This repository and its contents are the proprietary work of Arun Neupane. You may not copy, modify, distribute, or use this code for any purpose without explicit written permission. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>
    Built with ☕ and ⏰ past midnight · Nepal Time (UTC+5:45)
  </sub>
  <br />
  <sub>
    <a href="https://github.com/arundada9000">@arundada9000</a> ·
    <a href="mailto:arunneupane0000@gmail.com">Email</a> ·
    <a href="https://www.linkedin.com/in/arundada9000">LinkedIn</a>
  </sub>
</div>

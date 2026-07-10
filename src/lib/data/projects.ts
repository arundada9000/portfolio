export type CaseStudy = {
  problem: string;
  context: string;
  constraints: string[];
  /** rendered inside a terminal window as a data-flow diagram */
  architecture: string[];
  decisions: { title: string; body: string }[];
  results: string[];
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  /** one-line business / user outcome shown on the card */
  outcome: string;
  tech: string[];
  github: string;
  live?: string;
  stars?: number;
  featured: boolean;
  /** short fake terminal transcript shown as the card "mockup" */
  terminal: string[];
  /** key into src/lib/data/gallery.ts for real screenshots */
  galleryKey?: string;
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "sajilo-sahayata",
    title: "Sajilo Sahayata",
    year: "2025",
    summary:
      "Real-time disaster reporting and emergency coordination platform connecting citizens with local government responders across Nepal.",
    outcome:
      "Cuts incident-to-response delay with GPS auto-detection, offline-first reporting, and two-way SMS for areas with no data coverage.",
    tech: ["React", "Vite", "Tailwind v4", "Zustand", "TanStack Query", "Leaflet", "Node.js", "Express", "MongoDB", "Twilio", "Gemini"],
    github: "https://github.com/arundada9000/devnet",
    featured: true,
    galleryKey: "sajilosahayata",
    terminal: [
      "$ sahayata report --gps auto --photo flood.jpg",
      "  location detected: Tilottama-5, Rupandehi",
      "  offline → queued, will sync on reconnect",
      "✓ alert dispatched to ward office in 9 languages",
    ],
    caseStudy: {
      problem:
        "When a flood or landslide hits rural Nepal, reports reach local government through phone calls and hearsay. Responders lose the first critical hours confirming where the incident actually is, how severe it is, and who has already responded.",
      context:
        "Citizens on cheap Android phones with intermittent connectivity; ward-level officials with little technical training; nine local languages in one district. The platform had to work for both sides - a panicked citizen and an overloaded admin - at the same time.",
      constraints: [
        "Reports must survive zero connectivity - offline queue with auto-sync when the network returns.",
        "No-data fallback: emergencies can be submitted over plain SMS via Twilio, and admins can reply two-way.",
        "Multilingual by default - nine languages including Nepali, Hindi and Maithili, with AI-assisted translation via Google Gemini.",
        "Location must be captured automatically; asking a distressed user to type an address is a failure mode.",
      ],
      architecture: [
        "citizen PWA (React + Vite)",
        "  ├─ GPS + photo capture ──► report queue (offline-first)",
        "  ├─ queue ──sync──► Express API ──► MongoDB (geospatial index)",
        "  └─ SMS path ──► Twilio webhook ──► same report pipeline",
        "admin dashboard",
        "  ├─ Leaflet cluster map ◄── live reports",
        "  ├─ verification workflow ──► broadcast alerts (Web Push)",
        "  └─ analytics + safe-zone CRUD",
      ],
      decisions: [
        {
          title: "Offline-first, not offline-tolerant",
          body: "The report form writes to a local queue first and treats the network as an enhancement. Zustand holds the queue, and a sync worker drains it when connectivity returns - so the UX is identical online and offline.",
        },
        {
          title: "SMS as a first-class transport",
          body: "A separate Twilio ingestion path normalizes SMS submissions into the same report pipeline as the PWA, so admins triage one queue regardless of how the report arrived.",
        },
        {
          title: "Geospatial queries in the database",
          body: "MongoDB 2dsphere indexes power 'incidents near me' and cluster rendering, keeping the map fast instead of filtering thousands of reports in the browser.",
        },
      ],
      results: [
        "Full citizen-to-admin loop working end to end: report, verify, dispatch, broadcast.",
        "Nine-language support with AI-assisted translation and image analysis.",
        "Push notifications with deep links take responders straight to the incident on the map.",
        "Lesson: designing for the worst network first made the happy path trivial, not the other way around.",
      ],
    },
  },
  {
    slug: "sajilo-digital",
    title: "Sajilo Digital",
    year: "2025",
    summary:
      "Company website for the IT firm where I'm CTO - a cinematic, terminal-driven site built as an exploration of what a 2026 company site can be.",
    outcome:
      "Radical transparency as a sales tool: live development telemetry, system diagnostics, and a global command terminal instead of a static brochure.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "GSAP", "Framer Motion", "pnpm"],
    github: "https://github.com/arundada9000/sajilodigital",
    live: "https://sajilodigital.com.np",
    featured: true,
    galleryKey: "sajilodigital",
    terminal: [
      "$ sajilo --open",
      "  booting cinematic sequence… done",
      "  telemetry: 3 projects in flight",
      "> type `help` for site commands",
    ],
    caseStudy: {
      problem:
        "Every IT company site in the region looks the same: stock hero, three service cards, a contact form. For a firm selling technical excellence, the site itself is the portfolio - it had to prove capability instead of claiming it.",
      context:
        "I led architecture and frontend as CTO. The site doubles as our engineering showcase for clients who can't read code but can feel quality.",
      constraints: [
        "Cinematic animation without wrecking performance - GSAP timelines are orchestrated and lazy-mounted per section.",
        "A real command terminal for navigation that never blocks normal point-and-click users.",
        "Modular, strictly-typed codebase the rest of the team can extend without touching animation internals.",
      ],
      architecture: [
        "Next.js 16 App Router",
        "  ├─ RSC pages ──► section registry (modular, typed)",
        "  ├─ terminal layer ──► command parser ──► router / actions",
        "  ├─ GSAP timelines (client islands, lazy-mounted)",
        "  └─ telemetry feed ──► live project tracking widgets",
      ],
      decisions: [
        {
          title: "Terminal as progressive enhancement",
          body: "The command interface is a layer above conventional navigation, not a replacement. Every command has a clickable equivalent, so keyboard people get delight and everyone else never notices a barrier.",
        },
        {
          title: "Animation islands over global timelines",
          body: "Each section owns its GSAP context and cleans up on unmount. That kept scroll performance stable and let server components carry everything that doesn't move.",
        },
      ],
      results: [
        "Shipped as the company's production site at sajilodigital.com.np.",
        "Became the reference codebase for how we structure client work: strict TypeScript, modular sections, pnpm workspace discipline.",
        "Lesson: 'cinematic' is an information hierarchy problem before it is an animation problem.",
      ],
    },
  },
  {
    slug: "roomeo",
    title: "Roomeo",
    year: "2026",
    summary:
      "Map-first room and flat finder - real-time availability, smart filters, and location-based exploration for renters in Nepal.",
    outcome:
      "Replaces Facebook-group room hunting with a map you can actually search: PostGIS-backed 'near me' queries and landlord tooling in one app.",
    tech: ["Next.js 16", "TypeScript", "PostgreSQL", "PostGIS", "Prisma 7", "Leaflet", "Better Auth", "Zustand", "TanStack Query", "shadcn/ui"],
    github: "https://github.com/arundada9000/roomeo",
    live: "https://roomeo.vercel.app",
    featured: true,
    galleryKey: "roomeo",
    terminal: [
      "$ roomeo search --near butwal --max 12000",
      "  querying PostGIS… 23 units in radius",
      "  filters: attached bath, wifi, 2 rooms",
      "✓ 6 matches - opening map view",
    ],
    caseStudy: {
      problem:
        "Room hunting in Nepali cities happens in Facebook groups and word of mouth: no map, no filters, no way to know if a listing is still available. Renters waste days calling numbers on expired posts.",
      context:
        "Three user roles with different jobs: renters exploring by location, landlords managing properties and units, and admins moderating listings. The map is the product - everything else supports it.",
      constraints: [
        "Location queries had to be real geography, not bounding-box hacks - PostgreSQL + PostGIS from day one.",
        "Strict TypeScript end to end: Prisma schema as the single source of truth for types.",
        "Mobile-first: the map with a bottom-sheet list mirrors how people actually browse on phones.",
      ],
      architecture: [
        "Next.js 16 App Router (strict TS)",
        "  ├─ map view (Leaflet) ◄── viewport query ──► PostGIS radius search",
        "  ├─ grid view + filter sidebar ──► TanStack Query cache",
        "  ├─ Better Auth ──► role gates (renter / landlord / admin)",
        "  └─ landlord dashboard ──► Prisma 7 ──► PostgreSQL 16",
      ],
      decisions: [
        {
          title: "Map-first, list-second",
          body: "The primary browse surface is the map with a draggable bottom sheet, not a grid with a map tab. Viewport changes drive the query, so panning the map is searching.",
        },
        {
          title: "PostGIS over client-side filtering",
          body: "Distance and radius queries run in the database with spatial indexes. The client never downloads the full listing set, which keeps the map responsive as inventory grows.",
        },
      ],
      results: [
        "Live at roomeo.vercel.app with full renter, landlord, and admin flows.",
        "Favorites, unit galleries, and moderation dashboard shipped in the first release.",
        "Lesson: modeling geography properly in the database eliminated an entire class of frontend complexity.",
      ],
    },
  },
  {
    slug: "easy-sorting",
    title: "Easy Sorting",
    year: "2024",
    summary:
      "Sorting algorithms visualized step by step - built from scratch in vanilla HTML, CSS, and JavaScript, no libraries.",
    outcome:
      "Turns textbook pseudocode into something you can watch: fellow CSIT students use it to see what bubble sort actually does before an exam.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/arundada9000/Sorting",
    live: "https://easysorting.netlify.app",
    stars: 2,
    featured: true,
    galleryKey: "sorting",
    terminal: [
      "$ sort visualize --algo bubble --n 40",
      "  comparing a[3] ⇄ a[4]… swap",
      "  pass 2/39 complete",
      "✓ sorted in 780 steps - replay?",
    ],
    caseStudy: {
      problem:
        "Data-structures courses teach sorting as pseudocode on a slide. Most students memorize the steps without ever seeing the array move - and it shows in exams and interviews.",
      context:
        "Built during my BSc CSIT while studying DSA myself. The goal was a tool I would have wanted: pick an algorithm, watch every comparison and swap, control the speed.",
      constraints: [
        "Zero dependencies - every animation frame, timer, and state transition written by hand in vanilla JS.",
        "Step-accurate visualization: the animation must reflect the real algorithm, not a look-alike.",
        "Runs smoothly on the low-end laptops most students actually have.",
      ],
      architecture: [
        "vanilla JS core",
        "  ├─ algorithm runner ──► emits step events (compare / swap)",
        "  ├─ renderer ──► DOM bars, batched updates",
        "  └─ controls ──► speed, size, algorithm select, replay",
      ],
      decisions: [
        {
          title: "Algorithms emit steps, the renderer replays them",
          body: "Each sort runs to completion producing a step log, and the visualizer plays it back. That separation made every new algorithm a pure function - no animation code inside the sort.",
        },
      ],
      results: [
        "Live at easysorting.netlify.app and used by classmates preparing for DSA exams.",
        "The step-event pattern became my template for the later Stack visualizer.",
        "Lesson: building the visualizer taught me more about sorting than the course did.",
      ],
    },
  },
  // --- more projects (grid, no case study) ---
  {
    slug: "color-picker",
    title: "Color Picker",
    year: "2025",
    summary: "Extract colors from images and generate ready-to-paste CSS and Tailwind snippets.",
    outcome: "Screenshot to design token in one click.",
    tech: ["TypeScript", "React"],
    github: "https://github.com/arundada9000/color-picker",
    stars: 1,
    featured: false,
    terminal: [],
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    year: "2024",
    summary: "Real-time conversion across length, mass, temperature and more.",
    outcome: "Every unit system in one tool, no page reloads.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/arundada9000/Unit-Converter",
    live: "https://allunitconverter.netlify.app",
    stars: 2,
    featured: false,
    terminal: [],
  },
  {
    slug: "qr-toolkit",
    title: "QR Creator & Scanner",
    year: "2024",
    summary: "Create, scan, and save QR codes - fully client-side, nothing leaves the browser.",
    outcome: "Privacy-friendly QR tooling with zero backend.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/arundada9000/Qr-code-scanner-and-generator",
    live: "https://easyqrcreate.netlify.app",
    stars: 2,
    featured: false,
    terminal: [],
  },
  {
    slug: "stack-visualizer",
    title: "Stack Visualizer",
    year: "2024",
    summary: "Step-by-step stack data structure visualization with the matching code alongside.",
    outcome: "Push and pop, watched in slow motion.",
    tech: ["JavaScript", "CSS"],
    github: "https://github.com/arundada9000/stack",
    live: "https://easystack.netlify.app",
    stars: 2,
    featured: false,
    terminal: [],
  },
  {
    slug: "code-for-change",
    title: "Code for Change",
    year: "2025",
    summary: "Official website for Code for Change Rupandehi, the community I serve as Vice Secretary.",
    outcome: "The org's public face, built and maintained by its own members.",
    tech: ["JavaScript", "React"],
    github: "https://github.com/arundada9000/Code-for-Change",
    stars: 1,
    featured: false,
    terminal: [],
  },
  {
    slug: "pseudorandom",
    title: "Random Toolkit",
    year: "2024",
    summary: "Random numbers, passwords, coin tosses and dice throws in one utility.",
    outcome: "Entropy for everyday decisions.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/arundada9000/Random-Number",
    live: "https://pseudorandom.netlify.app",
    featured: false,
    terminal: [],
  },
  {
    slug: "cr7-tribute",
    title: "CR7 Tribute",
    year: "2024",
    summary: "A Cristiano Ronaldo tribute site - my most-starred repo, naturally.",
    outcome: "Proof that passion projects travel furthest.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/arundada9000/Cr7",
    stars: 3,
    featured: false,
    terminal: [],
  },
  {
    slug: "device-information",
    title: "Device Information",
    year: "2024",
    summary: "Everything the Navigator API knows about your device, laid bare.",
    outcome: "A privacy lesson disguised as a utility.",
    tech: ["JavaScript"],
    github: "https://github.com/arundada9000/Device-Information",
    stars: 2,
    featured: false,
    terminal: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

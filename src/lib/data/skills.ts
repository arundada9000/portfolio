export type SkillCategory = {
  id: string;
  label: string;
  /** shown as the mono "path" of the category, terminal-style */
  path: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    path: "~/skills/languages",
    skills: ["JavaScript", "TypeScript", "C / C++", "Python", "SQL"],
  },
  {
    id: "frontend",
    label: "Frontend",
    path: "~/skills/frontend",
    skills: [
      "React 19",
      "Next.js 16",
      "Tailwind CSS v4",
      "HTML & CSS",
      "Zustand",
      "TanStack Query",
      "GSAP",
      "Framer Motion",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    path: "~/skills/backend",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Prisma", "WebAuthn"],
  },
  {
    id: "devops",
    label: "Tools & DevOps",
    path: "~/skills/devops",
    skills: ["Git & GitHub", "Vercel", "Netlify", "pnpm", "VS Code", "Leaflet / PostGIS"],
  },
];

/** Flat list for the marquee strip */
export const marqueeSkills = skillCategories.flatMap((c) => c.skills);

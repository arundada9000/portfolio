export type Experience = {
  role: string;
  org: string;
  url?: string;
  // NOTE: confirm/adjust start dates - inferred from public profiles
  period: string;
  description: string;
  tech: string[];
};

export const experience: Experience[] = [
  {
    role: "CTO / Lead Architect",
    org: "Sajilo Digital Pvt. Ltd.",
    url: "https://sajilodigital.com.np",
    period: "2025 - Present",
    description:
      "Leading architecture and engineering for client production systems: a case management system deployed for Nepal Police, a WebAuthn biometric authentication platform for a national NGO, and the company's terminal-driven website.",
    tech: ["Next.js", "React 19", "TypeScript", "Node.js", "PostgreSQL", "WebAuthn"],
  },
  {
    role: "Vice Secretary",
    org: "Code for Change Rupandehi",
    url: "https://github.com/arundada9000/Code-for-Change",
    period: "2024 - Present",
    description:
      "Community tech organization. Wrote and taught a 6-day core React training curriculum, ran Git & GitHub workshops, built the official website, and shipped the Code Olympiad 2081 competition platform for BMC IT Club.",
    tech: ["React", "JavaScript", "Git", "Teaching"],
  },
  {
    role: "Self-taught → shipping",
    org: "Independent projects",
    url: "https://github.com/arundada9000",
    period: "2023 - 2024",
    description:
      "From first HTML course to 70+ public repositories: algorithm visualizers, converters, QR tooling, and a disaster-reporting PWA. Winner of CodeOlympiad 2080. Learned in public, deployed everything.",
    tech: ["JavaScript", "HTML", "CSS", "React", "Netlify"],
  },
  {
    role: "BSc. CSIT",
    org: "Bhairahawa Multiple Campus",
    period: "2021 - Present",
    description:
      "Computer Science & Information Technology. The DSA coursework became visualizer side-projects; the side-projects became a career.",
    tech: ["C", "C++", "DSA", "Databases"],
  },
];

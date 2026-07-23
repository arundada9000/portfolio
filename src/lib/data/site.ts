export const site = {
  deployed: "2026-07-10 13:49 NPT",
  name: "Arun Neupane",
  alias: "arundada9000",
  role: "Frontend Developer",
  // Rotating roles for the hero typing effect
  roles: [
    "Frontend Developer",
    "React & Next.js Engineer",
    "CTO @ Sajilo Digital",
    "Open Source Contributor",
  ],
  tagline: "I like to code till I don't like to code. (It never happens.)",
  location: "Butwal, Lumbini, Nepal",
  timezone: "Asia/Kathmandu",
  email: "arunneupane0000@gmail.com",
  phone: "+977 9811420975",
  // digits only, for wa.me links (no +, spaces, or dashes)
  whatsapp: "9779811420975",
  linkedin: "https://www.linkedin.com/in/arundada9000",
  github: "https://github.com/arundada9000",
  // Web3Forms access key - routes contact submissions straight to email.
  // Public by design (same key used on the previous portfolio). Override
  // with NEXT_PUBLIC_WEB3FORMS_KEY in .env.local if you rotate it.
  web3formsKey: "a70b99ba-e904-480f-9f8b-e420787fbc0d",
  company: {
    name: "Sajilo Digital Pvt. Ltd.",
    role: "CTO / Lead Architect",
    url: "https://sajilodigital.com.np",
  },
  // Primary deployment; alt is the Sajilo Digital subdomain
  url: "https://arunneupane.vercel.app",
  altUrl: "https://arun.sajilodigital.com.np",
  resume: "/arun-neupane-resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/arundada9000", handle: "@arundada9000" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arundada9000", handle: "in/arundada9000" },
    { label: "X", href: "https://x.com/arundada9000", handle: "@arundada9000" },
    { label: "YouTube", href: "https://www.youtube.com/@arundada9000", handle: "@arundada9000" },
    { label: "WhatsApp", href: "https://wa.me/9779811420975?text=Hi%20Arun%2C%20I%20saw%20your%20portfolio", handle: "+977 9811420975" },
    { label: "Email", href: "mailto:arunneupane0000@gmail.com", handle: "arunneupane0000@gmail.com" },
    { label: "Instagram", href: "https://www.instagram.com/arundada9000/", handle: "@arundada9000" },
    { label: "Facebook", href: "https://www.facebook.com/arundada9000/", handle: "arundada9000" },
  ],
  stats: [
    { value: "70+", label: "public repositories" },
    { value: "3", label: "production systems shipped" },
    { value: "2+", label: "years building for the web" },
    { value: "1 AM", label: "average commit hour (NPT)" },
  ],
} as const;

export type Social = (typeof site.socials)[number];

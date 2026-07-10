import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/data/site";
import { skillCategories } from "@/lib/data/skills";
import { Nav } from "@/components/Nav";
import { StatusLine } from "@/components/StatusLine";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { BackToTop } from "@/components/BackToTop";
import { ContextMenu } from "@/components/ContextMenu";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { DevConsole } from "@/components/DevConsole";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const IDENTITY_DESC =
  "Arun Neupane - also known as arundada9000 - is a self-taught frontend developer and coder from Butwal, Lumbini, Nepal, and CTO at Sajilo Digital. Arun builds production React, Next.js and TypeScript systems: a police case-management system, the Code for Change Nepal platform, and disaster-response apps.";

const IDENTITY_DESC_SHORT = "Arun Neupane (arundada9000): self-taught frontend developer from Nepal. CTO at Sajilo Digital. React, Next.js, TypeScript.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: `${site.name} - Portfolio`,
  title: {
    default: `${site.name} (arundada9000) - Frontend Developer & Coder from Nepal`,
    template: `%s - ${site.name}`,
  },
  description: IDENTITY_DESC,
  keywords: [
    "Arun Neupane",
    "Arun",
    "Arun coder",
    "Arun from Nepal",
    "Arun Neupane Nepal",
    "Arun Neupane developer",
    "Arun developer Nepal",
    "arundada9000",
    "Arun CTO Sajilo Digital",
    "frontend developer Nepal",
    "React developer Nepal",
    "Next.js developer",
    "TypeScript developer Butwal",
    "Sajilo Digital CTO",
    "Nepali frontend developer",
    "React Nepal",
    "Next.js Nepal portfolio",
    "hire frontend developer Nepal",
    "freelance React developer Nepal",
    "web developer Butwal",
    "Sajilo Sahayata disaster app",
    "Roomeo room finder",
    "Code for Change Nepal",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: { canonical: site.url },
  openGraph: {
    type: "profile",
    url: site.url,
    siteName: `${site.name} - Portfolio`,
    title: `${site.name} (arundada9000) - Frontend Developer & Coder from Nepal`,
    description: IDENTITY_DESC,
    locale: "en_US",
    firstName: "Arun",
    lastName: "Neupane",
    username: site.alias,
    images: [{ url: `${site.url}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - Frontend Developer & Coder from Nepal`,
    description: IDENTITY_DESC_SHORT,
    images: [`${site.url}/opengraph-image`],
  },
  other: {
    "theme-color": "#0a0e15",
    "color-scheme": "dark",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ── AEO / SEO entity graph ────────────────────────────────────────────────
// A cross-linked @graph so search engines and AI answer engines resolve
// "Arun Neupane", "Arun from Nepal", "Arun coder" → this one person entity.
const PERSON_ID = `${site.url}/#arun`;
const ORG_ID = `${site.company.url}/#sajilodigital`;
const SITE_ID = `${site.url}/#website`;

const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.name,
      givenName: "Arun",
      familyName: "Neupane",
      alternateName: ["Arun", "arundada9000", "Arun Neupane Nepal", "Arun the coder", "Arun from Nepal"],
      description: IDENTITY_DESC,
      url: site.url,
      mainEntityOfPage: site.url,
      image: `${site.url}/images/arun.png`,
      email: `mailto:${site.email}`,
      telephone: site.phone,
      gender: "Male",
      birthPlace: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Butwal", addressRegion: "Lumbini", addressCountry: "NP" } },
      jobTitle: ["Frontend Developer", "CTO", "Lead Architect", "Full-Stack Engineer"],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Frontend Developer",
          occupationalCategory: "15-1254.00 Web Developers",
          skills: "React, Next.js, TypeScript, Node.js, PostgreSQL, WebAuthn",
        },
        {
          "@type": "Occupation",
          name: "Chief Technology Officer",
          occupationalCategory: "11-9041.00",
          skills: "Technical architecture, team leadership, full-stack development",
        },
      ],
      worksFor: { "@id": ORG_ID },
      memberOf: [
        { "@type": "Organization", name: "Code for Change Rupandehi", url: "https://github.com/arundada9000/Code-for-Change" },
        { "@type": "Organization", name: "BMCIT Club" },
      ],
      alumniOf: { "@type": "CollegeOrUniversity", name: "Bhairahawa Multiple Campus", url: "https://bmc.tu.edu.np" },
      nationality: { "@type": "Country", name: "Nepal" },
      homeLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Butwal",
          addressRegion: "Lumbini",
          addressCountry: "NP",
        },
      },
      knowsLanguage: ["English", "Nepali", "Hindi"],
      knowsAbout: [
        "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express.js",
        "PostgreSQL", "MongoDB", "Prisma", "WebAuthn", "Tailwind CSS", "GSAP",
        "Framer Motion", "Motion", "Frontend development", "Full-stack web development",
        "Offline-first PWA", "Geospatial search", "PostGIS", "REST API design",
        "Git & GitHub", "Docker", "Vercel", "Netlify", "Responsive design",
        "Web accessibility", "SEO", "Technical teaching",
      ],
      award: [
        "InnovateX National Hackathon - Winner",
        "CodeOlympiad 2080 - Winner",
        "Girls in ICT Coding Competition - Winner",
      ],
      sameAs: [
        site.altUrl,
        ...site.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
      ],
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.company.name,
      url: site.company.url,
      description: "IT company based in Nepal delivering production web systems: case management, WebAuthn biometric authentication, terminal-driven websites.",
      founder: { "@id": PERSON_ID },
      employee: { "@id": PERSON_ID },
      foundingDate: "2025",
      address: { "@type": "PostalAddress", addressLocality: "Butwal", addressRegion: "Lumbini", addressCountry: "NP" },
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: site.url,
      name: `${site.name} - Portfolio`,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profilepage`,
      url: site.url,
      name: `${site.name} - Portfolio`,
      isPartOf: { "@id": SITE_ID },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      dateModified: new Date().toISOString(),
    },
    {
      "@type": "ItemList",
      "@id": `${site.url}/#skills`,
      url: `${site.url}/#skills`,
      name: "Skills & Technologies",
      description: "A comprehensive list of Arun Neupane's technical skills and technologies.",
      numberOfItems: skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0),
      itemListElement: skillCategories.flatMap((category, ci) =>
        category.skills.map((skill, si) => ({
          "@type": "ListItem",
          position: ci * 100 + si + 1,
          name: skill,
          description: `${skill} - ${category.label}`,
        })),
      ),
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Arun Neupane?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arun Neupane (arundada9000) is a self-taught frontend developer and coder from Butwal, Nepal, and the CTO of Sajilo Digital. He builds production React, Next.js and TypeScript web systems.",
          },
        },
        {
          "@type": "Question",
          name: "Where is Arun Neupane from?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arun Neupane is from Butwal, Lumbini Province, Nepal.",
          },
        },
        {
          "@type": "Question",
          name: "What does Arun Neupane do?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arun is a frontend developer and CTO at Sajilo Digital. He specialises in React, Next.js and TypeScript, and has built a police case-management system, the Code for Change Nepal platform, disaster-response apps, and map-first products.",
          },
        },
        {
          "@type": "Question",
          name: "How can I contact Arun Neupane?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `You can reach Arun by email at ${site.email}, on WhatsApp at ${site.phone}, or via his portfolio at ${site.url}.`,
          },
        },
        {
          "@type": "Question",
          name: "What projects has Arun Neupane built?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arun built Sajilo Sahayata (disaster reporting PWA with offline sync), Roomeo (PostGIS-powered room finder), Sajilo Digital (terminal-driven company site), a police case-management system for Nepal Police, Easy Sorting (algorithm visualizer), and the Code for Change Nepal platform.",
          },
        },
        {
          "@type": "Question",
          name: "Is Arun Neupane available for hire?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Arun is open to freelance projects, full-time roles, and React/Next.js consulting. He can be reached at arunneupane0000@gmail.com.",
          },
        },
        {
          "@type": "Question",
          name: "What technologies does Arun Neupane use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arun works with React 19, Next.js 16, TypeScript, Tailwind CSS v4, Node.js, Express, PostgreSQL, MongoDB, Prisma, WebAuthn, GSAP, Framer Motion, and Leaflet/PostGIS.",
          },
        },
        {
          "@type": "Question",
          name: "What is arundada9000?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "arundada9000 is the GitHub username and online alias of Arun Neupane, a frontend developer from Nepal.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="crt min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
        />
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-amber focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-night"
        >
          Skip to content
        </a>
        <Preloader />
        <ScrollProgress />
        <Nav />
        <div className="relative z-10 flex-1">{children}</div>
        <Footer />
        <StatusLine />
        <CommandPalette />
        <KeyboardShortcuts />
        <ContextMenu />
        <BackToTop />
        <CustomCursor />
        <DevConsole />
      </body>
    </html>
  );
}

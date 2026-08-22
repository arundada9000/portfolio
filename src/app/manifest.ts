import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} (arundada9000) - Frontend Developer & Coder`,
    short_name: site.name,
    description:
      "Portfolio of Arun Neupane (arundada9000), frontend developer and CTO at Sajilo Digital, Nepal.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e15",
    theme_color: "#0a0e15",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Selected Work & Case Studies",
        short_name: "Work",
        description: "View production systems and architecture case studies",
        url: "/#work",
      },
      {
        name: "Screenshot Gallery (69+ Screens)",
        short_name: "Gallery",
        description: "Browse full project screenshots with lightbox",
        url: "/#gallery",
      },
      {
        name: "Open Source (70+ Repos)",
        short_name: "Open Source",
        description: "Explore public repositories and GitHub activity",
        url: "/#open-source",
      },
      {
        name: "Contact Arun Neupane",
        short_name: "Contact",
        description: "Get in touch for freelance, consulting, or full-time roles",
        url: "/#contact",
      },
    ],
  };
}

import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} - Portfolio`,
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
  };
}

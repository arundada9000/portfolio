import type { MetadataRoute } from "next";
import { featuredProjects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";

const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: NOW, changeFrequency: "monthly", priority: 1 },
    ...featuredProjects
      .filter((p) => p.caseStudy)
      .map((p) => ({
        url: `${site.url}/work/${p.slug}`,
        lastModified: NOW,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}

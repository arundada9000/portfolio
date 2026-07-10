import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/llms.txt" },
      { userAgent: "Googlebot", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

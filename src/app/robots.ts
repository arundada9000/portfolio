import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/music/", "/pdf/"] },
      { userAgent: "GPTBot", allow: "/llms.txt" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/my-images/" },
    ],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/image-sitemap`],
  };
}

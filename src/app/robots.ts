import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/music/"] },
      { userAgent: "GPTBot", allow: ["/", "/llms.txt"] },
      { userAgent: "Claude-Web", allow: ["/", "/llms.txt"] },
      { userAgent: "anthropic-ai", allow: ["/", "/llms.txt"] },
      { userAgent: "PerplexityBot", allow: ["/", "/llms.txt"] },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: ["/my-images/", "/screenshots/", "/images/"] },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
    ],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/image-sitemap`],
    host: site.url,
  };
}

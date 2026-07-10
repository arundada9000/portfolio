import { site } from "@/lib/data/site";

const IMAGE_URLS = [
  { url: "/my-images/about.jpg", caption: "Arun Neupane portrait in casual setting", title: "Arun Neupane - professional portrait" },
  { url: "/my-images/arun-suit.jpg", caption: "Arun Neupane in formal suit", title: "Arun Neupane - formal portrait" },
  { url: "/my-images/arun-profile.png", caption: "Arun Neupane clean profile cutout", title: "Arun Neupane - profile picture" },
  { url: "/my-images/arun-classroom.jpg", caption: "Arun Neupane in classroom setting", title: "Arun Neupane in class" },
];

export async function GET() {
  const urls = IMAGE_URLS.map(
    (img) => `  <url>
    <loc>${site.url}</loc>
    <image:image>
      <image:loc>${site.url}${img.url}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
    </image:image>
  </url>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=UTF-8" },
  });
}

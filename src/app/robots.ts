import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Anything disallowed here must also be absent from the XML sitemap
        // (see `publicPagesConfig` in src/lib/sitemap-data.ts) — submitting a URL
        // for indexing while blocking its crawl is a contradictory signal.
        //
        // `/book` is deliberately NOT listed. It is linked from the Navbar on every
        // page, so Google will always discover it; a Disallow would only stop the
        // crawl, not the indexing, producing "Indexed, though blocked by robots.txt"
        // with no snippet. It is kept out of the index by `noindex` in
        // src/app/(pages)/book/layout.tsx instead — which only works if the crawler
        // is allowed to fetch the page and read the tag. Do not re-add it here.
        disallow: ["/dashboard/", "/api/", "/login", "/register", "/profile"],
      },
    ],
    // Must come from SITE_URL, the single source of truth for the canonical domain
    // (src/lib/site.ts). Advertising a www sitemap while every <loc> inside it is
    // non-www costs crawlers a redirect hop and contradicts the canonicals.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

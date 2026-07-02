/**
 * SINGLE SOURCE OF TRUTH for the site's canonical (production) URL.
 *
 * Every file that needs the domain (layout, robots.ts, sitemap, seo.ts,
 * blog pages, etc.) must import SITE_URL or absoluteUrl from here.
 * Never hardcode the domain anywhere else in the codebase again —
 * that's what caused the "Duplicate without user-selected canonical"
 * error in Google Search Console.
 *
 * IMPORTANT: Set NEXT_PUBLIC_SITE_URL in your production environment
 * (Vercel/host dashboard) to exactly the domain you want Google to treat
 * as canonical — including whether it has "www." or not.
 */

const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.waywisetech.com"
    : "http://localhost:3000");

export const SITE_URL = rawUrl.replace(/\/+$/, "");

/**
 * Build an absolute URL for a given path using SITE_URL.
 * absoluteUrl()            -> "https://www.waywisetech.com"
 * absoluteUrl("/")         -> "https://www.waywisetech.com"
 * absoluteUrl("/about-us") -> "https://www.waywisetech.com/about-us"
 */
export function absoluteUrl(path?: string): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
import { MetadataRoute } from "next";
import { GroupedSitemapEntry } from "./sitemap-groups";
import { servicesData } from "@/datas/services";
import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

/**
 * MAINTENANCE NOTE — `lastModified` / <lastmod>
 *
 * Never derive these from `new Date()` at build or request time. A sitemap where every
 * <lastmod> carries the deploy timestamp tells crawlers "everything changed" on every
 * deploy, which trains them to ignore the field entirely and defeats its only purpose:
 * telling Google which pages are actually worth re-crawling.
 *
 * These dates are the real content-update dates, seeded from git history of each route's
 * page + component sources. When you change a page's *visible content*, bump that page's
 * date here. Purely technical edits (refactors, styling, dependency bumps) should NOT
 * bump it — <lastmod> means "the content changed", not "the file changed".
 *
 * Blog posts are exempt: they take `updatedAt` straight from the API, which is the
 * correct per-record source of truth.
 */

// Fallback for a route added to the site but not yet listed below. Deliberately a fixed
// date, not `new Date()` — a stale date is a far smaller problem than a lying one.
const CONTENT_BASELINE = "2026-08-17";

const toDate = (isoDay: string) => new Date(`${isoDay}T00:00:00.000Z`);

// Helper to get image URL
const getImageUrl = (
	image: { src?: string } | string | undefined
): string | null => {
	if (!image) return null;
	if (typeof image === "string") {
		if (image.startsWith("http")) return image;
		return image.startsWith("/") ? `${baseUrl}${image}` : `${baseUrl}/${image}`;
	}
	if (image && typeof image === "object" && image !== null) {
		const src = (image as { src?: unknown }).src;
		if (typeof src === "string" && src.length > 0) {
			if (src.startsWith("http")) return src;
			return src.startsWith("/") ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
		}
	}
	return null;
};

// Public pages configuration.
//
// Only indexable pages belong here. A page must NOT appear if it is either listed in the
// `disallow` array of `src/app/robots.ts` or marked `robots: { index: false }` in its own
// metadata — submitting a URL for indexing while telling crawlers not to index it is a
// contradictory signal and gets flagged as a sitemap error. That is why /book is absent:
// it is a bare third-party flip-book iframe, held out of the index by `noindex` in
// `src/app/(pages)/book/layout.tsx`.
const publicPagesConfig: Array<{
	path: string;
	label: string;
	priority: number;
	changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
	lastModified: string;
}> = [
	{ path: "/", label: "Home", priority: 1.0, changeFrequency: "daily", lastModified: "2026-08-17" },
	{ path: "/about-us", label: "About Us", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-17" },
	{ path: "/contact-us", label: "Contact Us", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-10" },
	{ path: "/services", label: "Services", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-08-17" },
	{ path: "/microsoft-support", label: "Microsoft Support", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-10" },
	{ path: "/medical-it-support", label: "Medical Billing & RCM", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-10" },
	{ path: "/faq", label: "FAQ", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-08-17" },
	{ path: "/privacy-policy", label: "Privacy Policy", priority: 0.5, changeFrequency: "yearly", lastModified: "2026-08-10" },
	{ path: "/terms-and-conditions", label: "Terms and Conditions", priority: 0.5, changeFrequency: "yearly", lastModified: "2026-08-10" },
	{ path: "/blog", label: "Blog", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-08-10" },
	{ path: "/sitemap-page", label: "Sitemap", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-08-12" },
];

// Content-update date per service page, keyed by `service.url`. Bump when you edit that
// service's copy in `src/datas/services.ts`.
const servicePagesLastModified: Record<string, string> = {
	"/services/web-application": "2026-08-17",
	"/services/mobile-application": "2026-08-17",
	"/services/ai-integration": "2026-08-17",
	"/services/graphics-design": "2026-08-17",
	"/services/digital-marketing": "2026-08-17",
	"/services/cloud-engineering": "2026-08-17",
};

export async function getAllSitemapEntries(): Promise<GroupedSitemapEntry[]> {
	const entries: GroupedSitemapEntry[] = [];

	// Add public pages
	publicPagesConfig.forEach((page) => {
		entries.push({
			url: `${baseUrl}${page.path}`,
			lastModified: toDate(page.lastModified),
			changeFrequency: page.changeFrequency,
			priority: page.priority,
			group: "public-pages",
			groupLabel: "Public Pages",
		});
	});

	// Add service pages. Images belong here as per-entry `images` (which Next.js emits as
	// <image:image> children of this <url>) — never as standalone <url> entries of their own.
	servicesData.forEach((service) => {
		const imageUrls: string[] = [];
		const bgUrl = getImageUrl(service.bgImage);
		const videoUrl = getImageUrl(service.videoImage);
		const iconUrl = getImageUrl(service.icon);

		if (bgUrl) imageUrls.push(bgUrl);
		if (videoUrl) imageUrls.push(videoUrl);
		if (iconUrl) imageUrls.push(iconUrl);

		entries.push({
			url: `${baseUrl}${service.url}`,
			lastModified: toDate(servicePagesLastModified[service.url] ?? CONTENT_BASELINE),
			changeFrequency: "weekly",
			priority: 0.9,
			images: imageUrls.length > 0 ? imageUrls : undefined,
			group: "service-pages",
			groupLabel: "Services",
		});
	});

	// Fetch and add blog pages
	try {
		const baseApi = process.env.NEXT_PUBLIC_BASE_API;
		if (baseApi) {
			const response = await fetch(`${baseApi}/blogs/public`, {
				cache: "no-store",
			});
			if (response.ok) {
				const data = await response.json();
				const blogs = data.data || [];

				blogs.forEach((blog: { slug: string; updatedAt?: string; featuredImage?: string }) => {
					const imageUrls: string[] = [];
					if (blog.featuredImage) {
						imageUrls.push(blog.featuredImage);
					}

					entries.push({
						url: `${baseUrl}/blog/${blog.slug}`,
						lastModified: blog.updatedAt
							? new Date(blog.updatedAt)
							: toDate(CONTENT_BASELINE),
						changeFrequency: "weekly",
						priority: 0.7,
						images: imageUrls.length > 0 ? imageUrls : undefined,
						group: "blog-pages",
						groupLabel: "Blog",
					});
				});
			}
		}
	} catch {
		// Silent fail - blogs will be excluded if API is unavailable
	}

	return entries;
}

// For XML sitemap generation: same entries, minus the grouping metadata that only the
// human-readable /sitemap-page needs.
export async function getXmlSitemapEntries(): Promise<MetadataRoute.Sitemap> {
	const grouped = await getAllSitemapEntries();
	return grouped.map(({ group, groupLabel, ...entry }) => entry);
}

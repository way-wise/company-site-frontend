import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_BASE_API || process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api/v1";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://waywisetech.com";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function getCanonicalUrl(path?: string): string {
  let url = path ? `${BASE_URL}${path}` : BASE_URL;
  
  if (IS_PRODUCTION) {
    url = url.replace("://", "://www.").replace("://www.www.", "://www.");
  }
  
  return url;
}

export interface SeoData {
  id: string;
  pageSlug: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  isActive: boolean;
}

interface SeoResponse {
  success: boolean;
  data: SeoData | null;
}

export async function getSeoBySlug(slug: string): Promise<SeoData | null> {
  try {
    const response = await fetch(`${API_URL}/seo/slug/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const result: SeoResponse = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Error fetching SEO for slug "${slug}":`, error);
    return null;
  }
}

export function generatePageMetadata(
  seo: SeoData | null,
  fallback: {
    title: string;
    description: string;
    keywords?: string[];
    path?: string;
  }
): Metadata {
  const siteName = "Way Wise Tech";

  const canonicalUrlFallback = getCanonicalUrl(fallback.path);

  if (!seo) {
    return {
      title: fallback.title,
      description: fallback.description,
      keywords: fallback.keywords,
      authors: [{ name: siteName }],
      creator: siteName,
      publisher: siteName,
      alternates: {
        canonical: canonicalUrlFallback,
      },
      openGraph: {
        type: "website",
        siteName: siteName,
        locale: "en_US",
        url: canonicalUrlFallback,
        title: fallback.title,
        description: fallback.description,
      },
      twitter: {
        card: "summary_large_image",
        site: "@waywisetech",
        creator: "@waywisetech",
        title: fallback.title,
        description: fallback.description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }

  const canonicalUrl = seo.canonicalUrl || canonicalUrlFallback;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords || fallback.keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: siteName,
      locale: "en_US",
      url: canonicalUrl,
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage,
              width: 1200,
              height: 630,
              alt: seo.metaTitle,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@waywisetech",
      creator: "@waywisetech",
      title: seo.twitterTitle || seo.metaTitle,
      description: seo.twitterDescription || seo.metaDescription,
      images: seo.twitterImage ? [seo.twitterImage] : [],
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
      googleBot: {
        index: seo.robotsIndex,
        follow: seo.robotsFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export async function getDynamicMetadata(
  slug: string,
  fallback: {
    title: string;
    description: string;
    keywords?: string[];
    path?: string;
  }
): Promise<Metadata> {
  const seo = await getSeoBySlug(slug);
  return generatePageMetadata(seo, fallback);
}

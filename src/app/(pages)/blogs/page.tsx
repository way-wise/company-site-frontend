import { Blog } from "@/schema/blogSchema";
import type { Metadata } from "next";
import { BlogList } from "../_components/blogs/blog-list";

async function getAllBlogs(): Promise<Blog[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const url = `${baseUrl}/blogs/public`;

    const response = await fetch(url, {
      cache: "no-store", // Always fetch fresh data to show new published blogs immediately
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

// SEO Metadata
export const metadata: Metadata = {
  title: "Luxury Car & Limo Service Blog | Escalade4LAX Los Angeles",
  description:
    "Explore travel tips, LAX airport guides, and insights on luxury limo and car services in Los Angeles. Stay updated with Escalade4LAX premium ride news",
  keywords: [
    "blog",
    "travel tips",
    "LAX airport guides",
    "Los Angeles",
    "LAX airport",
    "luxury limo service",
    "car service Los Angeles",
    "Escalade4LAX",
  ],
  openGraph: {
    title: "Luxury Car & Limo Service Blog | Escalade4LAX Los Angeles",
    description:
      "Explore travel tips, LAX airport guides, and insights on luxury limo and car services in Los Angeles. Stay updated with Escalade4LAX premium ride news",
    type: "website",
    url: "/blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Car & Limo Service Blog | Escalade4LAX Los Angeles",
    description:
      "Explore travel tips, LAX airport guides, and insights on luxury limo and car services in Los Angeles. Stay updated with Escalade4LAX premium ride news",
  },
  alternates: {
    canonical: "/blogs",
  },
};

const BlogsPage = async () => {
  const blogs = await getAllBlogs();
  const baseUrl = process.env.APP_URL || "https://escalade4lax.com/api";
  const frontendUrl = baseUrl;

  // Structured data for blog collection
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Luxury Car & Limo Service Blog ",
    description:
      "Explore travel tips, LAX airport guides, and insights on luxury limo and car services in Los Angeles. Stay updated with Escalade4LAX premium ride news",
    url: `${frontendUrl}/blogs`,
    publisher: {
      "@type": "Organization",
      name: "Escalade4LAX Los Angeles",
      url: frontendUrl,
    },
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.metaDescription || blog.excerpt || blog.title,
      url: `${frontendUrl}/blogs/${blog.slug}`,
      datePublished: blog.publishedAt || blog.createdAt,
      dateModified: blog.updatedAt,
      author: {
        "@type": "Person",
        name: blog.author?.name || blog.author?.email || "Unknown Author",
      },
      image: blog.featuredImage || undefined,
      keywords:
        blog.tags
          ?.filter((tag): tag is string => tag !== undefined)
          .join(", ") || "",
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our Blog
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Stay updated with the latest news, tips, and insights from our team
          </p>
        </div> */}

        {/* Blog List */}
        <BlogList blogs={blogs} />
      </div>
    </div>
  );
};

export default BlogsPage;

import { Blog } from "@/schema/blogSchema";
import type { Metadata } from "next";
import { BlogList } from "../_components/blogs/blog-list";

async function getAllBlogs(): Promise<Blog[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
    const url = `${baseUrl}/blogs/public`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// SEO Metadata
export const metadata: Metadata = {
  title: "Blog | Way-Wise - Insights, Tips & Industry News",
  description:
    "Stay updated with the latest insights, tips, and industry news from Way-Wise. Explore articles on business solutions, technology trends, and expert advice to help your business grow.",
  keywords: [
    "blog",
    "business insights",
    "industry news",
    "business tips",
    "technology trends",
    "expert advice",
    "Way-Wise blog",
    "business solutions",
  ],
  openGraph: {
    title: "Blog | Way-Wise - Insights, Tips & Industry News",
    description:
      "Stay updated with the latest insights, tips, and industry news from Way-Wise. Expert articles to help your business grow.",
    type: "website",
    url: "/blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Way-Wise - Insights, Tips & Industry News",
    description:
      "Stay updated with the latest insights, tips, and industry news from Way-Wise. Expert articles to help your business grow.",
  },
  alternates: {
    canonical: "/blogs",
  },
};

const BlogsPage = async () => {
  const blogs = await getAllBlogs();
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Structured data for blog collection
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Way-Wise Blog",
    description:
      "Stay updated with the latest insights, tips, and industry news from Way-Wise. Expert articles on business solutions, technology trends, and growth strategies.",
    url: `${frontendUrl}/blogs`,
    publisher: {
      "@type": "Organization",
      name: "Way-Wise",
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

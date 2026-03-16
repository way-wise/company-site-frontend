import { getDynamicMetadata } from "@/lib/seo";
import { Blog } from "@/schema/blogSchema";
import type { Metadata } from "next";
import { BlogList } from "../_components/blogs/blog-list";

import { BlogFilters } from "../_components/blogs/blog-filters";
import { Newsletter } from "../_components/blogs/newsletter";

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

export async function generateMetadata(): Promise<Metadata> {
	return getDynamicMetadata("blog", {
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
		path: "/blog",
	});
}

const BlogsPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ category?: string; search?: string }>;
}) => {
	const blogs = await getAllBlogs();
	const resolvedSearchParams = await searchParams;
	const isFiltering =
		!!resolvedSearchParams.category || !!resolvedSearchParams.search;

	// Sort blogs by date (newest first) just in case API doesn't
	const sortedBlogs = [...blogs].sort(
		(a, b) =>
			new Date(b.publishedAt || b.createdAt).getTime() -
			new Date(a.publishedAt || a.createdAt).getTime()
	);

	// If not filtering, we remove the featured one from the grid?
	// Or keep it? Let's remove it from grid if it's shown in Hero
	const gridBlogs = !isFiltering ? sortedBlogs : sortedBlogs;

	// Extract unique tags for categories
	const allTags = Array.from(
		new Set(blogs.flatMap((blog) => blog.tags || []))
	).sort();

	const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL;

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
			url: `${frontendUrl}/blog/${blog.slug}`,
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
		<div className="min-h-screen bg-white dark:bg-black">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>

			<div className="container mx-auto px-4 py-8 md:py-12">
				{/* Header Section */}
				<div className="mb-12 text-center">
					<h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
						Our <span className="text-blue-600">Blog</span>
					</h1>
					<p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
						Insights, tutorials, and updates from the Way-Wise team.
					</p>
				</div>

				{/* Hero Section - Only show when not filtering */}
				{/* {!isFiltering && featuredBlog && <BlogHero blog={featuredBlog} />} */}

				{/* Filters and Search */}
				<BlogFilters categories={allTags} />

				{/* Blog Grid */}
				<BlogList blogs={gridBlogs} />

				{/* Newsletter Section */}
				<Newsletter />
			</div>
		</div>
	);
};

export default BlogsPage;

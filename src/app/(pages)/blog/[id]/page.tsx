
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetail } from "../../_components/blogs/blog-detail";
import { getAllBlogs, getBlogBySlug } from "@/lib/api/blogs";

interface BlogDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({
	params,
}: BlogDetailPageProps): Promise<Metadata> {
	const resolvedParams = await params;
	const blog = await getBlogBySlug(resolvedParams.id);

	if (!blog) {
		return {
			title: "Blog Post Not Found",
			description: "The requested blog post could not be found.",
		};
	}

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
	const blogUrl = `${baseUrl}/blogs/${blog.slug}`;

	// Filter out undefined tags
	const validTags =
		blog.tags?.filter((tag): tag is string => tag !== undefined) || [];

	return {
		title: blog.metaTitle || blog.title,
		description:
			blog.metaDescription ||
			blog.excerpt ||
			`Read ${blog.title} - ${blog.author?.name || blog.author?.email}`,
		keywords: validTags,
		authors: [
			{ name: blog.author?.name || blog.author?.email || "Unknown Author" },
		],
		openGraph: {
			title: blog.metaTitle || blog.title,
			description: blog.metaDescription || blog.excerpt || `Read ${blog.title}`,
			type: "article",
			url: blogUrl,
			publishedTime: blog.publishedAt || blog.createdAt,
			modifiedTime: blog.updatedAt,
			authors: [blog.author?.name || blog.author?.email || "Unknown Author"],
			tags: validTags,
			images: blog.featuredImage
				? [
						{
							url: blog.featuredImage,
							width: 1200,
							height: 630,
							alt: blog.title,
						},
				  ]
				: [],
		},
		twitter: {
			card: "summary_large_image",
			title: blog.metaTitle || blog.title,
			description: blog.metaDescription || blog.excerpt || `Read ${blog.title}`,
			images: blog.featuredImage ? [blog.featuredImage] : [],
		},
		alternates: {
			canonical: blogUrl,
		},
	};
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
	const resolvedParams = await params;
	const blog = await getBlogBySlug(resolvedParams.id);
	const allBlogs = await getAllBlogs();

	if (!blog) {
		notFound();
	}

	// Simple related logic: same tags or just recent
	const relatedBlogs = allBlogs
		.filter((b) => b.id !== blog.id)
		.sort((a, b) => {
			// Prioritize same tags
			const aTags = a.tags || [];
			const bTags = b.tags || [];
			const blogTags = blog.tags || [];
			const aMatch = aTags.filter((t) => blogTags.includes(t)).length;
			const bMatch = bTags.filter((t) => blogTags.includes(t)).length;
			return bMatch - aMatch;
		})
		.slice(0, 3); // Top 3

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
	const blogUrl = `${baseUrl}/blogs/${blog.slug}`;

	const validTags =
		blog.tags?.filter((tag): tag is string => tag !== undefined) || [];

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blog.title,
		description: blog.metaDescription || blog.excerpt || blog.title,
		image: blog.featuredImage ? [blog.featuredImage] : [],
		author: {
			"@type": "Person",
			name: blog.author?.name || blog.author?.email || "Unknown Author",
		},
		publisher: {
			"@type": "Organization",
			name: "Way-Wise Car Rental",
			url: baseUrl,
		},
		datePublished: blog.publishedAt || blog.createdAt,
		dateModified: blog.updatedAt,
		url: blogUrl,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": blogUrl,
		},
		keywords: validTags.join(", ") || "",
		articleBody: blog.content,
	};

	return (
		<div className="min-h-screen bg-white dark:bg-black">
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>

			<div className="container mx-auto px-4 py-8">
				<BlogDetail blog={blog} relatedBlogs={relatedBlogs} />
			</div>
		</div>
	);
};

export default BlogDetailPage;

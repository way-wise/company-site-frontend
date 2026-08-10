"use client";

import { Blog } from "@/schema/blogSchema";
import { formatDate } from "@/lib/date-format";
import Image from "next/image";
import Link from "next/link";

interface RelatedPostsProps {
	blogs: Blog[];
	currentBlogId: string;
}

export const RelatedPosts = ({ blogs, currentBlogId }: RelatedPostsProps) => {
	const relatedBlogs = blogs
		.filter((blog) => blog.id !== currentBlogId)
		.slice(0, 3);

	if (relatedBlogs.length === 0) return null;

	return (
		<div className="mt-16 border-t pt-12">
			<h2 className="mb-8 text-2xl font-bold text-gray-900">
				Recommended for you
			</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{relatedBlogs.map((blog) => (
					<Link
						key={blog.id}
						href={`/blog/${blog.slug}`}
						className="group block"
					>
						{blog.featuredImage && (
							<div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
								<Image
									src={blog.featuredImage}
									alt={blog.title}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
						)}
						<h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 transition-colors group-hover:text-blue-600">
							{blog.title}
						</h3>
						<p className="mb-3 text-sm text-gray-600 line-clamp-2">
							{blog.excerpt}
						</p>
						<div className="text-xs text-gray-500">
							{formatDate(blog.publishedAt || blog.createdAt)}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

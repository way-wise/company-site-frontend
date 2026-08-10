"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date-format";
import { Blog } from "@/schema/blogSchema";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface BlogListProps {
	blogs: Blog[];
}

export const BlogList = ({ blogs }: BlogListProps) => {
	const searchParams = useSearchParams();
	const category = searchParams.get("category");
	const search = searchParams.get("search");

	const filteredBlogs = useMemo(() => {
		return blogs.filter((blog) => {
			const matchesCategory =
				!category ||
				category === "All" ||
				blog.tags?.some((tag) => tag.toLowerCase() === category.toLowerCase());

			const matchesSearch =
				!search ||
				blog.title.toLowerCase().includes(search.toLowerCase()) ||
				blog.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
				(blog.content &&
					blog.content.toLowerCase().includes(search.toLowerCase()));

			return matchesCategory && matchesSearch;
		});
	}, [blogs, category, search]);

	if (filteredBlogs.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-24 text-center">
				<div className="mb-4 rounded-full bg-gray-100 p-4">
					<SearchIcon className="h-8 w-8 text-gray-400" />
				</div>
				{/* Not a heading: this is an empty-state message, not a section of the
				    document. As an h3 it put a stray heading in the page outline. */}
				<p className="mb-2 text-xl font-semibold text-gray-900">
					No articles found
				</p>
				<p className="text-gray-500">
					Try adjusting your search or filters to find what you&apos;re looking
					for.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			<AnimatePresence mode="popLayout">
				{filteredBlogs.map((blog) => {
					const authorName =
						blog.author?.name ||
						blog.userProfile?.user?.name ||
						"Way-Wise Team";

					return (
						<motion.article
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							key={blog.id}
							className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 dark:border-gray-800 dark:bg-gray-900"
						>
							<Link
								href={`/blog/${blog.slug}`}
								className="block overflow-hidden"
							>
								{blog.featuredImage ? (
									<div className="relative h-56 w-full overflow-hidden">
										<Image
											src={blog.featuredImage}
											alt={blog.title}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 transition-colors group-hover:from-black/10" />
									</div>
								) : (
									<div className="flex h-56 w-full items-center justify-center bg-gray-100 text-gray-400">
										<span className="text-sm">No Image</span>
									</div>
								)}
							</Link>

							<div className="flex flex-1 flex-col p-6">
								<div className="mb-3 flex flex-wrap gap-2">
									{blog.tags?.slice(0, 2).map((tag, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="bg-gray-100 text-xs font-normal text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
										>
											{tag}
										</Badge>
									))}
								</div>

								<Link href={`/blog/${blog.slug}`} className="mb-3 block">
									<h2 className="text-xl font-bold text-gray-900 line-clamp-2 transition-colors group-hover:text-blue-600 dark:text-white">
										{blog.title}
									</h2>
								</Link>

								{blog.excerpt && (
									<p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
										{blog.excerpt}
									</p>
								)}

								<div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
											{authorName.charAt(0)}
										</div>
										<div className="flex flex-col">
											<span className="text-xs font-medium text-gray-900 dark:text-gray-200">
												{authorName}
											</span>
											<span className="text-xs text-gray-500">
												{formatDate(blog.publishedAt || blog.createdAt)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</motion.article>
					);
				})}
			</AnimatePresence>
		</div>
	);
};

function SearchIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

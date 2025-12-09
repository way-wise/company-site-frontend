"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date-format";
import { Blog } from "@/schema/blogSchema";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogHeroProps {
	blog: Blog;
}

export const BlogHero = ({ blog }: BlogHeroProps) => {
	const authorName =
		blog.author?.name || blog.userProfile?.user?.name || "Way-Wise Team";

	return (
		<div className="relative mb-16 overflow-hidden rounded-2xl bg-gray-900 text-white shadow-2xl">
			{/* Background Image with Overlay */}
			{blog.featuredImage && (
				<div className="absolute inset-0">
					<Image
						src={blog.featuredImage}
						alt={blog.title}
						fill
						className="object-cover opacity-60 transition-opacity hover:opacity-50"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
				</div>
			)}

			<div className="relative z-10 grid gap-8 px-6 py-12 md:px-12 md:py-24 lg:grid-cols-2 lg:gap-12">
				<div className="flex flex-col justify-center space-y-6">
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							variant="secondary"
							className="bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 px-3 py-1"
						>
							Featured Post
						</Badge>
						{blog.tags?.slice(0, 2).map((tag) => (
							<Badge
								key={tag}
								variant="outline"
								className="border-gray-500 text-gray-300"
							>
								{tag}
							</Badge>
						))}
					</div>

					<Link href={`/blogs/${blog.slug}`} className="group">
						<h1 className="text-3xl font-bold font-[Family-Name,sans-serif] leading-tight md:text-5xl group-hover:text-blue-300 transition-colors">
							{blog.title}
						</h1>
					</Link>

					<p className="line-clamp-3 text-lg text-gray-300 md:text-xl">
						{blog.excerpt || blog.content.substring(0, 150) + "..."}
					</p>

					<div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 font-bold text-gray-300">
								{authorName.charAt(0)}
							</div>
							<span className="font-medium text-gray-200">{authorName}</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
						</div>
					</div>

					<div className="pt-4">
						<Button
							asChild
							size="lg"
							className="rounded-full bg-white text-gray-900 hover:bg-gray-100 px-8"
						>
							<Link href={`/blogs/${blog.slug}`}>
								Read Article <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

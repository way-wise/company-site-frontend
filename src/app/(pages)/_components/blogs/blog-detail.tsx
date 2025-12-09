"use client";

import { Blog } from "@/schema/blogSchema";
import { formatDate } from "@/lib/date-format";
import Image from "next/image";
import { Calendar, Tag, User, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { ShareButtons } from "./share-buttons";
import { RelatedPosts } from "./related-posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
	ssr: false,
});

interface BlogDetailProps {
	blog: Blog;
	relatedBlogs: Blog[];
}

export const BlogDetail = ({ blog, relatedBlogs }: BlogDetailProps) => {
	const authorName =
		blog.author?.name || blog.userProfile?.user?.name || "Way-Wise Team";

	return (
		<article className="mx-auto max-w-4xl">
			{/* Featured Image */}
			{blog.featuredImage && (
				<div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl shadow-lg md:h-[480px]">
					<Image
						src={blog.featuredImage}
						alt={blog.title}
						fill
						className="object-cover"
						priority
					/>
				</div>
			)}

			{/* Blog Header */}
			<header className="mb-12 ">
				<div className="mb-6 flex flex-wrap justify-start gap-2">
					{blog.tags?.map((tag: string, index: number) => (
						<Badge
							key={index}
							variant="secondary"
							className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1"
						>
							{tag}
						</Badge>
					))}
				</div>

				<h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl lg:text-4xl">
					{blog.title}
				</h1>

				{/* Meta Information */}
				<div className="flex flex-wrap items-center justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={`https://ui-avatars.com/api/?name=${authorName}&background=random`}
							/>
							<AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
						</Avatar>
						<span className="font-medium text-gray-900 dark:text-gray-200">
							{authorName}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						<span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
					</div>
					{/* <div className="flex items-center gap-2">
						<MessageSquare className="h-4 w-4" />
						<span>0 Comments</span>
					</div> */}
				</div>
			</header>

			<div className="grid gap-12 lg:grid-cols-[1fr_auto]">
				<div className="w-full">
					{/* Excerpt */}
					{blog.excerpt && (
						<div className="mb-8 border-l-4 border-blue-500 bg-blue-50 p-6 pl-8 text-xl font-medium italic leading-relaxed text-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
							{blog.excerpt}
						</div>
					)}

					{/* Blog Content */}
					<div className="prose prose-lg prose-blue max-w-none dark:prose-invert">
						<MarkdownPreview
							source={blog.content}
							className="bg-transparent !text-gray-800 !dark:text-gray-200"
							style={{ backgroundColor: "transparent" }}
						/>
					</div>

					<Separator className="my-12" />

					{/* Share & Author Bottom */}
					<div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
						<ShareButtons title={blog.title} slug={blog.slug} />
					</div>

					{/* Comments Section (Placeholder) */}
					{/* <div className="mt-16">
						<h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
							Comments
						</h3>
						<div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
							<Textarea
								placeholder="Leave a comment..."
								className="mb-4 bg-white dark:bg-gray-950"
							/>
							<div className="flex justify-end">
								<Button>Post Comment</Button>
							</div>
						</div>
					</div> */}
				</div>
			</div>

			<RelatedPosts blogs={relatedBlogs} currentBlogId={blog.id} />
		</article>
	);
};

"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/date-format";
import { Blog } from "@/schema/blogSchema";
import { Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RelatedPosts } from "./related-posts";
import { ShareButtons } from "./share-buttons";
import "./blog-content.css";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
	ssr: false,
});

interface BlogDetailProps {
	blog: Blog;
	relatedBlogs: Blog[];
}

interface Heading {
	level: number;
	text: string;
	id: string;
}

const slugify = (text: string): string => {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

const extractHeadingsFromHtml = (html: string): Heading[] => {
	const headings: Heading[] = [];
	const seen = new Set<string>();

	// Match h1-h6 tags with their content
	const regex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
	let match;

	while ((match = regex.exec(html)) !== null) {
		const level = parseInt(match[1], 10);
		// Strip any HTML tags from the heading text
		const text = match[2].replace(/<[^>]*>/g, "").trim();
		const id = slugify(text);

		// Handle duplicate IDs
		let uniqueId = id;
		let counter = 1;
		while (seen.has(uniqueId)) {
			uniqueId = `${id}-${counter}`;
			counter++;
		}
		seen.add(uniqueId);

		headings.push({ level, text, id: uniqueId });
	}

	return headings;
};

export const BlogDetail = ({ blog, relatedBlogs }: BlogDetailProps) => {
	const [headings, setHeadings] = useState<Heading[]>([]);

	// Extract headings from HTML content
	useEffect(() => {
		const extracted = extractHeadingsFromHtml(blog.content);
		setHeadings(extracted);
	}, [blog.content]);

	// Assign IDs to rendered headings for TOC navigation
	useEffect(() => {
		const assignIdsToHeadings = () => {
			const extracted = extractHeadingsFromHtml(blog.content);
			const contentDiv = document.querySelector(".blog-content");
			if (!contentDiv) return;

			const headingElements = contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
			headingElements.forEach((el, index) => {
				if (extracted[index]) {
					el.id = extracted[index].id;
				}
			});
		};

		// Small delay to ensure MarkdownPreview has rendered
		const timer = setTimeout(assignIdsToHeadings, 500);
		return () => clearTimeout(timer);
	}, [blog.content]);

	return (
		<article className="mx-auto max-w-7xl">
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
			<header className="mx-auto  mb-12">
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

				<h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
					{blog.title}
				</h1>

				{/* Meta Information */}
				<div className="flex flex-wrap items-center justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						<span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
					</div>
				</div>
			</header>
			<div className="grid gap-12 lg:grid-cols-[1fr_250px] lg:gap-8 xl:gap-16">
				<div className="w-full min-w-0">
					{/* Excerpt */}
					{blog.excerpt && (
						<div className="mb-8 border-l-4 border-blue-500 bg-blue-50 p-6 pl-8 text-xl font-medium italic leading-relaxed text-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
							{blog.excerpt}
						</div>
					)}

					{/* Blog Content */}
					<div className="blog-content prose prose-lg prose-blue max-w-none dark:prose-invert">
						<MarkdownPreview
							source={blog.content}
							className="bg-transparent !text-gray-800 !dark:text-gray-200"
							style={{ backgroundColor: "transparent" }}
							wrapperElement={{
								"data-color-mode": "light",
							}}
						/>
					</div>

					<Separator className="my-12" />

					{/* Share & Author Bottom */}
					<div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
						<ShareButtons title={blog.title} slug={blog.slug} />
					</div>

				</div>

			{/* Table of Contents sidebar */}
				<div className="hidden lg:block">
					<div className="sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
						<div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
							<h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
								Table of Contents
							</h4>
							<nav className="flex flex-col space-y-3">
								{headings.length === 0 ? (
									<p className="text-sm text-gray-400 italic">
										No sections found
									</p>
								) : (
									headings.map((heading, index) => (
										<a
											key={index}
											href={`#${heading.id}`}
											className={`block text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
												heading.level === 3
													? "pl-4 text-gray-500 dark:text-gray-500"
													: "text-gray-600 font-medium dark:text-gray-400"
											}`}
											onClick={(e) => {
												e.preventDefault();
												const element = document.getElementById(heading.id);
												if (element) {
													element.scrollIntoView({ behavior: "smooth" });
												}
											}}
										>
											{heading.text}
										</a>
									))
								)}
							</nav>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-16 sm:mt-24">
				<RelatedPosts blogs={relatedBlogs} currentBlogId={blog.id} />
			</div>
		</article>
	);
};

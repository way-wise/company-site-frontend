"use client";

import { Blog } from "@/schema/blogSchema";
import { formatDate } from "@/lib/date-format";
import Image from "next/image";
import { Calendar, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogDetailProps {
  blog: Blog;
}

export const BlogDetail = ({ blog }: BlogDetailProps) => {
  const authorName =
    blog.author?.name ||
    blog.userProfile?.user?.name ||
    blog.author?.email ||
    blog.userProfile?.user?.email ||
    "Unknown Author";

  return (
    <article className="mx-auto max-w-4xl">
      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
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
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Published: {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
          </div>
          {blog.updatedAt !== blog.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Updated: {formatDate(blog.updatedAt)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-6 flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Excerpt */}
        {blog.excerpt && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-lg leading-relaxed text-gray-700">
            {blog.excerpt}
          </div>
        )}
      </header>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
          {blog.content}
        </div>
      </div>

      {/* Author Card */}
      <div className="mt-12 rounded-lg border bg-gray-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {authorName}
            </h3>
            <p className="text-sm text-gray-600">
              Published on {formatDate(blog.publishedAt || blog.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};


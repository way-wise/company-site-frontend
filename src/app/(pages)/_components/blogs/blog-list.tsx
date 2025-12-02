"use client";

import { Blog } from "@/schema/blogSchema";
import { formatDate } from "@/lib/date-format";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface BlogListProps {
  blogs: Blog[];
}

export const BlogList = ({ blogs }: BlogListProps) => {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No blog posts available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => {
        const authorName =
          blog.author?.name ||
          blog.userProfile?.user?.name ||
          blog.author?.email ||
          blog.userProfile?.user?.email ||
          "Unknown Author";

        return (
          <article
            key={blog.id}
            className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Link href={`/blogs/${blog.slug}`}>
              {blog.featuredImage && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-2 flex flex-wrap gap-2">
                  {blog.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                  {blog.title}
                </h2>

                {blog.excerpt && (
                  <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{authorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
};


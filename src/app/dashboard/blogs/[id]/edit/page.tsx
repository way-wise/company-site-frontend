"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBlog, useUpdateBlog } from "@/hooks/useBlogMutations";
import { CreateBlogInput, createBlogSchema } from "@/schema/blogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function EditBlogForm() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const updateBlogMutation = useUpdateBlog();

  // Fetch blog data
  const { data: blogResponse, isLoading } = useBlog(blogId);
  const blog = blogResponse?.data;

  const form = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      status: "DRAFT",
      tags: [],
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Update form when blog data is loaded
  useEffect(() => {
    if (blog) {
      // Ensure status is a valid string value
      const statusValue = String(blog.status || "DRAFT") as
        | "DRAFT"
        | "PUBLISHED"
        | "ARCHIVED";

      form.reset({
        title: blog.title || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        featuredImage: blog.featuredImage || "",
        status: statusValue,
        tags: blog.tags || [],
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
      });

      // Explicitly set status to ensure form state is updated
      form.setValue("status", statusValue, {
        shouldValidate: true,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog]);

  const handleSubmit = async (data: CreateBlogInput) => {
    try {
      // Ensure status is always a valid value
      const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
      const statusValue = validStatuses.includes(
        data.status as (typeof validStatuses)[number]
      )
        ? data.status
        : blog?.status || "DRAFT";

      const submitData = {
        ...data,
        status: statusValue as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      };

      await updateBlogMutation.mutateAsync({
        blogId,
        blogData: submitData,
      });

      router.push("/dashboard/blogs");
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const isSubmitting = updateBlogMutation.isPending;

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    form.setValue("tags", tags);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/3 rounded bg-muted"></div>
          <div className="mb-8 h-4 w-1/2 rounded bg-muted"></div>
          <div className="space-y-4">
            <div className="h-10 rounded bg-muted"></div>
            <div className="h-20 rounded bg-muted"></div>
            <div className="h-32 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Blog not found</h1>
          <p className="mt-2 text-muted-foreground">
            The blog you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/dashboard/blogs")}
            className="mt-4"
          >
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog</h1>
          <p className="text-muted-foreground">Update your blog post</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter blog title"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter blog excerpt (optional)"
                      {...field}
                      value={field.value || ""}
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content *</FormLabel>
                  <FormControl>
                    <MarkdownEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Enter blog content in markdown format..."
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "DRAFT"}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        placeholder="Upload a featured image for your blog post"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tags separated by commas (e.g., travel, tips, guide)"
                      onChange={(e) => handleTagsChange(e.target.value)}
                      value={field.value.join(", ")}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SEO title (optional)"
                        {...field}
                        value={field.value || ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="SEO description (optional)"
                        {...field}
                        value={field.value || ""}
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Blog"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function EditBlogPage() {
  return (
    <PermissionGuard
      permissions={["update_blog", "update_all_blogs"]}
      requireAll={false}
    >
      <EditBlogForm />
    </PermissionGuard>
  );
}

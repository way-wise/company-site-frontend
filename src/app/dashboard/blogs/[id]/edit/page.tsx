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
import { TagsInput } from "@/components/ui/tags-input";
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
			status: blog?.status || "DRAFT",
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
				status: blog.status || "DRAFT",
				tags: blog.tags || [],
				metaTitle: blog.metaTitle || "",
				metaDescription: blog.metaDescription || "",
			});
		}
	}, [blog, form]);

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

	if (isLoading) {
		return (
			<div className="w-full space-y-8">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="h-8 w-48 animate-pulse rounded bg-muted" />
						<div className="h-4 w-64 animate-pulse rounded bg-muted" />
					</div>
					<div className="flex gap-2">
						<div className="h-10 w-20 animate-pulse rounded bg-muted" />
						<div className="h-10 w-24 animate-pulse rounded bg-muted" />
					</div>
				</div>
				<div className="grid gap-8 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						<div className="h-[400px] animate-pulse rounded-lg bg-muted" />
						<div className="h-[200px] animate-pulse rounded-lg bg-muted" />
					</div>
					<div className="space-y-6 lg:col-span-1">
						<div className="h-[150px] animate-pulse rounded-lg bg-muted" />
						<div className="h-[150px] animate-pulse rounded-lg bg-muted" />
						<div className="h-[200px] animate-pulse rounded-lg bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	if (!blog) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
				<h1 className="text-2xl font-bold">Blog not found</h1>
				<p className="text-muted-foreground">
					The blog you&apos;re looking for doesn&apos;t exist or has been
					removed.
				</p>
				<Button onClick={() => router.push("/dashboard/blogs")}>
					Back to Blogs
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.back()}
							className="h-8 w-8 p-0"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<h1 className="text-2xl font-bold tracking-tight">
							Edit Blog Post
						</h1>
					</div>
					<p className="text-sm text-muted-foreground pl-10">
						Update your blog post content and settings.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => router.back()}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						onClick={form.handleSubmit(handleSubmit)}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Updating..." : "Save Changes"}
					</Button>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
					<div className="grid gap-8 lg:grid-cols-3">
						{/* Main Content - Left Column */}
						<div className="space-y-6 lg:col-span-2">
							<div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Post Title</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter a descriptive title"
													className="text-lg font-medium"
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
													placeholder="A short summary of your post to appear in cards and search results..."
													className="resize-none"
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
											<FormLabel>Content</FormLabel>
											<FormControl>
												<div className="min-h-[500px]">
													<MarkdownEditor
														value={field.value || ""}
														onChange={field.onChange}
														placeholder="Write your story here..."
														disabled={isSubmitting}
														height={500}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
								<div className="space-y-2">
									<h3 className="text-lg font-medium">
										Search Engine Optimization
									</h3>
									<p className="text-sm text-muted-foreground">
										Manage how your post appears in search results.
									</p>
								</div>
								<FormField
									control={form.control}
									name="metaTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Meta Title</FormLabel>
											<FormControl>
												<Input
													placeholder="SEO title (defaults to post title if empty)"
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
													placeholder="A concise description for search engines..."
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
							</div>
						</div>

						{/* Sidebar - Right Column */}
						<div className="space-y-6 lg:col-span-1">
							{/* Status & Visibility */}
							<div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
								<h3 className="font-medium">Publishing</h3>
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
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
							</div>

							{/* Tags */}
							<div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
								<h3 className="font-medium">Tags</h3>
								<FormField
									control={form.control}
									name="tags"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="sr-only">Tags</FormLabel>
											<FormControl>
												<TagsInput
													value={field.value}
													onChange={field.onChange}
													placeholder="Add tags..."
													disabled={isSubmitting}
												/>
											</FormControl>
											<p className="text-xs text-muted-foreground">
												Press enter or comma to add a tag.
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Featured Image */}
							<div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
								<h3 className="font-medium">Featured Image</h3>
								<FormField
									control={form.control}
									name="featuredImage"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="sr-only">Featured Image</FormLabel>
											<FormControl>
												<ImageUpload
													value={field.value || ""}
													onChange={field.onChange}
													disabled={isSubmitting}
													placeholder="Upload image"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				</form>
			</Form>
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

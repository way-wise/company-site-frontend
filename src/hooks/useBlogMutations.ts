"use client";

import { blogService, BlogsQueryParams, BlogStats } from "@/services/BlogService";
import { Blog, CreateBlogInput } from "@/schema/blogSchema";
import { ApiResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const blogQueryKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogQueryKeys.all, "list"] as const,
  list: (params: BlogsQueryParams) =>
    [...blogQueryKeys.lists(), params] as const,
  details: () => [...blogQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...blogQueryKeys.details(), id] as const,
  public: () => [...blogQueryKeys.all, "public"] as const,
  publicList: () => [...blogQueryKeys.public(), "list"] as const,
  publicDetail: (slug: string) => [...blogQueryKeys.public(), "detail", slug] as const,
  stats: () => [...blogQueryKeys.all, "stats"] as const,
};

export const useBlogs = (params: BlogsQueryParams) => {
  return useQuery({
    queryKey: blogQueryKeys.list(params),
    queryFn: () => blogService.getAllBlogs(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useBlog = (blogId: string) => {
  return useQuery({
    queryKey: blogQueryKeys.detail(blogId),
    queryFn: () => blogService.getBlogById(blogId),
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: blogQueryKeys.publicDetail(slug),
    queryFn: () => blogService.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePublicBlogs = () => {
  return useQuery({
    queryKey: blogQueryKeys.publicList(),
    queryFn: () => blogService.getPublicBlogs(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useBlogStats = () => {
  return useQuery({
    queryKey: blogQueryKeys.stats(),
    queryFn: () => blogService.getBlogStats(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogData: CreateBlogInput & { userProfileId?: string }) =>
      blogService.createBlog(blogData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Blog created successfully");
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
        // Invalidate public blogs if published
        if (variables.status === "PUBLISHED") {
          queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicList() });
        }
      } else {
        toast.error(data.message || "Failed to create blog");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create blog";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      blogData,
    }: {
      blogId: string;
      blogData: Partial<CreateBlogInput>;
    }) => blogService.updateBlog(blogId, blogData),

    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Blog updated successfully");
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: blogQueryKeys.detail(variables.blogId),
        });
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
        // Invalidate public blogs if status changed to/from published
        if (variables.blogData.status === "PUBLISHED") {
          queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicList() });
        }
      } else {
        toast.error(data.message || "Failed to update blog");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update blog";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogId: string) => blogService.deleteBlog(blogId),
    onSuccess: (data, blogId) => {
      if (data.success) {
        toast.success("Blog deleted successfully");
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
        queryClient.removeQueries({ queryKey: blogQueryKeys.detail(blogId) });
        // Invalidate public blogs
        queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicList() });
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete blog";
      toast.error(errorMessage);
    },
  });
};


"use client";

import apiClient from "@/lib/axios";
import { Blog, CreateBlogInput } from "@/schema/blogSchema";
import { ApiResponse } from "@/types";

export interface BlogsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  title?: string;
  userProfileId?: string;
}

export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  archivedBlogs: number;
}

export const blogService = {
  // Get all blogs with pagination and search
  getAllBlogs: async (
    params: BlogsQueryParams
  ): Promise<
    ApiResponse<{
      meta: { page: number; limit: number; total: number; totalPages: number };
      data: Blog[];
    }>
  > => {
    const { page = 1, limit = 10, search, status, title, userProfileId } = params;
    let url = `/blogs?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (title) {
      url += `&title=${encodeURIComponent(title)}`;
    }
    if (userProfileId) {
      url += `&userProfileId=${encodeURIComponent(userProfileId)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get public blogs (published only)
  getPublicBlogs: async (): Promise<ApiResponse<Blog[]>> => {
    const response = await apiClient.get("/blogs/public");
    return response.data;
  },

  // Get single blog by ID
  getBlogById: async (blogId: string): Promise<ApiResponse<Blog>> => {
    const response = await apiClient.get(`/blogs/${blogId}`);
    return response.data;
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string): Promise<ApiResponse<Blog>> => {
    const response = await apiClient.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  // Create new blog
  createBlog: async (
    blogData: CreateBlogInput & { userProfileId?: string }
  ): Promise<ApiResponse<Blog>> => {
    const response = await apiClient.post("/blogs", blogData);
    return response.data;
  },

  // Update blog
  updateBlog: async (
    blogId: string,
    blogData: Partial<CreateBlogInput>
  ): Promise<ApiResponse<Blog>> => {
    const response = await apiClient.put(`/blogs/${blogId}`, blogData);
    return response.data;
  },

  // Delete blog
  deleteBlog: async (blogId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/blogs/${blogId}`);
    return response.data;
  },

  // Get blog statistics
  getBlogStats: async (): Promise<ApiResponse<BlogStats>> => {
    const response = await apiClient.get("/blogs/stats");
    return response.data;
  },
};


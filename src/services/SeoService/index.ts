"use client";

import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types";

export interface SeoSetting {
  id: string;
  pageSlug: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeoInput {
  pageSlug: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  isActive?: boolean;
}

export interface SeoQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
}

export interface SeoListResponse {
  success: boolean;
  message: string;
  data: SeoSetting[];
  meta: { page: number; limit: number; total: number };
}

export const seoService = {
  getAllSeoSettings: async (params: SeoQueryParams): Promise<SeoListResponse> => {
    const { page = 1, limit = 50, searchTerm, isActive } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (searchTerm?.trim()) {
      queryParams.append("searchTerm", searchTerm.trim());
    }
    if (isActive !== undefined) {
      queryParams.append("isActive", isActive.toString());
    }

    const response = await apiClient.get(`/seo?${queryParams.toString()}`);
    return response.data;
  },

  getSeoById: async (id: string): Promise<ApiResponse<SeoSetting>> => {
    const response = await apiClient.get(`/seo/${id}`);
    return response.data;
  },

  getSeoBySlug: async (slug: string): Promise<ApiResponse<SeoSetting>> => {
    const encodedSlug = encodeURIComponent(slug);
    const response = await apiClient.get(`/seo/slug/${encodedSlug}`);
    return response.data;
  },

  createSeo: async (data: CreateSeoInput): Promise<ApiResponse<SeoSetting>> => {
    const response = await apiClient.post("/seo", data);
    return response.data;
  },

  updateSeo: async (
    id: string,
    data: Partial<CreateSeoInput>
  ): Promise<ApiResponse<SeoSetting>> => {
    const response = await apiClient.patch(`/seo/${id}`, data);
    return response.data;
  },

  upsertSeo: async (data: CreateSeoInput): Promise<ApiResponse<SeoSetting>> => {
    const response = await apiClient.post("/seo/upsert", data);
    return response.data;
  },

  deleteSeo: async (id: string): Promise<ApiResponse<SeoSetting>> => {
    const response = await apiClient.delete(`/seo/${id}`);
    return response.data;
  },
};

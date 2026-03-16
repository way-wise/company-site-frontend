"use client";

import {
  seoService,
  SeoQueryParams,
  CreateSeoInput,
} from "@/services/SeoService";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const seoQueryKeys = {
  all: ["seo"] as const,
  lists: () => [...seoQueryKeys.all, "list"] as const,
  list: (params: SeoQueryParams) => [...seoQueryKeys.lists(), params] as const,
  details: () => [...seoQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...seoQueryKeys.details(), id] as const,
  slugs: () => [...seoQueryKeys.all, "slug"] as const,
  slug: (slug: string) => [...seoQueryKeys.slugs(), slug] as const,
};

export const useSeoSettings = (params: SeoQueryParams) => {
  return useQuery({
    queryKey: seoQueryKeys.list(params),
    queryFn: () => seoService.getAllSeoSettings(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useSeoSetting = (id: string) => {
  return useQuery({
    queryKey: seoQueryKeys.detail(id),
    queryFn: () => seoService.getSeoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSeoBySlug = (slug: string) => {
  return useQuery({
    queryKey: seoQueryKeys.slug(slug),
    queryFn: () => seoService.getSeoBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSeoInput) => seoService.createSeo(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("SEO setting created successfully");
        queryClient.invalidateQueries({ queryKey: seoQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to create SEO setting");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create SEO setting";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateSeoInput>;
    }) => seoService.updateSeo(id, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("SEO setting updated successfully");
        queryClient.invalidateQueries({ queryKey: seoQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: seoQueryKeys.detail(variables.id),
        });
      } else {
        toast.error(data.message || "Failed to update SEO setting");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update SEO setting";
      toast.error(errorMessage);
    },
  });
};

export const useUpsertSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSeoInput) => seoService.upsertSeo(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("SEO setting saved successfully");
        queryClient.invalidateQueries({ queryKey: seoQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: seoQueryKeys.slugs() });
      } else {
        toast.error(data.message || "Failed to save SEO setting");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to save SEO setting";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteSeo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => seoService.deleteSeo(id),
    onSuccess: (data, id) => {
      if (data.success) {
        toast.success("SEO setting deleted successfully");
        queryClient.invalidateQueries({ queryKey: seoQueryKeys.lists() });
        queryClient.removeQueries({ queryKey: seoQueryKeys.detail(id) });
      } else {
        toast.error(data.message || "Failed to delete SEO setting");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete SEO setting";
      toast.error(errorMessage);
    },
  });
};

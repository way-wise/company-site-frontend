"use client";

import { earningService, EarningsQueryParams } from "@/services/EarningService";
import { Earning } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Type for API error responses
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Query keys for consistent caching
export const earningQueryKeys = {
  all: ["earnings"] as const,
  lists: () => [...earningQueryKeys.all, "list"] as const,
  list: (params: EarningsQueryParams) =>
    [...earningQueryKeys.lists(), params] as const,
  details: () => [...earningQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...earningQueryKeys.details(), id] as const,
  stats: (startDate?: string, endDate?: string) =>
    [...earningQueryKeys.all, "stats", startDate, endDate] as const,
  projectEarnings: (startDate?: string, endDate?: string) =>
    [...earningQueryKeys.all, "project-earnings", startDate, endDate] as const,
};

// Hook to get all earnings
export const useEarnings = (params: EarningsQueryParams) => {
  return useQuery({
    queryKey: earningQueryKeys.list(params),
    queryFn: () => earningService.getAllEarnings(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get earning by ID
export const useEarning = (earningId: string) => {
  return useQuery({
    queryKey: earningQueryKeys.detail(earningId),
    queryFn: () => earningService.getEarningById(earningId),
    enabled: !!earningId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get earning statistics
export const useEarningStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: earningQueryKeys.stats(startDate, endDate),
    queryFn: () => earningService.getEarningStats(startDate, endDate),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get project earnings from milestone payments
export const useProjectEarnings = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: earningQueryKeys.projectEarnings(startDate, endDate),
    queryFn: () => earningService.getProjectEarnings(startDate, endDate),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to create earning
export const useCreateEarning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (earningData: {
      amount: number;
      description?: string;
      date: string;
      projectId?: string;
      category?: string;
    }) => earningService.createEarning(earningData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Earning created successfully");
        queryClient.invalidateQueries({ queryKey: earningQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: earningQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create earning");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create earning";
      toast.error(errorMessage);
    },
  });
};

// Hook to update earning
export const useUpdateEarning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      earningId,
      earningData,
    }: {
      earningId: string;
      earningData: Partial<Earning>;
    }) => earningService.updateEarning(earningId, earningData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Earning updated successfully");
        queryClient.invalidateQueries({ queryKey: earningQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: earningQueryKeys.detail(variables.earningId),
        });
        queryClient.invalidateQueries({ queryKey: earningQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to update earning");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update earning";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete earning
export const useDeleteEarning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (earningId: string) => earningService.deleteEarning(earningId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Earning deleted successfully");
        queryClient.invalidateQueries({ queryKey: earningQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: earningQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to delete earning");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete earning";
      toast.error(errorMessage);
    },
  });
};


"use client";

import { partnerService, PartnersQueryParams } from "@/services/PartnerService";
import { Partner } from "@/types";
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
export const partnerQueryKeys = {
  all: ["partners"] as const,
  lists: () => [...partnerQueryKeys.all, "list"] as const,
  list: (params: PartnersQueryParams) =>
    [...partnerQueryKeys.lists(), params] as const,
  details: () => [...partnerQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...partnerQueryKeys.details(), id] as const,
  public: () => [...partnerQueryKeys.all, "public"] as const,
};

// Hook to get all partners
export const usePartners = (params: PartnersQueryParams) => {
  return useQuery({
    queryKey: partnerQueryKeys.list(params),
    queryFn: () => partnerService.getAllPartners(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get public partners (no auth required)
export const usePublicPartners = () => {
  return useQuery({
    queryKey: partnerQueryKeys.public(),
    queryFn: () => partnerService.getPublicPartners(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get partner by ID
export const usePartner = (partnerId: string) => {
  return useQuery({
    queryKey: partnerQueryKeys.detail(partnerId),
    queryFn: () => partnerService.getPartnerById(partnerId),
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create partner
export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      partnerData,
      imageFile,
    }: {
      partnerData: { name: string; image?: string; isShow?: boolean };
      imageFile?: File;
    }) => partnerService.createPartner(partnerData, imageFile),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Partner created successfully");
        // Invalidate and refetch partners list
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.public() });
      } else {
        toast.error(data.message || "Failed to create partner");
      }
    },
    onError: (error: Error) => {
      console.error("Create partner error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create partner";
      toast.error(errorMessage);
    },
  });
};

// Hook to update partner
export const useUpdatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      partnerId,
      partnerData,
      imageFile,
    }: {
      partnerId: string;
      partnerData: Partial<Partner>;
      imageFile?: File;
    }) => partnerService.updatePartner(partnerId, partnerData, imageFile),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Partner updated successfully");
        // Invalidate and refetch partners list and specific partner
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: partnerQueryKeys.detail(variables.partnerId),
        });
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.public() });
      } else {
        toast.error(data.message || "Failed to update partner");
      }
    },
    onError: (error: Error) => {
      console.error("Update partner error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update partner";
      toast.error(errorMessage);
    },
  });
};

// Hook to toggle partner visibility
export const useTogglePartnerVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      partnerId,
      isShow,
    }: {
      partnerId: string;
      isShow: boolean;
    }) => partnerService.togglePartnerVisibility(partnerId, isShow),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Partner visibility updated successfully");
        // Invalidate and refetch partners list and public partners
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.public() });
      } else {
        toast.error(data.message || "Failed to update partner visibility");
      }
    },
    onError: (error: Error) => {
      console.error("Toggle partner visibility error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update partner visibility";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete partner
export const useDeletePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partnerId: string) => partnerService.deletePartner(partnerId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Partner deleted successfully");
        // Invalidate and refetch partners list
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: partnerQueryKeys.public() });
      } else {
        toast.error(data.message || "Failed to delete partner");
      }
    },
    onError: (error: Error) => {
      console.error("Delete partner error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete partner";
      toast.error(errorMessage);
    },
  });
};


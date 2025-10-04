"use client";

import { serviceService, ServicesQueryParams } from "@/services/ServiceService";
import { Service } from "@/types";
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
export const serviceQueryKeys = {
  all: ["services"] as const,
  lists: () => [...serviceQueryKeys.all, "list"] as const,
  list: (params: ServicesQueryParams) =>
    [...serviceQueryKeys.lists(), params] as const,
  details: () => [...serviceQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceQueryKeys.details(), id] as const,
  stats: () => [...serviceQueryKeys.all, "stats"] as const,
};

// Hook to get all services
export const useServices = (params: ServicesQueryParams) => {
  return useQuery({
    queryKey: serviceQueryKeys.list(params),
    queryFn: () => serviceService.getAllServices(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get service by ID
export const useService = (serviceId: string) => {
  return useQuery({
    queryKey: serviceQueryKeys.detail(serviceId),
    queryFn: () => serviceService.getServiceById(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get service statistics
export const useServiceStats = () => {
  return useQuery({
    queryKey: serviceQueryKeys.stats(),
    queryFn: () => serviceService.getServiceStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: {
      name: string;
      image?: File | string;
      description?: string;
    }) => serviceService.createService(serviceData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Service created successfully");
        // Invalidate and refetch services list
        queryClient.invalidateQueries({ queryKey: serviceQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: serviceQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create service");
      }
    },
    onError: (error: Error) => {
      console.error("Create service error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create service";
      toast.error(errorMessage);
    },
  });
};

// Hook to update service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      serviceData,
    }: {
      serviceId: string;
      serviceData: Partial<Service>;
    }) => serviceService.updateService(serviceId, serviceData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Service updated successfully");
        // Invalidate and refetch services list and specific service
        queryClient.invalidateQueries({ queryKey: serviceQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: serviceQueryKeys.detail(variables.serviceId),
        });
        queryClient.invalidateQueries({ queryKey: serviceQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to update service");
      }
    },
    onError: (error: Error) => {
      console.error("Update service error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update service";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => serviceService.deleteService(serviceId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Service deleted successfully");
        // Invalidate and refetch services list
        queryClient.invalidateQueries({ queryKey: serviceQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: serviceQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to delete service");
      }
    },
    onError: (error: Error) => {
      console.error("Delete service error:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete service";
      toast.error(errorMessage);
    },
  });
};

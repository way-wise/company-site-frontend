"use client";

import {
  milestoneService,
  MilestonesQueryParams,
} from "@/services/MilestoneService";
import { Milestone } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const milestoneQueryKeys = {
  all: ["milestones"] as const,
  lists: () => [...milestoneQueryKeys.all, "list"] as const,
  list: (params: MilestonesQueryParams) =>
    [...milestoneQueryKeys.lists(), params] as const,
  details: () => [...milestoneQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...milestoneQueryKeys.details(), id] as const,
};

export const useMilestones = (params: MilestonesQueryParams) => {
  return useQuery({
    queryKey: milestoneQueryKeys.list(params),
    queryFn: () => milestoneService.getAllMilestones(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useMilestone = (milestoneId: string) => {
  return useQuery({
    queryKey: milestoneQueryKeys.detail(milestoneId),
    queryFn: () => milestoneService.getMilestoneById(milestoneId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!milestoneId,
  });
};

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneData: {
      name: string;
      description?: string;
      status?: string;
      projectId: string;
    }) => milestoneService.createMilestone(milestoneData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Milestone created successfully");
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to create milestone");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create milestone";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      milestoneId,
      milestoneData,
    }: {
      milestoneId: string;
      milestoneData: Partial<Milestone>;
    }) => milestoneService.updateMilestone(milestoneId, milestoneData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Milestone updated successfully");
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: milestoneQueryKeys.detail(variables.milestoneId),
        });
      } else {
        toast.error(data.message || "Failed to update milestone");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update milestone";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) =>
      milestoneService.deleteMilestone(milestoneId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Milestone deleted successfully");
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to delete milestone");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete milestone";
      toast.error(errorMessage);
    },
  });
};

export const useAssignEmployeesToMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      milestoneId,
      userProfileIds,
    }: {
      milestoneId: string;
      userProfileIds: string[];
    }) => milestoneService.assignEmployees(milestoneId, userProfileIds),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Employees assigned successfully");
        // Invalidate all milestone queries
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.all });
        // Refetch the specific milestone detail
        queryClient.refetchQueries({
          queryKey: milestoneQueryKeys.detail(variables.milestoneId),
        });
        // Refetch the milestones list
        queryClient.refetchQueries({ queryKey: milestoneQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to assign employees");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to assign employees";
      toast.error(errorMessage);
    },
  });
};

export const useAssignServicesToMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      milestoneId,
      serviceIds,
    }: {
      milestoneId: string;
      serviceIds: string[];
    }) => milestoneService.assignServices(milestoneId, serviceIds),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Services assigned successfully");
        // Invalidate all milestone queries
        queryClient.invalidateQueries({ queryKey: milestoneQueryKeys.all });
        // Refetch the specific milestone detail
        queryClient.refetchQueries({
          queryKey: milestoneQueryKeys.detail(variables.milestoneId),
        });
        // Refetch the milestones list
        queryClient.refetchQueries({ queryKey: milestoneQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to assign services");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to assign services";
      toast.error(errorMessage);
    },
  });
};

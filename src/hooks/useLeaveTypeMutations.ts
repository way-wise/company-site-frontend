"use client";

import {
  CreateLeaveTypeData,
  LeaveTypeQueryParams,
  leaveTypeService,
  UpdateLeaveTypeData,
} from "@/services/LeaveTypeService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const leaveTypeQueryKeys = {
  all: ["leaveTypes"] as const,
  lists: () => [...leaveTypeQueryKeys.all, "list"] as const,
  list: (params: LeaveTypeQueryParams) =>
    [...leaveTypeQueryKeys.lists(), params] as const,
  active: () => [...leaveTypeQueryKeys.all, "active"] as const,
  details: () => [...leaveTypeQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...leaveTypeQueryKeys.details(), id] as const,
};

export const useLeaveTypes = (params: LeaveTypeQueryParams) => {
  return useQuery({
    queryKey: leaveTypeQueryKeys.list(params),
    queryFn: () => leaveTypeService.getAllLeaveTypes(params),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useActiveLeaveTypes = () => {
  return useQuery({
    queryKey: leaveTypeQueryKeys.active(),
    queryFn: () => leaveTypeService.getActiveLeaveTypes(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLeaveType = (leaveTypeId: string) => {
  return useQuery({
    queryKey: leaveTypeQueryKeys.detail(leaveTypeId),
    queryFn: () => leaveTypeService.getLeaveTypeById(leaveTypeId),
    enabled: !!leaveTypeId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveTypeData: CreateLeaveTypeData) =>
      leaveTypeService.createLeaveType(leaveTypeData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Leave type created successfully");
        queryClient.invalidateQueries({ queryKey: leaveTypeQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: leaveTypeQueryKeys.active(),
        });
      } else {
        toast.error(data.message || "Failed to create leave type");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to create leave type"
      );
    },
  });
};

export const useUpdateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leaveTypeId,
      leaveTypeData,
    }: {
      leaveTypeId: string;
      leaveTypeData: UpdateLeaveTypeData;
    }) => leaveTypeService.updateLeaveType(leaveTypeId, leaveTypeData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Leave type updated successfully");
        queryClient.invalidateQueries({ queryKey: leaveTypeQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: leaveTypeQueryKeys.detail(variables.leaveTypeId),
        });
        queryClient.invalidateQueries({
          queryKey: leaveTypeQueryKeys.active(),
        });
      } else {
        toast.error(data.message || "Failed to update leave type");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to update leave type"
      );
    },
  });
};

export const useDeleteLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveTypeId: string) =>
      leaveTypeService.deleteLeaveType(leaveTypeId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Leave type deleted successfully");
        queryClient.invalidateQueries({ queryKey: leaveTypeQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: leaveTypeQueryKeys.active(),
        });
      } else {
        toast.error(data.message || "Failed to delete leave type");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to delete leave type"
      );
    },
  });
};

export const useToggleLeaveTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveTypeId: string) =>
      leaveTypeService.toggleLeaveTypeStatus(leaveTypeId),
    onSuccess: (data, leaveTypeId) => {
      if (data.success) {
        toast.success(
          `Leave type ${
            data.data?.isActive ? "activated" : "deactivated"
          } successfully`
        );
        queryClient.invalidateQueries({ queryKey: leaveTypeQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: leaveTypeQueryKeys.detail(leaveTypeId),
        });
        queryClient.invalidateQueries({
          queryKey: leaveTypeQueryKeys.active(),
        });
      } else {
        toast.error(data.message || "Failed to toggle leave type status");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message ||
          "Failed to toggle leave type status"
      );
    },
  });
};

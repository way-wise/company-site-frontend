"use client";

import {
  leaveBalanceService,
  CreateLeaveBalanceData,
  UpdateLeaveBalanceData,
  AllocateBalanceData,
  LeaveBalanceQueryParams,
} from "@/services/LeaveBalanceService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const leaveBalanceQueryKeys = {
  all: ["leaveBalances"] as const,
  lists: () => [...leaveBalanceQueryKeys.all, "list"] as const,
  list: (params: LeaveBalanceQueryParams) =>
    [...leaveBalanceQueryKeys.lists(), params] as const,
  user: (userProfileId: string, year?: number) =>
    [...leaveBalanceQueryKeys.all, "user", userProfileId, year] as const,
  details: () => [...leaveBalanceQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...leaveBalanceQueryKeys.details(), id] as const,
};

export const useLeaveBalances = (params: LeaveBalanceQueryParams) => {
  return useQuery({
    queryKey: leaveBalanceQueryKeys.list(params),
    queryFn: () => leaveBalanceService.getAllLeaveBalances(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUserLeaveBalances = (userProfileId: string, year?: number) => {
  return useQuery({
    queryKey: leaveBalanceQueryKeys.user(userProfileId, year),
    queryFn: () => leaveBalanceService.getUserLeaveBalances(userProfileId, year),
    enabled: !!userProfileId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLeaveBalance = (balanceId: string) => {
  return useQuery({
    queryKey: leaveBalanceQueryKeys.detail(balanceId),
    queryFn: () => leaveBalanceService.getLeaveBalanceById(balanceId),
    enabled: !!balanceId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (balanceData: CreateLeaveBalanceData) =>
      leaveBalanceService.createLeaveBalance(balanceData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Leave balance created successfully");
        queryClient.invalidateQueries({ queryKey: leaveBalanceQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to create leave balance");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to create leave balance"
      );
    },
  });
};

export const useUpdateLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      balanceId,
      balanceData,
    }: {
      balanceId: string;
      balanceData: UpdateLeaveBalanceData;
    }) => leaveBalanceService.updateLeaveBalance(balanceId, balanceData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Leave balance updated successfully");
        queryClient.invalidateQueries({ queryKey: leaveBalanceQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: leaveBalanceQueryKeys.detail(variables.balanceId) });
      } else {
        toast.error(data.message || "Failed to update leave balance");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to update leave balance"
      );
    },
  });
};

export const useDeleteLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (balanceId: string) =>
      leaveBalanceService.deleteLeaveBalance(balanceId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Leave balance deleted successfully");
        queryClient.invalidateQueries({ queryKey: leaveBalanceQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to delete leave balance");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to delete leave balance"
      );
    },
  });
};

export const useAllocateAnnualBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userProfileId,
      data,
    }: {
      userProfileId: string;
      data?: AllocateBalanceData;
    }) => leaveBalanceService.allocateAnnualBalance(userProfileId, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Annual leave balance allocated successfully");
        queryClient.invalidateQueries({ queryKey: leaveBalanceQueryKeys.user(variables.userProfileId) });
        queryClient.invalidateQueries({ queryKey: leaveBalanceQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to allocate annual balance");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to allocate annual balance"
      );
    },
  });
};


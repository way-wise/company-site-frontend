"use client";

import {
  AllocateBalanceData,
  CreateLeaveBalanceData,
  LeaveBalanceQueryParams,
  leaveBalanceService,
  UpdateLeaveBalanceData,
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
  summary: (year?: number, page?: number, limit?: number) =>
    [...leaveBalanceQueryKeys.all, "summary", year, page, limit] as const,
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
    queryFn: () =>
      leaveBalanceService.getUserLeaveBalances(userProfileId, year),
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
        queryClient.invalidateQueries({
          queryKey: leaveBalanceQueryKeys.all,
        });
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
        queryClient.invalidateQueries({
          queryKey: leaveBalanceQueryKeys.all,
        });
        queryClient.invalidateQueries({
          queryKey: leaveBalanceQueryKeys.detail(variables.balanceId),
        });
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
        queryClient.invalidateQueries({
          queryKey: leaveBalanceQueryKeys.all,
        });
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
        queryClient.invalidateQueries({
          queryKey: leaveBalanceQueryKeys.all,
        });
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

export const useEmployeesLeaveSummary = (
  year?: number,
  params?: { page?: number; limit?: number; enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = params || {};
  return useQuery({
    queryKey: leaveBalanceQueryKeys.summary(
      year,
      queryParams.page,
      queryParams.limit
    ),
    queryFn: () =>
      leaveBalanceService.getEmployeesLeaveSummary(year, queryParams),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAllocateYearlyLeaveForAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ year, totalDays }: { year: number; totalDays: number }) =>
      leaveBalanceService.allocateYearlyLeaveForAll(year, totalDays),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          data.message ||
            `Yearly leave allocated successfully! ${
              data.data?.allocated || 0
            } new allocations created, ${
              data.data?.updated || 0
            } existing allocations updated for ${
              data.data?.totalEmployees || 0
            } employees.`
        );
        // Invalidate all leave balance related queries
        queryClient.invalidateQueries({
          queryKey: leaveBalanceQueryKeys.all,
        });
        // Also invalidate leave queries to refresh stats
        queryClient.invalidateQueries({ queryKey: ["leaves"] });
      } else {
        toast.error(data.message || "Failed to allocate yearly leave");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message ||
          "Failed to allocate yearly leave for all employees"
      );
    },
  });
};

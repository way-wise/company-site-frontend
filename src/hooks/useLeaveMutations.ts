"use client";

import {
  leaveService,
  ApplyLeaveData,
  ApproveLeaveData,
  RejectLeaveData,
  LeaveQueryParams,
  LeaveCalendarParams,
} from "@/services/LeaveService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const leaveQueryKeys = {
  all: ["leaves"] as const,
  lists: () => [...leaveQueryKeys.all, "list"] as const,
  list: (params: LeaveQueryParams) =>
    [...leaveQueryKeys.lists(), params] as const,
  mine: (params: LeaveQueryParams) =>
    [...leaveQueryKeys.all, "mine", params] as const,
  details: () => [...leaveQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...leaveQueryKeys.details(), id] as const,
  stats: (params?: { year?: number; userProfileId?: string }) =>
    [...leaveQueryKeys.all, "stats", params] as const,
  calendar: (params: LeaveCalendarParams) =>
    [...leaveQueryKeys.all, "calendar", params] as const,
};

export const useMyLeaves = (params: LeaveQueryParams) => {
  return useQuery({
    queryKey: leaveQueryKeys.mine(params),
    queryFn: () => leaveService.getMyLeaves(params),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAllLeaves = (params: LeaveQueryParams) => {
  return useQuery({
    queryKey: leaveQueryKeys.list(params),
    queryFn: () => leaveService.getAllLeaves(params),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLeave = (leaveId: string) => {
  return useQuery({
    queryKey: leaveQueryKeys.detail(leaveId),
    queryFn: () => leaveService.getLeaveById(leaveId),
    enabled: !!leaveId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLeaveStats = (params?: { year?: number; userProfileId?: string }) => {
  return useQuery({
    queryKey: leaveQueryKeys.stats(params),
    queryFn: () => leaveService.getLeaveStats(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLeaveCalendar = (params: LeaveCalendarParams) => {
  return useQuery({
    queryKey: leaveQueryKeys.calendar(params),
    queryFn: () => leaveService.getLeaveCalendar(params),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveData: ApplyLeaveData) =>
      leaveService.applyForLeave(leaveData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Leave application submitted successfully");
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.mine({ page: 1, limit: 10 }) });
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to apply for leave");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to apply for leave"
      );
    },
  });
};

export const useCancelLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveId: string) => leaveService.cancelLeave(leaveId),
    onSuccess: (data, leaveId) => {
      if (data.success) {
        toast.success("Leave cancelled successfully");
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.mine({ page: 1, limit: 10 }) });
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.detail(leaveId) });
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to cancel leave");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to cancel leave"
      );
    },
  });
};

export const useDeleteLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveId: string) => leaveService.deleteLeave(leaveId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Leave deleted successfully");
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.mine({ page: 1, limit: 10 }) });
      } else {
        toast.error(data.message || "Failed to delete leave");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to delete leave"
      );
    },
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leaveId,
      data,
    }: {
      leaveId: string;
      data: ApproveLeaveData;
    }) => leaveService.approveLeave(leaveId, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Leave approved successfully");
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.detail(variables.leaveId) });
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to approve leave");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to approve leave"
      );
    },
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leaveId,
      data,
    }: {
      leaveId: string;
      data: RejectLeaveData;
    }) => leaveService.rejectLeave(leaveId, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Leave rejected successfully");
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.detail(variables.leaveId) });
        queryClient.invalidateQueries({ queryKey: leaveQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to reject leave");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message || "Failed to reject leave"
      );
    },
  });
};


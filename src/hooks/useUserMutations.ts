"use client";

import {
  BanUserData,
  CreateUserData,
  userService,
  UsersQueryParams,
} from "@/services/UserService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys for consistent caching
export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (params: UsersQueryParams) =>
    [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  stats: () => [...userQueryKeys.all, "stats"] as const,
};

// Hook to fetch all users with pagination and search
export const useUsers = (params: UsersQueryParams) => {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => userService.getAllUsers(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch single user
export const useUser = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook to fetch user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: userQueryKeys.stats(),
    queryFn: () => userService.getUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => userService.createUser(userData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("User created successfully");
        // Invalidate and refetch users list
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create user");
      }
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create user";
      toast.error(errorMessage);
    },
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<any>;
    }) => userService.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("User updated successfully");
        // Invalidate specific user and users list
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.detail(variables.userId),
        });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      } else {
        toast.error(data.message || "Failed to update user");
      }
    },
    onError: (error: any) => {
      console.error("Update user error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user";
      toast.error(errorMessage);
    },
  });
};

// Hook to ban user
export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      banData,
    }: {
      userId: string;
      banData: BanUserData;
    }) => userService.banUser(userId, banData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("User banned successfully");
        // Invalidate specific user and users list
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.detail(variables.userId),
        });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to ban user");
      }
    },
    onError: (error: any) => {
      console.error("Ban user error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to ban user";
      toast.error(errorMessage);
    },
  });
};

// Hook to unban user
export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.unbanUser(userId),
    onSuccess: (data, userId) => {
      if (data.success) {
        toast.success("User unbanned successfully");
        // Invalidate specific user and users list
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.detail(userId),
        });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to unban user");
      }
    },
    onError: (error: any) => {
      console.error("Unban user error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to unban user";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (data, userId) => {
      if (data.success) {
        toast.success("User deleted successfully");
        // Invalidate users list and stats
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.stats() });
        // Remove the specific user from cache
        queryClient.removeQueries({ queryKey: userQueryKeys.detail(userId) });
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    },
    onError: (error: any) => {
      console.error("Delete user error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete user";
      toast.error(errorMessage);
    },
  });
};

"use client";

import { authService } from "@/services/AuthService";
import { LoginCredentials, RegisterCredentials } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        toast.success("Login successful!");
        queryClient.setQueryData(["currentUser"], data.data.user);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      } else {
        toast.error(data.message || "Login failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (data) => {
      if (data.success && data.data) {
        toast.success("Registration successful!");
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.push("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.success("Logged out successfully!");
      queryClient.clear();
      
      // Redirect to main public domain after logout
      const publicUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      window.location.href = publicUrl;
    },
    onError: (error: Error) => {
      queryClient.clear();
      
      // Even on error, redirect to main public domain
      const publicUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      window.location.href = publicUrl;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    },
    onError: (error: Error) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || error.message || "Failed to change password";
      toast.error(errorMessage);
    },
  });
};

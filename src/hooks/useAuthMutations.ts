"use client";

import { authService } from "@/services/AuthService";
import { LoginCredentials, RegisterCredentials } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data) {
        toast.success("Login successful!");
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        // Tokens are automatically stored by authService.login()
        // Don't redirect here - let the component handle it
      } else {
        toast.error(data.message || "Login failed");
      }
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    },
  });
};

// Register mutation
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
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.success("Logged out successfully!");
      queryClient.clear();
      router.push("/login");
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear local state
      queryClient.clear();
      router.push("/login");
    },
  });
};

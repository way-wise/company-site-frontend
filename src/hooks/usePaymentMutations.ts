"use client";

import {
  paymentService,
  CreatePaymentMethodData,
  PaymentMethod,
  SetupIntentResponse,
} from "@/services/PaymentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const paymentQueryKeys = {
  all: ["payment"] as const,
  methods: () => [...paymentQueryKeys.all, "methods"] as const,
  setupIntent: () => [...paymentQueryKeys.all, "setup-intent"] as const,
};

// Hook to fetch all payment methods
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: paymentQueryKeys.methods(),
    queryFn: async () => {
      const response = await paymentService.getAllPaymentMethods();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to create setup intent
export const useCreateSetupIntent = () => {
  return useMutation({
    mutationFn: async (): Promise<SetupIntentResponse> => {
      const response = await paymentService.createSetupIntent();
      if (!response.data) {
        throw new Error("Failed to create setup intent");
      }
      return response.data;
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Failed to create setup intent";
      toast.error(errorMessage);
    },
  });
};

// Hook to attach payment method
export const useAttachPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreatePaymentMethodData
    ): Promise<PaymentMethod> => {
      const response = await paymentService.attachPaymentMethod(data);
      if (!response.data) {
        throw new Error("Failed to attach payment method");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Payment method added successfully");
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.methods() });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Failed to add payment method";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete payment method
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string): Promise<void> => {
      await paymentService.deletePaymentMethod(paymentMethodId);
    },
    onSuccess: () => {
      toast.success("Payment method deleted successfully");
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.methods() });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Failed to delete payment method";
      toast.error(errorMessage);
    },
  });
};

// Hook to set default payment method
export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string): Promise<PaymentMethod> => {
      const response = await paymentService.setDefaultPaymentMethod(
        paymentMethodId
      );
      if (!response.data) {
        throw new Error("Failed to set default payment method");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Default payment method updated");
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.methods() });
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Failed to update default payment method";
      toast.error(errorMessage);
    },
  });
};


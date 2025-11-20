"use client";

import {
  paymentService,
  CreatePaymentMethodData,
  PaymentMethod,
  SetupIntentResponse,
} from "@/services/PaymentService";
import { MilestonePayment } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const paymentQueryKeys = {
  all: ["payment"] as const,
  methods: () => [...paymentQueryKeys.all, "methods"] as const,
  setupIntent: () => [...paymentQueryKeys.all, "setup-intent"] as const,
  milestonePayments: (milestoneId: string) =>
    [...paymentQueryKeys.all, "milestone-payments", milestoneId] as const,
  userPayments: () => [...paymentQueryKeys.all, "user-payments"] as const,
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

// Hook to process milestone payment
export const useProcessMilestonePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestoneId: string): Promise<MilestonePayment> => {
      const response = await paymentService.processMilestonePayment(milestoneId);
      if (!response.data) {
        throw new Error("Failed to process payment");
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Payment processed successfully! Invoice: ${data.invoiceNumber}`);
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.userPayments() });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to process payment";
      toast.error(errorMessage);
    },
  });
};

// Hook to get milestone payments
export const useMilestonePayments = (milestoneId: string) => {
  return useQuery({
    queryKey: paymentQueryKeys.milestonePayments(milestoneId),
    queryFn: async () => {
      const response = await paymentService.getMilestonePayments(milestoneId);
      return response.data || [];
    },
    enabled: !!milestoneId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get user payments
export const useUserPayments = () => {
  return useQuery({
    queryKey: paymentQueryKeys.userPayments(),
    queryFn: async () => {
      const response = await paymentService.getUserPayments();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get payment invoice
export const usePaymentInvoice = (paymentId: string) => {
  return useQuery({
    queryKey: [...paymentQueryKeys.all, "invoice", paymentId],
    queryFn: async () => {
      const response = await paymentService.getPaymentInvoice(paymentId);
      return response.data;
    },
    enabled: !!paymentId,
  });
};


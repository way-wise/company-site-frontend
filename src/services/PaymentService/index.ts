"use client";

import apiClient from "@/lib/axios";
import { ApiResponse, MilestonePayment } from "@/types";

export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  stripeCustomerId: string | null;
  cardLast4: string;
  cardBrand: string;
  cardExpMonth: number;
  cardExpYear: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
}

export interface CreatePaymentMethodData {
  paymentMethodId: string;
  setupIntentId?: string;
}

export const paymentService = {
  // Create setup intent
  createSetupIntent: async (): Promise<ApiResponse<SetupIntentResponse>> => {
    const response = await apiClient.post("/payment/setup-intent");
    return response.data;
  },

  // Attach payment method
  attachPaymentMethod: async (
    data: CreatePaymentMethodData
  ): Promise<ApiResponse<PaymentMethod>> => {
    const response = await apiClient.post("/payment/payment-methods", data);
    return response.data;
  },

  // Get all payment methods
  getAllPaymentMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    const response = await apiClient.get("/payment/payment-methods");
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (
    paymentMethodId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(
      `/payment/payment-methods/${paymentMethodId}`
    );
    return response.data;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (
    paymentMethodId: string
  ): Promise<ApiResponse<PaymentMethod>> => {
    const response = await apiClient.patch(
      `/payment/payment-methods/${paymentMethodId}/set-default`
    );
    return response.data;
  },

  // Process milestone payment
  processMilestonePayment: async (
    milestoneId: string
  ): Promise<ApiResponse<MilestonePayment>> => {
    const response = await apiClient.post(
      `/payment/milestones/${milestoneId}/process`
    );
    return response.data;
  },

  // Get milestone payments
  getMilestonePayments: async (
    milestoneId: string
  ): Promise<ApiResponse<MilestonePayment[]>> => {
    const response = await apiClient.get(
      `/payment/milestones/${milestoneId}/payments`
    );
    return response.data;
  },

  // Get user payments
  getUserPayments: async (): Promise<ApiResponse<MilestonePayment[]>> => {
    const response = await apiClient.get("/payment/payments");
    return response.data;
  },

  // Get payment invoice
  getPaymentInvoice: async (
    paymentId: string
  ): Promise<ApiResponse<MilestonePayment>> => {
    const response = await apiClient.get(`/payment/payments/${paymentId}/invoice`);
    return response.data;
  },
};




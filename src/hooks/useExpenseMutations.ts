"use client";

import { expenseService, ExpensesQueryParams } from "@/services/ExpenseService";
import { Expense } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Type for API error responses
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Query keys for consistent caching
export const expenseQueryKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseQueryKeys.all, "list"] as const,
  list: (params: ExpensesQueryParams) =>
    [...expenseQueryKeys.lists(), params] as const,
  details: () => [...expenseQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseQueryKeys.details(), id] as const,
  stats: (startDate?: string, endDate?: string) =>
    [...expenseQueryKeys.all, "stats", startDate, endDate] as const,
};

// Hook to get all expenses
export const useExpenses = (params: ExpensesQueryParams) => {
  return useQuery({
    queryKey: expenseQueryKeys.list(params),
    queryFn: () => expenseService.getAllExpenses(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get expense by ID
export const useExpense = (expenseId: string) => {
  return useQuery({
    queryKey: expenseQueryKeys.detail(expenseId),
    queryFn: () => expenseService.getExpenseById(expenseId),
    enabled: !!expenseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to get expense statistics
export const useExpenseStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: expenseQueryKeys.stats(startDate, endDate),
    queryFn: () => expenseService.getExpenseStats(startDate, endDate),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook to create expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: {
      amount: number;
      description?: string;
      date: string;
      category?: string;
      receiptUrl?: string;
    }) => expenseService.createExpense(expenseData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Expense created successfully");
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to create expense");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to create expense";
      toast.error(errorMessage);
    },
  });
};

// Hook to update expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expenseId,
      expenseData,
    }: {
      expenseId: string;
      expenseData: Partial<Expense>;
    }) => expenseService.updateExpense(expenseId, expenseData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("Expense updated successfully");
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: expenseQueryKeys.detail(variables.expenseId),
        });
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to update expense");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to update expense";
      toast.error(errorMessage);
    },
  });
};

// Hook to delete expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => expenseService.deleteExpense(expenseId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Expense deleted successfully");
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.stats() });
      } else {
        toast.error(data.message || "Failed to delete expense");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to delete expense";
      toast.error(errorMessage);
    },
  });
};


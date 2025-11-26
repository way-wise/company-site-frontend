"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  Expense,
  ExpenseStats,
  ExpensesQueryParams,
  PaginatedResponse,
} from "@/types";

export type { ExpensesQueryParams };

export const expenseService = {
  // Get all expenses with pagination and search
  getAllExpenses: async (
    params: ExpensesQueryParams
  ): Promise<ApiResponse<PaginatedResponse<Expense>>> => {
    const { page, limit, search, category, startDate, endDate } = params;
    let url = `/expenses?page=${page}&limit=${limit}`;

    if (search?.trim()) {
      url += `&q=${encodeURIComponent(search.trim())}`;
    }
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (startDate) {
      url += `&startDate=${encodeURIComponent(startDate)}`;
    }
    if (endDate) {
      url += `&endDate=${encodeURIComponent(endDate)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single expense by ID
  getExpenseById: async (expenseId: string): Promise<ApiResponse<Expense>> => {
    const response = await apiClient.get(`/expenses/${expenseId}`);
    return response.data;
  },

  // Create new expense
  createExpense: async (expenseData: {
    amount: number;
    description?: string;
    date: string;
    category?: string;
    receiptUrl?: string;
  }): Promise<ApiResponse<Expense>> => {
    const response = await apiClient.post("/expenses", expenseData);
    return response.data;
  },

  // Update expense
  updateExpense: async (
    expenseId: string,
    expenseData: Partial<Expense>
  ): Promise<ApiResponse<Expense>> => {
    const response = await apiClient.patch(`/expenses/${expenseId}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (expenseId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/expenses/${expenseId}`);
    return response.data;
  },

  // Get expense statistics
  getExpenseStats: async (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<ExpenseStats>> => {
    let url = "/expenses/stats";
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },
};


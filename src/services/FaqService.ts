"use client";

import apiClient from "@/lib/axios";
import { Faq, CreateFaqInput } from "@/schema/faqSchema";
import { ApiResponse } from "@/types";

export interface FaqsQueryParams {
	page?: number;
	limit?: number;
	searchTerm?: string;
	category?: string;
	isShow?: boolean;
}

export interface FaqsResponse {
	success: boolean;
	message: string;
	data: Faq[];
	meta: { page: number; limit: number; total: number };
}

export const faqService = {
	getAllFaqs: async (params: FaqsQueryParams): Promise<FaqsResponse> => {
		const { page = 1, limit = 10, searchTerm, category, isShow } = params;

		// Construct query parameters
		const queryParams = new URLSearchParams();
		queryParams.append("page", page.toString());
		queryParams.append("limit", limit.toString());

		if (searchTerm?.trim()) {
			queryParams.append("searchTerm", searchTerm.trim());
		}
		if (category) {
			queryParams.append("category", category);
		}
		if (isShow !== undefined) {
			queryParams.append("isShow", isShow.toString());
		}

		const response = await apiClient.get(`/faqs?${queryParams.toString()}`);
		return response.data;
	},

	getFaqById: async (id: string): Promise<ApiResponse<Faq>> => {
		const response = await apiClient.get(`/faqs/${id}`);
		return response.data;
	},

	createFaq: async (data: CreateFaqInput): Promise<ApiResponse<Faq>> => {
		const response = await apiClient.post("/faqs", data);
		return response.data;
	},

	updateFaq: async (
		id: string,
		data: Partial<CreateFaqInput>
	): Promise<ApiResponse<Faq>> => {
		const response = await apiClient.patch(`/faqs/${id}`, data);
		return response.data;
	},

	deleteFaq: async (id: string): Promise<ApiResponse<Faq>> => {
		const response = await apiClient.delete(`/faqs/${id}`);
		return response.data;
	},
};

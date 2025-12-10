"use client";

import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types";

export interface ContactFormData {
	fullName: string;
	email: string;
	whatsappNumber: string;
	serviceRequired: string;
	projectBudget: string;
	projectDescription: string;
}

export interface Contact extends ContactFormData {
	id: string;
	createdAt: string;
	updatedAt: string;
}

export interface GetAllContactsParams {
	page?: number;
	limit?: number;
	searchTerm?: string;
}

export const contactService = {
	submitContactForm: async (
		data: ContactFormData
	): Promise<ApiResponse<null>> => {
		const response = await apiClient.post("/contact/submit", data);
		return response.data;
	},

	getAllContacts: async (
		params?: GetAllContactsParams
	): Promise<ApiResponse<Contact[]>> => {
		const response = await apiClient.get("/contact", { params });
		return response.data;
	},
};

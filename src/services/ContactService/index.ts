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

	/**
	 * Fires the team notification email via this app's own Next.js route.
	 *
	 * Deliberately uses fetch, not apiClient: apiClient's baseURL is
	 * NEXT_PUBLIC_BASE_API, which would send this to the Express backend instead
	 * of the local route handler. A relative URL keeps it same-origin.
	 *
	 * Never throws — the caller has already stored the submission, so a failed
	 * notification must not turn a saved lead into a visible error.
	 */
	sendContactNotification: async (data: ContactFormData): Promise<boolean> => {
		try {
			const response = await fetch("/api/contact-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return response.ok;
		} catch {
			return false;
		}
	},

	getAllContacts: async (
		params?: GetAllContactsParams
	): Promise<ApiResponse<Contact[]>> => {
		const response = await apiClient.get("/contact", { params });
		return response.data;
	},
};

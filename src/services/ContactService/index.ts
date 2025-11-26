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

export const contactService = {
  submitContactForm: async (
    data: ContactFormData
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post("/contact/submit", data);
    return response.data;
  },
};


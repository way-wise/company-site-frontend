"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  PaginatedResponse,
  Service,
  ServiceStats,
  ServicesQueryParams,
} from "@/types";

export type { ServicesQueryParams };

// Type guard function to check if value is a File
const isFile = (value: File | string): value is File => {
  return value instanceof File;
};

// Service management service
export const serviceService = {
  // Get all services with pagination and search
  getAllServices: async (
    params: ServicesQueryParams
  ): Promise<PaginatedResponse<Service>> => {
    const { page, limit, search } = params;
    const url = `/service?page=${page}&limit=${limit}${
      search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : ""
    }`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single service by ID
  getServiceById: async (serviceId: string): Promise<ApiResponse<Service>> => {
    const response = await apiClient.get(`/service/${serviceId}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData: {
    name: string;
    image?: File | string;
    description?: string;
  }): Promise<ApiResponse<Service>> => {
    const formData = new FormData();
    formData.append("name", serviceData.name);

    if (serviceData.description) {
      formData.append("description", serviceData.description);
    }

    if (serviceData.image) {
      if (isFile(serviceData.image)) {
        formData.append("image", serviceData.image);
      } else {
        formData.append("image", serviceData.image);
      }
    }
    console.log(formData);
    const response = await apiClient.post("/service", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update service
  updateService: async (
    serviceId: string,
    serviceData: Partial<Service & { image?: File | string }>
  ): Promise<ApiResponse<Service>> => {
    const formData = new FormData();

    if (serviceData.name) {
      formData.append("name", serviceData.name);
    }

    if (serviceData.description) {
      formData.append("description", serviceData.description);
    }

    if (serviceData.image) {
      if (isFile(serviceData.image)) {
        formData.append("image", serviceData.image);
      } else {
        formData.append("image", serviceData.image);
      }
    }

    const response = await apiClient.put(`/service/${serviceId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete service
  deleteService: async (serviceId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/service/${serviceId}`);
    return response.data;
  },

  // Get service statistics (for dashboard)
  getServiceStats: async (): Promise<ApiResponse<ServiceStats>> => {
    const response = await apiClient.get("/service/stats");
    return response.data;
  },
};

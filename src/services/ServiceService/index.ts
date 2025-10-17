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

    // Transform backend response to match frontend expectations
    const { result, meta } = response.data.data;
    const totalPages = Math.ceil(meta.total / meta.limit);

    return {
      data: result,
      pagination: {
        currentPage: meta.page,
        totalPages,
        totalItems: meta.total,
        itemsPerPage: meta.limit,
      },
    };
  },

  // Get single service by ID
  getServiceById: async (serviceId: string): Promise<ApiResponse<Service>> => {
    const response = await apiClient.get(`/service/${serviceId}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<Service>> => {
    const response = await apiClient.post("/service", serviceData);
    return response.data;
  },

  // Update service
  updateService: async (
    serviceId: string,
    serviceData: Partial<Service>
  ): Promise<ApiResponse<Service>> => {
    const response = await apiClient.put(`/service/${serviceId}`, serviceData);
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

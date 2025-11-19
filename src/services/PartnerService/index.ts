"use client";

import apiClient from "@/lib/axios";
import {
  ApiResponse,
  Partner,
  PartnersQueryParams,
} from "@/types";

// Custom type for partner pagination response
interface PartnerPaginatedResponse {
  data: Partner[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export type { PartnersQueryParams };

// Partner management service
export const partnerService = {
  // Get all partners with pagination and search
  getAllPartners: async (
    params: PartnersQueryParams
  ): Promise<PartnerPaginatedResponse> => {
    const { page, limit, search, isShow } = params;
    let url = `/partner?page=${page}&limit=${limit}`;
    
    if (search?.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    
    if (isShow !== undefined) {
      url += `&isShow=${isShow}`;
    }

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

  // Get public partners (no auth required)
  getPublicPartners: async (): Promise<ApiResponse<Partner[]>> => {
    const response = await apiClient.get("/partner/public");
    return response.data;
  },

  // Get single partner by ID
  getPartnerById: async (partnerId: string): Promise<ApiResponse<Partner>> => {
    const response = await apiClient.get(`/partner/${partnerId}`);
    return response.data;
  },

  // Create new partner
  createPartner: async (partnerData: {
    name: string;
    image?: string;
    isShow?: boolean;
  }, imageFile?: File): Promise<ApiResponse<Partner>> => {
    const formData = new FormData();
    formData.append("name", partnerData.name);
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (partnerData.image) {
      // If image is a URL string, append it to body
      formData.append("image", partnerData.image);
    }
    
    if (partnerData.isShow !== undefined) {
      formData.append("isShow", partnerData.isShow.toString());
    }

    const response = await apiClient.post("/partner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update partner
  updatePartner: async (
    partnerId: string,
    partnerData: Partial<Partner>,
    imageFile?: File
  ): Promise<ApiResponse<Partner>> => {
    const formData = new FormData();
    
    if (partnerData.name) {
      formData.append("name", partnerData.name);
    }
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (partnerData.image) {
      formData.append("image", partnerData.image);
    }
    
    if (partnerData.isShow !== undefined) {
      formData.append("isShow", partnerData.isShow.toString());
    }

    const response = await apiClient.put(`/partner/${partnerId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Toggle partner visibility
  togglePartnerVisibility: async (
    partnerId: string,
    isShow: boolean
  ): Promise<ApiResponse<Partner>> => {
    const response = await apiClient.patch(`/partner/${partnerId}/toggle-visibility`, {
      isShow,
    });
    return response.data;
  },

  // Delete partner
  deletePartner: async (partnerId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/partner/${partnerId}`);
    return response.data;
  },
};


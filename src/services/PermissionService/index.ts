import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  Permission,
  PermissionFormData,
  PermissionsQueryParams,
} from "@/types";

export const PermissionService = {
  // Get all permissions
  getAllPermissions: async (params?: PermissionsQueryParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("q", params.search);
    if (params?.group) queryParams.append("group", params.group);

    const response = await axiosInstance.get<
      ApiResponse<{
        result: Permission[];
        meta: { page: number; limit: number; total: number };
      }>
    >(`/permissions?${queryParams.toString()}`);
    return response.data;
  },

  // Get single permission
  getPermissionById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Permission>>(
      `/permissions/${id}`
    );
    return response.data;
  },

  // Get permission groups
  getPermissionGroups: async () => {
    const response = await axiosInstance.get<ApiResponse<string[]>>(
      "/permissions/groups"
    );
    return response.data;
  },

  // Create permission
  createPermission: async (data: PermissionFormData) => {
    const response = await axiosInstance.post<ApiResponse<Permission>>(
      "/permissions",
      data
    );
    return response.data;
  },

  // Update permission
  updatePermission: async (id: string, data: Partial<PermissionFormData>) => {
    const response = await axiosInstance.put<ApiResponse<Permission>>(
      `/permissions/${id}`,
      data
    );
    return response.data;
  },

  // Delete permission
  deletePermission: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse>(
      `/permissions/${id}`
    );
    return response.data;
  },
};

import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  AssignPermissionsToRoleData,
  AssignRoleToUserData,
  Permission,
  Role,
  RoleFormData,
  RolesQueryParams,
  UserRoleAssignment,
} from "@/types";

export const RoleService = {
  // Get all roles
  getAllRoles: async (params?: RolesQueryParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("q", params.search);

    const response = await axiosInstance.get<
      ApiResponse<{
        result: Role[];
        meta: { page: number; limit: number; total: number };
      }>
    >(`/roles?${queryParams.toString()}`);
    return response.data;
  },

  // Get single role
  getRoleById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Role>>(`/roles/${id}`);
    return response.data;
  },

  // Get user roles
  getUserRoles: async (userId: string) => {
    const response = await axiosInstance.get<ApiResponse<UserRoleAssignment[]>>(
      `/roles/user/${userId}/roles`
    );
    return response.data;
  },

  // Get user permissions
  getUserPermissions: async (userId: string) => {
    const response = await axiosInstance.get<ApiResponse<Permission[]>>(
      `/roles/user/${userId}/permissions`
    );
    return response.data;
  },

  // Create role
  createRole: async (data: RoleFormData) => {
    const response = await axiosInstance.post<ApiResponse<Role>>(
      "/roles",
      data
    );
    return response.data;
  },

  // Update role
  updateRole: async (id: string, data: Partial<RoleFormData>) => {
    const response = await axiosInstance.put<ApiResponse<Role>>(
      `/roles/${id}`,
      data
    );
    return response.data;
  },

  // Delete role
  deleteRole: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse>(`/roles/${id}`);
    return response.data;
  },

  // Assign permissions to role
  assignPermissionsToRole: async (
    roleId: string,
    data: AssignPermissionsToRoleData
  ) => {
    const response = await axiosInstance.post<ApiResponse>(
      `/roles/${roleId}/permissions`,
      data
    );
    return response.data;
  },

  // Remove permission from role
  removePermissionFromRole: async (roleId: string, permissionId: string) => {
    const response = await axiosInstance.delete<ApiResponse>(
      `/roles/${roleId}/permissions/${permissionId}`
    );
    return response.data;
  },

  // Assign role to user
  assignRoleToUser: async (data: AssignRoleToUserData) => {
    const response = await axiosInstance.post<ApiResponse>(
      "/roles/assign-user",
      data
    );
    return response.data;
  },

  // Remove role from user
  removeRoleFromUser: async (data: AssignRoleToUserData) => {
    const response = await axiosInstance.post<ApiResponse>(
      "/roles/remove-user",
      data
    );
    return response.data;
  },
};

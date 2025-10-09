import { RoleService } from "@/services/RoleService";
import {
  AssignPermissionsToRoleData,
  AssignRoleToUserData,
  RoleFormData,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRoles = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => RoleService.getAllRoles(params),
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => RoleService.getRoleById(id),
    enabled: !!id,
  });
};

export const useUserRoles = (userId: string) => {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: () => RoleService.getUserRoles(userId),
    enabled: !!userId,
  });
};

export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: ["user-permissions", userId],
    queryFn: () => RoleService.getUserPermissions(userId),
    enabled: !!userId,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleFormData) => RoleService.createRole(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(data.message || "Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoleFormData> }) =>
      RoleService.updateRole(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success(data.message || "Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RoleService.deleteRole(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(data.message || "Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete role");
    },
  });
};

export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: string;
      data: AssignPermissionsToRoleData;
    }) => RoleService.assignPermissionsToRole(roleId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success(data.message || "Permissions assigned successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to assign permissions"
      );
    },
  });
};

export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: string;
      permissionId: string;
    }) => RoleService.removePermissionFromRole(roleId, permissionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role"] });
      toast.success(data.message || "Permission removed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove permission"
      );
    },
  });
};

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRoleToUserData) =>
      RoleService.assignRoleToUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success(data.message || "Role assigned to user successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to assign role to user"
      );
    },
  });
};

export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRoleToUserData) =>
      RoleService.removeRoleFromUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success(data.message || "Role removed from user successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove role from user"
      );
    },
  });
};

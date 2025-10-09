import { PermissionService } from "@/services/PermissionService";
import { PermissionFormData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePermissions = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  group?: string;
}) => {
  return useQuery({
    queryKey: ["permissions", params],
    queryFn: () => PermissionService.getAllPermissions(params),
  });
};

export const usePermission = (id: string) => {
  return useQuery({
    queryKey: ["permission", id],
    queryFn: () => PermissionService.getPermissionById(id),
    enabled: !!id,
  });
};

export const usePermissionGroups = () => {
  return useQuery({
    queryKey: ["permission-groups"],
    queryFn: () => PermissionService.getPermissionGroups(),
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionFormData) =>
      PermissionService.createPermission(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission-groups"] });
      toast.success(data.message || "Permission created successfully");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to create permission");
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PermissionFormData>;
    }) => PermissionService.updatePermission(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      queryClient.invalidateQueries({ queryKey: ["permission-groups"] });
      toast.success(data.message || "Permission updated successfully");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to update permission");
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PermissionService.deletePermission(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permission-groups"] });
      toast.success(data.message || "Permission deleted successfully");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to delete permission");
    },
  });
};

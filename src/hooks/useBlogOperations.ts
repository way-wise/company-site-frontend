import { useQueryClient } from "@tanstack/react-query";
import { blogQueryKeys } from "./useBlogMutations";

/**
 * Hook for blog cache operations
 * Provides functions to invalidate React Query cache for blog-related endpoints
 */
export const useBlogOperations = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate the blog list cache
   * This will cause React Query to refetch blog data on next access
   */
  const invalidateBlogCache = async () => {
    await queryClient.invalidateQueries({ queryKey: blogQueryKeys.lists() });
  };

  /**
   * Invalidate the public blogs cache
   * This will cause React Query to refetch public blog data on next access
   */
  const invalidatePublicBlogs = async () => {
    await queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicList() });
  };

  /**
   * Invalidate a specific blog by ID
   */
  const invalidateBlogById = async (id: string) => {
    await queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(id) });
  };

  /**
   * Invalidate blog stats cache
   */
  const invalidateBlogStats = async () => {
    await queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
  };

  /**
   * Invalidate all blog-related caches
   */
  const invalidateAllBlogCaches = async () => {
    await Promise.all([
      invalidateBlogCache(),
      invalidatePublicBlogs(),
      invalidateBlogStats(),
    ]);
  };

  return {
    invalidateBlogCache,
    invalidatePublicBlogs,
    invalidateBlogById,
    invalidateBlogStats,
    invalidateAllBlogCaches,
  };
};


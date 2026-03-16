"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useCreateSeo } from "@/hooks/useSeoHooks";
import { CreateSeoInput } from "@/services/SeoService";
import { useRouter } from "next/navigation";
import { SeoForm } from "../_components/seo-form";

export default function CreateSeoPage() {
  const router = useRouter();
  const createSeoMutation = useCreateSeo();

  const handleSubmit = async (data: CreateSeoInput) => {
    try {
      await createSeoMutation.mutateAsync(data);
      router.push("/dashboard/seo");
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <PermissionGuard permissions={["manage_seo"]}>
      <SeoForm
        onSubmit={handleSubmit}
        isSubmitting={createSeoMutation.isPending}
        mode="create"
      />
    </PermissionGuard>
  );
}

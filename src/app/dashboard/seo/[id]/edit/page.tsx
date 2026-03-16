"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Spinner from "@/components/ui/spinner";
import { useSeoSetting, useUpdateSeo } from "@/hooks/useSeoHooks";
import { CreateSeoInput } from "@/services/SeoService";
import { useParams, useRouter } from "next/navigation";
import { SeoForm } from "../../_components/seo-form";

export default function EditSeoPage() {
  const router = useRouter();
  const params = useParams();
  const seoId = params.id as string;

  const { data: seoData, isLoading } = useSeoSetting(seoId);
  const updateSeoMutation = useUpdateSeo();

  const handleSubmit = async (data: CreateSeoInput) => {
    try {
      await updateSeoMutation.mutateAsync({
        id: seoId,
        data,
      });
      router.push("/dashboard/seo");
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!seoData?.data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">SEO setting not found</p>
      </div>
    );
  }

  return (
    <PermissionGuard permissions={["manage_seo"]}>
      <SeoForm
        initialData={seoData.data}
        onSubmit={handleSubmit}
        isSubmitting={updateSeoMutation.isPending}
        mode="edit"
      />
    </PermissionGuard>
  );
}

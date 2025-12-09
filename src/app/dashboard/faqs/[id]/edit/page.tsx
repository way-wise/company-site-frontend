"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Button } from "@/components/ui/button";
import { useFaq, useUpdateFaq } from "@/hooks/useFaqHooks";
import { CreateFaqInput } from "@/schema/faqSchema";
import { useParams, useRouter } from "next/navigation";
import { FaqForm } from "../../_components/faq-form";

export default function EditFaqPage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;
	const updateFaqMutation = useUpdateFaq();
	const { data: faqResponse, isLoading } = useFaq(id);
	const faq = faqResponse?.data;

	const handleSubmit = async (data: CreateFaqInput) => {
		try {
			await updateFaqMutation.mutateAsync({ id, data });
			router.push("/dashboard/faqs");
		} catch {
			// Error handled by mutation
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (!faq) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
				<h1 className="text-2xl font-bold">FAQ not found</h1>
				<p className="text-muted-foreground">
					The FAQ you&apos;re looking for doesn&apos;t exist or has been
					removed.
				</p>
				<Button onClick={() => router.push("/dashboard/faqs")}>
					Back to FAQs
				</Button>
			</div>
		);
	}

	return (
		<PermissionGuard permissions={["update_faq"]}>
			<FaqForm
				initialData={faq}
				onSubmit={handleSubmit}
				isSubmitting={updateFaqMutation.isPending}
				mode="edit"
			/>
		</PermissionGuard>
	);
}

"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useCreateFaq } from "@/hooks/useFaqHooks";
import { CreateFaqInput } from "@/schema/faqSchema";
import { useRouter } from "next/navigation";
import { FaqForm } from "../_components/faq-form";

export default function CreateFaqPage() {
	const router = useRouter();
	const createFaqMutation = useCreateFaq();

	const handleSubmit = async (data: CreateFaqInput) => {
		try {
			await createFaqMutation.mutateAsync(data);
			router.push("/dashboard/faqs");
		} catch {
			// Error handled by mutation
		}
	};

	return (
		<PermissionGuard permissions={["create_faq"]}>
			<FaqForm
				onSubmit={handleSubmit}
				isSubmitting={createFaqMutation.isPending}
				mode="create"
			/>
		</PermissionGuard>
	);
}

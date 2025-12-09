"use client";

import { faqService, FaqsQueryParams } from "@/services/FaqService";
import { CreateFaqInput } from "@/schema/faqSchema";
import {
	useMutation,
	useQuery,
	useQueryClient,
	keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
	response?: {
		data?: {
			message?: string;
		};
	};
}

export const faqQueryKeys = {
	all: ["faqs"] as const,
	lists: () => [...faqQueryKeys.all, "list"] as const,
	list: (params: FaqsQueryParams) => [...faqQueryKeys.lists(), params] as const,
	details: () => [...faqQueryKeys.all, "detail"] as const,
	detail: (id: string) => [...faqQueryKeys.details(), id] as const,
};

export const useFaqs = (params: FaqsQueryParams) => {
	return useQuery({
		queryKey: faqQueryKeys.list(params),
		queryFn: () => faqService.getAllFaqs(params),
		staleTime: 5 * 60 * 1000,
		placeholderData: keepPreviousData, // Optimistic UI for pagination
	});
};

export const useFaq = (id: string) => {
	return useQuery({
		queryKey: faqQueryKeys.detail(id),
		queryFn: () => faqService.getFaqById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000,
	});
};

export const useCreateFaq = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateFaqInput) => faqService.createFaq(data),
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Faq created successfully");
				queryClient.invalidateQueries({ queryKey: faqQueryKeys.lists() });
			} else {
				toast.error(data.message || "Failed to create faq");
			}
		},
		onError: (error: Error) => {
			const apiError = error as ApiError;
			const errorMessage =
				apiError.response?.data?.message ||
				error.message ||
				"Failed to create faq";
			toast.error(errorMessage);
		},
	});
};

export const useUpdateFaq = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<CreateFaqInput> }) =>
			faqService.updateFaq(id, data),
		onSuccess: (data, variables) => {
			if (data.success) {
				toast.success("Faq updated successfully");
				queryClient.invalidateQueries({ queryKey: faqQueryKeys.lists() });
				queryClient.invalidateQueries({
					queryKey: faqQueryKeys.detail(variables.id),
				});
			} else {
				toast.error(data.message || "Failed to update faq");
			}
		},
		onError: (error: Error) => {
			const apiError = error as ApiError;
			const errorMessage =
				apiError.response?.data?.message ||
				error.message ||
				"Failed to update faq";
			toast.error(errorMessage);
		},
	});
};

export const useDeleteFaq = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => faqService.deleteFaq(id),
		onSuccess: (data, id) => {
			if (data.success) {
				toast.success("Faq deleted successfully");
				queryClient.invalidateQueries({ queryKey: faqQueryKeys.lists() });
				queryClient.removeQueries({ queryKey: faqQueryKeys.detail(id) });
			} else {
				toast.error(data.message || "Failed to delete faq");
			}
		},
		onError: (error: Error) => {
			const apiError = error as ApiError;
			const errorMessage =
				apiError.response?.data?.message ||
				error.message ||
				"Failed to delete faq";
			toast.error(errorMessage);
		},
	});
};

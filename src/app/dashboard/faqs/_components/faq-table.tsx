"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CustomModal as Modal } from "@/components/ui/modal";
import { useFaqs, useDeleteFaq } from "@/hooks/useFaqHooks";
import { formatDate } from "@/lib/date-format";
import { Faq } from "@/schema/faqSchema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVertical, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const FaqTable = () => {
	const router = useRouter();
	const deleteFaqMutation = useDeleteFaq();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [faqId, setFaqId] = useState<string | undefined>("");
	const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
	const [pagination, setPagination] = useState({
		pageIndex: 1,
		pageSize: 10,
	});

	// Search and filter states
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState(search);

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);
		return () => clearTimeout(timer);
	}, [search]);

	// Fetch faqs data
	const {
		data: faqsData,
		isLoading,
		error,
	} = useFaqs({
		page: pagination.pageIndex,
		limit: pagination.pageSize,
		searchTerm: debouncedSearch || undefined,
	});

	// Handle create faq navigation
	const handleCreateFaq = () => {
		router.push("/dashboard/faqs/create");
	};

	// Handle edit faq navigation
	const handleEditFaq = (id: string) => {
		router.push(`/dashboard/faqs/${id}/edit`);
	};

	// Handle delete faq
	const handleDeleteFaq = async () => {
		if (!faqId) return;

		try {
			await deleteFaqMutation.mutateAsync(faqId);
			setDeleteModalOpen(false);
			setSelectedFaq(null);
		} catch {
			// Error is handled by the mutation hook
		}
	};

	// Table columns
	const columns: ColumnDef<Faq>[] = [
		{
			accessorKey: "question",
			header: "Question",
			cell: ({ row }) => {
				const question = row.getValue("question") as string;
				return (
					<div className="max-w-[400px] truncate font-medium" title={question}>
						{question}
					</div>
				);
			},
		},
		{
			accessorKey: "category",
			header: "Category",
			cell: ({ row }) => {
				const category = row.getValue("category") as string;
				return <Badge variant="outline">{category}</Badge>;
			},
		},
		{
			accessorKey: "order",
			header: "Order",
			cell: ({ row }) => {
				return <div className="text-center">{row.getValue("order")}</div>;
			},
		},
		{
			accessorKey: "isShow",
			header: "Visible",
			cell: ({ row }) => {
				const isShow = row.getValue("isShow") as boolean;
				return (
					<Badge
						className={
							isShow
								? "bg-green-100 text-green-800"
								: "bg-gray-100 text-gray-800"
						}
					>
						{isShow ? "Yes" : "No"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Created",
			cell: ({ row }) => {
				const date = row.getValue("createdAt") as string;
				return <span className="text-sm">{formatDate(date)}</span>;
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const faq = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => faq.id && handleEditFaq(faq.id)}>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setSelectedFaq(faq);
									setFaqId(faq.id);
									setDeleteModalOpen(true);
								}}
								className="text-red-600"
							>
								<Trash className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	if (error) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold">FAQ Management</h2>
						<p className="text-gray-600">Manage your FAQs</p>
					</div>
					<Button onClick={handleCreateFaq}>
						<Plus className="mr-2 h-4 w-4" />
						Create FAQ
					</Button>
				</div>
				<div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
					<p className="font-medium">Error loading FAQs</p>
					<p className="text-sm">
						{error instanceof Error
							? error.message
							: "An unexpected error occurred"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">FAQ Management</h2>
					<p className="text-gray-600">Manage your FAQs</p>
				</div>
				<Button onClick={handleCreateFaq}>
					<Plus className="mr-2 h-4 w-4" />
					Create FAQ
				</Button>
			</div>

			{/* Filters */}
			<div className="flex gap-4">
				<Input
					placeholder="Search FAQs..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-sm"
				/>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={faqsData?.data || []}
				pagination={{
					pageIndex: pagination.pageIndex,
					pageSize: pagination.pageSize,
					total: faqsData?.meta?.total || 0,
				}}
				onPaginationChange={(newPagination) => {
					setPagination({
						pageIndex: newPagination.pageIndex,
						pageSize: newPagination.pageSize,
					});
				}}
				isPending={isLoading}
			/>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Delete FAQ"
				isPending={false}
			>
				<div className="space-y-4">
					<p>
						Are you sure you want to delete this FAQ? This action cannot be
						undone.
					</p>
					{selectedFaq && (
						<div className="rounded bg-gray-50 p-3">
							<h4 className="font-medium">{selectedFaq.question}</h4>
							<p className="text-sm text-gray-600">{selectedFaq.category}</p>
						</div>
					)}
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteFaq}>
							Delete
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

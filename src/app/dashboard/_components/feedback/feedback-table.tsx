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
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import { useContacts } from "@/hooks/useContacts";
import { Contact } from "@/services/ContactService";
import { Eye, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";

// Helper function to format date
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString();
};

export const FeedbackTable = () => {
	// Modal states
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

	// Pagination and search states
	const [pagination, setPagination] = useState({
		pageIndex: 1,
		pageSize: 10,
	});
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 600);

		return () => clearTimeout(timer);
	}, [search]);

	// Get contacts data
	const {
		data: contactsData,
		isLoading,
		error,
		isError,
		refetch,
	} = useContacts({
		page: pagination.pageIndex,
		limit: pagination.pageSize,
		searchTerm: debouncedSearch,
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		setPagination({
			pageIndex: 1,
			pageSize: 10,
		});
	};

	// Table columns
	const columns = [
		{
			header: "Full Name",
			accessorKey: "fullName",
		},
		{
			header: "Email",
			accessorKey: "email",
		},
		{
			header: "WhatsApp",
			accessorKey: "whatsappNumber",
		},
		{
			header: "Service",
			accessorKey: "serviceRequired",
			cell: ({ row }: { row: { original: Contact } }) => (
				<Badge variant="outline">{row.original.serviceRequired}</Badge>
			),
		},
		{
			header: "Budget",
			accessorKey: "projectBudget",
		},
		{
			header: "Date",
			accessorKey: "createdAt",
			cell: ({ row }: { row: { original: Contact } }) =>
				formatDate(row.original.createdAt),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }: { row: { original: Contact } }) => {
				return (
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger>
							<MoreVertical className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									setSelectedContact(row.original);
									setViewModalOpen(true);
								}}
							>
								<Eye className="mr-2 h-4 w-4" />
								<span>View Details</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<>
			<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-medium">Feedback / Contacts</h1>
			</div>
			<div className="rounded-xl border bg-card p-6">
				<div className="flex items-center justify-between gap-4 pb-6">
					<div className="flex items-center gap-4">
						<Input
							type="search"
							placeholder="Search name, email, service..."
							value={search}
							onChange={handleSearchChange}
							className="max-w-xs"
						/>
					</div>
				</div>

				{/* Error State */}
				{isError && (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="mb-4 text-destructive">
							<p className="text-lg font-medium">Failed to load contacts</p>
							<p className="text-sm text-muted-foreground">
								{(error as Error)?.message || "Something went wrong"}
							</p>
						</div>
						<Button onClick={() => refetch()} variant="outline">
							Try Again
						</Button>
					</div>
				)}

				{/* Loading State */}
				{isLoading && !contactsData && (
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<div className="mb-4">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
							</div>
							<p className="text-muted-foreground">Loading contacts...</p>
						</div>
					</div>
				)}

				{/* Data Table */}
				{!isLoading && !isError && contactsData && (
					<DataTable
						data={contactsData?.data || []}
						columns={columns}
						isPending={isLoading}
						pagination={{
							pageIndex: (contactsData.meta?.page || 1) - 1,
							pageSize: pagination.pageSize,
							total: contactsData.meta?.total || 0,
						}}
						onPaginationChange={(newPagination) => {
							setPagination({
								pageIndex: newPagination.pageIndex + 1,
								pageSize: newPagination.pageSize,
							});
						}}
					/>
				)}
			</div>

			{/* View Details Modal */}
			<Modal open={viewModalOpen} onOpenChange={setViewModalOpen}>
				<ModalContent className="max-w-md">
					<ModalHeader>
						<ModalTitle>Contact Details</ModalTitle>
					</ModalHeader>
					{selectedContact && (
						<div className="space-y-4 p-4">
							<div>
								<h4 className="font-semibold text-sm text-muted-foreground">
									Full Name
								</h4>
								<p className="text-base">{selectedContact.fullName}</p>
							</div>
							<div>
								<h4 className="font-semibold text-sm text-muted-foreground">
									Email
								</h4>
								<p className="text-base">{selectedContact.email}</p>
							</div>
							<div>
								<h4 className="font-semibold text-sm text-muted-foreground">
									WhatsApp
								</h4>
								<p className="text-base">{selectedContact.whatsappNumber}</p>
							</div>
							<div>
								<h4 className="font-semibold text-sm text-muted-foreground">
									Service Required
								</h4>
								<p className="text-base">{selectedContact.serviceRequired}</p>
							</div>
							<div>
								<h4 className="font-semibold text-sm text-muted-foreground">
									Project Budget
								</h4>
								<p className="text-base">{selectedContact.projectBudget}</p>
							</div>
							<div>
								<h4 className="font-semibold text-sm text-muted-foreground">
									Project Description
								</h4>
								<p className="text-base whitespace-pre-wrap">
									{selectedContact.projectDescription}
								</p>
							</div>
							<div>
								<h4 className="font-semibold text-sm text-muted-foreground">
									Submitted At
								</h4>
								<p className="text-base">
									{formatDate(selectedContact.createdAt)}
								</p>
							</div>
						</div>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

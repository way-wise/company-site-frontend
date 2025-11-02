"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCancelLeave,
  useDeleteLeave,
  useMyLeaves,
} from "@/hooks/useLeaveMutations";
import { LeaveApplicationWithRelations } from "@/types";
import { Calendar, Edit, MoreVertical, Trash, X } from "lucide-react";
import { useState } from "react";
import { LeaveDetailsModal } from "./leave-details-modal";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
    CANCELLED: "bg-gray-100 text-gray-800 border-gray-300",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${
        colors[status] || colors.PENDING
      }`}
    >
      {status}
    </span>
  );
};

const getTypeBadge = (type: { name: string; color: string | null }) => {
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: type.color ? `${type.color}20` : undefined,
        color: type.color || undefined,
        borderColor: type.color || "#gray",
      }}
    >
      {type.name}
    </span>
  );
};

export const LeaveTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] =
    useState<LeaveApplicationWithRelations | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: leavesData, isLoading } = useMyLeaves({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    status: statusFilter === "all" ? "" : statusFilter,
  });

  const { mutate: deleteLeave } = useDeleteLeave();
  const { mutate: cancelLeave } = useCancelLeave();

  const meta = leavesData?.data?.meta || { page: 1, limit: 10, total: 0 };
  const leaves = leavesData?.data?.result || [];

  const handleDelete = () => {
    if (selectedLeave) {
      deleteLeave(selectedLeave.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedLeave(null);
        },
      });
    }
  };

  const handleCancel = () => {
    if (selectedLeave) {
      cancelLeave(selectedLeave.id, {
        onSuccess: () => {
          setCancelModalOpen(false);
          setSelectedLeave(null);
        },
      });
    }
  };

  const columns = [
    {
      accessorKey: "leaveType",
      header: "Type",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) =>
        getTypeBadge(row.original.leaveType),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) =>
        formatDate(row.original.startDate),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) =>
        formatDate(row.original.endDate),
    },
    {
      accessorKey: "totalDays",
      header: "Days",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) =>
        row.original.totalDays,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) =>
        getStatusBadge(row.original.status),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) => (
        <span className="max-w-xs truncate">{row.original.reason}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) =>
        formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: LeaveApplicationWithRelations } }) => {
        const leave = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedLeave(leave);
                    setDetailsModalOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </DropdownMenuItem>
              {leave.status === "PENDING" && (
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={() => {
                      setSelectedLeave(leave);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </DropdownMenuItem>
              )}
              {leave.status === "APPROVED" && (
                <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-orange-600"
                    onClick={() => {
                      setSelectedLeave(leave);
                      setCancelModalOpen(true);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">My Leaves</h2>
        </div>
      </div>

      <div className="flex items-center gap-4 pb-6">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPagination({ pageIndex: 1, pageSize: pagination.pageSize });
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={leaves}
        isPending={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: meta.total,
        }}
        onPaginationChange={(newPagination) => {
          setPagination({
            pageIndex: newPagination.pageIndex,
            pageSize: newPagination.pageSize,
          });
        }}
      />

      {/* Leave Details Modal */}
      <LeaveDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
      />

      {/* Delete Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Delete Leave Application</ModalTitle>
          </ModalHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this leave application? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedLeave(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Cancel Modal */}
      <Modal open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Cancel Leave Application</ModalTitle>
          </ModalHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel this approved leave? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCancelModalOpen(false);
                  setSelectedLeave(null);
                }}
              >
                No
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Yes, Cancel
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

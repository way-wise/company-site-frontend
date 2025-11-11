"use client";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { LeaveApplicationWithRelations } from "@/types";
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  User,
  X,
} from "lucide-react";

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveApplicationWithRelations | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
      className={`px-3 py-1 rounded-full text-sm font-medium border ${
        colors[status] || colors.PENDING
      }`}
    >
      {status}
    </span>
  );
};

export const LeaveDetailsModal = ({
  isOpen,
  onClose,
  leave,
}: LeaveDetailsModalProps) => {
  if (!leave) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Leave Application Details
          </ModalTitle>
        </ModalHeader>

        <div className="space-y-6 py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Status
              </h3>
              {getStatusBadge(leave.status)}
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Days
              </h3>
              <p className="text-2xl font-bold">{leave.totalDays}</p>
            </div>
          </div>

          {/* Leave Type */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Leave Type
            </h3>
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: leave.leaveTypeMeta.color }}
                aria-hidden
              />
              <p className="text-base font-medium">
                {leave.leaveTypeMeta.label}
              </p>
            </div>
            {leave.leaveTypeMeta.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {leave.leaveTypeMeta.description}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </h3>
              <p className="text-base">{formatDate(leave.startDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </h3>
              <p className="text-base">{formatDate(leave.endDate)}</p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reason
            </h3>
            <p className="text-base bg-muted p-3 rounded-md">{leave.reason}</p>
          </div>

          {/* Attachment */}
          {leave.attachmentUrl && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Attachment
              </h3>
              <a
                href={leave.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-base break-all"
              >
                {leave.attachmentUrl}
              </a>
            </div>
          )}

          {/* Approver Info */}
          {leave.approver && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                {leave.status === "APPROVED" ? "Approved By" : "Processed By"}
              </h3>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-base font-medium">
                  {leave.approver.user.name}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="h-3 w-3" />
                  {leave.approver.user.email}
                </p>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {leave.status === "REJECTED" && leave.rejectionReason && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Rejection Reason
              </h3>
              <p className="text-base bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-md text-red-900 dark:text-red-100">
                {leave.rejectionReason}
              </p>
            </div>
          )}

          {/* Admin Comments */}
          {leave.comments && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Admin Comments
              </h3>
              <p className="text-base bg-muted p-3 rounded-md">
                {leave.comments}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Created
              </h3>
              <p className="text-sm">{formatDateTime(leave.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Updated
              </h3>
              <p className="text-sm">{formatDateTime(leave.updatedAt)}</p>
            </div>
          </div>

          {/* Cancelled Date */}
          {leave.cancelledAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancelled At
              </h3>
              <p className="text-base">{formatDateTime(leave.cancelledAt)}</p>
            </div>
          )}

          {/* Applicant Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Applicant
            </h3>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-base font-medium">
                {leave.userProfile.user.name}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-3 w-3" />
                {leave.userProfile.user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

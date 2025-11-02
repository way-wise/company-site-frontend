"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useRejectLeave } from "@/hooks/useLeaveMutations";
import { LeaveApplicationWithRelations } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const rejectLeaveSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Rejection reason cannot exceed 500 characters"),
  comments: z.string().max(500, "Comments cannot exceed 500 characters").optional(),
});

type RejectLeaveFormData = z.infer<typeof rejectLeaveSchema>;

interface RejectLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveApplicationWithRelations | null;
}

export const RejectLeaveModal = ({
  isOpen,
  onClose,
  leave,
}: RejectLeaveModalProps) => {
  const rejectLeaveMutation = useRejectLeave();

  const form = useForm<RejectLeaveFormData>({
    resolver: zodResolver(rejectLeaveSchema),
    defaultValues: {
      rejectionReason: "",
      comments: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        rejectionReason: "",
        comments: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: RejectLeaveFormData) => {
    if (!leave) return;

    try {
      await rejectLeaveMutation.mutateAsync({
        leaveId: leave.id,
        data: {
          rejectionReason: data.rejectionReason,
          comments: data.comments || undefined,
        },
      });
      form.reset();
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  if (!leave) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Reject Leave Application</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please provide a reason for rejecting this leave application.
              </p>
              <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                <div>
                  <span className="font-medium">Employee:</span>{" "}
                  {leave.userProfile.user.name}
                </div>
                <div>
                  <span className="font-medium">Leave Type:</span>{" "}
                  {leave.leaveType.name}
                </div>
                <div>
                  <span className="font-medium">Period:</span>{" "}
                  {new Date(leave.startDate).toLocaleDateString()} -{" "}
                  {new Date(leave.endDate).toLocaleDateString()} (
                  {leave.totalDays} days)
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a detailed reason for rejection..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional comments..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={rejectLeaveMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={rejectLeaveMutation.isPending}
                isLoading={rejectLeaveMutation.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                {rejectLeaveMutation.isPending
                  ? "Rejecting..."
                  : "Reject Leave"}
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
};


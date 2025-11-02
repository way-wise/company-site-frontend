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
import { useApproveLeave } from "@/hooks/useLeaveMutations";
import { LeaveApplicationWithRelations } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const approveLeaveSchema = z.object({
  comments: z.string().max(500, "Comments cannot exceed 500 characters").optional(),
});

type ApproveLeaveFormData = z.infer<typeof approveLeaveSchema>;

interface ApproveLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveApplicationWithRelations | null;
}

export const ApproveLeaveModal = ({
  isOpen,
  onClose,
  leave,
}: ApproveLeaveModalProps) => {
  const approveLeaveMutation = useApproveLeave();

  const form = useForm<ApproveLeaveFormData>({
    resolver: zodResolver(approveLeaveSchema),
    defaultValues: {
      comments: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        comments: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: ApproveLeaveFormData) => {
    if (!leave) return;

    try {
      await approveLeaveMutation.mutateAsync({
        leaveId: leave.id,
        data: {
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
          <ModalTitle>Approve Leave Application</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to approve this leave application?
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
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any comments about this approval..."
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
                disabled={approveLeaveMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={approveLeaveMutation.isPending}
                isLoading={approveLeaveMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {approveLeaveMutation.isPending
                  ? "Approving..."
                  : "Approve Leave"}
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
};


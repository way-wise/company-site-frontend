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
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { useApplyLeave } from "@/hooks/useLeaveMutations";
import { useActiveLeaveTypes } from "@/hooks/useLeaveTypeMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const applyLeaveSchema = z
  .object({
    leaveTypeId: z.string().min(1, "Leave type is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z
      .string()
      .min(10, "Reason must be at least 10 characters")
      .max(500, "Reason cannot exceed 500 characters"),
    attachmentUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  });

type ApplyLeaveFormData = z.infer<typeof applyLeaveSchema>;

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyLeaveModal({
  isOpen,
  onClose,
}: ApplyLeaveModalProps) {
  const { data: leaveTypesData, isLoading: isLeaveTypesLoading } =
    useActiveLeaveTypes();
  const applyLeaveMutation = useApplyLeave();

  const leaveTypes = leaveTypesData?.data || [];

  const form = useForm<ApplyLeaveFormData>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      reason: "",
      attachmentUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
        attachmentUrl: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: ApplyLeaveFormData) => {
    try {
      await applyLeaveMutation.mutateAsync(data);
      onClose();
    } catch (error) {
      console.error("Error applying for leave:", error);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Apply for Leave</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="leaveTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLeaveTypesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            {type.color && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: type.color }}
                              />
                            )}
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a detailed reason for your leave..."
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
              name="attachmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://..."
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
                disabled={applyLeaveMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={applyLeaveMutation.isPending}
                isLoading={applyLeaveMutation.isPending}
              >
                {applyLeaveMutation.isPending ? "Applying..." : "Apply for Leave"}
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}


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
import { LEAVE_TYPE_OPTIONS } from "@/constants/leave-types";
import { useApplyLeave } from "@/hooks/useLeaveMutations";
import { LEAVE_TYPE_VALUES } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const applyLeaveSchema = z
  .object({
    leaveType: z.enum(LEAVE_TYPE_VALUES).optional(),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        {
          message: "Start date must be a valid date",
        }
      ),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        {
          message: "End date must be a valid date",
        }
      ),
    reason: z
      .string()
      .min(10, "Reason must be at least 10 characters")
      .max(500, "Reason cannot exceed 500 characters"),
    attachmentUrl: z
      .union([
        z.string().url("Invalid attachment URL"),
        z.literal(""),
        z.undefined(),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: "End date must be greater than or equal to start date",
      path: ["endDate"],
    }
  );

type ApplyLeaveFormData = z.infer<typeof applyLeaveSchema>;

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyLeaveModal({
  isOpen,
  onClose,
}: ApplyLeaveModalProps) {
  const applyLeaveMutation = useApplyLeave();

  const form = useForm<ApplyLeaveFormData>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      leaveType: undefined,
      startDate: "",
      endDate: "",
      reason: "",
      attachmentUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        leaveType: undefined,
        startDate: "",
        endDate: "",
        reason: "",
        attachmentUrl: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: ApplyLeaveFormData) => {
    try {
      // Normalize optional fields to undefined
      const submitData = {
        ...data,
        leaveType: data.leaveType ?? undefined,
        attachmentUrl: data.attachmentUrl || undefined,
      };
      await applyLeaveMutation.mutateAsync(submitData);
      onClose();
    } catch {
      // Error is handled by the mutation hook
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
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEAVE_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: type.color }}
                              aria-hidden
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {type.description}
                              </span>
                            </div>
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
                    <Input type="url" placeholder="https://..." {...field} />
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
                {applyLeaveMutation.isPending
                  ? "Applying..."
                  : "Apply for Leave"}
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}

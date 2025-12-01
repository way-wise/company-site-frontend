"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
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
import { Textarea } from "@/components/ui/textarea";
import { Milestone } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const markAsPaidSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  paidAt: z.string().min(1, "Payment date is required"),
  manualPaymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

type MarkAsPaidFormData = z.infer<typeof markAsPaidSchema>;

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
  onSubmit: (data: MarkAsPaidFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function MarkAsPaidModal({
  isOpen,
  onClose,
  milestone,
  onSubmit,
  isLoading = false,
}: MarkAsPaidModalProps) {
  const form = useForm<MarkAsPaidFormData>({
    resolver: zodResolver(markAsPaidSchema),
    defaultValues: {
      amount: milestone?.cost ? Number(milestone.cost) : 0,
      paidAt: new Date().toISOString().split("T")[0],
      manualPaymentMethod: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: MarkAsPaidFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!milestone) return null;

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Mark Payment as Paid</ModalTitle>
        </ModalHeader>

        <div className="space-y-4">
          {/* Warning Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">
                  Manual Payment Recording
                </h4>
                <p className="text-sm text-yellow-800">
                  You are about to manually mark this milestone as paid. This
                  should only be used when the client has paid through a system
                  other than Stripe (e.g., bank transfer, cash, check). This
                  action will create a permanent payment record and cannot be
                  easily reversed.
                </p>
              </div>
            </div>
          </div>

          {/* Milestone Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Milestone Details
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Milestone:</span>
                <span className="font-medium text-gray-900">
                  {milestone.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-medium text-gray-900">
                  ${Number(milestone.cost || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-yellow-700">
                  {milestone.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormFieldset disabled={isLoading}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Payment Amount ($)
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paidAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Payment Date
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manualPaymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Payment Method
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Bank Transfer, Cash, Check, Wire Transfer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional details about this payment..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    {isLoading ? "Processing..." : "Confirm Payment"}
                  </Button>
                </div>
              </FormFieldset>
            </form>
          </Form>
        </div>
      </ModalContent>
    </Modal>
  );
}


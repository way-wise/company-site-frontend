"use client";

import {
  UpdateMilestoneFormData,
  updateMilestoneSchema,
} from "@/components/modules/admin/projectValidation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateMilestone } from "@/hooks/useMilestoneMutations";
import { Milestone } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UpdateMilestoneProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

export default function UpdateMilestone({
  isOpen,
  onClose,
  milestone,
}: UpdateMilestoneProps) {
  const updateMilestoneMutation = useUpdateMilestone();

  const form = useForm<UpdateMilestoneFormData>({
    resolver: zodResolver(updateMilestoneSchema),
    defaultValues: {
      name: "",
      description: "",
      cost: 0,
      status: "PENDING",
      startDate: undefined,
      endDate: undefined,
    },
  });

  useEffect(() => {
    if (milestone && isOpen) {
      // Format dates for input fields (YYYY-MM-DD format)
      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      form.reset({
        name: milestone.name,
        description: milestone.description || "",
        cost: milestone.cost || 0,
        status: milestone.status,
        startDate: formatDateForInput(milestone.startDate) || undefined,
        endDate: formatDateForInput(milestone.endDate) || undefined,
      });
    }
  }, [milestone, isOpen, form]);

  const handleSubmit = async (values: UpdateMilestoneFormData) => {
    if (!milestone) return;

    try {
      // Convert empty date strings to undefined
      const submitData = {
        ...values,
        startDate:
          values.startDate && values.startDate.trim() !== ""
            ? values.startDate
            : undefined,
        endDate:
          values.endDate && values.endDate.trim() !== ""
            ? values.endDate
            : undefined,
      };
      await updateMilestoneMutation.mutateAsync({
        milestoneId: milestone.id,
        milestoneData: submitData,
      });
      onClose();
    } catch {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Update Milestone</ModalTitle>
        </ModalHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldset disabled={updateMilestoneMutation.isPending}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Milestone Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Milestone Description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
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
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                        />
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
                        <Input
                          type="date"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ""}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 py-5">
                <Button type="button" onClick={onClose} variant="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={updateMilestoneMutation.isPending}
                >
                  Update Milestone
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}

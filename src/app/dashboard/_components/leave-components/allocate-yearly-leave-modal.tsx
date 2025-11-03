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
import { useAllocateYearlyLeaveForAll } from "@/hooks/useLeaveBalanceMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const allocateYearlyLeaveSchema = z.object({
  year: z
    .number()
    .int("Year must be an integer")
    .min(2000, "Year must be after 2000")
    .max(2100, "Year must be before 2100"),
  totalDays: z
    .number()
    .int("Days must be an integer")
    .min(0, "Days cannot be negative")
    .max(365, "Days cannot exceed 365"),
});

type AllocateYearlyLeaveFormData = z.infer<typeof allocateYearlyLeaveSchema>;

interface AllocateYearlyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllocateYearlyLeaveModal({
  isOpen,
  onClose,
}: AllocateYearlyLeaveModalProps) {
  const allocateMutation = useAllocateYearlyLeaveForAll();

  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = -2; i <= 2; i++) {
      years.push(currentYear + i);
    }
    return years;
  }, [currentYear]);

  const form = useForm<AllocateYearlyLeaveFormData>({
    resolver: zodResolver(allocateYearlyLeaveSchema),
    defaultValues: {
      year: currentYear,
      totalDays: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        year: currentYear,
        totalDays: 0,
      });
    }
  }, [isOpen, currentYear, form]);

  const onSubmit = (values: AllocateYearlyLeaveFormData) => {
    allocateMutation.mutate(
      {
        year: values.year,
        totalDays: values.totalDays,
      },
      {
        onSuccess: () => {
          onClose();
          form.reset();
        },
      }
    );
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="sm:max-w-[500px]">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Allocate Yearly Leave for All Employees
          </ModalTitle>
        </ModalHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Yearly Leave Days</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total leave days"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? 0 : parseInt(value, 10));
                      }}
                      value={field.value || ""}
                      min={0}
                      max={365}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    This will allocate the same leave days to all employees for
                    the selected year.
                  </p>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={allocateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={allocateMutation.isPending}
              >
                {allocateMutation.isPending ? "Allocating..." : "Allocate Leave"}
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}


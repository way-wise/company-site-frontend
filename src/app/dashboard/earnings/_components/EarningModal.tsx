"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEarning,
  useUpdateEarning,
} from "@/hooks/useEarningMutations";
import { useProjects } from "@/hooks/useProjectMutations";
import { Earning, EarningFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const earningSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  projectId: z.string().optional(),
  category: z.string().optional(),
});

interface EarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  earning?: Earning | null;
}

export function EarningModal({
  isOpen,
  onClose,
  earning,
}: EarningModalProps) {
  const createMutation = useCreateEarning();
  const updateMutation = useUpdateEarning();
  const { data: projectsData } = useProjects({
    page: 1,
    limit: 100,
  });

  const form = useForm<EarningFormData>({
    resolver: zodResolver(earningSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      projectId: undefined,
      category: "",
    },
  });

  useEffect(() => {
    if (earning) {
      form.reset({
        amount: earning.amount,
        description: earning.description || "",
        date: new Date(earning.date).toISOString().split("T")[0],
        projectId: earning.projectId || undefined,
        category: earning.category || "",
      });
    } else {
      form.reset({
        amount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
        projectId: undefined,
        category: "",
      });
    }
  }, [earning, isOpen, form]);

  const onSubmit = async (data: EarningFormData) => {
    try {
      const projectId = data.projectId && data.projectId !== "none" ? data.projectId : undefined;
      
      if (earning) {
        await updateMutation.mutateAsync({
          earningId: earning.id,
          earningData: {
            amount: data.amount,
            description: data.description,
            date: new Date(data.date).toISOString(),
            projectId,
            category: data.category,
          },
        });
      } else {
        await createMutation.mutateAsync({
          amount: data.amount,
          description: data.description,
          date: new Date(data.date).toISOString(),
          projectId,
          category: data.category,
        });
      }
      onClose();
      form.reset();
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {earning ? "Edit Earning" : "Add New Earning"}
          </DialogTitle>
          <DialogDescription>
            {earning
              ? "Update the earning details below."
              : "Add a new earning entry to track company revenue."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? undefined : value);
                    }}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Project</SelectItem>
                      {((projectsData?.data as { data?: { result?: Array<{ id: string; name: string }> } })?.data?.result || []).map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Service, Product, Consulting"
                      {...field}
                    />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a description for this earning..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? earning
                    ? "Updating..."
                    : "Creating..."
                  : earning
                    ? "Update Earning"
                    : "Create Earning"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateExpense,
  useUpdateExpense,
} from "@/hooks/useExpenseMutations";
import { Expense, ExpenseFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const expenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  category: z.string().optional(),
  receiptUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export function ExpenseModal({
  isOpen,
  onClose,
  expense,
}: ExpenseModalProps) {
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      receiptUrl: "",
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount,
        description: expense.description || "",
        date: new Date(expense.date).toISOString().split("T")[0],
        category: expense.category || "",
        receiptUrl: expense.receiptUrl || "",
      });
    } else {
      form.reset({
        amount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        receiptUrl: "",
      });
    }
  }, [expense, isOpen, form]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (expense) {
        await updateMutation.mutateAsync({
          expenseId: expense.id,
          expenseData: {
            amount: data.amount,
            description: data.description,
            date: new Date(data.date).toISOString(),
            category: data.category,
            receiptUrl: data.receiptUrl || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          amount: data.amount,
          description: data.description,
          date: new Date(data.date).toISOString(),
          category: data.category,
          receiptUrl: data.receiptUrl || undefined,
        });
      }
      onClose();
      form.reset();
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const receiptUrl = form.watch("receiptUrl");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {expense
              ? "Update the expense details below."
              : "Add a new expense entry to track company costs."}
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Office Supplies, Travel, Software"
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
                      placeholder="Add a description for this expense..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiptUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt URL (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/receipt.pdf"
                        {...field}
                      />
                      {receiptUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(receiptUrl, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
                  ? expense
                    ? "Updating..."
                    : "Creating..."
                  : expense
                    ? "Update Expense"
                    : "Create Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


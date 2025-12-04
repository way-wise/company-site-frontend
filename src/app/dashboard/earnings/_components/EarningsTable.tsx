"use client";

import { DeleteModal } from "@/components/shared/DeleteModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/UserContext";
import {
  useDeleteEarning,
  useEarnings,
  useProjectEarnings,
} from "@/hooks/useEarningMutations";
import {
  useDeleteExpense,
  useExpenses,
} from "@/hooks/useExpenseMutations";
import { Earning, Expense } from "@/types";
import { Download, Edit, MoreVertical, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { EarningModal } from "./EarningModal";
import { ExpenseModal } from "./ExpenseModal";

interface EarningsTableProps {
  startDate?: string;
  endDate?: string;
}

export function EarningsTable({ startDate, endDate }: EarningsTableProps) {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission("create_earning") || hasPermission("create_expense");
  const canEdit = hasPermission("update_earning") || hasPermission("update_expense");
  const canDelete = hasPermission("delete_earning") || hasPermission("delete_expense");

  const [earningModalOpen, setEarningModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState<Earning | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "earning" | "expense";
    id: string;
    name: string;
  } | null>(null);

  const { data: earningsData, isLoading: earningsLoading } = useEarnings({
    page: 1,
    limit: 1000,
    startDate,
    endDate,
  });

  const { data: expensesData, isLoading: expensesLoading } = useExpenses({
    page: 1,
    limit: 1000,
    startDate,
    endDate,
  });

  const { data: projectEarningsData } = useProjectEarnings(startDate, endDate);
  const deleteEarningMutation = useDeleteEarning();
  const deleteExpenseMutation = useDeleteExpense();

  const isLoading = earningsLoading || expensesLoading;

  // Combine manual earnings with project earnings
  const allEarnings = useMemo(() => {
    // Access earnings data - try the pattern used in other components first
    const earningsResponse = earningsData?.data;
    let earningsList: Earning[] = [];
    
    if (earningsResponse && typeof earningsResponse === 'object') {
      // Pattern used in project table: data.result
      if ('result' in earningsResponse && Array.isArray(earningsResponse.result)) {
        earningsList = earningsResponse.result as Earning[];
      }
      // Fallback: { success: true, data: { meta: {...}, result: [...] } }
      else if ('data' in earningsResponse && earningsResponse.data && typeof earningsResponse.data === 'object' && 'result' in earningsResponse.data) {
        earningsList = Array.isArray((earningsResponse.data as { result: unknown }).result) 
          ? (earningsResponse.data as { result: Earning[] }).result 
          : [];
      }
    }
    
    const manualEarnings: (Earning & { source: "manual" })[] =
      earningsList.map((e) => ({
        ...e,
        source: "manual" as const,
      }));

    // Access project earnings data - response structure: { success: true, data: [...] }
    const projectEarningsResponse = projectEarningsData?.data;
    let projectEarningsList: Array<{ projectId: string; projectName: string; totalAmount: number }> = [];
    
    if (projectEarningsResponse && typeof projectEarningsResponse === 'object') {
      // Structure: { success: true, data: [...] }
      if ('data' in projectEarningsResponse && Array.isArray(projectEarningsResponse.data)) {
        projectEarningsList = projectEarningsResponse.data;
      }
      // Structure: [...] (direct array)
      else if (Array.isArray(projectEarningsResponse)) {
        projectEarningsList = projectEarningsResponse;
      }
    }

    const projectEarnings: (Earning & { source: "project" })[] =
      projectEarningsList.flatMap((pe) => ({
        id: `project-${pe.projectId}`,
        amount: pe.totalAmount,
        description: `Project earnings from ${pe.projectName}`,
        date: new Date().toISOString(),
        projectId: pe.projectId,
        project: { id: pe.projectId, name: pe.projectName },
        category: "Project Earnings",
        createdBy: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: "project" as const,
      }));

    return [...manualEarnings, ...projectEarnings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [earningsData, projectEarningsData]);

  const allExpenses = useMemo(() => {
    // Access expenses data - try the pattern used in other components first
    const expensesResponse = expensesData?.data;
    let expensesList: Expense[] = [];
    
    if (expensesResponse && typeof expensesResponse === 'object') {
      // Pattern used in project table: data.result
      if ('result' in expensesResponse && Array.isArray(expensesResponse.result)) {
        expensesList = expensesResponse.result as Expense[];
      }
      // Fallback: { success: true, data: { meta: {...}, result: [...] } }
      else if ('data' in expensesResponse && expensesResponse.data && typeof expensesResponse.data === 'object' && 'result' in expensesResponse.data) {
        expensesList = Array.isArray((expensesResponse.data as { result: unknown }).result)
          ? (expensesResponse.data as { result: Expense[] }).result
          : [];
      }
    }
    
    return expensesList.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expensesData]);

  // Combine and sort by date
  const combinedData = useMemo(() => {
    const earnings = allEarnings.map((e) => ({
      type: "earning" as const,
      id: e.id,
      date: e.date,
      amount: e.amount,
      description: e.description,
      category: e.category,
      project: e.project,
      source: e.source,
      data: e,
    }));

    const expenses = allExpenses.map((e) => ({
      type: "expense" as const,
      id: e.id,
      date: e.date,
      amount: e.amount,
      description: e.description,
      category: e.category,
      receiptUrl: e.receiptUrl,
      data: e,
    }));

    return [...earnings, ...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [allEarnings, allExpenses]);

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "earning") {
        await deleteEarningMutation.mutateAsync(itemToDelete.id);
      } else {
        await deleteExpenseMutation.mutateAsync(itemToDelete.id);
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Amount", "Description", "Category", "Project"];
    const rows = combinedData.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.type === "earning" ? "Earning" : "Expense",
      item.amount.toString(),
      item.description || "",
      item.category || "",
      item.type === "earning" && "project" in item && item.project
        ? item.project.name
        : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totalEarnings = allEarnings.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalExpenses = allExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netTotal = totalEarnings - totalExpenses;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Earnings & Expenses</CardTitle>
            <div className="flex gap-2">
              {canCreate && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedEarning(null);
                      setEarningModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Earning
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedExpense(null);
                      setExpenseModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : combinedData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No earnings or expenses found for the selected period.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Project</TableHead>
                      {canEdit || canDelete ? <TableHead>Actions</TableHead> : null}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combinedData.map((item) => (
                      <TableRow key={`${item.type}-${item.id}`}>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === "earning"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.type === "earning" ? "Earning" : "Expense"}
                          </span>
                        </TableCell>
                        <TableCell
                          className={
                            item.type === "earning"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {item.type === "earning" ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.description || "-"}
                        </TableCell>
                        <TableCell>{item.category || "-"}</TableCell>
                        <TableCell>
                          {item.type === "earning" &&
                          "project" in item &&
                          item.project
                            ? item.project.name
                            : "-"}
                        </TableCell>
                        {(canEdit || canDelete) &&
                          (item.type === "expense" ||
                            (item.type === "earning" &&
                              "source" in item &&
                              (item as { source?: string }).source === "manual")) && (
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVertical className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {canEdit && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (item.type === "earning") {
                                          setSelectedEarning(item.data as Earning);
                                          setEarningModalOpen(true);
                                        } else {
                                          setSelectedExpense(item.data as Expense);
                                          setExpenseModalOpen(true);
                                        }
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  {canDelete && (
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() => {
                                        setItemToDelete({
                                          type: item.type,
                                          id: item.id,
                                          name:
                                            item.type === "earning"
                                              ? `Earning of ${formatCurrency(item.amount)}`
                                              : `Expense of ${formatCurrency(item.amount)}`,
                                        });
                                        setDeleteModalOpen(true);
                                      }}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(totalEarnings)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Total</p>
                  <p
                    className={`text-lg font-semibold ${
                      netTotal >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(netTotal)}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <EarningModal
        isOpen={earningModalOpen}
        onClose={() => {
          setEarningModalOpen(false);
          setSelectedEarning(null);
        }}
        earning={selectedEarning}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDelete}
        itemName={itemToDelete?.name}
        isLoading={
          deleteEarningMutation.isPending || deleteExpenseMutation.isPending
        }
      />
    </>
  );
}


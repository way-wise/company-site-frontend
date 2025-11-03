"use client";

import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/UserContext";
import { useEmployeesLeaveSummary } from "@/hooks/useLeaveBalanceMutations";
import { EmployeeLeaveSummary } from "@/services/LeaveBalanceService";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";

interface LeaveBreakdownItem {
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeColor: string | null;
  usedDays: number;
  remainingDays: number;
  totalDays: number;
}

export const LeaveSummaryTable = () => {
  const { hasPermission, isLoading: isAuthLoading } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const canViewAllEmployees =
    !isAuthLoading && hasPermission("view_team_leaves");

  const {
    data: summaryData,
    isLoading,
    error,
  } = useEmployeesLeaveSummary(year, {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    enabled: !isAuthLoading,
  });

  // Extract data and meta from response
  // Response structure: { success, message, data: EmployeeLeaveSummary[], meta: { page, limit, total } }
  const meta = summaryData?.meta || { page: 1, limit: 10, total: 0 };
  const summaries =
    (summaryData?.data as EmployeeLeaveSummary[] | undefined) || [];

  // Generate year options (current year ± 2 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -2; i <= 2; i++) {
      years.push(currentYear + i);
    }
    return years;
  }, []);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "employeeName",
        header: "Employee Name",
        cell: ({ row }: { row: { original: EmployeeLeaveSummary } }) => (
          <div>
            <span className="font-medium">{row.original.employeeName}</span>
            <p className="text-xs text-muted-foreground">
              {row.original.employeeEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "totalUsedDays",
        header: "Leave Taken",
        cell: ({ row }: { row: { original: EmployeeLeaveSummary } }) => (
          <div className="text-center">
            <span className="font-semibold text-lg">
              {row.original.totalUsedDays}
            </span>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        ),
      },
      {
        accessorKey: "totalRemainingDays",
        header: "Remaining",
        cell: ({ row }: { row: { original: EmployeeLeaveSummary } }) => (
          <div className="text-center">
            <span
              className={`font-semibold text-lg ${
                row.original.totalRemainingDays < 5
                  ? "text-red-600"
                  : row.original.totalRemainingDays < 10
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {row.original.totalRemainingDays}
            </span>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        ),
      },
      {
        accessorKey: "totalDays",
        header: "Total Allocated",
        cell: ({ row }: { row: { original: EmployeeLeaveSummary } }) => (
          <div className="text-center">
            <span className="font-medium">{row.original.totalDays}</span>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        ),
      },
    ];
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">
            {canViewAllEmployees
              ? "Employee Leave Summary"
              : "My Leave Summary"}
          </h2>
        </div>
        <Select
          value={year.toString()}
          onValueChange={(value) => {
            setYear(parseInt(value));
            setPagination({ pageIndex: 1, pageSize: pagination.pageSize });
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((yr) => (
              <SelectItem key={yr} value={yr.toString()}>
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load leave summary:{" "}
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      )}

      {!error && summaries.length === 0 && !isLoading && !isAuthLoading && (
        <div className="rounded-lg border p-4 text-center">
          <p className="text-muted-foreground">
            No leave summary data available for {year}. Employees may not have
            leave balances allocated for this year.
          </p>
        </div>
      )}

      {!error && (summaries.length > 0 || isLoading || isAuthLoading) && (
        <DataTable
          columns={columns}
          data={summaries}
          isPending={isLoading || isAuthLoading}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            total: meta.total,
          }}
          onPaginationChange={(newPagination) => {
            setPagination({
              pageIndex: newPagination.pageIndex,
              pageSize: newPagination.pageSize,
            });
          }}
        />
      )}
    </div>
  );
};

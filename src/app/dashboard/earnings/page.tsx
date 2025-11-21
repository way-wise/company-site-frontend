"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EarningsStats } from "./_components/EarningsStats";
import { EarningsTable } from "./_components/EarningsTable";
import { useAuth } from "@/context/UserContext";
import { useMemo, useState } from "react";
import { redirect } from "next/navigation";

export default function EarningsPage() {
  const { hasPermission, isLoading: authLoading } = useAuth();
  const [dateFilter, setDateFilter] = useState<"all" | "month" | "year">("all");

  const canRead = hasPermission("read_earning") || hasPermission("read_expense");

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    let start: string | undefined;
    let end: string | undefined;

    if (dateFilter === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    } else if (dateFilter === "year") {
      start = new Date(now.getFullYear(), 0, 1).toISOString();
      end = new Date(now.getFullYear(), 11, 31).toISOString();
    }

    return { startDate: start, endDate: end };
  }, [dateFilter]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canRead) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings & Expenses</h1>
          <p className="text-muted-foreground mt-2">
            Track company earnings and expenses with detailed reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={(v: "all" | "month" | "year") => setDateFilter(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <EarningsStats startDate={startDate} endDate={endDate} />

      <EarningsTable startDate={startDate} endDate={endDate} />
    </div>
  );
}


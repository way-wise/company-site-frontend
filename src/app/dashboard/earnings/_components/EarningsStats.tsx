"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useEarningStats,
  useProjectEarnings,
} from "@/hooks/useEarningMutations";
import { useExpenseStats } from "@/hooks/useExpenseMutations";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface EarningsStatsProps {
  startDate?: string;
  endDate?: string;
}

export function EarningsStats({ startDate, endDate }: EarningsStatsProps) {
  const { data: earningStatsData, isLoading: earningsLoading } =
    useEarningStats(startDate, endDate);
  const { data: expenseStatsData, isLoading: expensesLoading } =
    useExpenseStats(startDate, endDate);
  const { data: projectEarningsData, isLoading: projectEarningsLoading } =
    useProjectEarnings(startDate, endDate);

  const isLoading =
    earningsLoading || expensesLoading || projectEarningsLoading;

  // Access stats data - response structure: { success: true, data: { ... } }
  const earningStatsResponse = earningStatsData?.data;
  let manualEarnings = 0;

  if (earningStatsResponse && typeof earningStatsResponse === "object") {
    if (
      "data" in earningStatsResponse &&
      earningStatsResponse.data &&
      typeof earningStatsResponse.data === "object"
    ) {
      manualEarnings = Number(
        (earningStatsResponse.data as { totalEarnings?: number })
          ?.totalEarnings || 0
      );
    } else if ("totalEarnings" in earningStatsResponse) {
      manualEarnings = Number(
        (earningStatsResponse as { totalEarnings: number }).totalEarnings || 0
      );
    }
  }

  const projectEarningsResponse = projectEarningsData?.data;
  let projectEarningsList: Array<{ totalAmount: number }> = [];

  if (projectEarningsResponse && typeof projectEarningsResponse === "object") {
    if (
      "data" in projectEarningsResponse &&
      Array.isArray(projectEarningsResponse.data)
    ) {
      projectEarningsList = projectEarningsResponse.data;
    } else if (Array.isArray(projectEarningsResponse)) {
      projectEarningsList = projectEarningsResponse;
    }
  }

  const projectEarnings = projectEarningsList.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const totalEarnings = manualEarnings + projectEarnings;

  const expenseStatsResponse = expenseStatsData?.data;
  let totalExpenses = 0;
  let totalCount = 0;

  if (expenseStatsResponse && typeof expenseStatsResponse === "object") {
    if (
      "data" in expenseStatsResponse &&
      expenseStatsResponse.data &&
      typeof expenseStatsResponse.data === "object"
    ) {
      totalExpenses = Number(
        (expenseStatsResponse.data as { totalExpenses?: number })
          ?.totalExpenses || 0
      );
      totalCount = Number(
        (expenseStatsResponse.data as { totalCount?: number })?.totalCount || 0
      );
    } else {
      totalExpenses = Number(
        (expenseStatsResponse as { totalExpenses?: number })?.totalExpenses || 0
      );
      totalCount = Number(
        (expenseStatsResponse as { totalCount?: number })?.totalCount || 0
      );
    }
  }
  const netProfit = totalEarnings - totalExpenses;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            $
            {totalEarnings.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <CardDescription className="text-xs mt-1">
            Manual: $
            {manualEarnings.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            | Projects: $
            {projectEarnings.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            $
            {totalExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <CardDescription className="text-xs mt-1">
            {totalCount} expense entries
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
          {netProfit >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              netProfit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            $
            {netProfit.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <CardDescription className="text-xs mt-1">
            {netProfit >= 0 ? "Profit" : "Loss"}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          <ArrowUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {totalEarnings > 0
              ? ((netProfit / totalEarnings) * 100).toFixed(1)
              : "0.0"}
            %
          </div>
          <CardDescription className="text-xs mt-1">
            {totalEarnings > 0
              ? `Based on ${totalEarnings.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} earnings`
              : "No earnings data"}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

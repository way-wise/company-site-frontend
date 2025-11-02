"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserLeaveBalances } from "@/hooks/useLeaveBalanceMutations";
import { LeaveBalanceWithRelations } from "@/types";
import { CalendarDays } from "lucide-react";

interface LeaveBalanceCardProps {
  userProfileId: string;
  year?: number;
}

export const LeaveBalanceCard = ({ userProfileId, year }: LeaveBalanceCardProps) => {
  const { data: balancesData, isLoading } = useUserLeaveBalances(
    userProfileId,
    year || new Date().getFullYear()
  );

  const balances = balancesData?.data || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Leave Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!balances || balances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Leave Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No leave balance information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Leave Balance {year || new Date().getFullYear()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {balances.map((balance: LeaveBalanceWithRelations) => (
            <div
              key={balance.id}
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{
                borderLeftColor: balance.leaveType.color || "#ccc",
                borderLeftWidth: "4px",
              }}
            >
              <div>
                <h4 className="font-medium">{balance.leaveType.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {balance.leaveType.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{balance.remainingDays}</div>
                <div className="text-xs text-muted-foreground">
                  of {balance.totalDays} days
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


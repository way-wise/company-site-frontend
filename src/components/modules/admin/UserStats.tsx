"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStats } from "@/hooks/useUserMutations";
import { Shield, UserCheck, Users, UserX } from "lucide-react";

export const UserStats = () => {
  const { data: statsData, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 animate-pulse bg-muted rounded"></div>
              </CardTitle>
              <div className="h-4 w-4 animate-pulse bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 animate-pulse bg-muted rounded mb-1"></div>
              <div className="h-3 w-24 animate-pulse bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <p className="text-muted-foreground">
            Failed to load user statistics
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = statsData?.data || {
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    adminUsers: 0,
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "All registered users",
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      description: "Currently active users",
      color: "text-green-600",
    },
    {
      title: "Banned Users",
      value: stats.bannedUsers,
      icon: UserX,
      description: "Suspended users",
      color: "text-red-600",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: Shield,
      description: "Administrator accounts",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

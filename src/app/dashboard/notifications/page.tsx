"use client";

import Breadcrumb from "@/components/shared/Breadcrumb";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useNotifications, useMarkAllAsRead } from "@/hooks/useNotificationMutations";
import { NotificationType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheck, Bell } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const limit = 20;

  const { data, isLoading, refetch } = useNotifications({
    page,
    limit,
    type: typeFilter !== "all" ? typeFilter : undefined,
    read: readFilter === "read" ? true : readFilter === "unread" ? false : undefined,
  });

  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.data?.result || [];
  const totalPages = data?.data?.meta.totalPages || 0;
  const hasMore = totalPages > page;

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleNavigate = () => {
    // Navigation is handled by NotificationItem
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Notifications", current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        {unreadNotifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={(value) => {
          setTypeFilter(value as NotificationType | "all");
          setPage(1);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="TASK">Tasks</SelectItem>
            <SelectItem value="PROJECT">Projects</SelectItem>
            <SelectItem value="MILESTONE">Milestones</SelectItem>
            <SelectItem value="CHAT">Chat</SelectItem>
            <SelectItem value="FILE">Files</SelectItem>
            <SelectItem value="COMMENT">Comments</SelectItem>
            <SelectItem value="LEAVE">Leave</SelectItem>
            <SelectItem value="PAYMENT">Payments</SelectItem>
            <SelectItem value="SYSTEM">System</SelectItem>
          </SelectContent>
        </Select>

        <Select value={readFilter} onValueChange={(value) => {
          setReadFilter(value as "all" | "read" | "unread");
          setPage(1);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3 p-3 border rounded-lg">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground mt-2">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-2 border rounded-lg divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => refetch()}
                  onNavigate={handleNavigate}
                />
              ))}
              {hasMore && (
                <div className="p-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Load more
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-4">
          {unreadNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <CheckCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No unread notifications</p>
              <p className="text-sm text-muted-foreground mt-2">
                All caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-2 border rounded-lg divide-y">
              {unreadNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => refetch()}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4 mt-4">
          {readNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No read notifications</p>
            </div>
          ) : (
            <div className="space-y-2 border rounded-lg divide-y">
              {readNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => refetch()}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


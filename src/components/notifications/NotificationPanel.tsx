"use client";

import { useNotifications, useMarkAllAsRead } from "@/hooks/useNotificationMutations";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Using native scroll instead of ScrollArea for simplicity
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { NotificationType } from "@/types";

interface NotificationPanelProps {
  children: React.ReactNode;
}

export const NotificationPanel = ({ children }: NotificationPanelProps) => {
  // Filter state for future use
  // const [filter, setFilter] = useState<{
  //   type?: NotificationType;
  //   read?: boolean;
  // }>({});
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const limit = 10;
  const router = useRouter();

  const { data, isLoading, refetch } = useNotifications({
    page,
    limit,
  });

  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.data?.result || [];
  const hasMore = (data?.data?.meta.totalPages || 0) > page;

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleReadAll = () => {
    setOpen(false);
    router.push("/dashboard/notifications");
  };

  const handleNavigate = () => {
    setOpen(false);
  };

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {notifications.some((n) => !n.read) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="h-8 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          <div className="p-2">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-3">
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
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No notifications
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => refetch()}
                    onNavigate={handleNavigate}
                  />
                ))}
                {hasMore && (
                  <div className="p-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      className="text-xs"
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReadAll}
                className="w-full justify-between text-xs"
              >
                <span>Read All</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


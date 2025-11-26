"use client";

import { useNotifications } from "@/context/NotificationContext";
import { NotificationPanel } from "./NotificationPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export const NotificationBell = () => {
  const { unreadCount, isLoading } = useNotifications();

  return (
    <NotificationPanel>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {!isLoading && unreadCount !== undefined && unreadCount > 0 && (
          <Badge
            variant="destructive"
            size="icon"
            className={cn(
              "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0",
              "flex items-center justify-center text-xs font-bold"
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </NotificationPanel>
  );
};


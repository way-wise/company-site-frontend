"use client";

import { Notification } from "@/types";
import { useMarkAsRead } from "@/hooks/useNotificationMutations";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckSquare,
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  FolderKanban,
  Milestone,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: () => void;
  onNavigate?: () => void;
}

const getNotificationIcon = (type: Notification["type"]) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "TASK":
      return <CheckSquare className={iconClass} />;
    case "PROJECT":
      return <FolderKanban className={iconClass} />;
    case "LEAVE":
      return <Calendar className={iconClass} />;
    case "PAYMENT":
      return <CreditCard className={iconClass} />;
    case "MILESTONE":
      return <Milestone className={iconClass} />;
    case "CHAT":
      return <MessageSquare className={iconClass} />;
    case "FILE":
      return <FileText className={iconClass} />;
    case "COMMENT":
      return <MessageSquare className={iconClass} />;
    case "SYSTEM":
      return <AlertCircle className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "TASK":
      return "text-blue-600";
    case "PROJECT":
      return "text-purple-600";
    case "LEAVE":
      return "text-green-600";
    case "PAYMENT":
      return "text-emerald-600";
    case "MILESTONE":
      return "text-orange-600";
    case "CHAT":
      return "text-cyan-600";
    case "FILE":
      return "text-indigo-600";
    case "COMMENT":
      return "text-pink-600";
    case "SYSTEM":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getNotificationUrl = (notification: Notification): string | null => {
  const data = notification.data as Record<string, unknown> | null | undefined;
  
  if (!data) {
    return null;
  }

  switch (notification.type) {
    case "TASK": {
      const taskId = data.taskId as string | undefined;
      if (taskId) {
        return `/dashboard/tasks?taskId=${taskId}`;
      }
      return "/dashboard/tasks";
    }
    case "PROJECT": {
      const projectId = data.projectId as string | undefined;
      if (projectId) {
        return `/dashboard/projects/${projectId}`;
      }
      return "/dashboard/projects";
    }
    case "MILESTONE": {
      const projectId = data.projectId as string | undefined;
      const milestoneId = data.milestoneId as string | undefined;
      if (projectId && milestoneId) {
        return `/dashboard/projects/${projectId}/milestones/${milestoneId}`;
      }
      if (projectId) {
        return `/dashboard/projects/${projectId}`;
      }
      return "/dashboard/milestones";
    }
    case "CHAT": {
      const conversationId = data.conversationId as string | undefined;
      if (conversationId) {
        return `/dashboard/chat?conversationId=${conversationId}`;
      }
      return "/dashboard/chat";
    }
    case "FILE": {
      const projectId = data.projectId as string | undefined;
      if (projectId) {
        return `/dashboard/projects/${projectId}`;
      }
      return "/dashboard/projects";
    }
    case "COMMENT": {
      const taskId = data.taskId as string | undefined;
      if (taskId) {
        return `/dashboard/tasks?taskId=${taskId}`;
      }
      return "/dashboard/tasks";
    }
    case "LEAVE": {
      return "/dashboard/leave";
    }
    case "PAYMENT": {
      const milestoneId = data.milestoneId as string | undefined;
      const projectId = data.projectId as string | undefined;
      if (milestoneId) {
        return `/dashboard/milestones/${milestoneId}/payment`;
      }
      if (projectId) {
        return `/dashboard/projects/${projectId}`;
      }
      return "/dashboard/milestones";
    }
    case "SYSTEM": {
      return "/dashboard";
    }
    default:
      return null;
  }
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onNavigate,
}: NotificationItemProps) => {
  const router = useRouter();
  const markAsReadMutation = useMarkAsRead();

  const handleClick = () => {
    // Mark as read if not already read
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id, {
        onSuccess: () => {
          onMarkAsRead?.();
          navigateToUrl();
        },
      });
    } else {
      navigateToUrl();
    }
  };

  const navigateToUrl = () => {
    const url = getNotificationUrl(notification);
    if (url) {
      onNavigate?.();
      router.push(url);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex gap-3 rounded-lg p-3 transition-colors cursor-pointer",
        "hover:bg-accent",
        !notification.read && "bg-accent/50"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex-shrink-0",
          getNotificationColor(notification.type)
        )}
      >
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium",
              !notification.read && "font-semibold"
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary mt-1.5" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
};


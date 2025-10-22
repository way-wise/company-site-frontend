import {
  CalendarDays,
  CassetteTape,
  CheckSquare,
  FolderKanban,
  Home,
  Key,
  LayoutGrid,
  MessageCircle,
  Milestone,
  Settings,
  Shield,
  UsersRound,
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  permission?: string; // Keep for backwards compatibility
  permissions?: string[]; // New array format
  roles?: string[];
  submenu?: SubMenuItem[];
  baseUrl?: string;
}

export interface SubMenuItem {
  title: string;
  url: string;
  permission?: string;
}

export const menuConfig: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    url: "/dashboard",
    // Always visible to authenticated users
  },
  {
    title: "Back to Home",
    icon: Home,
    url: "/",
    // Always visible
  },
  {
    title: "Users",
    icon: UsersRound,
    url: "/dashboard/users",
    permissions: ["read_user", "create_user"],
  },
  {
    title: "Roles",
    icon: Shield,
    url: "/dashboard/roles",
    permissions: ["read_role", "create_role"],
  },
  {
    title: "Permissions",
    icon: Key,
    url: "/dashboard/permissions",
    permissions: ["read_permission", "create_permission"],
  },
  {
    title: "Services",
    icon: CassetteTape,
    url: "/dashboard/services",
    permissions: ["read_service", "create_service"],
  },
  {
    title: "Projects",
    icon: FolderKanban,
    url: "/dashboard/projects",
    permissions: ["read_project", "create_project"],
  },
  {
    title: "Milestones",
    icon: Milestone,
    url: "/dashboard/milestones",
    permissions: ["read_milestone", "create_milestone"],
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    url: "/dashboard/tasks",
    permissions: ["read_task", "create_task"],
  },
  {
    title: "Chat",
    icon: MessageCircle,
    url: "/dashboard/chat",
    // Always visible to authenticated users
  },
  {
    title: "Leave Management",
    icon: CalendarDays,
    url: "/dashboard/leave",
    permissions: ["read_leave", "create_leave"],
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
    // Always visible to authenticated users
  },
];

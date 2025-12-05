import {
  CalendarDays,
  CassetteTape,
  CheckSquare,
  DollarSign,
  FileText,
  FolderKanban,
  Handshake,
  Home,
  Key,
  LayoutGrid,
  MessageCircle,
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
    title: "Back to Home",
    icon: Home,
    url: "/",
    // Always visible
  },
  {
    title: "Dashboard",
    icon: LayoutGrid,
    url: "/dashboard",
    // Always visible to authenticated users
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
    title: "Partners",
    icon: Handshake,
    url: "/dashboard/partners",
    permissions: ["read_partner", "create_partner"],
  },
  {
    title: "Projects",
    icon: FolderKanban,
    url: "/dashboard/projects",
    permissions: ["view_all_projects", "read_project", "create_project"],
  },
  // {
  //   title: "Milestones",
  //   icon: Milestone,
  //   url: "/dashboard/milestones",
  //   permissions: ["read_milestone", "create_milestone"],
  // },
  {
    title: "Tasks",
    icon: CheckSquare,
    url: "/dashboard/tasks",
    permissions: ["read_task", "create_task"],
  },
  {
    title: "Blogs",
    icon: FileText,
    url: "/dashboard/blogs",
    permissions: ["read_blog", "view_all_blogs", "create_blog"],
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
    title: "Earnings",
    icon: DollarSign,
    url: "/dashboard/earnings",
    permissions: ["read_earning", "read_expense"],
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
    // Always visible to authenticated users
  },
];

import {
  CalendarDays,
  CassetteTape,
  CheckSquare,
  FolderKanban,
  Home,
  Key,
  LayoutGrid,
  Milestone,
  Settings,
  Shield,
  UsersRound,
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  permission?: string;
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
    permission: "read_user",
  },
  {
    title: "Roles",
    icon: Shield,
    url: "/dashboard/roles",
    permission: "read_role",
  },
  {
    title: "Permissions",
    icon: Key,
    url: "/dashboard/permissions",
    permission: "read_permission",
  },
  {
    title: "Services",
    icon: CassetteTape,
    url: "/dashboard/services",
    permission: "read_service",
  },
  {
    title: "Projects",
    icon: FolderKanban,
    url: "/dashboard/projects",
    permission: "read_project",
  },
  {
    title: "Milestones",
    icon: Milestone,
    url: "/dashboard/milestones",
    permission: "read_milestone",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    url: "/dashboard/tasks",
    permission: "read_task",
  },
  {
    title: "Leave Management",
    icon: CalendarDays,
    url: "/dashboard/leave",
    permission: "read_leave",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
    // Always visible to authenticated users
  },
];

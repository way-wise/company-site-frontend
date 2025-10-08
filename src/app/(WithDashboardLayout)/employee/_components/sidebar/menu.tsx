import LogoutButton from "@/components/auth/LogoutButton";
import {
  CassetteTape,
  Dumbbell,
  Home,
  LayoutGrid,
  UsersRound,
} from "lucide-react";
import MenuItem from "./menu-item";

const SidebarMenu = () => {
  const menuList = [
    {
      title: "Back to Home",
      icon: <Home className="icon" />,
      url: "/",
    },
    {
      title: "Dashboard",
      icon: <LayoutGrid className="icon" />,
      url: "/employee",
    },

    {
      title: "Users",
      icon: <UsersRound className="icon" />,
      url: "/employee/profile",
    },

    {
      title: "Projects",
      icon: <Dumbbell className="icon" />,
      url: "/employee/attendance",
    },
    {
      title: "Services",
      icon: <CassetteTape className="icon" />,
      url: "/employee/settings",
    },
  ];

  return (
    <nav className="grow space-y-1.5 overflow-y-auto p-6">
      {menuList.map((menu, index) => {
        return <MenuItem key={index} {...menu} />;
      })}
      <br />
      <hr />
      <br />
      <LogoutButton />
    </nav>
  );
};

export default SidebarMenu;

import {
  CassetteTape,
  Dumbbell,
  Home,
  LayoutGrid,
  Play,
  Rows3,
  UsersRound,
} from "lucide-react";
import MenuCollapsible from "./menu-collapsible";
import MenuCollapsibleItem from "./menu-collapsible-item";
import MenuItem from "./menu-item";

const SidebarMenu = () => {
  const menuList = [
    {
      title: "Dashboard",
      icon: <LayoutGrid className="icon" />,
      url: "/admin",
    },
    {
      title: "Back to Home",
      icon: <Home className="icon" />,
      url: "/",
    },
    {
      title: "Users",
      icon: <UsersRound className="icon" />,
      url: "/admin/users",
    },

    {
      title: "Projects",
      icon: <Dumbbell className="icon" />,
      url: "/admin/projects",
    },
    {
      title: "Categories",
      icon: <CassetteTape className="icon" />,
      url: "/admin/categories",
    },

    {
      title: "Products",
      icon: <Rows3 className="icon" />,
      url: "/admin/products",
    },
    {
      title: "Demo",
      icon: <Play className="icon" />,
      baseUrl: "/admin/clients-list",
      submenu: [
        {
          title: "Projects List",
          url: "/admin/clients-list",
        },
        {
          title: "Clients List",
          url: "/admin/clients-list",
        },
      ],
    },
  ];

  return (
    <nav className="grow space-y-1.5 overflow-y-auto p-6">
      {menuList.map((menu, index) => {
        if (menu.submenu) {
          return (
            <MenuCollapsible key={index} {...menu}>
              {menu.submenu.map((submenu, index) => (
                <MenuCollapsibleItem key={index} {...submenu} />
              ))}
            </MenuCollapsible>
          );
        }

        return <MenuItem key={index} {...menu} />;
      })}
    </nav>
  );
};

export default SidebarMenu;

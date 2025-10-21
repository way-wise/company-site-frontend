"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { useAuth } from "@/context/UserContext";
import MenuCollapsible from "../shared/sidebar/menu-collapsible";
import MenuCollapsibleItem from "../shared/sidebar/menu-collapsible-item";
import MenuItem from "../shared/sidebar/menu-item";
import { menuConfig } from "./menu-config";

const DynamicSidebarMenu = () => {
  const { hasPermission, hasAnyPermission } = useAuth();

  // Filter menu items based on user permissions
  const visibleMenuItems = menuConfig.filter((menu) => {
    // If no permission required, show to everyone
    if (!menu.permissions && !menu.permission) {
      return true;
    }

    // Check for new permissions array format first
    if (menu.permissions && menu.permissions.length > 0) {
      return hasAnyPermission(menu.permissions);
    }

    // Fallback to old single permission format for backwards compatibility
    if (menu.permission) {
      return hasPermission(menu.permission);
    }

    return true;
  });

  return (
    <nav className="grow space-y-1.5 overflow-y-auto p-6">
      {visibleMenuItems.map((menu, index) => {
        const Icon = menu.icon;

        if (menu.submenu) {
          // Filter submenu items based on permissions
          const visibleSubmenuItems = menu.submenu.filter((submenu) => {
            if (!submenu.permission) return true;
            return hasPermission(submenu.permission);
          });

          // Only show collapsible if there are visible submenu items
          if (visibleSubmenuItems.length === 0) return null;

          return (
            <MenuCollapsible
              key={index}
              icon={<Icon className="icon" />}
              title={menu.title}
              baseUrl={menu.baseUrl || menu.url}
            >
              {visibleSubmenuItems.map((submenu, subIndex) => (
                <MenuCollapsibleItem key={subIndex} {...submenu} />
              ))}
            </MenuCollapsible>
          );
        }

        return (
          <MenuItem
            key={index}
            icon={<Icon className="icon" />}
            title={menu.title}
            url={menu.url}
          />
        );
      })}
      <br />
      <hr />
      <br />
      <LogoutButton />
    </nav>
  );
};

export default DynamicSidebarMenu;

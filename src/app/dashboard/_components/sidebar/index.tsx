"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/sidebar-provider";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import DynamicSidebarMenu from "./dynamic-menu";

const Sidebar = () => {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const pathName = usePathname();

  // Hide sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathName, isMobile, setOpenMobile]);

  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile}>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex flex-col">
              <DrawerTitle className="text-xl font-medium">
                Brand Logo
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Mobile sidebar navigation
              </DrawerDescription>
            </div>
            <DrawerClose
              className={cn(
                buttonVariants({ variant: "secondary", size: "icon" })
              )}
            >
              <X />
            </DrawerClose>
          </DrawerHeader>
          <DynamicSidebarMenu />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 flex-col border-r bg-card transition-[margin] duration-300 md:flex",
        {
          "-ml-72": state === "collapsed",
        }
      )}
    >
      <DynamicSidebarMenu />
    </aside>
  );
};

export default Sidebar;

import { SidebarProvider } from "@/providers/sidebar-provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "./_components/header";
import Sidebar from "./_components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // If not authenticated, redirect to login
  if (!token) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="fixed flex size-full">
        <Sidebar />
        <div className="flex w-full flex-col overflow-hidden">
          <Header />
          <main className="grow overflow-y-auto bg-zinc-50 p-6 dark:bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

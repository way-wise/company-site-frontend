"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuthMutations";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      variant="outline"
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

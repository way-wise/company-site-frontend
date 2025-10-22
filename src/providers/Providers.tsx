"use client";

import { SocketProvider } from "@/context/SocketContext";
import { AuthProvider } from "@/context/UserContext";
import { ProgressProvider } from "@/providers/progress-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ProgressProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ProgressProvider>
  );
}

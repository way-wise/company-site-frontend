"use client";

import { SSEProvider } from "@/context/SSEContext";
import { AuthProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ProgressProvider } from "@/providers/progress-provider";
import { StripeProvider } from "@/providers/stripe-provider";
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
        <StripeProvider>
          <AuthProvider>
            <SSEProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </SSEProvider>
          </AuthProvider>
        </StripeProvider>
      </QueryClientProvider>
    </ProgressProvider>
  );
}

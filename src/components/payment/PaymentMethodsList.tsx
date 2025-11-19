"use client";

import { PaymentMethodCard } from "./PaymentMethodCard";
import {
  usePaymentMethods,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/hooks/usePaymentMutations";
import { PaymentMethod } from "@/services/PaymentService";
import { useState } from "react";

export function PaymentMethodsList() {
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  const setDefaultMutation = useSetDefaultPaymentMethod();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      await setDefaultMutation.mutateAsync(id);
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No payment methods saved yet.</p>
        <p className="text-sm mt-1">Add a card to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method: PaymentMethod) => (
        <PaymentMethodCard
          key={method.id}
          paymentMethod={method}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
          isDeleting={deletingId === method.id}
          isSettingDefault={settingDefaultId === method.id}
        />
      ))}
    </div>
  );
}




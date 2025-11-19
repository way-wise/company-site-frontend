"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentMethod } from "@/services/PaymentService";
import { CreditCard, Trash2, Star } from "lucide-react";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

const getCardBrandIcon = (brand: string) => {
  const normalizedBrand = brand.toLowerCase();
  if (normalizedBrand.includes("visa")) return "VISA";
  if (normalizedBrand.includes("mastercard")) return "MC";
  if (normalizedBrand.includes("amex") || normalizedBrand.includes("american")) return "AMEX";
  if (normalizedBrand.includes("discover")) return "DISC";
  return brand.toUpperCase().slice(0, 4);
};

export function PaymentMethodCard({
  paymentMethod,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
}: PaymentMethodCardProps) {
  const cardBrand = getCardBrandIcon(paymentMethod.cardBrand);
  const expMonth = String(paymentMethod.cardExpMonth).padStart(2, "0");
  const expYear = String(paymentMethod.cardExpYear).slice(-2);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-lg">{cardBrand}</span>
                {paymentMethod.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                    <Star className="h-3 w-3 fill-current" />
                    Default
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  •••• •••• •••• {paymentMethod.cardLast4}
                </p>
                <p>
                  Expires {expMonth}/{expYear}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!paymentMethod.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetDefault(paymentMethod.id)}
                disabled={isSettingDefault}
                isLoading={isSettingDefault}
              >
                Set Default
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(paymentMethod.id)}
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




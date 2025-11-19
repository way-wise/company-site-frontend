"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddPaymentMethodForm } from "@/components/payment/AddPaymentMethodForm";
import { PaymentMethodsList } from "@/components/payment/PaymentMethodsList";
import { useAuth } from "@/context/UserContext";
import { CreditCard, Settings } from "lucide-react";

const SettingsPage = () => {
  const { user, hasRole } = useAuth();
  const isClient = hasRole("CLIENT");

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-gray-500">
              <Settings className="h-5 w-5" />
              <p className="text-sm">Settings options coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isClient && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Manage your saved payment cards
                </CardDescription>
              </div>
              <AddPaymentMethodForm />
            </div>
          </CardHeader>
          <CardContent>
            <PaymentMethodsList />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;

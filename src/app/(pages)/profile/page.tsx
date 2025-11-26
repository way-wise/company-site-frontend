"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AddPaymentMethodForm } from "@/components/payment/AddPaymentMethodForm";
import { PaymentMethodsList } from "@/components/payment/PaymentMethodsList";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { ProfileInfoSection } from "@/components/profile/ProfileInfoSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import { useUserPayments } from "@/hooks/usePaymentMutations";
import { MilestonePayment } from "@/types";
import { CreditCard, Eye, FileText, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const isClient = hasRole("CLIENT");
  const { data: payments, isLoading: loadingPayments } = useUserPayments();

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            {isClient && (
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
            )}
            {isClient && (
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Password</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileInfoSection user={user} />
          </TabsContent>

          {isClient && (
            <TabsContent value="payments" className="space-y-6">
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
            </TabsContent>
          )}

          {isClient && (
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payment History
                  </CardTitle>
                  <CardDescription>
                    View all your milestone payment records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPayments ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                      <p className="text-gray-600 mt-4">
                        Loading payment history...
                      </p>
                    </div>
                  ) : payments && payments.length > 0 ? (
                    <div className="space-y-4">
                      {payments.map((payment: MilestonePayment) => (
                        <div
                          key={payment.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900">
                                  {payment.milestone?.name ||
                                    "Milestone Payment"}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    payment.status === "succeeded"
                                      ? "bg-green-100 text-green-700"
                                      : payment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {payment.status}
                                </span>
                              </div>
                              {payment.milestone?.project && (
                                <p className="text-sm text-gray-600 mb-1">
                                  Project: {payment.milestone.project.name}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                                <span>Invoice: {payment.invoiceNumber}</span>
                                <span>
                                  {new Date(
                                    payment.paidAt
                                  ).toLocaleDateString()}
                                </span>
                                {payment.paymentMethod && (
                                  <span>
                                    {payment.paymentMethod.cardBrand.toUpperCase()}{" "}
                                    •••• {payment.paymentMethod.cardLast4}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                                ${Number(payment.amount).toFixed(2)}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  router.push(
                                    `/dashboard/milestones/${payment.milestoneId}/invoice/${payment.id}`
                                  );
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">
                                  View Invoice
                                </span>
                                <span className="sm:hidden">View</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No payment history found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="password" className="space-y-6">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;

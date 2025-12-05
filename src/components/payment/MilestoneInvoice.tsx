"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePaymentInvoice } from "@/hooks/usePaymentMutations";
import { FileText, Loader2, Printer } from "lucide-react";

interface MilestoneInvoiceProps {
  paymentId: string;
}

export function MilestoneInvoice({ paymentId }: MilestoneInvoiceProps) {
  const { data: payment, isLoading } = usePaymentInvoice(paymentId);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Invoice not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-4xl mx-auto py-8">
        {/* Action buttons - hidden when printing */}
        <div className="mb-6 flex justify-between items-center no-print">
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
        </div>

        {/* Invoice Content */}
        <Card className="p-8 invoice-content">
          {/* Invoice Header */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
                <p className="text-gray-600">Invoice Number: {payment.invoiceNumber}</p>
                <p className="text-gray-600">Date: {formatDate(payment.paidAt)}</p>
                <div className="mt-2">
                  <Badge
                    className={
                      payment.paymentType === "MANUAL"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }
                  >
                    {payment.paymentType === "MANUAL" ? "Manual Payment" : "Stripe Payment"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-600 capitalize">
                  {payment.status}
                </p>
              </div>
            </div>
          </div>

          {/* Company and Client Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
              <p className="text-gray-700">Your Company Name</p>
              <p className="text-gray-600 text-sm">Company Address</p>
              <p className="text-gray-600 text-sm">Email: company@example.com</p>
              <p className="text-gray-600 text-sm">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">To:</h3>
              {payment.user && (
                <>
                  <p className="text-gray-700">{payment.user.name}</p>
                  <p className="text-gray-600 text-sm">{payment.user.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Milestone Details */}
          {payment.milestone && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Milestone Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">
                  {payment.milestone.name}
                </p>
                {payment.milestone.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {payment.milestone.description}
                  </p>
                )}
                {payment.milestone.project && (
                  <p className="text-sm text-gray-600">
                    Project: {payment.milestone.project.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Details Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    {payment.milestone?.name || "Milestone Payment"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">
                    Total
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg">
                    ${Number(payment.amount).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Method */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
            {payment.paymentType === "MANUAL" ? (
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Method:</span> {payment.manualPaymentMethod}
                </p>
                {payment.notes && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600">{payment.notes}</p>
                  </div>
                )}
                {payment.processor && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Processed by:</span> {payment.processor.name} ({payment.processor.email})
                  </p>
                )}
              </div>
            ) : payment.paymentMethod ? (
              <p className="text-gray-700">
                {payment.paymentMethod.cardBrand.toUpperCase()} ••••{" "}
                {payment.paymentMethod.cardLast4}
              </p>
            ) : (
              <p className="text-gray-600">N/A</p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600 text-center">
              Thank you for your business!
            </p>
            {payment.paymentType === "STRIPE" && payment.stripePaymentIntentId && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Payment Intent ID: {payment.stripePaymentIntentId}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
          }

          /* Hide everything except invoice content */
          body * {
            visibility: hidden;
          }

          .invoice-content,
          .invoice-content * {
            visibility: visible;
          }

          .invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Hide non-printable elements */
          .no-print,
          button,
          nav,
          header,
          footer,
          aside,
          [role="navigation"],
          [role="banner"],
          [role="contentinfo"] {
            display: none !important;
            visibility: hidden !important;
          }

          /* Reset body for print */
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }

          /* Card styling for print */
          .invoice-content {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

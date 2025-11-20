"use client";

import { MilestoneInvoice } from "@/components/payment/MilestoneInvoice";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;

  return (
    <div>
      <div className="container max-w-4xl mx-auto py-4 print:hidden">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <MilestoneInvoice paymentId={paymentId} />
    </div>
  );
}


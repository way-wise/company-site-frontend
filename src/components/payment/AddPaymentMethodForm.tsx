"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useAttachPaymentMethod,
  useCreateSetupIntent,
} from "@/hooks/usePaymentMutations";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Plus } from "lucide-react";
import { useState } from "react";

const getStripeKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
    return null;
  }
  return key;
};

const stripeKey = getStripeKey();
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function PaymentFormContent({
  clientSecret,
  setupIntentId,
  onSuccess,
}: {
  clientSecret: string;
  setupIntentId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const attachPaymentMethodMutation = useAttachPaymentMethod();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // First, submit the elements to validate the form
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message ?? null);
        setIsProcessing(false);
        return;
      }

      // Then confirm the setup intent
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: "if_required",
      });

      if (confirmError) {
        setErrorMessage(confirmError.message ?? null);
        setIsProcessing(false);
        return;
      }

      if (setupIntent?.status === "succeeded" && setupIntent.payment_method) {
        // Attach the payment method
        await attachPaymentMethodMutation.mutateAsync({
          paymentMethodId: setupIntent.payment_method as string,
          setupIntentId,
        });

        onSuccess();
      } else {
        setErrorMessage("Setup intent did not succeed. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setErrorMessage(errorMsg);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="py-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>
      {errorMessage && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          isLoading={isProcessing}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Save Card
        </Button>
      </div>
    </form>
  );
}

export function AddPaymentMethodForm() {
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null);

  const createSetupIntentMutation = useCreateSetupIntent();

  const handleOpenChange = async (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !clientSecret) {
      try {
        const result = await createSetupIntentMutation.mutateAsync();
        setClientSecret(result.clientSecret);
        setSetupIntentId(result.setupIntentId);
      } catch {
        setOpen(false);
      }
    } else if (!newOpen) {
      setClientSecret(null);
      setSetupIntentId(null);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    setClientSecret(null);
    setSetupIntentId(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new credit or debit card to your account
          </DialogDescription>
        </DialogHeader>
        {!stripePromise ? (
          <div className="py-8 text-center">
            <p className="text-red-600 mb-2">Stripe is not configured</p>
            <p className="text-sm text-gray-500">Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.</p>
          </div>
        ) : clientSecret && setupIntentId ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <PaymentFormContent
              clientSecret={clientSecret}
              setupIntentId={setupIntentId}
              onSuccess={handleSuccess}
            />
          </Elements>
        ) : (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading payment form...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

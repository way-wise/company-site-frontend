"use client";

import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ReactNode, useMemo } from "react";

interface StripeProviderProps {
  children: ReactNode;
}

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    if (publishableKey) {
      stripePromise = loadStripe(publishableKey);
    }
  }
  return stripePromise;
};

export function StripeProvider({ children }: StripeProviderProps) {
  const stripe = useMemo(() => getStripe(), []);

  if (!stripe) {
    return <>{children}</>;
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        appearance: {
          theme: "stripe",
        },
      }}
    >
      {children}
    </Elements>
  );
}




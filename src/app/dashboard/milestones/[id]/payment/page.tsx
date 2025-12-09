"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMilestone } from "@/hooks/useMilestoneMutations";
import {
  useAttachPaymentMethod,
  useCreateSetupIntent,
  usePaymentMethods,
  useProcessMilestonePayment,
} from "@/hooks/usePaymentMutations";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const getStripeKey = () => {
	const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
	if (!key) {
		return null;
	}
	return key;
};

const stripeKey = getStripeKey();
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function AddCardFormContent({
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
	const [error, setError] = useState<string | null>(null);
	const attachPaymentMethodMutation = useAttachPaymentMethod();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setIsProcessing(true);

		try {
			const { error: submitError } = await elements.submit();
			if (submitError) {
				toast.error(submitError.message || "Failed to submit form");
				setIsProcessing(false);
				return;
			}

			const { error, paymentMethod } = await stripe.createPaymentMethod({
				elements,
			});

			if (error || !paymentMethod) {
				toast.error(error?.message || "Failed to create payment method");
				setIsProcessing(false);
				return;
			}

			await attachPaymentMethodMutation.mutateAsync({
				paymentMethodId: paymentMethod.id,
				setupIntentId,
			});

			onSuccess();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to add payment method";
			console.error("Error adding payment method:", errorMessage);
			setError(errorMessage);
			toast.error("Failed to add payment method");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<PaymentElement />
			<Button
				type="submit"
				disabled={
					!stripe || isProcessing || attachPaymentMethodMutation.isPending
				}
				className="w-full"
			>
				{isProcessing || attachPaymentMethodMutation.isPending ? (
					<>
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						Adding Card...
					</>
				) : (
					<>
						<CreditCard className="h-4 w-4 mr-2" />
						Add Card
					</>
				)}
			</Button>
		</form>
	);
}

function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [setupIntentId, setSetupIntentId] = useState<string | null>(null);
	const createSetupIntentMutation = useCreateSetupIntent();

	useEffect(() => {
		const createIntent = async () => {
			try {
				const result = await createSetupIntentMutation.mutateAsync();
				setClientSecret(result.clientSecret);
				setSetupIntentId(result.setupIntentId);
			} catch (error) {
				// Failed to create setup intent
			}
		};
		createIntent();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!stripePromise) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600 mb-2">Stripe is not configured</p>
				<p className="text-sm text-gray-500">
					Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment
					variables.
				</p>
			</div>
		);
	}

	if (!clientSecret || !setupIntentId) {
		return (
			<div className="text-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
				<p className="text-gray-600">Loading payment form...</p>
			</div>
		);
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret,
				appearance: {
					theme: "stripe",
				},
			}}
		>
			<div className="space-y-4">
				<p className="text-gray-600">
					Please add a payment method to continue.
				</p>
				<AddCardFormContent
					clientSecret={clientSecret}
					setupIntentId={setupIntentId}
					onSuccess={onSuccess}
				/>
			</div>
		</Elements>
	);
}

export default function MilestonePaymentPage() {
	const params = useParams();
	const router = useRouter();
	const milestoneId = params.id as string;
	const [showAddCard, setShowAddCard] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);

	const { data: milestoneData, isLoading: loadingMilestone } =
		useMilestone(milestoneId);
	const milestone = milestoneData?.data;

	// Convert cost to number if it's a Decimal/string
	const milestoneCost = milestone ? Number(milestone.cost) : 0;

	const { data: paymentMethods, isLoading: loadingMethods } =
		usePaymentMethods();
	const defaultPaymentMethod = paymentMethods?.find((pm) => pm.isDefault);

	const processPaymentMutation = useProcessMilestonePayment();

	useEffect(() => {
		if (!loadingMethods && !defaultPaymentMethod && !showAddCard) {
			setShowAddCard(true);
		}
	}, [loadingMethods, defaultPaymentMethod, showAddCard]);

	const handlePaymentWithExistingCard = async () => {
		if (!milestone) return;

		try {
			await processPaymentMutation.mutateAsync(milestone.id);
			setPaymentSuccess(true);
			setTimeout(() => {
				router.push(`/dashboard/projects/${milestone.projectId}`);
			}, 2000);
		} catch (error) {
			// Payment error
		}
	};

	const handleCardAdded = async () => {
		if (!milestone) return;
		setShowAddCard(false);

		// Wait a bit for the payment method to be available
		setTimeout(async () => {
			try {
				await processPaymentMutation.mutateAsync(milestone.id);
				setPaymentSuccess(true);
				setTimeout(() => {
					router.push(`/dashboard/projects/${milestone.projectId}`);
				}, 2000);
			} catch (error) {
				// Payment error
			}
		}, 1000);
	};

	if (loadingMilestone) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
			</div>
		);
	}

	if (!milestone) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-gray-600">Milestone not found</p>
				</div>
			</div>
		);
	}

	if (paymentSuccess) {
		return (
			<div className="container max-w-2xl mx-auto py-8">
				<Card className="p-8 text-center">
					<div className="mb-4">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
							<CreditCard className="h-8 w-8 text-green-600" />
						</div>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Payment Successful!
					</h2>
					<p className="text-gray-600 mb-4">
						Your payment has been processed successfully.
					</p>
					<p className="text-sm text-gray-500">
						Redirecting to project page...
					</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="container max-w-2xl mx-auto py-8">
			<Button variant="ghost" onClick={() => router.back()} className="mb-6">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back
			</Button>

			<Card className="p-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-6">
					Pay for Milestone
				</h1>

				{showAddCard ? (
					<AddCardForm onSuccess={handleCardAdded} />
				) : defaultPaymentMethod ? (
					<div className="space-y-4">
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<CreditCard className="h-5 w-5 text-gray-600" />
									<div>
										<p className="font-medium text-gray-900">
											{defaultPaymentMethod.cardBrand.toUpperCase()} ••••{" "}
											{defaultPaymentMethod.cardLast4}
										</p>
										<p className="text-sm text-gray-500">
											Default payment method
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<h3 className="font-semibold text-blue-900 mb-2">
								Payment Summary
							</h3>
							<div className="space-y-1 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">Milestone:</span>
									<span className="font-medium">{milestone.name}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Amount:</span>
									<span className="font-bold text-lg">
										${milestoneCost.toFixed(2)}
									</span>
								</div>
							</div>
						</div>

						<Button
							onClick={handlePaymentWithExistingCard}
							disabled={processPaymentMutation.isPending}
							className="w-full bg-green-600 hover:bg-green-700 text-white"
						>
							{processPaymentMutation.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Processing...
								</>
							) : (
								<>
									<CreditCard className="h-4 w-4 mr-2" />
									Pay ${milestoneCost.toFixed(2)}
								</>
							)}
						</Button>
					</div>
				) : (
					<div className="text-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
						<p className="text-gray-600">Loading payment methods...</p>
					</div>
				)}
			</Card>
		</div>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactService, ContactFormData } from "@/services/ContactService";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ContactForm = () => {
	const [formData, setFormData] = useState<ContactFormData>({
		fullName: "",
		email: "",
		whatsappNumber: "",
		serviceRequired: "",
		projectBudget: "",
		projectDescription: "",
	});
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const [errors, setErrors] = useState<
		Partial<Record<keyof ContactFormData, string>>
	>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		} else if (formData.fullName.trim().length < 2) {
			newErrors.fullName = "Full name must be at least 2 characters";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.whatsappNumber.trim()) {
			newErrors.whatsappNumber = "Phone number is required";
		} else if (formData.whatsappNumber.trim().length < 10) {
			newErrors.whatsappNumber = "Phone number must be at least 10 characters";
		}

		if (!formData.serviceRequired) {
			newErrors.serviceRequired = "Please select a service";
		}

		if (!formData.projectBudget) {
			newErrors.projectBudget = "Please select a project budget";
		}

		if (!formData.projectDescription.trim()) {
			newErrors.projectDescription = "Project description is required";
		} else if (formData.projectDescription.trim().length < 10) {
			newErrors.projectDescription =
				"Project description must be at least 10 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name as keyof ContactFormData]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user selects
		if (errors[name as keyof ContactFormData]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors in the form");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await contactService.submitContactForm(formData);

			if (response.success) {
				setSuccessMessage(
					response.message ||
						"Thank you for your inquiry! We'll get back to you within 24 hours."
				);
				// Reset form after successful submission
				setFormData({
					fullName: "",
					email: "",
					whatsappNumber: "",
					serviceRequired: "",
					projectBudget: "",
					projectDescription: "",
				});
				setErrors({});
			} else {
				toast.error(response.message || "Failed to submit the form");
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An error occurred while submitting the form";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
			{/* Full Name */}
			<div className="space-y-2">
				<Label
					htmlFor="fullName"
					className="text-sm font-medium text-[#1B3447]"
				>
					Full Name
				</Label>
				<Input
					type="text"
					id="fullName"
					name="fullName"
					value={formData.fullName}
					onChange={handleInputChange}
					className={`w-full ${errors.fullName ? "border-red-500" : ""}`}
					disabled={isSubmitting}
				/>
				{errors.fullName && (
					<p className="text-sm text-red-500">{errors.fullName}</p>
				)}
			</div>

			{/* Email and WhatsApp - Responsive layout */}
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Email */}
				<div className="flex-1 space-y-2">
					<Label htmlFor="email" className="text-sm font-medium text-[#1B3447]">
						Email
					</Label>
					<Input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className={`w-full ${errors.email ? "border-red-500" : ""}`}
						disabled={isSubmitting}
						autoComplete="email"
					/>
					{errors.email && (
						<p className="text-sm text-red-500">{errors.email}</p>
					)}
				</div>

				{/* WhatsApp Number */}
				<div className="flex-1 space-y-2">
					<Label
						htmlFor="whatsappNumber"
						className="text-sm font-medium text-[#1B3447]"
					>
						Phone Number
					</Label>
					<Input
						type="tel"
						id="whatsappNumber"
						name="whatsappNumber"
						value={formData.whatsappNumber}
						onChange={handleInputChange}
						className={`w-full ${
							errors.whatsappNumber ? "border-red-500" : ""
						}`}
						disabled={isSubmitting}
					/>
					{errors.whatsappNumber && (
						<p className="text-sm text-red-500">{errors.whatsappNumber}</p>
					)}
				</div>
			</div>

			{/* Service and Budget - Responsive layout */}
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Service Required */}
				<div className="flex-1 space-y-2">
					<Label
						htmlFor="serviceRequired"
						className="text-sm font-medium text-[#1B3447]"
					>
						Service Required
					</Label>
					<Select
						name="serviceRequired"
						value={formData.serviceRequired}
						onValueChange={(value) =>
							handleSelectChange("serviceRequired", value)
						}
						disabled={isSubmitting}
					>
						<SelectTrigger
							className={`w-full ${
								errors.serviceRequired ? "border-red-500" : ""
							}`}
							id="serviceRequired"
						>
							<SelectValue placeholder="Select Your Service" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="web-development">Web Development</SelectItem>
							<SelectItem value="mobile-app">Mobile App Development</SelectItem>
							<SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
							<SelectItem value="consulting">AI/ML</SelectItem>
							<SelectItem value="digital-marketing">
								Digital Marketing
							</SelectItem>
							<SelectItem value="graphics-design">Graphics Design</SelectItem>
							<SelectItem value="iot">Internet of Things</SelectItem>
							<SelectItem value="cloud-engineering">
								Cloud Engineering
							</SelectItem>
							<SelectItem value="other">Other</SelectItem>
						</SelectContent>
					</Select>
					{errors.serviceRequired && (
						<p className="text-sm text-red-500">{errors.serviceRequired}</p>
					)}
				</div>

				{/* Project Budget */}
				<div className="flex-1 space-y-2">
					<Label
						htmlFor="projectBudget"
						className="text-sm font-medium text-[#1B3447]"
					>
						Project Budget
					</Label>
					<Select
						name="projectBudget"
						value={formData.projectBudget}
						onValueChange={(value) =>
							handleSelectChange("projectBudget", value)
						}
						disabled={isSubmitting}
					>
						<SelectTrigger
							className={`w-full ${
								errors.projectBudget ? "border-red-500" : ""
							}`}
							id="projectBudget"
						>
							<SelectValue placeholder="Select Your Range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="under-1k">Under $1,000</SelectItem>
							<SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
							<SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
							<SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
							<SelectItem value="25k-plus">$25,000+</SelectItem>
						</SelectContent>
					</Select>
					{errors.projectBudget && (
						<p className="text-sm text-red-500">{errors.projectBudget}</p>
					)}
				</div>
			</div>

			{/* Project Description */}
			<div className="space-y-2">
				<Label
					htmlFor="projectDescription"
					className="text-sm font-medium text-[#1B3447]"
				>
					Project Description
				</Label>
				<Textarea
					id="projectDescription"
					name="projectDescription"
					value={formData.projectDescription}
					onChange={handleInputChange}
					rows={8}
					className={`w-full resize-none ${
						errors.projectDescription ? "border-red-500" : ""
					}`}
					placeholder="Tell us about your project..."
					disabled={isSubmitting}
				/>
				{errors.projectDescription && (
					<p className="text-sm text-red-500">{errors.projectDescription}</p>
				)}
			</div>

			{successMessage && (
				<p id="contact-success-message" className="text-green-500 text-sm mt-2">
					{successMessage}
				</p>
			)}

			{/* Submit Button */}
			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-brand hover:bg-brand/90 text-white !py-6 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Sending...
					</>
				) : (
					"Send An Inquiry"
				)}
			</Button>
		</form>
	);
};

export default ContactForm;

"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CreateFaqInput, createFaqSchema, Faq } from "@/schema/faqSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FaqFormProps {
	initialData?: Faq;
	onSubmit: (data: CreateFaqInput) => Promise<void>;
	isSubmitting: boolean;
	mode: "create" | "edit";
}

export const FaqForm = ({
	initialData,
	onSubmit,
	isSubmitting,
	mode,
}: FaqFormProps) => {
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(createFaqSchema),
		defaultValues: {
			question: initialData?.question || "",
			answer: initialData?.answer || "",
			category: initialData?.category || "",
			order: initialData?.order || 0,
			isShow: initialData?.isShow ?? true,
		},
	});

	return (
		<div className="w-full space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.back()}
							className="h-8 w-8 p-0"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<h1 className="text-2xl font-bold tracking-tight">
							{mode === "create" ? "Create FAQ" : "Edit FAQ"}
						</h1>
					</div>
					<p className="pl-10 text-sm text-muted-foreground">
						{mode === "create"
							? "Create a new frequently asked question."
							: "Update existing FAQ details."}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => router.back()}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button type="submit" form="faq-form" disabled={isSubmitting}>
						{isSubmitting
							? mode === "create"
								? "Creating..."
								: "Updating..."
							: mode === "create"
							? "Create FAQ"
							: "Save Changes"}
					</Button>
				</div>
			</div>

			<Form {...form}>
				<form
					id="faq-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<div className="grid gap-8 lg:grid-cols-3">
						{/* Main Content - Left Column */}
						<div className="space-y-6 lg:col-span-2">
							<div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
								<FormField
									control={form.control}
									name="question"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Question</FormLabel>
											<FormControl>
												<Input
													placeholder="What is the question?"
													className="text-lg font-medium"
													{...field}
													disabled={isSubmitting}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="answer"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Answer</FormLabel>
											<FormControl>
												<div className="min-h-[500px]">
													<MarkdownEditor
														value={field.value || ""}
														onChange={field.onChange}
														placeholder="Provide the answer here..."
														disabled={isSubmitting}
														height={400}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Sidebar - Right Column */}
						<div className="space-y-6 lg:col-span-1">
							<div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
								<h3 className="font-medium">Settings</h3>

								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. General, Billing"
													{...field}
													disabled={isSubmitting}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="order"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Order</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="0"
													{...field}
													value={field.value as number}
													onChange={(e) =>
														field.onChange(parseInt(e.target.value) || 0)
													}
													disabled={isSubmitting}
												/>
											</FormControl>
											<FormDescription>
												Higher numbers may appear later in the list.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="isShow"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Visibility</FormLabel>
											<Select
												onValueChange={(value) =>
													field.onChange(value === "true")
												}
												value={field.value ? "true" : "false"}
												disabled={isSubmitting}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select visibility" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="true">Visible</SelectItem>
													<SelectItem value="false">Hidden</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

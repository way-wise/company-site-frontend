"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export const Newsletter = () => {
	return (
		<div className="my-16 overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 text-center text-white md:px-12 lg:py-16">
			<div className="mx-auto max-w-2xl">
				<div className="mb-6 flex justify-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
						<Mail className="h-6 w-6 text-white" />
					</div>
				</div>
				<h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
					Subscribe to our newsletter
				</h2>
				<p className="mb-8 text-lg text-gray-300">
					Get the latest insights, tutorials, and updates delivered straight to
					your inbox. No spam, we promise.
				</p>

				<form
					className="mx-auto flex max-w-md flex-col gap-3 md:flex-row"
					onSubmit={(e) => e.preventDefault()}
				>
					<Input
						type="email"
						placeholder="Enter your email"
						className="h-11 rounded-full border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/10"
					/>
					<Button
						type="submit"
						size="lg"
						className="h-11 rounded-full bg-white text-gray-900 hover:bg-gray-100"
					>
						Subscribe
					</Button>
				</form>
			</div>
		</div>
	);
};

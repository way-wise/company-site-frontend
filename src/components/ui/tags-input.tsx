"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagsInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"onChange" | "value"
	> {
	value: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
}

export function TagsInput({
	value,
	onChange,
	placeholder = "Add tags...",
	className,
	disabled,
	...props
}: TagsInputProps) {
	const [inputValue, setInputValue] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
			e.preventDefault();
			const newTag = inputValue.trim();
			if (!value.includes(newTag)) {
				onChange([...value, newTag]);
			}
			setInputValue("");
		} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
			onChange(value.slice(0, -1));
		}
	};

	const removeTag = (tagToRemove: string) => {
		onChange(value.filter((tag) => tag !== tagToRemove));
	};

	return (
		<div
			className={cn(
				"flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2",
				className
			)}
			onClick={() => inputRef.current?.focus()}
		>
			{value.map((tag) => (
				<Badge
					key={tag}
					variant="secondary"
					className="gap-1 hover:bg-secondary/80"
				>
					{tag}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-3 w-3 p-0 hover:bg-transparent"
						onClick={(e) => {
							e.stopPropagation();
							removeTag(tag);
						}}
						disabled={disabled}
					>
						<X className="h-3 w-3" />
						<span className="sr-only">Remove {tag} tag</span>
					</Button>
				</Badge>
			))}
			<Input
				ref={inputRef}
				type="text"
				className="min-w-[120px] flex-1 border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
				placeholder={value.length === 0 ? placeholder : ""}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				disabled={disabled}
				{...props}
			/>
		</div>
	);
}

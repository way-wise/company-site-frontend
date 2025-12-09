"use client";

import { Button } from "@/components/ui/button";
import {
	Facebook,
	Linkedin,
	Twitter,
	Link as LinkIcon,
	Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
	title: string;
	slug: string;
}

export const ShareButtons = ({ title, slug }: ShareButtonsProps) => {
	const [copied, setCopied] = useState(false);
	const url =
		typeof window !== "undefined"
			? `${window.location.origin}/blogs/${slug}`
			: "";

	const handleCopy = () => {
		navigator.clipboard.writeText(url);
		setCopied(true);
		toast.success("Link copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	};

	const shareLinks = [
		{
			icon: Twitter,
			href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				title
			)}&url=${encodeURIComponent(url)}`,
			label: "Twitter",
		},
		{
			icon: Linkedin,
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				url
			)}`,
			label: "LinkedIn",
		},
		{
			icon: Facebook,
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				url
			)}`,
			label: "Facebook",
		},
	];

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium text-gray-500">Share:</span>
			<div className="flex gap-2">
				{shareLinks.map((link) => (
					<Button
						key={link.label}
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-full border-gray-200 text-gray-500 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
						onClick={() => window.open(link.href, "_blank")}
					>
						<link.icon className="h-3.5 w-3.5" />
						<span className="sr-only">Share on {link.label}</span>
					</Button>
				))}
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 rounded-full border-gray-200 text-gray-500 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
					onClick={handleCopy}
				>
					{copied ? (
						<Check className="h-3.5 w-3.5" />
					) : (
						<LinkIcon className="h-3.5 w-3.5" />
					)}
					<span className="sr-only">Copy Link</span>
				</Button>
			</div>
		</div>
	);
};

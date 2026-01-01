"use client";

import dynamic from "next/dynamic";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
	ssr: false,
});

interface FaqAnswerProps {
	answer: string;
}

export const FaqAnswer = ({ answer }: FaqAnswerProps) => {
	return (
		<div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-brand prose-a:no-underline hover:prose-a:underline">
			<MarkdownPreview
				source={answer}
				className="bg-transparent !text-gray-700"
				style={{ backgroundColor: "transparent" }}
				wrapperElement={{
					"data-color-mode": "light",
				}}
			/>
		</div>
	);
};


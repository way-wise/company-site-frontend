"use client";

export default function CalendlyButton({
	buttonText,
	url,
}: {
	buttonText: string;
	url: string;
}) {
	const openCalendly = () => {
		if (window.Calendly) {
			window.Calendly.initPopupWidget({
				url: url || "https://calendly.com/way-wise-tech/marketing-growth-call",
			});
		}
	};

	return (
		<button
			onClick={openCalendly}
			className="bg-gradient-to-r cursor-pointer from-[#00D4FF] to-[#0099CC] text-white lg:px-8 lg:py-4 px-4 py-3 rounded-lg text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-left"
		>
			{buttonText || "Schedule time with me"}{" "}
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="ml-2"
			>
				<path
					d="M5 12H19M19 12L12 5M19 12L12 19"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}

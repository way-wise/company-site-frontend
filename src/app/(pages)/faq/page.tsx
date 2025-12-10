import PageHeader from "@/components/shared/PageHeader";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { getAllFaqs } from "@/lib/api/faqs";
import { Faq } from "@/schema/faqSchema";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const metadata: Metadata = {
	alternates: {
		canonical: `${baseUrl}/faq`,
	},
};

const FaqPage = async () => {
	const faqs = await getAllFaqs();

	// Group by category
	const groupedFaqs = faqs.reduce((acc, faq) => {
		const category = faq.category || "General";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(faq);
		return acc;
	}, {} as Record<string, Faq[]>);

	// Default priority categories to show first if they exist
	const priorityCategories = ["General", "Technical", "Process"];
	const otherCategories = Object.keys(groupedFaqs).filter(
		(cat) => !priorityCategories.includes(cat)
	);
	const sortedCategories = [
		...priorityCategories.filter((c) => groupedFaqs[c]),
		...otherCategories,
	];

	return (
		<main>
			<PageHeader
				title="FREQUENTLY"
				description="ASKED QUESTIONS"
				titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
				descriptionClass="text-brand text-5xl lg:text-[85px]"
				breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
			/>

			<section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
				<div className="container mx-auto px-2 max-w-5xl">
					{/* Introduction */}
					<div className="mb-12 text-center">
						<p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
							Find answers to the most commonly asked questions about our
							services, processes, and how we can help transform your business
							with technology.
						</p>
					</div>

					{faqs.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">
							No FAQs found. Check back later!
						</div>
					) : (
						sortedCategories.map((category) => {
							const categoryFaqs = groupedFaqs[category];
							return (
								<div key={category} className="mb-12">
									<Card className="p-6 shadow-lg">
										<h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
											<span className="text-brand text-4xl">•</span>
											{category} Questions
										</h2>
										<Accordion type="single" collapsible className="w-full">
											{categoryFaqs.map((faq, index) => (
												<AccordionItem
													key={faq.id}
													value={`${category}-${index}`}
												>
													<AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-brand">
														{faq.question}
													</AccordionTrigger>
													<AccordionContent className="text-gray-700 leading-relaxed">
														{faq.answer}
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									</Card>
								</div>
							);
						})
					)}

					{/* Contact CTA */}
					<div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 text-center">
						<h3 className="text-2xl font-bold text-gray-900 mb-4">
							Still Have Questions?
						</h3>
						<p className="text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto">
							Can&apos;t find the answer you&apos;re looking for? Our team is
							here to help! Reach out to us and we&apos;ll get back to you as
							soon as possible.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<a
								href="/contact-us"
								className="inline-flex items-center justify-center px-8 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors"
							>
								Contact Us
							</a>
							<a
								href="mailto:info@waywisetech.com"
								className="inline-flex items-center justify-center px-8 py-3 border-2 border-brand text-brand font-semibold rounded-lg hover:bg-brand hover:text-white transition-colors"
							>
								Email Us
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default FaqPage;

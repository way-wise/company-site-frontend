import { Faq } from "@/schema/faqSchema";

export async function getAllFaqs(): Promise<Faq[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
		const url = `${baseUrl}/faqs?isShow=true&limit=100`; // Fetch all visible faqs

		const response = await fetch(url, {
			cache: "no-store",
		});

		if (!response.ok) {
			console.error("Failed to fetch FAQs", response.statusText);
			return [];
		}

		const data = await response.json();
		return data.data || [];
	} catch (error) {
		console.error("Error fetching FAQs:", error);
		return [];
	}
}

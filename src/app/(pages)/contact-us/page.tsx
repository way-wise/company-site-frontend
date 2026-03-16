import MapSection from "@/components/modules/contactUs/MapSection";
import ContactUs from "@/components/modules/home/ContactUs";
import PageHeader from "@/components/shared/PageHeader";
import type { Metadata } from "next";

const baseUrl =
	process.env.NEXT_PUBLIC_BASE_URL ||
	(process.env.NODE_ENV === "production"
		? "https://www.waywisetech.com"
		: "http://localhost:3000");

export const metadata: Metadata = {
	title: "Contact Us | Web Development Company | Get Custom Software Quote",
	description:
		"Contact Way Wise Tech, trusted web development company, to discuss your project and get a custom software development quote for web, mobile, and digital solutions",
	keywords: [
		"contact web development company",
		"web development company contact",
		"get web development quote",
		"custom software development contact",
		"web development consultation",
		"hire web developers",
		"web development company near me",
	],
	alternates: {
		canonical: `${baseUrl}/contact-us`,
	},
	openGraph: {
		type: "website",
		url: `${baseUrl}/contact-us`,
		title: "Contact Us | Web Development Company",
		description:
			"Contact Way Wise Tech for custom web development and software solutions. Get a free quote for your project.",
	},
};

const ContactUsPage = () => {
	return (
		<main>
			<PageHeader
				title="CONTACT"
				description="US"
				titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
				descriptionClass="text-brand text-5xl lg:text-[85px]"
			/>
			<ContactUs />
			<MapSection />
		</main>
	);
};

export default ContactUsPage;

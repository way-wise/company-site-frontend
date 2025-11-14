import MapSection from "@/components/modules/contactUs/MapSection";
import ContactUs from "@/components/modules/home/ContactUs";
import PageHeader from "@/components/shared/PageHeader";
import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  title: "Contact Us | Web Development Company | Get Custom Software Quote",
  description:
    "Contact Way Wise Tech for custom web development, software solutions, and digital services. Get a free quote for your web development project. Expert team ready to help your business grow.",
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
      <MapSection />
      <ContactUs />
    </main>
  );
};

export default ContactUsPage;

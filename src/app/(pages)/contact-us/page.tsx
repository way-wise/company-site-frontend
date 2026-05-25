import MapSection from "@/components/modules/contactUs/MapSection";
import ContactUs from "@/components/modules/home/ContactUs";
import PageHeader from "@/components/shared/PageHeader";
import { getDynamicMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
   return getDynamicMetadata("contact-us", {
      title: "Contact Us | Web Development Company | Get Custom Software Quote",
      description:
         "Contact Way Wise Tech, trusted web development company, to discuss your project and get a custom software development quote for web, mobile",
      keywords: [
         "contact web development company",
         "web development company contact",
         "get web development quote",
         "custom software development contact",
         "web development consultation",
         "hire web developers",
         "web development company near me",
      ],
      path: "/contact-us",
   });
}

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

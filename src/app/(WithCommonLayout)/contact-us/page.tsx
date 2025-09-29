import MapSection from "@/components/modules/contactUs/MapSection";
import ContactUs from "@/components/modules/home/ContactUs";
import PageHeader from "@/components/shared/PageHeader";

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

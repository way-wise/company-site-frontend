import ChooseUs from "@/components/modules/aboutUs/whychooseUs";
import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import SuccessProjects from "@/components/modules/services/SuccessProjects";
import PageHeader from "@/components/shared/PageHeader";

const AboutUs = () => {
  return (
    <>
      <PageHeader
        title="ABOUT"
        description="WAY-WISE"
        titleClass="text-white text-5xl lg:text-[85px] font-bold font-['Akira Expanded]"
        descriptionClass="text-brand text-5xl lg:text-[85px]"
      />
      <ChooseUs />
      <SuccessProjects />
      <CategorySection />
      <ContactUs />
    </>
  );
};

export default AboutUs;

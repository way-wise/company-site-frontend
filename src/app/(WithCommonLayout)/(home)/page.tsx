import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import HeroSection from "@/components/modules/home/HeroSection";
import Services from "@/components/modules/home/Services";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <Services />
      <ContactUs />
    </div>
  );
};

export default HomePage;

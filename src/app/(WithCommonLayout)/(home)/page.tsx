import CategorySection from "@/components/modules/home/CategorySection";
import ContactUs from "@/components/modules/home/ContactUs";
import HeroSection from "@/components/modules/home/HeroSection";
import Offers from "@/components/modules/home/Offers";
import Projects from "@/components/modules/home/Projects";
import Services from "@/components/modules/home/Services";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <Services />
      <Projects />
      <Offers />
      {/* <ScrollComp /> */}
      <ContactUs />
    </div>
  );
};

export default HomePage;

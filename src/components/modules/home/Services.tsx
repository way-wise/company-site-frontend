import SectionTitle from "@/components/modules/home/SectionTitle";
import { Service } from "@/types";
import ServiceCard from "./ServiceCard";

// Import service images
import cloudEngineeringBg from "@/assets/images/services/cloud-engineering.png";
import digitalMarketingBg from "@/assets/images/services/digital-marketing.png";
import graphicsDesignBg from "@/assets/images/services/graphics-design.png";
import internetThingsBg from "@/assets/images/services/internetthings.png";
import mobileAppBg from "@/assets/images/services/mobile-application.png";
import webAppBg from "@/assets/images/services/web-application.png";

// Import service icons
import cloudIcon from "@/assets/icons/services/cloud.svg";
import digitalIcon from "@/assets/icons/services/digital.png";
import graphicsIcon from "@/assets/icons/services/graphics.svg";
import internetIcon from "@/assets/icons/services/internet.svg";
import mobileIcon from "@/assets/icons/services/mobile.svg";
import webIcon from "@/assets/icons/services/web.png";

const Services = () => {
  const services: Service[] = [
    {
      id: 1,
      title: "Web Application",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: webAppBg,
      url: "#",
      icon: webIcon,
    },
    {
      id: 2,
      title: "Mobile Application",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: mobileAppBg,
      url: "#",
      icon: mobileIcon,
    },
    {
      id: 3,
      title: "Digital Marketing",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: digitalMarketingBg,
      url: "#",
      icon: digitalIcon,
    },
    {
      id: 4,
      title: "Graphics Design",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: graphicsDesignBg,
      url: "#",
      icon: graphicsIcon,
    },
    {
      id: 5,
      title: "Internet of Things",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: internetThingsBg,
      url: "#",
      icon: cloudIcon,
    },
    {
      id: 6,
      title: "Cloud Engineering",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: cloudEngineeringBg,
      url: "#",
      icon: internetIcon,
    },
  ];
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="mb-16">
        <SectionTitle
          title="Our Services"
          description="We offer a comprehensive suite of services designed to meet all your digital needs.
Our team of experts is committed to delivering top-notch solutions that drive
growth, enhance your brand, and streamline your operations."
          titleClass="text-[#1B3447] text-[55px] font-bold"
          descriptionClass="text-[#3D4E5C] text-[20px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default Services;

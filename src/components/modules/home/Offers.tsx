"use client";
import SectionTitle from "@/components/modules/home/SectionTitle";
import { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import OffersCard from "./OffersCard";

// Public folder image paths
const offerLeftImg1 = "/images/offers/offer1.png";
const offerLeftImg2 = "/images/offers/offer2.png";
const offerLeftImg3 = "/images/offers/offer3.png";
const offerLeftImg4 = "/images/offers/offer4.png";

export interface OfferData {
  id: number;
  title: string;
  description: string;
  subtitle: string;
  projectCount: string;
  backgroundColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  imageSrc: StaticImageData | string;
  imageAlt: string;
}

const getBreakpoint = (): "lg" | "sm" | "base" => {
  if (typeof window === "undefined") return "base";
  if (window.innerWidth >= 1024) return "lg";
  if (window.innerWidth >= 640) return "sm";
  return "base";
};

const getTopValue = (index: number, breakpoint: "lg" | "sm" | "base"): number => {
  switch (breakpoint) {
    case "lg":
      return 160 + index * 20;
    case "sm":
      return 128 + index * 16;
    default:
      return 80 + index * 12;
  }
};

const Offers = () => {
  const [breakpoint, setBreakpoint] = useState<"lg" | "sm" | "base">("base");

  useEffect(() => {
    const updateBreakpoint = () => setBreakpoint(getBreakpoint());
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);
  const offers: OfferData[] = [
    {
      id: 1,
      title: "Experienced Engineers",
      description:
        "Our team of 21 highly skilled engineers brings decades of combined expertise in cutting-edge technologies and software development. With proven track records across diverse industries, we deliver innovative, scalable solutions tailored to your business needs with precision and excellence.",
      subtitle: " Project Done",
      projectCount: "70+",
      backgroundColor: "bg-[#C6CFFF]",
      buttonColor: "bg-[#9AABFF]",
      buttonHoverColor: "hover:bg-[#7A8FFF]",
      imageSrc: offerLeftImg1,
      imageAlt: "Experienced Engineers",
    },
    {
      id: 2,
      title: "Supportive Team",
      description:
        "Our dedicated team of engineers and project managers works seamlessly to deliver exceptional results that exceed expectations. We foster a collaborative environment where communication flows freely, ensuring every team member is aligned with your vision and committed to your success.",
      subtitle: " Team Members",
      projectCount: "21+",
      backgroundColor: "bg-[#FFB8B0]",
      buttonColor: "bg-[#FE8F83]",
      buttonHoverColor: "hover:bg-[#FE8F89]",
      imageSrc: offerLeftImg2,
      imageAlt: "Supportive Team",
    },
    {
      id: 3,
      title: "Inclusive Process",
      description:
        "Our inclusive development process ensures that every stakeholder's perspective is valued and integrated into the final product. Through transparent collaboration, regular check-ins, and open communication channels, we keep you informed and engaged throughout the entire journey.",
      subtitle: " On Going Projects",
      projectCount: "10+",
      backgroundColor: "bg-[#FBE8A4]",
      buttonColor: "bg-[#F7BB48]",
      buttonHoverColor: "hover:bg-[#E6C200]",
      imageSrc: offerLeftImg3,
      imageAlt: "Inclusive Process",
    },
    {
      id: 4,
      title: "Regular Supervision",
      description:
        "Our commitment to continuous supervision and quality assurance ensures the highest standards are maintained throughout every phase of your project. With rigorous testing protocols and performance monitoring, we identify and resolve potential issues before they impact your business.",
      subtitle: "Project Supervision",
      projectCount: "23+",
      backgroundColor: "bg-[#ABF5FF]",
      buttonColor: "bg-[#76EBFB]",
      buttonHoverColor: "hover:bg-[#00B8B8]",
      imageSrc: offerLeftImg4,
      imageAlt: "Regular Supervision",
    },
  ];

  return (
    <section className="relative  bg-[url('@/assets/images/offers/offer-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="container relative z-10 py-10 lg:py-20 ">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2 sm:space-y-3 lg:space-y-4 mb-12 lg:mb-16">
          <h3 className="text-white text-3xl sm:text-4xl lg:text-[55px] font-bold">What We Offer</h3>
          <p className="text-white text-base sm:text-lg lg:text-[20px]">We provide end-to-end IT solutions designed to help businesses grow and operate efficiently. From custom web and app development to graphic design, digital marketing, virtual assistance, data management, and secure server deployment, we deliver scalable solutions tailored to your goals.</p>
        </div>

        {/* Stack Scroll for All Devices */}
        <div className="block relative space-y-0">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="sticky mb-4 sm:mb-6 lg:mb-0 transition-all duration-300"
              style={{
                top: `${getTopValue(index, breakpoint)}px`,
                zIndex: index + 1,
              }}
            >
              <OffersCard {...offer} />
            </div>
          ))}
          {/* Spacer to ensure last card has scroll space */}
          <div className="h-[60vh] sm:h-[50vh] lg:h-[30vh]" />
        </div>
      </div>
    </section>
  );
};

export default Offers;

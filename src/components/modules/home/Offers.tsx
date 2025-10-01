"use client";
import SectionTitle from "@/components/modules/home/SectionTitle";
import { StaticImageData } from "next/image";
import OffersCard from "./OffersCard";

import offerLeftImg1 from "@/assets/images/offers/offer1.png";
import offerLeftImg2 from "@/assets/images/offers/offer2.png";
import offerLeftImg3 from "@/assets/images/offers/offer3.png";
import offerLeftImg4 from "@/assets/images/offers/offer4.png";

export interface OfferData {
  id: number;
  title: string;
  description: string;
  subtitle: string;
  projectCount: string;
  backgroundColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  imageSrc: StaticImageData;
  imageAlt: string;
}

const Offers = () => {
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
      <div className="container mx-auto relative z-10 py-10 lg:py-20 px-2">
        <div className="mb-8 lg:mb-16">
          <SectionTitle
            title="What We Offer"
            description="We deliver tailored IT services—from web development, App Development and graphic design to digital marketing, virtual assistance, data entry, and server deployment."
            titleClass="text-white text-3xl sm:text-4xl lg:text-[55px] font-bold"
            descriptionClass="text-white text-base sm:text-lg lg:text-[20px]"
          />
        </div>

        {/* Mobile: Simple vertical stack */}
        {/* <div className="block lg:hidden space-y-4 sm:space-y-6">
          {offers.map((offer) => (
            <OffersCard key={offer.id} {...offer} />
          ))}
        </div> */}

        {/* Desktop: Stack Scroll */}
        <div
          className="block relative pb-28"
          style={{
            height: `calc(${offers.length} * ${
              typeof window !== "undefined" && window.innerWidth >= 1440
                ? "60vh"
                : typeof window !== "undefined" && window.innerWidth >= 1024
                ? "70vh"
                : "auto"
            })`,
          }}
        >
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="sticky top-40 transition-transform duration-300"
              style={{
                zIndex: index + 1,
                transform: `translateY(${index * 10}%)`,
              }}
            >
              <OffersCard {...offer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;

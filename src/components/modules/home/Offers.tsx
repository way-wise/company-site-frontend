"use client";
import SectionTitle from "@/components/modules/home/SectionTitle";
import { StaticImageData } from "next/image";
import OffersCard from "./OffersCard";

// Import offer images
import offerLeftImg from "@/assets/images/offers/offer-left.png";
import offerLeftImg1 from "@/assets/images/offers/offer1.png";
import offerLeftImg2 from "@/assets/images/offers/offer2.png";
import offerLeftImg3 from "@/assets/images/offers/offer3.png";
import offerLeftImg4 from "@/assets/images/offers/offer4.png";

interface OfferData {
  id: number;
  title: string;
  description: string;
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
        "Our team of 10 highly skilled engineers excels in delivering innovative solutions.",
      projectCount: "30+",
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
        "Our dedicated team of engineers and project managers work seamlessly to deliver exceptional results.",
      projectCount: "25+",
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
        "Our inclusive process is key to delivering exceptional results. Our collaborative approach ensures every voice is heard.",
      projectCount: "30+",
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
        "Our commitment to continuous supervision ensures the highest quality standards throughout every project.",
      projectCount: "30+",
      backgroundColor: "bg-[#ABF5FF]",
      buttonColor: "bg-[#76EBFB]",
      buttonHoverColor: "hover:bg-[#00B8B8]",
      imageSrc: offerLeftImg4,
      imageAlt: "Regular Supervision",
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#F2F6FF] relative overflow-hidden">
      {/* Left top corner background image */}
      <div
        className="absolute top-0 left-0 w-[350px] h-full "
        style={{
          backgroundImage: `url(${offerLeftImg.src})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top left",
        }}
      />
      {/* Right bottom corner background image */}
      <div
        className="absolute bottom-0 right-0 w-[350px] h-full "
        style={{
          backgroundImage: `url(${offerLeftImg.src})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom right",
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="mb-16 ">
          <SectionTitle
            title="What We Offer"
            description="We deliver tailored IT services—from web development and graphic design to digital marketing, virtual assistance, data entry, media transcription, and server deployment. Powered by innovation and focused on your success, our expert team ensures scalable, cost-effective solutions that drive results."
            titleClass="text-normal text-[55px] font-bold"
            descriptionClass="text-normal text-[20px]"
          />
        </div>
        <div className="grid grid-cols-1 gap-8">
          {offers.map((offer) => (
            <OffersCard key={offer.id} {...offer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;

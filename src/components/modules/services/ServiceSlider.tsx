"use client";

import SectionTitle from "@/components/modules/home/SectionTitle";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard from "../home/ServiceCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ServiceSlider.css";

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
import { StaticImageData } from "next/image";

type TServiceSlider = {
  id: number;
  title: string;
  description: string;
  bgImage: StaticImageData;
  url: string;
  icon: StaticImageData;
  slug: string;
};

const ServiceSlider = () => {
  const services: TServiceSlider[] = [
    {
      id: 1,
      title: "Web Application",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: webAppBg,
      url: "#",
      icon: webIcon,
      slug: "web-application",
    },
    {
      id: 2,
      title: "Mobile Application",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: mobileAppBg,
      url: "#",
      icon: mobileIcon,
      slug: "mobile-application",
    },
    {
      id: 3,
      title: "Digital Marketing",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: digitalMarketingBg,
      url: "#",
      icon: digitalIcon,
      slug: "digital-marketing",
    },
    {
      id: 4,
      title: "Graphics Design",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: graphicsDesignBg,
      url: "#",
      icon: graphicsIcon,
      slug: "graphics-design",
    },
    {
      id: 5,
      title: "Internet of Things",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: internetThingsBg,
      url: "#",
      icon: cloudIcon,
      slug: "internet-of-things",
    },
    {
      id: 6,
      title: "Cloud Engineering",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: cloudEngineeringBg,
      url: "#",
      icon: internetIcon,
      slug: "cloud-engineering",
    },
  ];
  return (
    <section className="py-20 px-4 container mx-auto">
      <div className="mb-16">
        <SectionTitle
          title="Service You May Like"
          description=""
          titleClass="text-[#1B3447] text-4xl pb-4  xl:text-[55px] font-bold"
          descriptionClass="text-[#3D4E5C] text-base xl:text-[20px]"
        />
      </div>
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          grabCursor={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: false,
          // }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="mySwiper"
        >
          {services.map((service) => (
            <SwiperSlide key={service.id}>
              <ServiceCard service={service as TServiceSlider} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServiceSlider;

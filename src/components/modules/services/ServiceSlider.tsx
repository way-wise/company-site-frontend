"use client";

import SectionTitle from "@/components/modules/home/SectionTitle";
import { Service } from "@/types";
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

const ServiceSlider = () => {
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
    <section className="py-20 px-4 container mx-auto">
      <div className="mb-16">
        <SectionTitle
          title="Our Services"
          description="We offer a comprehensive suite of services designed to meet all your digital needs.
Our team of experts is committed to delivering top-notch solutions that drive
growth, enhance your brand, and streamline your operations."
          titleClass="text-[#1B3447] text-4xl pb-4  xl:text-[55px] font-bold"
          descriptionClass="text-[#3D4E5C] text-base xl:text-[20px]"
        />
      </div>
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
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
              <ServiceCard service={service} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServiceSlider;

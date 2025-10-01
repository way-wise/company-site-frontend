"use client";

import SectionTitle from "@/components/modules/home/SectionTitle";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard from "../home/ServiceCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ServiceSlider.css";

import { servicesData } from "@/datas/services";
import { ServiceDetail } from "@/types";

const ServiceSlider = () => {
  const services = servicesData;
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
              <ServiceCard service={service as ServiceDetail} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServiceSlider;

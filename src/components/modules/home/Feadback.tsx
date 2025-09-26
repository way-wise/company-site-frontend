"use client";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import FeadBackCard from "./FeadBackCard";

import companyLogo from "@/assets/images/category/fidden.png";
import clientImg from "@/assets/images/feadback/image1.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Feadback = () => {
  const swiperRef = useRef<any>(null);

  const feedbacks = [
    {
      image: clientImg,
      feedback:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      name: "Client Name Goes Here",
      designation: "CEO, Fidden.io",
      companyLogo: companyLogo,
    },
    {
      image: clientImg,
      feedback:
        "Lorem <Ips></Ips>um is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      name: "Another Client",
      designation: "Founder, TechCorp",
      companyLogo: companyLogo,
    },
    {
      image: clientImg,
      feedback:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      name: "Third Client",
      designation: "Manager, StartupX",
      companyLogo: companyLogo,
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-[url('@/assets/images/feadback/feadback-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[55px] font-bold leading-tight">
            Our Clients
          </h2>
          <p className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[55px] font-bold leading-tight">
            Recommend Us.
          </p>
        </div>

        {/* Swiper with Cards Effect and Navigation Arrows */}
        <div className="relative w-full max-w-4xl mx-auto px-8 sm:px-12 lg:px-16">
          {/* Left Arrow - Responsive positioning */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="w-full h-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {feedbacks.map((fb, i) => (
              <SwiperSlide key={i}>
                <FeadBackCard {...fb} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right Arrow - Responsive positioning */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Feadback;

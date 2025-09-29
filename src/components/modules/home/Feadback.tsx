"use client";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import FeadBackCard from "./FeadBackCard";

import bulletImg from "@/assets/images/category/bullet.svg";
import companyLogo from "@/assets/images/category/fidden.svg";
import clientImg from "@/assets/images/feadback/image1.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Feadback = () => {
  const swiperRef = useRef<{
    slidePrev: () => void;
    slideNext: () => void;
  } | null>(null);

  const feedbacks = [
    {
      image: clientImg,
      feedback:
        "The web app design looks clean and professional. Navigation is smooth, and the responsive layout works well across devices. A few minor UI polishings could make the experience even better.",
      name: "Nichol",
      designation: "CEO, Bullet-Proof",
      companyLogo: bulletImg,
    },
    {
      image: clientImg,
      feedback:
        "The software is developed with a well-structured codebase, which makes it easier to maintain and scale. The overall functionality works as expected, and adding new features will be efficient.",
      name: "Fidden",
      designation: "Founder, TechCorp",
      companyLogo: companyLogo,
    },
    {
      image: clientImg,
      feedback:
        "Performance is good and the system runs smoothly without major bugs. However, the initial loading time can be optimized further to improve user experience. Caching and asset optimization may help here.",
      name: "Third Client",
      designation: "Manager, StartupX",
      companyLogo: companyLogo,
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-[url('@/assets/images/feadback/feadback-bg.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
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
        <div className="relative w-full max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 overflow-hidden">
          {/* Left Arrow - Responsive positioning */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-2 sm:left-4 lg:left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
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
            className="absolute right-2 sm:right-4 lg:right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Feadback;

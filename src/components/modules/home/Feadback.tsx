"use client";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import FeadBackCard from "./FeadBackCard";

import {
  default as clientImg,
  default as companyLogo,
} from "@/assets/images/feadback/image1.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Feadback = () => {
  const swiperRef = useRef<any>(null);

  const feedbacks = [
    {
      image: clientImg,
      feedback:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      name: "Client Name Goes Here",
      designation: "CEO, Fidden.io",
      companyLogo: companyLogo,
    },
    {
      image: clientImg,
      feedback: "This is another testimonial text for the slider example...",
      name: "Another Client",
      designation: "Founder, TechCorp",
      companyLogo: companyLogo,
    },
    {
      image: clientImg,
      feedback: "Yet another feedback for the stacked card design...",
      name: "Third Client",
      designation: "Manager, StartupX",
      companyLogo: companyLogo,
    },
  ];

  return (
    <section className="py-20 px-4 bg-[url('@/assets/images/feadback/feadback-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto max-w-2/3">
        <div className="text-center mb-12">
          <h2 className="text-white text-[55px] font-bold">Our Clients</h2>
          <p className="text-white text-[55px] font-bold">Recommend Us.</p>
        </div>

        {/* Swiper with Cards Effect and Navigation Arrows */}
        <div className="relative flex items-center justify-center w-2/4 mx-auto">
          {/* Left Arrow - Positioned outside the card */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ArrowLeft />
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

          {/* Right Arrow - Positioned outside the card */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Feadback;

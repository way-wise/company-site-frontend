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
    <section className="py-20 px-4 bg-[url('@/assets/images/feadback/feadback-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto max-w-2/3">
        <div className="text-center mb-12">
          <h2 className="text-white text-[55px] font-bold">Our Clients</h2>
          <p className="text-white text-[55px] font-bold">Recommend Us.</p>
        </div>

        {/* Swiper with Cards Effect and Navigation Arrows */}
        <div className="relative flex items-center justify-center w-full  xl:w-2/4 mx-auto">
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

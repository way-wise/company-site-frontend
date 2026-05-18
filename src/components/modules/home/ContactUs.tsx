"use client";

import { CircleCheck } from "lucide-react";
import Image from "next/image";
import ContactForm from "./ContactForm";

// Public folder image paths
const firoz = "/images/contact/firoz.svg";
const lee = "/images/contact/lee1.png";

const ContactUs = () => {
  return (
    <div className="bg-slate-100">
      {/* Left border accent */}
      <div className="h-full bg-blue-200"></div>

      <div className="container  py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column - Information Section */}
          <div className="space-y-6 sm:space-y-8 flex flex-col items-center lg:items-start justify-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl  lg:text-4xl font-bold text-gray-800 leading-tight">
                Have a Project Idea?
                <br />
                Let&apos;s get started
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
                Get in touch with Way Wise Tech, a trusted web development and
                custom software development company operating in the USA and
                UAE, to discuss your project and receive a tailored solution for
                your business. Our team specializes in web application
                development, mobile app development, and scalable digital
                solutions, helping startups and enterprises turn ideas into
                powerful, results-driven technology.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-start gap-2">
                <CircleCheck className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">
                  We will respond to you within 24 hrs
                </span>
              </div>
              <div className="flex items-center justify-start gap-2">
                <CircleCheck className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">
                  Our business hours are Monday through Friday.
                </span>
              </div>
              <div className="flex items-center justify-start gap-2">
                <CircleCheck className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">
                  Office hours are from 9:00 AM to 5:00 PM.
                </span>
              </div>

              <div className="flex items-center justify-start gap-2">
                <CircleCheck className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">
                  We&apos;ll sign an NDA if requested.
                </span>
              </div>
            </div>

            {/* Team Members */}
            <div className="flex space-x-6">
              <div className="flex flex-col items-center space-y-3">
                <div className=" bg-[#FFB8B0] px-3 pt-3 rounded-xl">
                  <Image
                    src={firoz}
                    alt="Firoz Bari"
                    width={154}
                    height={184}
                    className="w-[154px] h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">Firoz Bari</p>
                  <p className="text-gray-600">Chairman</p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className=" bg-[#C6CFFF]  pt-3 rounded-xl">
                  <Image
                    src={lee}
                    alt="Seung Lee"
                    width={180}
                    height={180}
                    className="w-[180px] h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">Seung Lee</p>
                  <p className="text-gray-600">CTO</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

"use client";

import firoz from "@/assets/images/contact/firoz.svg";
import lee from "@/assets/images/contact/lee.svg";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsappNumber: "",
    serviceRequired: "",
    projectBudget: "",
    projectDescription: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Reset form after submission
    setFormData({
      fullName: "",
      email: "",
      whatsappNumber: "",
      serviceRequired: "",
      projectBudget: "",
      projectDescription: "",
    });
  };

  return (
    <div className="bg-slate-100">
      {/* Left border accent */}
      <div className="h-full bg-blue-200"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column - Information Section */}
          <div className="space-y-6 sm:space-y-8 flex flex-col items-center lg:items-start justify-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Have a Project Idea?
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Let's get started
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-md">
                We'll schedule a call to discuss your idea. After discovery
                sessions, we'll send a proposal, and upon approval, we'll get
                started.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-start gap-2">
                <CircleCheck className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">
                  We will respond to you within 24 hrs
                </span>
              </div>
              <div className="flex items-center justify-start gap-2">
                <CircleCheck className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">
                  We'll sign an NDA if requested.
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
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">Firoz Bari</p>
                  <p className="text-gray-600">Chairman</p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className=" bg-[#D7E5F3] px- pt-3 rounded-xl">
                  <Image src={lee} alt="Seung Lee" width={180} height={180} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">Seung Lee</p>
                  <p className="text-gray-600">CEO</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-[#1B3447] mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#A3B5C7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                />
              </div>

              {/* Email and WhatsApp - Responsive layout */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Email */}
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#1B3447] mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#A3B5C7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="flex-1">
                  <label
                    htmlFor="whatsappNumber"
                    className="block text-sm font-medium text-[#1B3447] mb-2"
                  >
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#A3B5C7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Service and Budget - Responsive layout */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Service Required */}
                <div className="flex-1">
                  <label
                    htmlFor="serviceRequired"
                    className="block text-sm font-medium text-[#1B3447] mb-2"
                  >
                    Service Required
                  </label>
                  <select
                    id="serviceRequired"
                    name="serviceRequired"
                    value={formData.serviceRequired}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#A3B5C7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Your Service</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App Development</option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Project Budget */}
                <div className="flex-1">
                  <label
                    htmlFor="projectBudget"
                    className="block text-sm font-medium text-[#1B3447] mb-2"
                  >
                    Project Budget
                  </label>
                  <select
                    id="projectBudget"
                    name="projectBudget"
                    value={formData.projectBudget}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#A3B5C7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Your Range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                  </select>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label
                  htmlFor="projectDescription"
                  className="block text-sm font-medium text-[#1B3447] mb-2"
                >
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#A3B5C7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
                  placeholder="Tell us about your project..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand/90 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-all cursor-pointer"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

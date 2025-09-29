"use client";

import firoz from "@/assets/images/contact/firoz.svg";
import lee from "@/assets/images/contact/lee.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
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
                <br />
                Let&apos;s get started
              </h1>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-md">
                We&apos;ll schedule a call to discuss your idea. After discovery
                sessions, we&apos;ll send a proposal, and upon approval,
                we&apos;ll get started.
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
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">Firoz Bari</p>
                  <p className="text-gray-600">Chairman</p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className=" bg-[#D7E5F3] px-3 pt-3 rounded-xl">
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
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-[#1B3447]"
                >
                  Full Name
                </Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full "
                  required
                />
              </div>

              {/* Email and WhatsApp - Responsive layout */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Email */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-[#1B3447]"
                  >
                    Your Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="whatsappNumber"
                    className="text-sm font-medium text-[#1B3447]"
                  >
                    WhatsApp Number
                  </Label>
                  <Input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Service and Budget - Responsive layout */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Service Required */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="serviceRequired"
                    className="text-sm font-medium text-[#1B3447]"
                  >
                    Service Required
                  </Label>
                  <Select
                    value={formData.serviceRequired}
                    onValueChange={(value) =>
                      handleSelectChange("serviceRequired", value)
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Your Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">
                        Web Development
                      </SelectItem>
                      <SelectItem value="mobile-app">
                        Mobile App Development
                      </SelectItem>
                      <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Budget */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="projectBudget"
                    className="text-sm font-medium text-[#1B3447]"
                  >
                    Project Budget
                  </Label>
                  <Select
                    value={formData.projectBudget}
                    onValueChange={(value) =>
                      handleSelectChange("projectBudget", value)
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Your Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-plus">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="projectDescription"
                  className="text-sm font-medium text-[#1B3447]"
                >
                  Project Description
                </Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full resize-none"
                  placeholder="Tell us about your project..."
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-brand hover:bg-brand/90 text-white !py-6 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base"
              >
                Send Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

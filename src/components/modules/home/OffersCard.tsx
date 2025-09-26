import { MoveUpRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface OfferCardProps {
  title: string;
  description: string;
  projectCount: string;
  backgroundColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  imageSrc: StaticImageData;
  imageAlt: string;
}

const OffersCard = ({
  title,
  description,
  projectCount,
  backgroundColor,
  buttonColor,
  buttonHoverColor,
  imageSrc,
  imageAlt,
}: OfferCardProps) => {
  return (
    <section
      className={`grid grid-cols-1 lg:grid-cols-2 ${backgroundColor} rounded-xl lg:rounded-2xl gap-4 sm:gap-6 lg:gap-10 p-3 sm:p-4 lg:p-5`}
    >
      {/* Left Section - Text Content */}
      <div className="p-3 sm:p-4 lg:p-8 flex flex-col justify-center gap-3 sm:gap-4 lg:gap-5 order-2 lg:order-1">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#222222] mb-2 lg:mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base lg:text-base text-[#444444] leading-relaxed mb-4 sm:mb-6 lg:mb-8">
          {description}
        </p>

        <div className="mb-4 sm:mb-6 lg:mb-8">
          <span className="text-xs sm:text-sm lg:text-sm text-[#444444] block mb-1 sm:mb-2">
            Project Done
          </span>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#222222]">
            {projectCount}
          </p>
        </div>

        <Link
          href="#"
          className={`w-full flex justify-between items-center gap-3 sm:gap-4 lg:gap-12 ${buttonColor} text-normal px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 rounded-lg font-medium ${buttonHoverColor} transition-colors lg:w-fit`}
        >
          <p className="text-sm sm:text-base lg:text-base"> Send Inquiry</p>
          <MoveUpRight className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </Link>
      </div>

      {/* Right Section - Image */}
      <div className="relative order-1 lg:order-2">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={600}
          height={400}
          className="w-full h-40 sm:h-48 lg:h-full object-cover rounded-lg lg:rounded-none"
        />
      </div>
    </section>
  );
};

export default OffersCard;

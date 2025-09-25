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
      className={`grid grid-cols-2 ${backgroundColor} rounded-2xl gap-10 p-5 `}
    >
      {/* Left Section - Text Content */}
      <div className="p-8 flex flex-col justify-center max-w-2/3 gap-5">
        <h2 className="text-3xl font-bold text-[#222222] mb-4">{title}</h2>
        <p className="text-base text-[#444444] leading-relaxed mb-8">
          {description}
        </p>

        <div className="mb-8">
          <span className="text-sm text-[#444444] block mb-2">
            Project Done
          </span>
          <p className="text-3xl font-bold text-[#222222]">{projectCount}</p>
        </div>

        <Link
          href="#"
          className={` w-full flex justify-between items-center gap-12 ${buttonColor} text-normal px-6 py-4 rounded-lg font-medium ${buttonHoverColor} transition-colors w-fit`}
        >
          <p> Send Inquiry</p>
          <MoveUpRight />
        </Link>
      </div>

      {/* Right Section - Image */}
      <div className="relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default OffersCard;

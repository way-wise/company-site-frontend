"use client";
import Image, { StaticImageData } from "next/image";

interface Props {
  image: StaticImageData;
  feedback: string;
  name: string;
  designation: string;
  companyLogo: StaticImageData;
}

const FeadBackCard = ({
  image,
  feedback,
  name,
  designation,
  companyLogo,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-[300px] flex items-center gap-6">
      {/* Left: Client Image */}
      <div className="flex-shrink-0">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-100">
          <Image
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col justify-between h-full">
        {/* Quotation marks and feedback */}
        <div className="flex-1">
          <div className="text-6xl text-black font-bold leading-none mb-4">
            ""
          </div>
          <p className="text-gray-700 text-sm leading-relaxed pr-4">
            {feedback}
          </p>
        </div>

        {/* Bottom: Name, designation and logo */}
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-bold text-lg text-black">{name}</h3>
            <p className="text-sm text-gray-600">{designation}</p>
          </div>
          <div className="flex items-center">
            <Image
              src={companyLogo}
              alt="company logo"
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeadBackCard;

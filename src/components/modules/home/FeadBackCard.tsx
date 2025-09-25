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
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-auto flex items-start gap-8">
      {/* Left: Client Image */}
      <div className="flex-shrink-0">
        <div className="  bg-blue-100">
          <Image src={image} alt={name} className="h-[350px] w-auto" />
        </div>
      </div>

      {/* Right: Content */}
      <div className="py-8 p flex flex-col h-full ">
        <div className="flex-1">
          <div className="text-6xl text-black font-bold leading-none mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="20"
              viewBox="0 0 23 20"
              fill="none"
            >
              <path
                d="M13.3278 20V13.0769C13.3278 9.64102 14.0894 6.74359 15.6126 4.38461C17.1865 1.97436 19.649 0.51282 23 0V4C21.0199 4.20513 19.649 4.92308 18.8874 6.15384C18.1766 7.33333 17.8212 9.10256 17.8212 11.4615L14.7748 11H22.9238V20H13.3278ZM0 20V13.0769C0 9.64102 0.76159 6.74359 2.28477 4.38461C3.85872 1.97436 6.32119 0.51282 9.67219 0V4C7.69205 4.20513 6.32119 4.92308 5.5596 6.15384C4.84879 7.33333 4.49338 9.10256 4.49338 11.4615L1.44702 11H9.59603V20H0Z"
                fill="black"
              />
            </svg>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed pr-4">
            {feedback}
          </p>
        </div>

        <div className="flex items-end justify-between mt-8  px-8">
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

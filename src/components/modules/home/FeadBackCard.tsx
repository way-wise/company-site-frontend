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
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full h-auto flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-8">
      {/* Client Image - Responsive layout */}
      <div className="flex-shrink-0 w-full sm:w-auto">
        <div className="bg-blue-100 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={name}
            className="h-[200px] sm:h-[250px] lg:h-[300px] xl:h-[350px] w-full sm:w-auto object-cover sm:object-cover object-top sm:object-center"
          />
        </div>
      </div>

      {/* Content - Responsive layout */}
      <div className="flex flex-col h-full w-full sm:flex-1">
        <div className="flex-1">
          <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-black font-bold leading-none mb-3 sm:mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="20"
              viewBox="0 0 23 20"
              fill="none"
              className="w-6 h-5 sm:w-7 sm:h-6 lg:w-8 lg:h-7 xl:w-[23px] xl:h-[20px]"
            >
              <path
                d="M13.3278 20V13.0769C13.3278 9.64102 14.0894 6.74359 15.6126 4.38461C17.1865 1.97436 19.649 0.51282 23 0V4C21.0199 4.20513 19.649 4.92308 18.8874 6.15384C18.1766 7.33333 17.8212 9.10256 17.8212 11.4615L14.7748 11H22.9238V20H13.3278ZM0 20V13.0769C0 9.64102 0.76159 6.74359 2.28477 4.38461C3.85872 1.97436 6.32119 0.51282 9.67219 0V4C7.69205 4.20513 6.32119 4.92308 5.5596 6.15384C4.84879 7.33333 4.49338 9.10256 4.49338 11.4615L1.44702 11H9.59603V20H0Z"
                fill="black"
              />
            </svg>
          </div>
          <p className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed pr-0 sm:pr-2 lg:pr-4">
            {feedback}
          </p>
        </div>

        <div className="flex items-end justify-between mt-6 sm:mt-8 px-0 sm:px-4 lg:px-8">
          <div>
            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-black">
              {name}
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              {designation}
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src={companyLogo}
              alt="company logo"
              className="h-6 w-auto sm:h-7 lg:h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeadBackCard;

import { Service } from "@/types";
import Image from "next/image";
import Link from "next/link";

const ServiceCard = ({ service }: { service: Service }) => {
  // Define background colors for each service card to match the design
  const getCardColor = (id: number) => {
    const colors = [
      "bg-gradient-to-br from-indigo-300 to-indigo-400", // Web Application - Purple/Blue
      "bg-gradient-to-br from-emerald-300 to-emerald-400", // Mobile Application - Green
      "bg-gradient-to-br from-amber-300 to-amber-400", // Digital Marketing - Yellow
      "bg-gradient-to-br from-cyan-300 to-cyan-400", // Graphics Design - Light Blue
      "bg-gradient-to-br from-rose-300 to-rose-400", // Internet of Things - Pink/Red
      "bg-gradient-to-br from-green-300 to-green-400", // Cloud Engineering - Green
    ];
    return colors[(id - 1) % colors.length];
  };

  return (
    <Link href={`/services/${service.slug}`}>
      <div
        className={`${getCardColor(
          service.id
        )} rounded-3xl  hover:scale-102 transition-transform duration-300`}
      >
        {/* Icon */}
        <div className="mb-6 p-6">
          <div className="p-5 bg-white rounded-full inline-block">
            <Image
              src={service.icon}
              alt={service.title}
              width={40}
              height={40}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6">
          <h3 className=" text-2xl xl:text-3xl font-bold text-normal mb-3 leading-tight">
            {service.title}
          </h3>
          <div className="flex justify-between items-center mb-6">
            <p className="text-normal/90 text-sm leading-relaxed  flex-1">
              {service.description}
            </p>

            {/* Arrow Button */}
            <Link
              href={`/services/${service.slug}`}
              className="self-end w-10 h-10  rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors duration-200 group"
            >
              <svg
                className="w-7 h-7  stroke-2 group-hover:translate-x-0.5 transition-transform duration-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Service Image at Bottom */}
        <div className=" w-full h-full">
          <Image
            src={service.bgImage}
            alt={service.title}
            className="w-full "
          />
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;

import { Service } from "@/types";
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

  const IconComponent = service.icon;

  return (
    <div
      className={`${getCardColor(
        service.id
      )} rounded-3xl p-6 h-full flex flex-col relative overflow-hidden group hover:scale-105 transition-transform duration-300`}
    >
      {/* Icon */}
      <div className="mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-white stroke-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
          {service.title}
        </h3>
        <p className="text-white/90 text-sm leading-relaxed mb-6 flex-1">
          {service.description}
        </p>

        {/* Arrow Button */}
        <Link
          href={service.url}
          className="self-end w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors duration-200 group"
        >
          <svg
            className="w-5 h-5 text-white stroke-2 group-hover:translate-x-0.5 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </Link>
      </div>

      {/* Background Image Overlay */}
      <div
        className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-cover bg-center opacity-20 rounded-tl-3xl"
        style={{ backgroundImage: `url(${service.bgImage})` }}
      />
    </div>
  );
};

export default ServiceCard;

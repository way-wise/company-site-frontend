import SectionTitle from "@/components/modules/home/SectionTitle";
import { Service } from "@/types";
import ServiceCard from "./ServiceCard";

// Simple icon components
const MonitorIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect x="2" y="2" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const SmartphoneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
);

const PaletteIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const NetworkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
  </svg>
);

const CloudIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const Services = () => {
  const services: Service[] = [
    {
      id: 1,
      title: "Web Application",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: "/images/web-app.jpg",
      url: "@/assets/services/web-application.jpg",
      icon: MonitorIcon,
    },
    {
      id: 2,
      title: "Mobile Application",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: "/images/mobile-app.jpg",
      url: "/services/mobile-application",
      icon: SmartphoneIcon,
    },
    {
      id: 3,
      title: "Digital Marketing",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: "/images/digital-marketing.jpg",
      url: "/services/digital-marketing",
      icon: TrendingUpIcon,
    },
    {
      id: 4,
      title: "Graphics Design",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: "/images/graphics-design.jpg",
      url: "/services/graphics-design",
      icon: PaletteIcon,
    },
    {
      id: 5,
      title: "Internet of Things",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: "/images/iot.jpg",
      url: "/services/internet-of-things",
      icon: NetworkIcon,
    },
    {
      id: 6,
      title: "Cloud Engineering",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      bgImage: "/images/cloud-engineering.jpg",
      url: "/services/cloud-engineering",
      icon: CloudIcon,
    },
  ];
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="mb-16">
        <SectionTitle
          title="Our Services"
          description="We offer a comprehensive suite of services designed to meet all your digital needs.
Our team of experts is committed to delivering top-notch solutions that drive
growth, enhance your brand, and streamline your operations."
          titleClass="text-[#1B3447] text-[55px] font-bold"
          descriptionClass="text-[#3D4E5C] text-[20px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default Services;

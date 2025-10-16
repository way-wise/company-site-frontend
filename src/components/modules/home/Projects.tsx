import SectionTitle from "@/components/modules/home/SectionTitle";
import { PortfolioProject } from "@/types";
import ProjectsCard from "./ProjectsCard";

// Import project images
import fiddenImg from "@/assets/images/projects/fidden-io.png";
import flyArzanImg from "@/assets/images/projects/fly.png";
import searchImg from "@/assets/images/projects/search.png";
import seatWavesImg from "@/assets/images/projects/seat-wave.png";
import voiceImg from "@/assets/images/projects/voice.png";
import weOutImg from "@/assets/images/projects/weout1.png";
const Projects = () => {
  const projects: PortfolioProject[] = [
    {
      id: 1,
      title: "SeatWaves Ticket Marketplace",
      description:
        "SeatWaves is an online ticket marketplace that makes finding and buying event tickets simple. Users can browse events, compare prices, and securely purchase tickets all in one place.",
      tags: ["UI/UX Design", "Web Development", "SEO"],
      url: "https://seatwaves.waywisetech.com",
      image: seatWavesImg,
    },

    {
      id: 2,
      title: "Fidden Website Landing Page",
      description:
        "A modern landing page design for an online cosmetic shop, built to highlight beauty products with elegance and style. Focused on smooth UI/UX, it ensures a seamless shopping experience. Optimized for showcasing collections, offers, and brand identity.",

      tags: ["UI/UX Design", "App Development", "SEO"],
      url: "https://fidden.io",
      image: fiddenImg,
    },
    {
      id: 3,
      title: "We Out Project",
      description:
        "We Out is an online ticketing platform for concerts, events, and travel occasions. It offers users a simple way to browse, book, and manage tickets with ease. Designed with smooth UI/UX and powerful backend integration, it ensures a secure and hassle-free booking experience.",

      tags: ["UX/UX Design", "App Development", "Web Development", "SEO"],
      url: "https://weout.waywisetech.com",
      image: weOutImg,
    },
    {
      id: 4,
      title: "Fly Arzan",

      description:
        "A complete digital platform for global airline ticket booking and management. It provides users with an easy way to search, compare, and purchase flights worldwide. Built with modern UI/UX and strong backend integration, ensuring secure transactions and a smooth travel booking experience.",

      tags: ["UX/UX Design", "Web Development", "SEO"],
      url: "https://fly-arzan.waywisetech.com",
      image: flyArzanImg,
    },
    {
      id: 5,
      title: "Voice Health AI",

      description:
        "A cutting-edge medical AI platform designed to assist in voice-based health analysis. It leverages advanced AI models to detect patterns and provide early health insights.",

      tags: ["UX/UX Design", "Web Development", "AI/ML", "SEO"],
      url: "https://voicehealth.ai/",
      image: voiceImg,
    },
    {
      id: 6,
      title: "Search Force AI",

      description:
        "An advanced AI-powered platform for image transformation and editing. It enables users to enhance, modify, and generate visuals with high precision. ",

      tags: ["UI/UX Design", "Web Development", "AI/ML", "SEO"],
      url: "https://www.searchforce.com",
      image: searchImg,
    },
  ];
  return (
    <section className="py-20    bg-[url('@/assets/images/projects/project-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto">
        <div className="mb-16 ">
          <SectionTitle
            title="Our Latest Projects"
            description="We offer a comprehensive suite of services designed to meet all your digital needs.
Our team of experts is committed to delivering top-notch solutions that drive
growth, enhance your brand, and streamline your operations."
            titleClass="text-white text-4xl pb-4  xl:text-[55px] font-bold"
            descriptionClass="text-[#fff] text-base xltext-[20px]"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-8 xl:gap-20 ">
          {projects.map((project) => (
            <ProjectsCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

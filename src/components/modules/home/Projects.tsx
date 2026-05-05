import SectionTitle from "@/components/modules/home/SectionTitle";
import { PortfolioProject } from "@/types";
import ProjectsCard from "./ProjectsCard";

// Public folder image paths
const fiddenImg = "/images/projects/fidden-io.png";
const flyArzanImg = "/images/projects/fly.png";
const searchImg = "/images/projects/search.png";
const seatWavesImg = "/images/projects/seat-wave.png";
const voiceImg = "/images/projects/voice.png";
const weOutImg = "/images/projects/weout1.png";
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
            title="Our Latest Web Development and Digital Innovation Projects"
            description="At Way Wise Tech, America's leading web development company, we take pride in developing digital solutions that transform businesses. Our services, from custom websites and web applications to software development and UI/UX, exhibit innovation, precision, and performance. Our experienced experts combine creativity and the newest technology to design solutions that lead growth, enhance brand visibility, and optimize business processes for customers across the globe."
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

import SectionTitle from "@/components/modules/home/SectionTitle";
import { Project } from "@/types";
import ProjectsCard from "./ProjectsCard";

// Import project images
import fiddenImg from "@/assets/images/projects/fidden-web.png";
import seatWavesImg from "@/assets/images/projects/seat-wave.png";

const Projects = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "SeatWaves Ticket Marketplace",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      tags: ["UI/UX Design", "Development"],
      url: "#",
      image: seatWavesImg,
    },
    {
      id: 2,
      title: "Fidden Website Landing Page",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      tags: ["UI/UX Design", "Development"],
      url: "#",
      image: fiddenImg,
    },
    {
      id: 3,
      title: "Digital Transformation Gallery Case",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      tags: ["UX Design", "Development"],
      url: "#",
      image: fiddenImg, // Yellow/Orange color
    },
    {
      id: 4,
      title: "Digital Transformation Gallery Case",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      tags: ["UX Design", "Development"],
      url: "#",
      image: seatWavesImg, // Cyan color
    },
    {
      id: 5,
      title: "Digital Transformation Gallery Case",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      tags: ["UX Design", "Development"],
      url: "#",
      image: seatWavesImg, // Pink/Red color
    },
    {
      id: 6,
      title: "Digital Transformation Gallery Case",
      description:
        "In today's digital world, a robust online presence is essential for any business",
      tags: ["UX Design", "Development"],
      url: "#",
      image: fiddenImg, // Green color
    },
  ];
  return (
    <section className="py-20 px-4   bg-[url('@/assets/images/projects/prjects.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto">
        <div className="mb-16 ">
          <SectionTitle
            title="Our Latest Projects"
            description="We offer a comprehensive suite of services designed to meet all your digital needs.
Our team of experts is committed to delivering top-notch solutions that drive
growth, enhance your brand, and streamline your operations."
            titleClass="text-white text-[55px] font-bold"
            descriptionClass="text-[#fff] text-[20px]"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-8 ">
          {projects.map((project) => (
            <ProjectsCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

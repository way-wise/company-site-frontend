import { Project } from "@/types";
import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProjectsCardProps {
  project: Project;
  className?: string;
}

const ProjectsCard: React.FC<ProjectsCardProps> = ({ project }) => {
  return (
    <div className={` rounded-2xl shadow-lg grid grid-cols-2 bg-white `}>
      {/* Left section - Image or Background Color */}
      <div className=" rounded-2xl ">
        {project?.image ? (
          <Image src={project?.image} alt={project?.title} className="w-full" />
        ) : (
          <div
            className="w-full h-full rounded-l-2xl"
            style={{ backgroundColor: project.backgroundColor }}
          >
            {/* Optional: Add some subtle pattern or texture for solid colors */}
            <div className="bg-[#FBE8A4] "></div>
          </div>
        )}
      </div>

      {/* Right white section */}
      <div className=" p-8 flex flex-col justify-between">
        {/* Tags section */}
        <div className="flex gap-3 mb-6">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
            {project.title}
          </h3>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            {project.description}
          </p>
        </div>

        {/* Know More button */}
        <div className="mt-auto">
          <a
            href={project.url}
            className="flex items-center gap-2 text-gray-800 font-semibold text-lg group hover:text-blue-600 transition-colors duration-200"
          >
            Know More
            <MoveUpRight />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCard;

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
    <div className="rounded-xl sm:rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-2 bg-white overflow-hidden">
      {/* Left section - Image or Background Color */}
      <div className="order-1 sm:order-1">
        {project?.image ? (
          <Image
            src={project?.image}
            alt={project?.title}
            className="w-full h-48 sm:h-auto object-cover object-top md:object-center"
          />
        ) : (
          <div className="w-full h-48 sm:h-full rounded-t-xl sm:rounded-l-2xl sm:rounded-r-none bg-[#FBE8A4]">
            {/* Optional: Add some subtle pattern or texture for solid colors */}
            <div className="bg-[#FBE8A4] h-full"></div>
          </div>
        )}
      </div>

      {/* Right white section */}
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between order-2 sm:order-2">
        {/* Tags section */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            {project.title}
          </h3>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
            {project.description}
          </p>
        </div>

        {/* Know More button */}
        <div className="mt-auto">
          <a
            href={project.url}
            className="flex items-center gap-2 text-gray-800 font-semibold text-base sm:text-lg group hover:text-blue-600 transition-colors duration-200"
          >
            Know More
            <MoveUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCard;

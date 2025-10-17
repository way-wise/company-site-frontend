"use client";

import Breadcrumb from "@/components/shared/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatStatusText, getProjectStatusColor } from "@/lib/status-utils";
import { ArrowLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectDetailsProps {
  project: any;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const router = useRouter();
  const statusColors = getProjectStatusColor(project.status);

  return (
    <div className="">
      <div className=" mx-auto  space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Projects", href: "/dashboard/projects" },
            { label: project.name, current: true },
          ]}
          className="mb-4"
        />

        {/* Project Information Card */}
        <Card className="py-4 px-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1  gap-8">
              {/* Left Column - Project Info */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Project Name */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {project.name}
                  </h1>
                </div>

                {/* Project Description */}
                <div className="flex-1 flex flex-col gap-3">
                  <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Description
                  </h4>
                  <p className="text-gray-700 text-lg leading-relaxed flex-1">
                    {project.description || "No description provided"}
                  </p>
                </div>
              </div>
              <hr className="my-4" />
              {/* Right Column - Status & Meta Info */}
              <div className="flex items-center justify-between gap-6 ">
                {/* Created Date */}
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {/* Status */}
                <div className="flex justify-start">
                  <Badge className={`${statusColors} text-sm px-4 py-2`}>
                    {formatStatusText(project.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

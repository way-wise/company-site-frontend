"use client";

import { ProjectFilesSection } from "@/components/project/ProjectFilesSection";
import { ProjectNoteSection } from "@/components/project/ProjectNoteSection";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useConversations,
  useCreateConversation,
} from "@/hooks/useChatMutations";
import { formatStatusText, getProjectStatusColor } from "@/lib/status-utils";
import { Project } from "@/types";
import {
  ArrowLeft,
  Calendar,
  FileText,
  MessageCircle,
  StickyNote,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const router = useRouter();
  const statusColors = getProjectStatusColor(project.status);
  const [isNavigatingToChat, setIsNavigatingToChat] = useState(false);
  const { data: conversationsData } = useConversations({
    type: "PROJECT",
    projectId: project.id,
  });
  const createConversationMutation = useCreateConversation();

  const handleChatClick = async () => {
    try {
      setIsNavigatingToChat(true);

      // Check if project conversation already exists
      const existingConversations = conversationsData?.data?.result || [];
      const projectConversation = existingConversations.find(
        (conv) => conv.projectId === project.id && conv.type === "PROJECT"
      );

      if (projectConversation) {
        // Navigate to existing conversation
        router.push(`/dashboard/chat?conversationId=${projectConversation.id}`);
      } else {
        // Create new project conversation
        const result = await createConversationMutation.mutateAsync({
          type: "PROJECT",
          projectId: project.id,
          participantIds: [], // Backend will handle adding project participants
        });

        if (result.success && result.data) {
          router.push(`/dashboard/chat?conversationId=${result.data.id}`);
        }
      }
    } catch (error) {
      toast.error("Failed to open project chat");
    } finally {
      setIsNavigatingToChat(false);
    }
  };

  return (
    <div className="">
      <div className="mx-auto space-y-8">
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
            {/* Header with Back Button and Chat Button */}
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
              <Button
                variant="default"
                size="sm"
                onClick={handleChatClick}
                disabled={
                  isNavigatingToChat || createConversationMutation.isPending
                }
                isLoading={
                  isNavigatingToChat || createConversationMutation.isPending
                }
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 gap-8">
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
              <div className="flex items-center justify-between gap-6">
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

        {/* Notes and Files Tabs */}
        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Files</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-6">
            <ProjectNoteSection projectId={project.id} />
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <ProjectFilesSection projectId={project.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
